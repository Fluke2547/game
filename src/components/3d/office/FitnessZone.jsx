import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import { useGameStore } from "../../../store/gameStore";
import { NPCs } from "../../../data/gameData";
import { globalPlayerState } from "../Player";
import * as THREE from "three";

function Treadmill({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Base Belt */}
      <mesh position={[0, 0.15, 0]} castShadow receiveShadow>
        <boxGeometry args={[1, 0.3, 2.5]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      {/* Side Rails */}
      <mesh position={[-0.55, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 2.5]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0.55, 0.2, 0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 2.5]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      {/* Front Console Tower */}
      <mesh position={[0, 0.8, -1.1]} castShadow>
        <boxGeometry args={[1, 1.6, 0.3]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
      {/* Screen */}
      <mesh position={[0, 1.3, -0.94]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.6, 0.4, 0.05]} />
        <meshStandardMaterial color="#111111" />
      </mesh>
      <mesh position={[0, 1.3, -0.91]} rotation={[-0.2, 0, 0]}>
        <planeGeometry args={[0.5, 0.3]} />
        <meshStandardMaterial
          color="#3498db"
          emissive="#3498db"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}

function YogaMat({ position, color, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.02, 0]} receiveShadow>
        <boxGeometry args={[1.2, 0.04, 2.4]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
      <mesh
        position={[0, 0.04, 1.1]}
        rotation={[0, 0, Math.PI / 2]}
        receiveShadow
      >
        <cylinderGeometry args={[0.08, 0.08, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.9} />
      </mesh>
    </group>
  );
}

function BenchPress({ position, rotation = [0, 0, 0] }) {
  const staticBarbellRef = useRef();
  useFrame(() => {
    if (!staticBarbellRef.current) return;
    let occupied = false;
    if (globalPlayerState.isBenching) {
      const dx = globalPlayerState.position.x - position[0];
      const dz = globalPlayerState.position.z - position[2];
      if (Math.sqrt(dx * dx + dz * dz) < 1.0) occupied = true;
    }
    if (!occupied) {
      for (const npc of NPCs) {
        const dx = (npc.position[0] || 0) - position[0];
        const dz = (npc.position[2] || 0) - position[2];
        if (
          Math.sqrt(dx * dx + dz * dz) < 1.0 &&
          npc.position[1] >= 6 &&
          npc.position[1] < 12
        ) {
          occupied = true;
          break;
        }
      }
    }
    staticBarbellRef.current.visible = !occupied;
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.4, 0.3]} castShadow>
        <boxGeometry args={[0.6, 0.2, 1.4]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>
      <mesh position={[0, 0.2, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0, 0.2, 0.8]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[-0.4, 0.8, -0.6]} castShadow>
        <boxGeometry args={[0.1, 1.6, 0.2]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0.4, 0.8, -0.6]} castShadow>
        <boxGeometry args={[0.1, 1.6, 0.2]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <group ref={staticBarbellRef} position={[0, 1.6, -0.6]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.03, 0.03, 1.8]} />
          <meshStandardMaterial color="#ecf0f1" />
        </mesh>
        <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#2d3436" />
        </mesh>
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 0.1]} />
          <meshStandardMaterial color="#2d3436" />
        </mesh>
      </group>
    </group>
  );
}

export function DumbbellModel({ size = "small" }) {
  const r = size === "large" ? 0.2 : 0.15;
  const w = size === "large" ? 0.15 : 0.1;
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.4]} />
        <meshStandardMaterial color="#bdc3c7" />
      </mesh>
      <mesh position={[-0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[r, r, w]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0.2, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[r, r, w]} />
        <meshStandardMaterial color="#111" />
      </mesh>
    </group>
  );
}

