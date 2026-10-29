import React from 'react';
import { Sofa, PlantPot } from './Furniture';

export default function LoungeZone({ position }) {
  return (
    <group position={position}>
      {/* Blue Rug */}
      <mesh position={[0, 0.01, -0.5]} receiveShadow>
        <boxGeometry args={[5, 0.02, 5]} />
        <meshStandardMaterial color="#3498db" />
      </mesh>

      {/* Purple Sofas */}
      <Sofa position={[0, 0, -2]} />
      <Sofa position={[-2.2, 0, -0.5]} rotation={[0, Math.PI / 2, 0]} />
      
      {/* Wooden Coffee Table */}
      <mesh position={[0, 0.2, -0.5]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 0.3, 0.8]} />
        <meshStandardMaterial color="#ddb892" />
      </mesh>
      
      <PlantPot position={[2.5, 0, -2.5]} />

      {/* Bookshelf */}
      <group position={[0, 0, -3]}>
        <mesh position={[0, 1.25, 0]} castShadow><boxGeometry args={[3, 2.5, 0.6]} /><meshStandardMaterial color="#ddb892" /></mesh>
        <mesh position={[0, 0.5, 0.1]} castShadow><boxGeometry args={[2.8, 0.05, 0.5]} /><meshStandardMaterial color="#8b5a2b" /></mesh>
        <mesh position={[0, 1.25, 0.1]} castShadow><boxGeometry args={[2.8, 0.05, 0.5]} /><meshStandardMaterial color="#8b5a2b" /></mesh>
        <mesh position={[0, 2.0, 0.1]} castShadow><boxGeometry args={[2.8, 0.05, 0.5]} /><meshStandardMaterial color="#8b5a2b" /></mesh>
        
        {/* Books */}
        <mesh position={[-1, 0.75, 0.1]} castShadow><boxGeometry args={[0.2, 0.4, 0.3]} /><meshStandardMaterial color="#e74c3c" /></mesh>
        <mesh position={[-0.7, 0.75, 0.1]} castShadow><boxGeometry args={[0.15, 0.45, 0.3]} /><meshStandardMaterial color="#3498db" /></mesh>
        <mesh position={[0.5, 1.5, 0.1]} castShadow><boxGeometry args={[0.2, 0.35, 0.3]} /><meshStandardMaterial color="#2ecc71" /></mesh>
        <mesh position={[0.8, 1.5, 0.1]} castShadow><boxGeometry args={[0.25, 0.4, 0.3]} /><meshStandardMaterial color="#f1c40f" /></mesh>
      </group>
    </group>
  );
}
