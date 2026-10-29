import React, { useMemo } from 'react';
import { Desk, Chair, Monitor, Laptop, PlantPot } from './Furniture';

// Simple deterministic hash to replace Math.random()
function seededValue(seed) {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

export default function WorkspaceZone({ position }) {
  const cols = [-4, 4];
  const rows = [-8, 0, 8];

  // Pre-calculate desk configs once so they never change on re-render
  const deskConfigs = useMemo(() => {
    const configs = [];
    let seed = 1;
    cols.forEach((cx, cIdx) => {
      rows.forEach((rz, rIdx) => {
        [0, 1].forEach((deskIdx) => {
          const hasMonitor = seededValue(seed++) > 0.5;
          const hasPlant = seededValue(seed++) > 0.3;
          configs.push({ cIdx, rIdx, deskIdx, hasMonitor, hasPlant });
        });
      });
    });
    return configs;
  }, []);

  return (
    <group position={position}>
      {/* Decorative Planter boxes along the window */}
      <mesh position={[-7, 0.4, -6]}><boxGeometry args={[1, 0.8, 3]} /><meshStandardMaterial color="#8B6914" /></mesh>
      <PlantPot position={[-7, 0.8, -7]} />
      <PlantPot position={[-7, 0.8, -6]} />
      <PlantPot position={[-7, 0.8, -5]} />

      <mesh position={[-7, 0.4, 2]}><boxGeometry args={[1, 0.8, 3]} /><meshStandardMaterial color="#8B6914" /></mesh>
      <PlantPot position={[-7, 0.8, 1]} />
      <PlantPot position={[-7, 0.8, 2]} />
      <PlantPot position={[-7, 0.8, 3]} />

      {/* Whiteboard */}
      <group position={[-6, 0, -11]} rotation={[0, 0, 0]}>
        <mesh position={[0, 1.5, 0]} castShadow><boxGeometry args={[3, 2, 0.1]} /><meshStandardMaterial color="#ffffff" /></mesh>
        <mesh position={[-1.4, 1.5, 0]}><boxGeometry args={[0.1, 2.1, 0.15]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
        <mesh position={[1.4, 1.5, 0]}><boxGeometry args={[0.1, 2.1, 0.15]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
        <mesh position={[-1.2, 0.5, 0]}><cylinderGeometry args={[0.05, 0.05, 1]} /><meshStandardMaterial color="#7f8c8d" /></mesh>
        <mesh position={[1.2, 0.5, 0]}><cylinderGeometry args={[0.05, 0.05, 1]} /><meshStandardMaterial color="#7f8c8d" /></mesh>
      </group>

      {cols.map((cx, cIdx) => (
        <React.Fragment key={`col-${cIdx}`}>
          {rows.map((rz, rIdx) => (
            <group key={`cluster-${cIdx}-${rIdx}`} position={[cx, 0, rz]}>
              {/* Low Partition Wall between desks */}
              <mesh position={[0, 0.6, 0]} castShadow><boxGeometry args={[2.2, 1.2, 0.1]} /><meshStandardMaterial color="#f5f6fa" /></mesh>

              {[
                { x: 0, z: -0.8, rot: Math.PI },
                { x: 0, z: 0.8, rot: 0 },
              ].map((pos, deskIdx) => {
                const cfg = deskConfigs.find(
                  c => c.cIdx === cIdx && c.rIdx === rIdx && c.deskIdx === deskIdx
                );
                return (
                  <group key={`desk-${deskIdx}`} position={[pos.x, 0, pos.z]} rotation={[0, pos.rot, 0]}>
                    <Desk />
                    <Chair position={[0, 0, 0.8]} />
                    
                    {cfg?.hasMonitor ? (
                      <Monitor dual position={[0, 1.05, -0.2]} />
                    ) : (
                      <Laptop position={[0, 0.76, -0.1]} />
                    )}
                    
                    <mesh position={[-0.2, 0.79, 0.2]} castShadow><boxGeometry args={[0.4, 0.02, 0.12]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
                    <mesh position={[0.2, 0.79, 0.2]} castShadow><boxGeometry args={[0.08, 0.02, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
                    <mesh position={[0.7, 0.82, 0.1]} castShadow><cylinderGeometry args={[0.04, 0.04, 0.1]} /><meshStandardMaterial color="#FFFFFF" /></mesh>
                    
                    {cfg?.hasPlant && (
                      <group position={[0.6, 0.78, -0.2]} scale={0.5}>
                        <PlantPot />
                      </group>
                    )}
                  </group>
                );
              })}
            </group>
          ))}
        </React.Fragment>
      ))}
    </group>
  );
}