function DumbbellRack({ position, rotation = [0, 0, 0] }) {
  const rackRef = useRef();
  useFrame(() => {
    let occupiedLarge = false;
    let occupiedSmall = false;

    if (globalPlayerState.isLifting === "large") occupiedLarge = true;
    if (globalPlayerState.isLifting === "small") occupiedSmall = true;

    // Fallback for old state or NPCs
    if (globalPlayerState.isLifting === true) occupiedSmall = true;

    if (!occupiedLarge && !occupiedSmall) {
      for (const npc of NPCs) {
        const dx = (npc.position[0] || 0) - position[0];
        const dz = (npc.position[2] || 0) - position[2];
        if (
          Math.sqrt(dx * dx + dz * dz) < 2.0 &&
          npc.position[1] >= 6 &&
          npc.position[1] < 12
        ) {
          occupiedSmall = true;
          break;
        }
      }
    }
    if (rackRef.current) {
      if (rackRef.current.children[0])
        rackRef.current.children[0].visible = !occupiedLarge;
      if (rackRef.current.children[1])
        rackRef.current.children[1].visible = !occupiedLarge;
      if (rackRef.current.children[2])
        rackRef.current.children[2].visible = !occupiedSmall;
      if (rackRef.current.children[3])
        rackRef.current.children[3].visible = !occupiedSmall;
    }
  });
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4, 1, 0.8]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>
      <group ref={rackRef} position={[0, 0, 0]}>
        {/* Large Pair (Left) */}
        <group position={[-1.2, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <DumbbellModel size="large" />
        </group>
        <group position={[-0.4, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <DumbbellModel size="large" />
        </group>
        {/* Small Pair (Right) */}
        <group position={[0.4, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <DumbbellModel size="small" />
        </group>
        <group position={[1.2, 1.1, 0]} rotation={[0, Math.PI / 2, 0]}>
          <DumbbellModel size="small" />
        </group>
      </group>
    </group>
  );
}

function MultiGym({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[3, 0.2, 2]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      <mesh position={[-1.2, 1.5, -0.8]} castShadow>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[1.2, 1.5, -0.8]} castShadow>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-1.2, 1.5, 0.8]} castShadow>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[1.2, 1.5, 0.8]} castShadow>
        <boxGeometry args={[0.1, 3, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 3, -0.8]} castShadow>
        <boxGeometry args={[2.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 3, 0.8]} castShadow>
        <boxGeometry args={[2.5, 0.1, 0.1]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[-1.2, 3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 1.7]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[1.2, 3, 0]} castShadow>
        <boxGeometry args={[0.1, 0.1, 1.7]} />
        <meshStandardMaterial color="#111" />
      </mesh>
      <mesh position={[0, 1, -0.8]} castShadow>
        <boxGeometry args={[0.6, 1.8, 0.4]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0, 3.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 3]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
    </group>
  );
}

