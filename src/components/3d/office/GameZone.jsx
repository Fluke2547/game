import React from 'react';

export default function GameZone({ position }) {
  return (
    <group position={position}>
      {/* Ping Pong Table (Voxel style) */}
      <group position={[-2, 0, 0]}>
        <mesh position={[0, 0.75, 0]} castShadow><boxGeometry args={[1.5, 0.1, 2.7]} /><meshStandardMaterial color="#00BCD4" /></mesh>
        <mesh position={[0, 0.35, 0]} castShadow><boxGeometry args={[1.2, 0.7, 2.4]} /><meshStandardMaterial color="#E0E0E0" /></mesh>
        {/* Net */}
        <mesh position={[0, 0.85, 0]}><boxGeometry args={[1.5, 0.1, 0.05]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
      </group>
      
      {/* Arcade Machine */}
      <group position={[2, 0, -1]}>
        <mesh position={[0, 0.9, 0]} castShadow><boxGeometry args={[0.8, 1.8, 0.8]} /><meshStandardMaterial color="#FF00FF" /></mesh>
        <mesh position={[0, 1.2, 0.41]}><boxGeometry args={[0.6, 0.5, 0.05]} /><meshStandardMaterial color="#00BCD4" emissive="#00BCD4" emissiveIntensity={0.8} /></mesh>
      </group>
    </group>
  );
}
