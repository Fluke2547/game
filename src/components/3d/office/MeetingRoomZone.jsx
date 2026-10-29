import React from 'react';
import { Chair } from './Furniture';

export default function MeetingRoomZone({ position, size }) {
  const [w, h, d] = size;
  const doorWidth = 2; // Width of the entrance gap
  const leftPanelW = (w - doorWidth) / 2;
  
  return (
    <group position={position}>
      {/* Glass partition walls with black frames */}
      {/* Front wall - SPLIT into 2 panels with door gap in center */}
      <mesh position={[-(doorWidth/2 + leftPanelW/2), h/2, d/2]}>
        <boxGeometry args={[leftPanelW, h, 0.05]} />
        <meshStandardMaterial color="#aed6f1" transparent opacity={0.15} metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[(doorWidth/2 + leftPanelW/2), h/2, d/2]}>
        <boxGeometry args={[leftPanelW, h, 0.05]} />
        <meshStandardMaterial color="#aed6f1" transparent opacity={0.15} metalness={0.9} roughness={0.1} />
      </mesh>
      
      {/* Door frame pillars */}
      <mesh position={[-doorWidth/2, h/2, d/2]} castShadow>
        <boxGeometry args={[0.15, h, 0.15]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      <mesh position={[doorWidth/2, h/2, d/2]} castShadow>
        <boxGeometry args={[0.15, h, 0.15]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      {/* Door top beam */}
      <mesh position={[0, h, d/2]} castShadow>
        <boxGeometry args={[doorWidth + 0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      
      {/* Back wall - full glass */}
      <mesh position={[0, h/2, -d/2]}><boxGeometry args={[w, h, 0.05]} /><meshStandardMaterial color="#aed6f1" transparent opacity={0.15} metalness={0.9} roughness={0.1} /></mesh>
      {/* Left wall - full glass */}
      <mesh position={[-w/2, h/2, 0]}><boxGeometry args={[0.05, h, d]} /><meshStandardMaterial color="#aed6f1" transparent opacity={0.15} metalness={0.9} roughness={0.1} /></mesh>
      {/* Right wall - full glass */}
      <mesh position={[w/2, h/2, 0]}><boxGeometry args={[0.05, h, d]} /><meshStandardMaterial color="#aed6f1" transparent opacity={0.15} metalness={0.9} roughness={0.1} /></mesh>
      
      {/* Corner Frames */}
      {[[-w/2, -d/2], [w/2, -d/2], [-w/2, d/2], [w/2, d/2]].map(([x, z], i) => (
        <mesh key={i} position={[x, h/2, z]} castShadow>
          <boxGeometry args={[0.15, h, 0.15]} />
          <meshStandardMaterial color="#2d3436" />
        </mesh>
      ))}
      {/* Front wall mullions (only on left/right panels, not the door) */}
      <mesh position={[-w/4, h/2, d/2]} castShadow><boxGeometry args={[0.1, h, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
      <mesh position={[w/4, h/2, d/2]} castShadow><boxGeometry args={[0.1, h, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
      
      {/* Oak Conference Table */}
      <group position={[0, 0, 0]}>
        <mesh position={[-1.5, 0.375, 0]} castShadow><boxGeometry args={[0.1, 0.75, 0.6]} /><meshStandardMaterial color="#2d3436" /></mesh>
        <mesh position={[1.5, 0.375, 0]} castShadow><boxGeometry args={[0.1, 0.75, 0.6]} /><meshStandardMaterial color="#2d3436" /></mesh>
        <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.0, 0.06, 1.4]} />
          <meshStandardMaterial color="#ddb892" />
        </mesh>
      </group>
      
      {/* Black Chairs */}
      {[-1.2, 0, 1.2].map((x, i) => (
        <React.Fragment key={i}>
          <Chair position={[x, 0, 1.1]} rotation={[0, 0, 0]} />
          <Chair position={[x, 0, -1.1]} rotation={[0, Math.PI, 0]} />
        </React.Fragment>
      ))}
      
      {/* Whiteboard */}
      <mesh position={[w/2 - 0.1, 1.5, 0]} castShadow><boxGeometry args={[0.1, 1.5, 2.5]} /><meshStandardMaterial color="#bdc3c7" /></mesh>
      <mesh position={[w/2 - 0.15, 1.5, 0]}>
        <boxGeometry args={[0.02, 1.4, 2.4]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}

