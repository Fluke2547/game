import { useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { useRef } from 'react';

const lookAtOffset = new THREE.Vector3(0, 0, 0);

/**
 * Camera follows the player and allows mouse rotation
 */
export default function CameraController({ playerRef }) {
  const controlsRef = useRef();

  useFrame((state, delta) => {
    if (!playerRef.current?.position || !controlsRef.current) return;
    const pp = playerRef.current.position;

    // Smoothly interpolate the controls target to follow the player
    lookAtOffset.set(pp.x, pp.y + 1, pp.z);
    controlsRef.current.target.lerp(lookAtOffset, 5 * delta);
    controlsRef.current.update();
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={false}
      minDistance={5}
      maxDistance={40}
      minPolarAngle={Math.PI / 6} // ~30 degrees
      maxPolarAngle={Math.PI / 3} // ~60 degrees
      enableDamping
      dampingFactor={0.05}
    />
  );
}