function PunchingBag({ position, rotation = [0, 0, 0] }) {
  const bagRef = useRef();

  useFrame((state) => {
    let occupied = false;
    // Check if player or NPC is punching
    if (globalPlayerState.isPunching) {
      const dx = globalPlayerState.position.x - position[0];
      const dz = globalPlayerState.position.z - position[2];
      if (Math.sqrt(dx * dx + dz * dz) < 2.0) occupied = true;
    }
    if (!occupied) {
      for (const npc of NPCs) {
        if (npc.pose !== "punch") continue;
        const dx = (npc.position[0] || 0) - position[0];
        const dz = (npc.position[2] || 0) - position[2];
        if (
          Math.sqrt(dx * dx + dz * dz) < 2.0 &&
          npc.position[1] >= 6 &&
          npc.position[1] < 12
        ) {
          occupied = true;
          break;
        }
      }
    }

    if (bagRef.current) {
      if (occupied) {
        // Swaying based on punching speed
        bagRef.current.rotation.z =
          Math.sin(state.clock.elapsedTime * 8) * 0.15;
        bagRef.current.rotation.x =
          Math.cos(state.clock.elapsedTime * 8) * 0.15;
      } else {
        // Interpolate back to 0
        bagRef.current.rotation.z *= 0.9;
        bagRef.current.rotation.x *= 0.9;
      }
    }
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.05, 0]} castShadow>
        <boxGeometry args={[1.5, 0.1, 1.5]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      <mesh position={[-0.6, 1.5, -0.6]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 3]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      <mesh
        position={[0, 2.95, -0.6]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[0.05, 0.05, 1.3]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>

      <group position={[0.6, 2.95, -0.6]} ref={bagRef}>
        <mesh position={[0, -0.35, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.7]} />
          <meshStandardMaterial color="#95a5a6" />
        </mesh>
        <mesh position={[0, -1.45, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.3, 1.5]} />
          <meshStandardMaterial color="#e74c3c" />
        </mesh>
        <mesh position={[0, -1.45, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>
    </group>
  );
}

function WaterCooler({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.6, 1, 0.6]} />
        <meshStandardMaterial color="#ecf0f1" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.6]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function PottedPlant({ position }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>
      <mesh position={[0, 1.4, 0]} castShadow>
        <boxGeometry args={[0.2, 1.5, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      <mesh position={[0, 2.4, 0]} castShadow>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial color="#2ecc71" />
      </mesh>
      <mesh position={[0.4, 2.8, 0.4]} castShadow>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#27ae60" />
      </mesh>
      <mesh position={[-0.4, 2.2, -0.4]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#2ecc71" />
      </mesh>
    </group>
  );
}

function LoungeCounter({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[4, 1, 1.2]} />
        <meshStandardMaterial color="#bdc3c7" />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[4.2, 0.1, 1.4]} />
        <meshStandardMaterial color="#f39c12" />
      </mesh>
      <mesh position={[-1, 1.15, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.6]} />
        <meshStandardMaterial color="#e84393" />
      </mesh>
      <mesh position={[-1, 1.25, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.6]} />
        <meshStandardMaterial color="#00cec9" />
      </mesh>
      <mesh position={[-1, 1.35, 0]} castShadow>
        <boxGeometry args={[0.4, 0.1, 0.6]} />
        <meshStandardMaterial color="#e84393" />
      </mesh>
      <mesh position={[1, 1.25, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial color="#0984e3" />
      </mesh>
      <mesh position={[1.3, 1.25, 0.2]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial color="#0984e3" />
      </mesh>
      <mesh position={[1.5, 1.25, -0.1]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 0.3]} />
        <meshStandardMaterial color="#0984e3" />
      </mesh>
    </group>
  );
}

function AFrameSign({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      <mesh position={[0, 0.5, 0.2]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      <mesh position={[0, 0.5, -0.2]} rotation={[-0.2, 0, 0]} castShadow>
        <boxGeometry args={[0.8, 1, 0.05]} />
        <meshStandardMaterial color="#2d3436" />
      </mesh>
      {/* Abstract Text Lines */}
      <mesh position={[0, 0.6, 0.23]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.05, 0.02]} />
        <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" />
      </mesh>
      <mesh position={[0, 0.45, 0.23]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.3, 0.05, 0.02]} />
        <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" />
      </mesh>
      <mesh position={[0, 0.3, 0.23]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.5, 0.05, 0.02]} />
        <meshStandardMaterial color="#f1c40f" emissive="#f1c40f" />
      </mesh>
    </group>
  );
}

function LedBorder({ position, width, depth, color }) {
  const t = 0.1;
  return (
    <group position={position}>
      <mesh position={[0, 0.02, -depth / 2]}>
        <boxGeometry args={[width + t, t, t]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[0, 0.02, depth / 2]}>
        <boxGeometry args={[width + t, t, t]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[-width / 2, 0.02, 0]}>
        <boxGeometry args={[t, t, depth + t]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
      <mesh position={[width / 2, 0.02, 0]}>
        <boxGeometry args={[t, t, depth + t]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.5}
        />
      </mesh>
    </group>
  );
}

export default function FitnessZone({ position }) {
  const currentFloor = useGameStore((s) => s.currentFloor);

  return (
    <group position={position}>
      <group visible={currentFloor >= 2}>
        {/* Floor */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[40, 0.2, 30]} />
          <meshStandardMaterial
            color="#1B2631"
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>

        {/* Glass railings */}
        <mesh position={[0, 0.5, 14.9]}>
          <boxGeometry args={[40, 1.0, 0.1]} />
          <meshStandardMaterial color="#aed6f1" transparent opacity={0.3} />
        </mesh>
        <mesh position={[0, 0.5, -14.9]}>
          <boxGeometry args={[40, 1.0, 0.1]} />
          <meshStandardMaterial color="#aed6f1" transparent opacity={0.3} />
        </mesh>
        <mesh position={[19.9, 0.5, 0]}>
          <boxGeometry args={[0.1, 1.0, 30]} />
          <meshStandardMaterial color="#aed6f1" transparent opacity={0.3} />
        </mesh>

        {/* ---- CARDIO ZONE ---- */}
        <LedBorder
          position={[-4, 0, -10]}
          width={22}
          depth={6}
          color="#00cec9"
        />
        <Treadmill position={[-12, 0, -10]} rotation={[0, -Math.PI / 2, 0]} />
        <Treadmill position={[-8, 0, -10]} rotation={[0, -Math.PI / 2, 0]} />
        <Treadmill position={[-4, 0, -10]} rotation={[0, -Math.PI / 2, 0]} />
        <Treadmill position={[0, 0, -10]} rotation={[0, -Math.PI / 2, 0]} />
        <Treadmill position={[4, 0, -10]} rotation={[0, -Math.PI / 2, 0]} />

        {/* Neon Sign "MAKE IT HAPPEN" */}
        <group position={[-4, 3.2, -14.8]}>
          <Text
            fontSize={0.8}
            color="#00cec9"
            anchorX="center"
            anchorY="middle"
          >
            <meshStandardMaterial
              color="#00cec9"
              emissive="#00cec9"
              emissiveIntensity={2}
              side={THREE.DoubleSide}
            />
            MAKE IT HAPPEN
          </Text>
        </group>

        {/* Water Cooler */}
        <WaterCooler position={[-16, 0, -13]} />
        <PottedPlant position={[-18, 0, -13]} />

        {/* ---- YOGA ZONE ---- */}
        <LedBorder
          position={[-4, 0, 0]}
          width={14}
          depth={10}
          color="#a29bfe"
        />
        <YogaMat
          position={[-6, 0, -2]}
          color="#fd79a8"
          rotation={[0, Math.PI / 6, 0]}
        />
        <YogaMat
          position={[-2, 0, -1]}
          color="#74b9ff"
          rotation={[0, -Math.PI / 8, 0]}
        />
        <YogaMat position={[-4, 0, 3]} color="#55efc4" rotation={[0, 0, 0]} />
        <YogaMat
          position={[-8, 0, 2]}
          color="#ffeaa7"
          rotation={[0, -Math.PI / 4, 0]}
        />
        <YogaMat
          position={[0, 0, 2]}
          color="#a29bfe"
          rotation={[0, Math.PI / 4, 0]}
        />

        {/* ---- WEIGHTS ZONE ---- */}
        <LedBorder
          position={[12, 0, 0]}
          width={10}
          depth={14}
          color="#fd79a8"
        />
        <BenchPress position={[10, 0, -2]} rotation={[0, Math.PI / 2, 0]} />
        <BenchPress position={[10, 0, 3]} rotation={[0, Math.PI / 2, 0]} />
        <MultiGym position={[15, 0, -4]} rotation={[0, -Math.PI / 2, 0]} />

        {/* Neon Sign "STRONGER EVERY DAY" */}
        <group position={[19.8, 3.2, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <Text
            fontSize={0.7}
            color="#fd79a8"
            anchorX="center"
            anchorY="middle"
          >
            <meshStandardMaterial
              color="#fd79a8"
              emissive="#fd79a8"
              emissiveIntensity={2}
              side={THREE.DoubleSide}
            />
            STRONGER
          </Text>
          <Text
            position={[0, -0.8, 0]}
            fontSize={0.5}
            color="#fd79a8"
            anchorX="center"
            anchorY="middle"
          >
            <meshStandardMaterial
              color="#fd79a8"
              emissive="#fd79a8"
              emissiveIntensity={2}
              side={THREE.DoubleSide}
            />
            EVERY DAY
          </Text>
        </group>
        <PottedPlant position={[16, 0, 5]} />

        {/* ---- PUNCHING BAG ---- */}
        <PunchingBag position={[15, 0, -11]} rotation={[0, Math.PI / 4, 0]} />

        {/* ---- DUMBBELL RACK ---- */}
        <LedBorder position={[-8, 0, 10]} width={8} depth={4} color="#0984e3" />
        <DumbbellRack position={[-8, 0, 10]} />

        {/* Neon Sign "YOU GOT THIS" */}
        <group position={[-8, 3.2, 12.5]} rotation={[0, Math.PI, 0]}>
          <Text
            fontSize={0.7}
            color="#55efc4"
            anchorX="center"
            anchorY="middle"
          >
            <meshStandardMaterial
              color="#55efc4"
              emissive="#55efc4"
              emissiveIntensity={2}
              side={THREE.DoubleSide}
            />
            YOU GOT THIS!
          </Text>
        </group>

        <PottedPlant position={[-4, 0, 11]} />

        {/* ---- LOUNGE COUNTER ---- */}
        <LedBorder position={[10, 0, 12]} width={8} depth={4} color="#ffeaa7" />
        <LoungeCounter position={[10, 0, 12]} />
        <AFrameSign position={[5, 0, 12]} rotation={[0, -Math.PI / 6, 0]} />
      </group>

      {/* Elevator Shaft */}
      <group position={[-16, -3, 12]}>
        <mesh position={[0, 6, 2]}>
          <boxGeometry args={[4, 18, 0.1]} />
          <meshStandardMaterial color="#aed6f1" transparent opacity={0.2} />
        </mesh>
        <mesh position={[2, 6, 0]}>
          <boxGeometry args={[0.1, 18, 4]} />
          <meshStandardMaterial color="#aed6f1" transparent opacity={0.2} />
        </mesh>
        <mesh position={[-2, 6, 0]}>
          <boxGeometry args={[0.1, 18, 4]} />
          <meshStandardMaterial color="#aed6f1" transparent opacity={0.2} />
        </mesh>
        {[
          [-2, -2],
          [2, -2],
          [2, 2],
          [-2, 2],
        ].map(([x, z], i) => (
          <mesh key={`ele-${i}`} position={[x, 6, z]}>
            <boxGeometry args={[0.2, 18, 0.2]} />
            <meshStandardMaterial color="#2d3436" />
          </mesh>
        ))}
        <mesh position={[0, -2.9, 0]}>
          <boxGeometry args={[4, 0.2, 4]} />
          <meshStandardMaterial color="#bdc3c7" />
        </mesh>
        <mesh position={[0, 3.1, 0]}>
          <boxGeometry args={[4, 0.2, 4]} />
          <meshStandardMaterial color="#bdc3c7" />
        </mesh>
        <mesh position={[0, 9.1, 0]}>
          <boxGeometry args={[4, 0.2, 4]} />
          <meshStandardMaterial color="#bdc3c7" />
        </mesh>
        <mesh position={[0, 15.1, 0]}>
          <boxGeometry args={[4, 0.2, 4]} />
          <meshStandardMaterial color="#2d3436" />
        </mesh>
      </group>
    </group>
  );
}
