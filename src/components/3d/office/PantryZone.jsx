import React from 'react';

export default function PantryZone({ position }) {
  return (
    <group position={position}>
      {/* Green Wall Backdrop */}
      <mesh position={[0, 2, -1.5]} castShadow>
        <boxGeometry args={[6, 4, 0.2]} />
        <meshStandardMaterial color="#7da27e" />
      </mesh>

      {/* Kitchen Counter (White & Oak Wood) */}
      <mesh position={[0, 0.45, -0.5]} castShadow><boxGeometry args={[4, 0.9, 1.0]} /><meshStandardMaterial color="#ffffff" /></mesh>
      <mesh position={[0, 0.95, -0.5]} castShadow><boxGeometry args={[4.2, 0.05, 1.1]} /><meshStandardMaterial color="#ddb892" /></mesh>
      
      {/* Blue Fridge */}
      <group position={[-2.5, 0, -0.5]}>
        <mesh position={[0, 1.0, 0]} castShadow><boxGeometry args={[0.9, 2.0, 0.9]} /><meshStandardMaterial color="#3498db" /></mesh>
        <mesh position={[0.2, 1.2, 0.46]}><boxGeometry args={[0.05, 0.4, 0.05]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
      </group>
      
      {/* Vending Machine (Blue) */}
      <group position={[2.5, 0, -0.5]}>
        <mesh position={[0, 1.0, 0]} castShadow><boxGeometry args={[0.9, 2.0, 0.9]} /><meshStandardMaterial color="#2980b9" /></mesh>
        <mesh position={[0, 1.2, 0.41]}><boxGeometry args={[0.7, 0.8, 0.1]} /><meshStandardMaterial color="#e0f7fa" emissive="#e0f7fa" emissiveIntensity={0.5} /></mesh>
      </group>

      {/* Upgraded Coffee Machine (Black/Silver with details) */}
      <group position={[1.2, 1.15, -0.6]}>
        <mesh castShadow><boxGeometry args={[0.4, 0.4, 0.35]} /><meshStandardMaterial color="#2d3436" /></mesh> {/* Main Body */}
        <mesh position={[0, -0.1, 0.15]}><boxGeometry args={[0.3, 0.1, 0.2]} /><meshStandardMaterial color="#bdc3c7" /></mesh> {/* Drip tray */}
        <mesh position={[0, 0.15, 0.15]}><boxGeometry args={[0.3, 0.1, 0.2]} /><meshStandardMaterial color="#2d3436" /></mesh> {/* Top overhang */}
        <mesh position={[0, 0, 0.15]}><cylinderGeometry args={[0.05, 0.05, 0.15]} /><meshStandardMaterial color="#bdc3c7" /></mesh> {/* Spout */}
        <mesh position={[-0.1, 0.15, 0.26]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color="#e74c3c" /></mesh> {/* Red button */}
        <mesh position={[0.1, 0.15, 0.26]}><circleGeometry args={[0.03, 16]} /><meshStandardMaterial color="#2ecc71" /></mesh> {/* Green button */}
        {/* Coffee Cup */}
        <mesh position={[0, -0.05, 0.15]}><cylinderGeometry args={[0.06, 0.05, 0.12]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>

      {/* Microwave (White/Silver with glass door) */}
      <group position={[-1.0, 1.15, -0.6]}>
        <mesh castShadow><boxGeometry args={[0.7, 0.4, 0.4]} /><meshStandardMaterial color="#ecf0f1" /></mesh> {/* Main Body */}
        <mesh position={[-0.05, 0, 0.21]}><boxGeometry args={[0.5, 0.3, 0.02]} /><meshStandardMaterial color="#111111" metalness={0.8} roughness={0.2} /></mesh> {/* Glass Door */}
        <mesh position={[0.25, 0, 0.21]}><boxGeometry args={[0.1, 0.3, 0.02]} /><meshStandardMaterial color="#bdc3c7" /></mesh> {/* Control Panel */}
        <mesh position={[0.25, 0.08, 0.22]}><boxGeometry args={[0.06, 0.04, 0.01]} /><meshStandardMaterial color="#2ecc71" emissive="#2ecc71" emissiveIntensity={0.5} /></mesh> {/* LED Time */}
        <mesh position={[0.25, -0.08, 0.22]} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.03, 0.03, 0.02]} /><meshStandardMaterial color="#7f8c8d" /></mesh> {/* Dial */}
      </group>
      
      {/* Open Shelving (Wooden) */}
      <mesh position={[0, 1.8, -1.3]} castShadow><boxGeometry args={[3, 0.05, 0.4]} /><meshStandardMaterial color="#ddb892" /></mesh>
      <mesh position={[0, 2.3, -1.3]} castShadow><boxGeometry args={[3, 0.05, 0.4]} /><meshStandardMaterial color="#ddb892" /></mesh>

      {/* Snacks on Lower Shelf */}
      <group position={[0, 1.825, -1.3]}>
        {/* Cereal Boxes */}
        <mesh position={[-1.2, 0.15, 0]} castShadow><boxGeometry args={[0.2, 0.3, 0.15]} /><meshStandardMaterial color="#e67e22" /></mesh>
        <mesh position={[-0.95, 0.15, 0]} castShadow><boxGeometry args={[0.2, 0.3, 0.15]} /><meshStandardMaterial color="#f1c40f" /></mesh>
        <mesh position={[-0.7, 0.125, 0]} castShadow><boxGeometry args={[0.15, 0.25, 0.15]} /><meshStandardMaterial color="#3498db" /></mesh>
        
        {/* Cookie Jars */}
        <mesh position={[0.2, 0.1, 0]} castShadow><cylinderGeometry args={[0.1, 0.1, 0.2]} /><meshStandardMaterial color="#ecf0f1" transparent opacity={0.7} /></mesh>
        <mesh position={[0.2, 0.2, 0]}><cylinderGeometry args={[0.08, 0.1, 0.05]} /><meshStandardMaterial color="#e74c3c" /></mesh> {/* Lid */}
        
        <mesh position={[0.5, 0.08, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 0.16]} /><meshStandardMaterial color="#ecf0f1" transparent opacity={0.7} /></mesh>
        <mesh position={[0.5, 0.16, 0]}><cylinderGeometry args={[0.06, 0.08, 0.04]} /><meshStandardMaterial color="#3498db" /></mesh> {/* Lid */}
      </group>

      {/* Snacks on Upper Shelf */}
      <group position={[0, 2.325, -1.3]}>
        {/* Coffee Bean Bags */}
        <mesh position={[1.0, 0.1, 0]} castShadow><boxGeometry args={[0.15, 0.2, 0.1]} /><meshStandardMaterial color="#2c3e50" /></mesh>
        <mesh position={[1.2, 0.1, 0]} castShadow rotation={[0, 0.2, 0]}><boxGeometry args={[0.15, 0.2, 0.1]} /><meshStandardMaterial color="#2c3e50" /></mesh>
        
        {/* Stack of cups */}
        <mesh position={[-0.3, 0.05, 0]} castShadow><cylinderGeometry args={[0.05, 0.04, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-0.3, 0.1, 0]} castShadow><cylinderGeometry args={[0.05, 0.04, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-0.3, 0.15, 0]} castShadow><cylinderGeometry args={[0.05, 0.04, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        
        <mesh position={[-0.5, 0.05, 0]} castShadow><cylinderGeometry args={[0.05, 0.04, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-0.5, 0.1, 0]} castShadow><cylinderGeometry args={[0.05, 0.04, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
      </group>

      {/* Dining Table (Oak Wood) */}
      <group position={[0, 0, 2]}>
        <mesh position={[0, 0.75, 0]} castShadow><boxGeometry args={[3, 0.1, 1.5]} /><meshStandardMaterial color="#ddb892" /></mesh>
        <mesh position={[-1.3, 0.35, -0.6]} castShadow><boxGeometry args={[0.1, 0.7, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
        <mesh position={[1.3, 0.35, -0.6]} castShadow><boxGeometry args={[0.1, 0.7, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
        <mesh position={[-1.3, 0.35, 0.6]} castShadow><boxGeometry args={[0.1, 0.7, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
        <mesh position={[1.3, 0.35, 0.6]} castShadow><boxGeometry args={[0.1, 0.7, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
        
        {/* Stools */}
        <mesh position={[-1, 0.3, -1.2]} castShadow><boxGeometry args={[0.5, 0.6, 0.5]} /><meshStandardMaterial color="#ddb892" /></mesh>
        <mesh position={[1, 0.3, -1.2]} castShadow><boxGeometry args={[0.5, 0.6, 0.5]} /><meshStandardMaterial color="#ddb892" /></mesh>
        <mesh position={[-1, 0.3, 1.2]} castShadow><boxGeometry args={[0.5, 0.6, 0.5]} /><meshStandardMaterial color="#ddb892" /></mesh>
        <mesh position={[1, 0.3, 1.2]} castShadow><boxGeometry args={[0.5, 0.6, 0.5]} /><meshStandardMaterial color="#ddb892" /></mesh>
      </group>
    </group>
  );
}
