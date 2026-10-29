import React from 'react';
import WorkspaceZone from './office/WorkspaceZone';
import MeetingRoomZone from './office/MeetingRoomZone';
import ReceptionZone from './office/ReceptionZone';
import PantryZone from './office/PantryZone';
import LoungeZone from './office/LoungeZone';
import FitnessZone from './office/FitnessZone';
import RooftopZone from './office/RooftopZone';
import { PlantPot } from './office/Furniture';
import { OFFICE_CONFIG } from '../../data/gameData';

function GlassFacade({ width, depth, height }) {
  const hw = width / 2;
  const hd = depth / 2;
  const h2 = height / 2;
  // Use thicker, elegant white frames for a modern high-end look
  const F_COLOR = "#ffffff";
  const G_COLOR = "#87CEEB";

  return (
    <group>
      {/* FRONT WALL */}
      <mesh position={[0, h2, hd]}><boxGeometry args={[width, height, 0.2]} /><meshStandardMaterial color={G_COLOR} transparent opacity={0.15} roughness={0.1} metalness={0.9} /></mesh>
      <mesh position={[0, height, hd]}><boxGeometry args={[width, 0.6, 0.3]} /><meshStandardMaterial color={F_COLOR} /></mesh>
      <mesh position={[0, 0, hd]}><boxGeometry args={[width, 0.6, 0.3]} /><meshStandardMaterial color={F_COLOR} /></mesh>
      
      {/* BACK WALL */}
      <mesh position={[0, h2, -hd]}><boxGeometry args={[width, height, 0.2]} /><meshStandardMaterial color={G_COLOR} transparent opacity={0.15} roughness={0.1} metalness={0.9} /></mesh>
      <mesh position={[0, height, -hd]}><boxGeometry args={[width, 0.6, 0.3]} /><meshStandardMaterial color={F_COLOR} /></mesh>
      <mesh position={[0, 0, -hd]}><boxGeometry args={[width, 0.6, 0.3]} /><meshStandardMaterial color={F_COLOR} /></mesh>
      
      {/* LEFT WALL */}
      <mesh position={[-hw, h2, 0]}><boxGeometry args={[0.2, height, depth]} /><meshStandardMaterial color={G_COLOR} transparent opacity={0.15} roughness={0.1} metalness={0.9} /></mesh>
      <mesh position={[-hw, height, 0]}><boxGeometry args={[0.3, 0.6, depth]} /><meshStandardMaterial color={F_COLOR} /></mesh>
      <mesh position={[-hw, 0, 0]}><boxGeometry args={[0.3, 0.6, depth]} /><meshStandardMaterial color={F_COLOR} /></mesh>
      
      {/* RIGHT WALL */}
      <mesh position={[hw, h2, 0]}><boxGeometry args={[0.2, height, depth]} /><meshStandardMaterial color={G_COLOR} transparent opacity={0.15} roughness={0.1} metalness={0.9} /></mesh>
      <mesh position={[hw, height, 0]}><boxGeometry args={[0.3, 0.6, depth]} /><meshStandardMaterial color={F_COLOR} /></mesh>
      <mesh position={[hw, 0, 0]}><boxGeometry args={[0.3, 0.6, depth]} /><meshStandardMaterial color={F_COLOR} /></mesh>
      
      {/* Corner Pillars */}
      {[[-hw, -hd], [hw, -hd], [-hw, hd], [hw, hd]].map(([px, pz], i) => (
        <mesh key={i} position={[px, h2, pz]}>
          <boxGeometry args={[0.6, height, 0.6]} />
          <meshStandardMaterial color={F_COLOR} />
        </mesh>
      ))}
    </group>
  );
}

export default function OfficeMap() {
  const { floorSize, wallHeight } = OFFICE_CONFIG;
  const w = floorSize.width;
  const d = floorSize.depth;
  const hw = w / 2;
  const hd = d / 2;

  return (
    <group>
      {/* ===== Interior Office Lighting ===== */}
      {/* Warm ceiling lights (simulating office LED panels) */}
      <pointLight position={[-10, 5, 0]} intensity={15} color="#fff5e6" distance={25} decay={2} />
      <pointLight position={[5, 5, 0]} intensity={15} color="#fff5e6" distance={25} decay={2} />
      <pointLight position={[14, 5, -8]} intensity={10} color="#fff5e6" distance={20} decay={2} />
      <pointLight position={[14, 5, 10]} intensity={10} color="#fff5e6" distance={20} decay={2} />
      {/* 2nd floor lighting */}
      <pointLight position={[-10, 11, 0]} intensity={15} color="#fff5e6" distance={25} decay={2} />
      <pointLight position={[10, 11, 0]} intensity={15} color="#fff5e6" distance={25} decay={2} />
      {/* Window-side fill light (daylight blue tint) */}
      <directionalLight position={[-20, 8, 0]} intensity={0.8} color="#c8e6ff" />

      {/* ===== FLOOR 1 (Light Cream Tile #F5F5DC / #E8E6E1) ===== */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color="#f0efe9" roughness={0.25} metalness={0.1} />
      </mesh>

      {/* ===== FLOOR 2 (Fitness Zone) ===== */}
      <FitnessZone position={[0, 6, 0]} />

      {/* ===== FLOOR 3 (Rooftop Zone) ===== */}
      <RooftopZone position={[0, 12, 0]} />

      {/* ===== BUILDING BASE (The skyscraper below the office) ===== */}
      <mesh position={[0, -25.1, 0]}>
        <boxGeometry args={[w - 0.2, 50, d - 0.2]} />
        <meshStandardMaterial color="#1a252f" roughness={0.9} transparent opacity={0.9} />
      </mesh>

      {/* ===== EXTERIOR WALLS (Full Glass 3 sides with black frames) ===== */}
      {/* Extend height to cover both floors (12 units) */}
      <GlassFacade width={w} depth={d} height={12} />

      {/* ===== ZONES ===== */}
      {/* 1. Workspace (Left Side - 12 Desks) */}
      <WorkspaceZone position={[-hw + 8, 0, 0]} />
      
      {/* 2. Meeting Room (Back center/left) */}
      <MeetingRoomZone position={[2, 0, -hd + 5]} size={[12, wallHeight, 8]} />
      
      {/* 3. Reception (Front Right) */}
      <ReceptionZone position={[hw - 6, 0, hd - 4]} />
      
      {/* 4. Pantry (Top Right) */}
      <PantryZone position={[hw - 4, 0, -hd + 4]} />
      
      {/* 5. Lounge (Right center) */}
      <LoungeZone position={[hw - 6, 0, 2]} />
      
      {/* Decorative Plants */}
      <PlantPot position={[-hw + 2, 0, hd - 2]} />
      <PlantPot position={[hw - 2, 0, hd - 2]} />
      <PlantPot position={[-hw + 2, 0, -hd + 2]} />
    </group>
  );
}

