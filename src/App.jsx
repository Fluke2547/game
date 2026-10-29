import React, { useState, useCallback, Component } from 'react';
import GameScene from './components/GameScene';
import StartScreen from './components/StartScreen';
import CharacterCreator from './components/CharacterCreator';
import HUD from './components/HUD';
import InteractPrompt from './components/InteractPrompt';
import NPCPopup from './components/NPCPopup';
import MiniGameView from './components/MiniGameView';
import GameResult from './components/GameResult';
import LeaderboardPanel from './components/LeaderboardPanel';
import DailyChaosPanel from './components/DailyChaosPanel';
import { useGameStore } from './store/gameStore';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 20, background: '#ffcccc', color: '#900', position: 'absolute', zIndex: 9999, top: 0, left: 0, right: 0, bottom: 0, overflow: 'auto' }}>
          <h2>Something went wrong in GameScene.</h2>
          <details style={{ whiteSpace: 'pre-wrap' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const {
    gameState,
    playerName,
    totalScore,
    nearbyNPC,
    selectedNPC,
    currentMiniGame,
    lastResult,
    showLeaderboard,
    startGame,
    interactWithNPC,
    closeNPCPopup,
    startMiniGame,
    endMiniGame,
    closeResult,
    toggleLeaderboard,
  } = useGameStore();

  return (
    <>
      {/* Create Character Screen */}
      {gameState === 'create' && (
        <CharacterCreator />
      )}

      {/* 3D Game Scene - always mounted after start */}
      {(gameState !== 'start' && gameState !== 'create') && (
        <ErrorBoundary>
          <GameScene />
        </ErrorBoundary>
      )}

      {/* HUD */}
      {gameState === 'playing' && (
        <>
          <HUD playerName={playerName} totalScore={totalScore} />
          <DailyChaosPanel />
          <div className="hud__controls">
            <span className="key-hint">W</span>
            <span className="key-hint">A</span>
            <span className="key-hint">S</span>
            <span className="key-hint">D</span>
            <span>เดิน</span>
            <span style={{ margin: '0 4px' }}>|</span>
            <span className="key-hint">F</span>
            <span>นั่ง</span>
            <span style={{ margin: '0 4px' }}>|</span>
            <span className="key-hint">Space</span>
            <span>กระโดด</span>
            <span style={{ margin: '0 4px' }}>|</span>
            <span className="key-hint">E</span>
            <span>คุย</span>
            <span style={{ margin: '0 4px' }}>|</span>
            <span className="key-hint">Tab</span>
            <span>อันดับ</span>
          </div>
        </>
      )}

      {/* Interaction prompt */}
      {gameState === 'playing' && nearbyNPC && !selectedNPC && (
        <InteractPrompt npcName={nearbyNPC.name} />
      )}

      {/* NPC Challenge popup */}
      {selectedNPC && !currentMiniGame && (
        <NPCPopup
          npc={selectedNPC}
          onSelectGame={startMiniGame}
          onClose={closeNPCPopup}
        />
      )}

      {/* Mini-game view */}
      {currentMiniGame && (
        <MiniGameView
          gameType={currentMiniGame}
          npc={selectedNPC}
          onEnd={endMiniGame}
        />
      )}

      {/* Game Result */}
      {lastResult && (
        <GameResult
          result={lastResult}
          onClose={closeResult}
        />
      )}

      {/* Leaderboard */}
      {showLeaderboard && (
        <LeaderboardPanel onClose={toggleLeaderboard} />
      )}
    </>
  );
}
