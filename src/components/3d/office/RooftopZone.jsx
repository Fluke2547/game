import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGameStore } from "../../../store/gameStore";

function Helipad({ position }) {
  return (
    <group position={position}>
      {/* Circle base */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.05, 0]}>
        <circleGeometry args={[6, 32]} />
        <meshStandardMaterial color="#2d3436" roughness={0.8} />
      </mesh>

      {/* The "H" Letter */}
      <group position={[0, 0.08, 0]}>
        <mesh position={[-1.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 4]} />
          <meshStandardMaterial color="#ecf0f1" />
        </mesh>
        <mesh position={[1.5, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.6, 4]} />
          <meshStandardMaterial color="#ecf0f1" />
        </mesh>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.4, 0.6]} />
          <meshStandardMaterial color="#ecf0f1" />
        </mesh>
      </group>

      {/* Helipad Lights */}
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
        const angle = (i / 8) * Math.PI * 2;
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 5.8, 0.1, Math.sin(angle) * 5.8]}
          >
            <sphereGeometry args={[0.1]} />
            <meshStandardMaterial
              color="#f1c40f"
              emissive="#f1c40f"
              emissiveIntensity={2}
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function Helicopter({ position, rotation = [0, 0, 0] }) {
  const rotorRef = useRef();

  useFrame((state, delta) => {
    if (rotorRef.current) {
      rotorRef.current.rotation.y += delta * 15; // Fast spinning
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Landing Skids */}
      <mesh position={[-0.8, 0.1, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 4]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0.8, 0.1, 0]} castShadow>
        <boxGeometry args={[0.1, 0.2, 4]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0, 0.2, 1.5]} castShadow>
        <boxGeometry args={[1.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0, 0.2, -1.5]} castShadow>
        <boxGeometry args={[1.6, 0.1, 0.1]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <boxGeometry args={[1.6, 1.4, 3.5]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>

      {/* Cockpit Window */}
      <mesh position={[0, 1.2, 1.76]}>
        <boxGeometry args={[1.4, 0.8, 0.1]} />
        <meshStandardMaterial color="#3498db" transparent opacity={0.6} />
      </mesh>

      {/* Tail */}
      <mesh position={[0, 1.2, -2.5]} castShadow>
        <boxGeometry args={[0.4, 0.4, 3]} />
        <meshStandardMaterial color="#e74c3c" />
      </mesh>
      <mesh position={[0, 1.5, -3.8]} castShadow>
        <boxGeometry args={[0.2, 1.2, 0.6]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>

      {/* Main Rotor Base */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.4]} />
        <meshStandardMaterial color="#2c3e50" />
      </mesh>

      {/* Main Rotor Blades */}
      <group position={[0, 2.0, 0]} ref={rotorRef}>
        <mesh castShadow>
          <boxGeometry args={[6, 0.05, 0.3]} />
          <meshStandardMaterial color="#2d3436" />
        </mesh>
        <mesh castShadow>
          <boxGeometry args={[0.3, 0.05, 6]} />
          <meshStandardMaterial color="#2d3436" />
        </mesh>
      </group>
    </group>
  );
}

function BBQGrill({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Legs */}
      <mesh position={[-0.4, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>
      <mesh position={[0.4, 0.5, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 1]} />
        <meshStandardMaterial color="#7f8c8d" />
      </mesh>

      {/* Grill Body */}
      <mesh position={[0, 1.0, 0]} castShadow>
        <cylinderGeometry args={[0.6, 0.4, 0.4]} />
        <meshStandardMaterial color="#c0392b" />
      </mesh>

      {/* Grill Grate */}
      <mesh position={[0, 1.2, 0]}>
        <cylinderGeometry args={[0.62, 0.62, 0.05]} />
        <meshStandardMaterial color="#34495e" />
      </mesh>

      {/* Embers/Fire */}
      <mesh position={[0, 1.15, 0]}>
        <cylinderGeometry args={[0.55, 0.55, 0.05]} />
        <meshStandardMaterial
          color="#d35400"
          emissive="#e67e22"
          emissiveIntensity={1}
        />
      </mesh>

      {/* Smoke particle effect placeholder */}
      <mesh position={[0, 1.5, 0]}>
        <sphereGeometry args={[0.2]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.2} />
      </mesh>
      <mesh position={[0.1, 1.8, 0.1]}>
        <sphereGeometry args={[0.3]} />
        <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

function PicnicTable({ position, rotation = [0, 0, 0] }) {
  return (
    <group position={position} rotation={rotation}>
      {/* Table Top */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 1.2]} />
        <meshStandardMaterial color="#f39c12" roughness={0.7} />
      </mesh>
      {/* Table Legs */}
      <mesh position={[-1.1, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.8]} />
        <meshStandardMaterial color="#8e44ad" />
      </mesh>
      <mesh position={[1.1, 0.4, 0]} castShadow>
        <boxGeometry args={[0.1, 0.8, 0.8]} />
        <meshStandardMaterial color="#8e44ad" />
      </mesh>

      {/* Benches */}
      <mesh position={[0, 0.4, 1.0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 0.4]} />
        <meshStandardMaterial color="#f39c12" roughness={0.7} />
      </mesh>
      <mesh position={[0, 0.4, -1.0]} castShadow>
        <boxGeometry args={[2.5, 0.1, 0.4]} />
        <meshStandardMaterial color="#f39c12" roughness={0.7} />
      </mesh>
      {/* Bench Legs */}
      <mesh position={[-1.1, 0.2, 1.0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.3]} />
        <meshStandardMaterial color="#8e44ad" />
      </mesh>
      <mesh position={[1.1, 0.2, 1.0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.3]} />
        <meshStandardMaterial color="#8e44ad" />
      </mesh>
      <mesh position={[-1.1, 0.2, -1.0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.3]} />
        <meshStandardMaterial color="#8e44ad" />
      </mesh>
      <mesh position={[1.1, 0.2, -1.0]} castShadow>
        <boxGeometry args={[0.1, 0.4, 0.3]} />
        <meshStandardMaterial color="#8e44ad" />
      </mesh>
    </group>
  );
}

export default function RooftopZone({ position }) {
  const currentFloor = useGameStore((s) => s.currentFloor);

  const isFlying = useGameStore((s) => s.isFlying);

  return (
    <group position={position}>
      {/* Rooftop is visible when player is on Floor 3 or above */}
      <group visible={currentFloor >= 3}>
        {/* Roof Base Plane */}
        <mesh position={[0, -0.1, 0]} receiveShadow>
          <boxGeometry args={[40, 0.2, 30]} />
          <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
        </mesh>

        {/* Glass railings around the edge to prevent falling visually */}
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
        <mesh position={[-19.9, 0.5, 0]}>
          <boxGeometry args={[0.1, 1.0, 30]} />
          <meshStandardMaterial color="#aed6f1" transparent opacity={0.3} />
        </mesh>

        {/* Helipad Area (Right side) */}
        <Helipad position={[-8, 0, 0]} />
        {!isFlying && (
          <Helicopter position={[-8, 0, 0]} rotation={[0, Math.PI / 4, 0]} />
        )}

        {/* BBQ Party Area (Left side) */}
        <BBQGrill position={[12, 0, -6]} />
        <PicnicTable position={[6, 0, -6]} />
        <PicnicTable position={[6, 0, 6]} />

        {/* Decorative Plants/Trees in corners */}
        <group position={[16, 0, -12]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#27ae60" />
          </mesh>
        </group>
        <group position={[16, 0, 12]}>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          <mesh position={[0, 2, 0]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="#27ae60" />
          </mesh>
        </group>
      </group>
    </group>
  );
}
