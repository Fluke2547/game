import { useGameStore } from '../../store/gameStore';
import { useThree, useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ATMOSPHERES = {
  morning: { bg: '#ffbe76', light: '#ffefe0', intensity: 1.2, fog: '#ffeaa7', type: 'clear' },
  noon: { bg: '#87CEEB', light: '#ffffff', intensity: 1.4, fog: '#dff9fb', type: 'clear' }, // Beautiful sky blue
  evening: { bg: '#fd79a8', light: '#ffdfdf', intensity: 1.0, fog: '#e84393', type: 'clear' },
  night: { bg: '#0c112b', light: '#8c9eff', intensity: 0.6, fog: '#0c112b', type: 'clear' },
  rain: { bg: '#57606f', light: '#d1d8e0', intensity: 0.8, fog: '#747d8c', type: 'rain' },
  snow: { bg: '#ced6e0', light: '#ffffff', intensity: 1.0, fog: '#f1f2f6', type: 'snow' },
  hot: { bg: '#f0932b', light: '#ffda79', intensity: 1.6, fog: '#ffbe76', type: 'hot' },
};

function RainParticles() {
  const group = useRef();
  
  useFrame((state, delta) => {
    if (group.current) {
      group.current.position.y -= 25 * delta;
      if (group.current.position.y < -20) {
        group.current.position.y = 20;
      }
    }
  });

  return (
    <group>
      <group ref={group}>
        <Sparkles count={800} scale={[40, 40, 40]} size={8} speed={0} color="#81D4FA" opacity={0.6} />
      </group>
      {/* Duplicate to prevent gaps when looping */}
      <group position={[0, 40, 0]} ref={(r) => {
        if(r) {
          const update = () => {
             if(group.current) r.position.y = group.current.position.y + 40;
             requestAnimationFrame(update);
          };
          update();
        }
      }}>
        <Sparkles count={800} scale={[40, 40, 40]} size={8} speed={0} color="#81D4FA" opacity={0.6} />
      </group>
    </group>
  );
}

function SnowParticles() {
  const group = useRef();
  
  useFrame((state, delta) => {
    if (group.current) {
      // Snow falls slowly (5 units/sec) and drifts slightly
      group.current.position.y -= 5 * delta;
      group.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 2;
      
      if (group.current.position.y < -20) {
        group.current.position.y = 20;
      }
    }
  });

  return (
    <group>
      <group ref={group}>
        <Sparkles count={1500} scale={[50, 40, 50]} size={12} speed={0.5} noise={1} color="#FFFFFF" opacity={0.8} />
      </group>
      {/* Duplicate for seamless looping */}
      <group position={[0, 40, 0]} ref={(r) => {
        if(r) {
          const update = () => {
             if(group.current) {
               r.position.y = group.current.position.y + 40;
               r.position.x = group.current.position.x; // Follow drift
             }
             requestAnimationFrame(update);
          };
          update();
        }
      }}>
        <Sparkles count={1500} scale={[50, 40, 50]} size={12} speed={0.5} noise={1} color="#FFFFFF" opacity={0.8} />
      </group>
    </group>
  );
}

function Lightning() {
  const lightRef = useRef();
  const flashTimer = useRef(Math.random() * 5 + 2);
  
  useFrame((state, delta) => {
    if (!lightRef.current) return;
    
    flashTimer.current -= delta;
    if (flashTimer.current <= 0) {
      if (Math.random() < 0.5) {
        lightRef.current.intensity = 15 + Math.random() * 15;
        flashTimer.current = 0.05 + Math.random() * 0.2;
      } else {
        flashTimer.current = 3 + Math.random() * 6;
      }
    }
    
    if (lightRef.current.intensity > 0.01) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, delta * 15);
    }
  });

  return <directionalLight ref={lightRef} position={[20, 100, -20]} color="#e0f7fa" intensity={0} />;
}

export default function WeatherSystem() {
  const atmosphere = useGameStore(s => s.atmosphere);
  const { scene } = useThree();
  const config = ATMOSPHERES[atmosphere] || ATMOSPHERES.noon;

  useEffect(() => {
    scene.background = new THREE.Color(config.bg);
    scene.fog = new THREE.Fog(config.fog, 50, 150);
  }, [atmosphere, scene, config]);

  // Lighting directions
  let dirLightPos = [10, 20, 10];
  if (atmosphere === 'morning') dirLightPos = [20, 10, -10];
  if (atmosphere === 'evening') dirLightPos = [-20, 10, 10];

  return (
    <>
      <ambientLight intensity={config.intensity * 0.6} color={config.light} />
      <directionalLight
        position={dirLightPos}
        intensity={config.intensity}
        color={config.light}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={0.1}
        shadow-camera-far={80}
      />
      <hemisphereLight skyColor={config.bg} groundColor="#F5E6D3" intensity={0.3} />

      {config.type === 'snow' && (
        <SnowParticles />
      )}
      {config.type === 'rain' && (
        <>
          <RainParticles />
          <Lightning />
        </>
      )}
    </>
  );
}
