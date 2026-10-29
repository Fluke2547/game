import { useState, useEffect, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { MINI_GAMES } from '../data/gameData';
import BadmintonGame from './minigames/BadmintonGame';
import FootballGame from './minigames/FootballGame';
import PingPongGame from './minigames/PingPongGame';

/**
 * MiniGameView - Renders the selected mini-game with timer + score HUD
 */
export default function MiniGameView({ gameType, npc, onEnd }) {
  const gameMeta = MINI_GAMES[gameType];
  const [score, setScore] = useState(0);
  const [gameActive, setGameActive] = useState(true);

  const handleEndGame = useCallback(() => {
    setGameActive(false);
    setTimeout(() => onEnd(score), 800);
  }, [score, onEnd]);

  const addScore = useCallback((points) => {
    setScore((prev) => prev + points);
  }, []);

  const GameComponent = {
    badminton: BadmintonGame,
    football: FootballGame,
    pingpong: PingPongGame,
  }[gameType];

  return (
    <>
      {/* Mini-game 3D Canvas */}
      <Canvas
        camera={{ fov: 50, position: [0, 8, 10], near: 0.1, far: 100 }}
        style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 5 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => { gl.setClearColor('#E8E0D4'); }}
      >
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 10, 5]} intensity={0.8} castShadow />
        {GameComponent && <GameComponent active={gameActive} onScore={addScore} onEndGame={handleEndGame} npc={npc} />}
      </Canvas>
    </>
  );
}
