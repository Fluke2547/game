import { Canvas } from '@react-three/fiber';
import { useRef } from 'react';
import OfficeMap from './3d/OfficeMap';
import Player from './3d/Player';
import NPCCharacters from './3d/NPCCharacters';
import CameraController from './3d/CameraController';
import WeatherSystem from './3d/WeatherSystem';
import CityBackground from './3d/CityBackground';

/**
 * Main 3D Game Scene using React Three Fiber
 * Contains: Office map, Player, NPCs, Camera, Weather
 */
export default function GameScene() {
  const playerRef = useRef();

  return (
    <Canvas
      shadows
      camera={{
        fov: 45,
        near: 0.1,
        far: 500,
        position: [15, 20, 15],
      }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
      gl={{ antialias: true, alpha: false }}
    >
      {/* ท้องฟ้าและหมอกสีส้มอมชมพูอบอุ่น (Warm Afternoon Haze) */}
      <color attach="background" args={['#FAD7A1']} />
      <fog attach="fog" args={['#FAD7A1', 40, 180]} />

      <WeatherSystem />

      {/* City Environment Background */}
      <CityBackground />

      {/* Office Map */}
      <OfficeMap />

      {/* Player */}
      <Player ref={playerRef} />

      {/* NPC Characters */}
      <NPCCharacters playerRef={playerRef} />

      {/* Camera follows player */}
      <CameraController playerRef={playerRef} />
    </Canvas>
  );
}
