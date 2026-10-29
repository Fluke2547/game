import React from 'react';

// Voxel Furniture Components (Oak, White, Black, Gray, Light Blue)

export function Desk(props) {
  return (
    <group {...props}>
      {/* Black legs */}
      {[[-0.8, 0.375, -0.4], [0.8, 0.375, -0.4], [-0.8, 0.375, 0.4], [0.8, 0.375, 0.4]].map((p, i) => (
        <mesh key={i} position={p} castShadow><boxGeometry args={[0.06, 0.75, 0.06]} /><meshStandardMaterial color="#2d3436" /></mesh>
      ))}
      {/* Oak wood top */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.06, 1.0]} />
        <meshStandardMaterial color="#ddb892" />
      </mesh>
    </group>
  );
}

export function Chair({ color = "#2d3436", ...props }) {
  // Black/Gray office chair by default
  return (
    <group {...props}>
      <mesh position={[0, 0.45, 0]} castShadow><boxGeometry args={[0.5, 0.08, 0.5]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.75, 0.2]} castShadow><boxGeometry args={[0.5, 0.5, 0.08]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.22, 0]} castShadow><boxGeometry args={[0.06, 0.45, 0.06]} /><meshStandardMaterial color="#2d3436" /></mesh>
      <mesh position={[0, 0.05, 0]}><boxGeometry args={[0.4, 0.06, 0.4]} /><meshStandardMaterial color="#111111" /></mesh>
    </group>
  );
}

export function Monitor({ dual = false, ...props }) {
  const Screen = ({ pos, rot }) => (
    <group position={pos} rotation={rot}>
      <mesh castShadow><boxGeometry args={[0.6, 0.35, 0.03]} /><meshStandardMaterial color="#2d3436" /></mesh>
      <mesh position={[0, 0, 0.02]}><boxGeometry args={[0.56, 0.31, 0.01]} /><meshStandardMaterial color="#00d2d3" emissive="#00d2d3" emissiveIntensity={0.6} /></mesh>
      <mesh position={[0, -0.22, 0]} castShadow><boxGeometry args={[0.06, 0.1, 0.06]} /><meshStandardMaterial color="#2d3436" /></mesh>
    </group>
  );

  return (
    <group {...props}>
      <mesh position={[0, -0.3, 0]} castShadow><boxGeometry args={[0.3, 0.03, 0.15]} /><meshStandardMaterial color="#2d3436" /></mesh>
      {dual ? (
        <>
          <Screen pos={[-0.32, 0, 0]} rot={[0, 0.15, 0]} />
          <Screen pos={[0.32, 0, 0]} rot={[0, -0.15, 0]} />
        </>
      ) : (
        <Screen pos={[0, 0, 0]} rot={[0, 0, 0]} />
      )}
    </group>
  );
}

export function Laptop(props) {
  return (
    <group {...props}>
      {/* Base */}
      <mesh position={[0, 0.01, 0]} castShadow><boxGeometry args={[0.4, 0.02, 0.3]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
      {/* Screen */}
      <group position={[0, 0.02, -0.15]} rotation={[0.2, 0, 0]}>
        <mesh position={[0, 0.15, 0]} castShadow><boxGeometry args={[0.4, 0.3, 0.02]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
        <mesh position={[0, 0.15, 0.012]}><boxGeometry args={[0.36, 0.26, 0.01]} /><meshStandardMaterial color="#00d2d3" emissive="#00d2d3" emissiveIntensity={0.4} /></mesh>
      </group>
    </group>
  );
}

export function PlantPot(props) {
  return (
    <group {...props}>
      <mesh position={[0, 0.2, 0]} castShadow><boxGeometry args={[0.4, 0.4, 0.4]} /><meshStandardMaterial color="#9b7b4e" /></mesh>
      <mesh position={[0, 0.6, 0]} castShadow><boxGeometry args={[0.06, 0.4, 0.06]} /><meshStandardMaterial color="#4d321d" /></mesh>
      <mesh position={[0, 1.0, 0]} castShadow><boxGeometry args={[0.55, 0.55, 0.55]} /><meshStandardMaterial color="#2ecc71" /></mesh>
      <mesh position={[0, 1.4, 0]} castShadow><boxGeometry args={[0.4, 0.4, 0.4]} /><meshStandardMaterial color="#27ae60" /></mesh>
    </group>
  );
}

export function Sofa({ color = "#9b59b6", ...props }) {
  // Purple sofa by default, as requested in image/prompt
  return (
    <group {...props}>
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow><boxGeometry args={[1.8, 0.3, 0.8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0, 0.55, -0.3]} castShadow><boxGeometry args={[1.8, 0.4, 0.2]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[-0.8, 0.45, 0]} castShadow><boxGeometry args={[0.2, 0.3, 0.8]} /><meshStandardMaterial color={color} /></mesh>
      <mesh position={[0.8, 0.45, 0]} castShadow><boxGeometry args={[0.2, 0.3, 0.8]} /><meshStandardMaterial color={color} /></mesh>
    </group>
  );
}
