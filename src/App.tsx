import { useState } from 'react';
import { TopBar } from './components/TopBar';
import { HomeSetup } from './components/HomeSetup';
import { TurnBanner } from './components/TurnBanner';
import { Phase1Radar } from './components/Phase1Radar';
import { Phase2Nomenclature } from './components/Phase2Nomenclature';
import { Phase3PhScale } from './components/Phase3PhScale';
import { Phase4Neutralization } from './components/Phase4Neutralization';
import { ResultsScreen } from './components/ResultsScreen';
import { GameMode, PhaseId, PlayerOrTeam, TurnResult } from './types/game';
import { soundEngine } from './utils/sound';

type ScreenState = 'home' | 'turn_banner' | 'playing' | 'results';

function createInitialPlayer(name: string, index: number): PlayerOrTeam {
  return {
    id: `player-${index}-${Date.now()}`,
    name,
    colorIndex: index,
    totalScore: 0,
    totalAnswered: 0,
    totalCorrect: 0,
    phaseStats: {
      1: { answered: 0, correct: 0, score: 0 },
      2: { answered: 0, correct: 0, score: 0 },
      3: { answered: 0, correct: 0, score: 0 },
      4: { answered: 0, correct: 0, score: 0 },
    },
  };
}

export default function App() {
  const [screen, setScreen] = useState<ScreenState>('home');
  const [mode, setMode] = useState<GameMode>('solo');
  const [players, setPlayers] = useState<PlayerOrTeam[]>([]);
  const [currentPhase, setCurrentPhase] = useState<PhaseId>(1);
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [roundNonce, setRoundNonce] = useState(0);
  const [muted, setMuted] = useState(false);

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  const handleStartSolo = (nickname: string) => {
    const soloPlayer = createInitialPlayer(nickname, 0);
    setMode('solo');
    setPlayers([soloPlayer]);
    setCurrentPhase(1);
    setActivePlayerIndex(0);
    setRoundNonce((n) => n + 1);
    setScreen('playing');
  };

  const handleStartTeams = (teamNames: string[]) => {
    const teamPlayers = teamNames.map((name, idx) =>
      createInitialPlayer(name, idx)
    );
    setMode('teams');
    setPlayers(teamPlayers);
    setCurrentPhase(1);
    setActivePlayerIndex(0);
    setRoundNonce((n) => n + 1);
    setScreen('turn_banner');
  };

  const handlePhaseTurnComplete = (result: TurnResult) => {
    // Update active player/team stats
    setPlayers((prev) =>
      prev.map((p, idx) => {
        if (idx !== activePlayerIndex) return p;
        const prevPhaseStats = p.phaseStats[currentPhase];
        return {
          ...p,
          totalScore: p.totalScore + result.scoreDelta,
          totalAnswered: p.totalAnswered + result.answeredDelta,
          totalCorrect: p.totalCorrect + result.correctDelta,
          phaseStats: {
            ...p.phaseStats,
            [currentPhase]: {
              answered: prevPhaseStats.answered + result.answeredDelta,
              correct: prevPhaseStats.correct + result.correctDelta,
              score: prevPhaseStats.score + result.scoreDelta,
            },
          },
        };
      })
    );

    if (mode === 'solo') {
      if (currentPhase < 4) {
        setCurrentPhase((prev) => (prev + 1) as PhaseId);
        setRoundNonce((n) => n + 1);
        setScreen('playing');
      } else {
        setScreen('results');
      }
      return;
    }

    // Team Mode: Everyone plays Phase X before advancing to Phase X+1
    const isLastTeamInPhase = activePlayerIndex + 1 >= players.length;
    if (!isLastTeamInPhase) {
      setActivePlayerIndex((prev) => prev + 1);
      setRoundNonce((n) => n + 1);
      setScreen('turn_banner');
    } else if (currentPhase < 4) {
      setCurrentPhase((prev) => (prev + 1) as PhaseId);
      setActivePlayerIndex(0);
      setRoundNonce((n) => n + 1);
      setScreen('turn_banner');
    } else {
      setScreen('results');
    }
  };

  const handleGoHome = () => {
    soundEngine.playClick();
    setScreen('home');
  };

  const handlePlayAgainSolo = () => {
    const currentName = players[0]?.name || 'Estudante';
    handleStartSolo(currentName);
  };

  const handleReplaySameTeams = () => {
    const names = players.map((p) => p.name);
    handleStartTeams(names);
  };

  const activePlayer = players[activePlayerIndex];

  // Question counts tailored for Solo vs Classroom Group flow
  const phase1Count = mode === 'solo' ? 6 : 4;
  const phase2Rounds = mode === 'solo' ? 2 : 1;
  const phase3Count = mode === 'solo' ? 5 : 3;
  const phase4Count = mode === 'solo' ? 5 : 3;

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-[#0F172A]">
      <TopBar
        screen={screen}
        mode={mode}
        currentPhase={currentPhase}
        players={players}
        activePlayerIndex={activePlayerIndex}
        muted={muted}
        onToggleMute={handleToggleMute}
        onGoHome={handleGoHome}
      />

      <div className="flex-1">
        {screen === 'home' && (
          <HomeSetup
            onStartSolo={handleStartSolo}
            onStartTeams={handleStartTeams}
          />
        )}

        {screen === 'turn_banner' && activePlayer && (
          <TurnBanner
            phase={currentPhase}
            team={activePlayer}
            teamNumber={activePlayerIndex + 1}
            totalTeams={players.length}
            onReady={() => setScreen('playing')}
          />
        )}

        {screen === 'playing' && activePlayer && (
          <>
            {currentPhase === 1 && (
              <Phase1Radar
                key={`p1-${roundNonce}`}
                questionCount={phase1Count}
                playerName={activePlayer.name}
                onComplete={handlePhaseTurnComplete}
              />
            )}
            {currentPhase === 2 && (
              <Phase2Nomenclature
                key={`p2-${roundNonce}`}
                roundCount={phase2Rounds}
                playerName={activePlayer.name}
                onComplete={handlePhaseTurnComplete}
              />
            )}
            {currentPhase === 3 && (
              <Phase3PhScale
                key={`p3-${roundNonce}`}
                questionCount={phase3Count}
                playerName={activePlayer.name}
                onComplete={handlePhaseTurnComplete}
              />
            )}
            {currentPhase === 4 && (
              <Phase4Neutralization
                key={`p4-${roundNonce}`}
                questionCount={phase4Count}
                playerName={activePlayer.name}
                onComplete={handlePhaseTurnComplete}
              />
            )}
          </>
        )}

        {screen === 'results' && (
          <ResultsScreen
            mode={mode}
            players={players}
            onPlayAgainSolo={handlePlayAgainSolo}
            onReplaySameTeams={handleReplaySameTeams}
            onRegisterNewTeams={handleGoHome}
          />
        )}
      </div>
    </div>
  );
}
