import React from 'react';
import { Monitor, Chair, PlantPot } from './Furniture';

export default function ReceptionZone({ position }) {
  return (
    <group position={position}>
      {/* Reception Counter (White & Oak Wood) */}
      <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[3.5, 1.0, 0.8]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 1.05, 0]} castShadow><boxGeometry args={[3.7, 0.05, 1.0]} /><meshStandardMaterial color="#ddb892" /></mesh>
      
      <Monitor position={[0.5, 1.1, -0.2]} />
      <Chair position={[0.5, 0, -1]} rotation={[0, Math.PI, 0]} />
      
      {/* Wooden Backdrop with HELLO sign */}
      <mesh position={[0, 1.5, -2]} castShadow receiveShadow>
        <boxGeometry args={[5, 3, 0.1]} />
        <meshStandardMaterial color="#ddb892" />
      </mesh>
      
      {/* HELLO sign (White) */}
      <group position={[0, 2, -1.9]}>
        <mesh><boxGeometry args={[2.5, 0.8, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[0, 0, 0.06]}>
          <boxGeometry args={[2.3, 0.6, 0.02]} />
          <meshStandardMaterial color="#2d3436" />
        </mesh>
      </group>

      {/* Waiting Area (Purple seats) */}
      <Chair color="#9b59b6" position={[-3, 0, 1]} rotation={[0, Math.PI/2, 0]} />
      <Chair color="#9b59b6" position={[-3, 0, 2]} rotation={[0, Math.PI/2, 0]} />
      
      <PlantPot position={[-3, 0, -1]} />
    </group>
  );
}
