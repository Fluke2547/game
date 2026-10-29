import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { NPCs, COLLISION_BOXES } from "../../data/gameData";
import { useGameStore } from "../../store/gameStore";

const INTERACT_DISTANCE = 2.5;
const NPC_RADIUS = 0.4;

/**
 * Check if position (px, pz) collides with any COLLISION_BOX
 * @param cx, cz - current position of NPC (to allow walking OUT of boxes)
 */
function npcCollides(px, pz, cx, cz) {
  for (const box of COLLISION_BOXES) {
    // ถ้ายืนอยู่ข้างในกล่องชนนี้อยู่แล้ว (เช่น ตอนวาร์ปไปนั่งโซฟา) ให้เดินทะลุออกมาได้
    const alreadyInside =
      cx !== undefined &&
      cz !== undefined &&
      cx + NPC_RADIUS > box.x - box.w / 2 &&
      cx - NPC_RADIUS < box.x + box.w / 2 &&
      cz + NPC_RADIUS > box.z - box.d / 2 &&
      cz - NPC_RADIUS < box.z + box.d / 2;
    if (alreadyInside) continue;

    if (
      px + NPC_RADIUS > box.x - box.w / 2 &&
      px - NPC_RADIUS < box.x + box.w / 2 &&
      pz + NPC_RADIUS > box.z - box.d / 2 &&
      pz - NPC_RADIUS < box.z + box.d / 2
    ) {
      return true;
    }
  }
  return false;
}

/**
 * VoxelCharacter - Minecraft-style NPC body
 */
export function VoxelCharacter({ color, name, forwardedRef, pose = "stand" }) {
  const localRef = useRef();
  const bodyRef = forwardedRef || localRef;
  const timeOffset = useRef(Math.random() * Math.PI * 2);

  const leftLeg = useRef();
  const rightLeg = useRef();
  const leftArm = useRef();
  const rightArm = useRef();
  const barbellRef = useRef();

  useFrame((state) => {
    if (!bodyRef.current) return;

    const t = state.clock.elapsedTime * 8 + timeOffset.current;
    const isSitting = pose === "sit" || pose === "work" || pose === "write";
    const sitY = isSitting ? -0.4 : 0;

    // Reset body rotation for standard poses
    if (pose !== "yoga") {
      bodyRef.current.rotation.x = 0;
    }

    if (pose === "yoga") {
      const runTime = state.clock.elapsedTime * 4 + timeOffset.current;
      const sitUp = (Math.sin(runTime) + 1) / 2; // ค่าจาก 0 ถึง 1
      const bendAngle = sitUp * (Math.PI / 2.2); // โค้งตัวขึ้น 0 ถึง 80 องศา

      bodyRef.current.position.y = 0.5 + sitUp * 0.15;
      bodyRef.current.rotation.x = -Math.PI / 2 + bendAngle;

      // หมุนขากลับทิศทางเพื่อให้ราบไปกับพื้นเสมอ
      if (leftLeg.current) leftLeg.current.rotation.x = -bendAngle;
      if (rightLeg.current) rightLeg.current.rotation.x = -bendAngle;

      // ยกแขนไว้ตรงอกหรือหลังหัว
      if (leftArm.current) leftArm.current.rotation.x = Math.PI / 1.5;
      if (rightArm.current) rightArm.current.rotation.x = Math.PI / 1.5;
    } else if (pose === "bench") {
      if (leftLeg.current) leftLeg.current.rotation.x = 0;
      if (rightLeg.current) rightLeg.current.rotation.x = 0;

      const runTime = state.clock.elapsedTime * 4 + timeOffset.current * 2;
      const sw = (Math.sin(runTime) + 1) / 2; // 0 to 1
      const armRot = -Math.PI / 4 - (sw * Math.PI) / 4;

      if (leftArm.current) leftArm.current.rotation.x = armRot;
      if (rightArm.current) rightArm.current.rotation.x = armRot;
      bodyRef.current.position.y = 0.65;
      bodyRef.current.position.z = -0.3;
      bodyRef.current.rotation.x = -Math.PI / 2;

      if (barbellRef.current) {
        barbellRef.current.visible = true;
        barbellRef.current.position.y = 0.8 + sw * 0.6;
        barbellRef.current.position.z = -0.3;
      }
    } else if (pose === "bike") {
      const runTime = state.clock.elapsedTime * 10 + timeOffset.current * 2;
      const sw = (Math.sin(runTime) * Math.PI) / 6;
      if (leftLeg.current) leftLeg.current.rotation.x = -Math.PI / 4 + sw;
      if (rightLeg.current) rightLeg.current.rotation.x = -Math.PI / 4 - sw;
      if (leftArm.current) leftArm.current.rotation.x = -Math.PI / 4;
      if (rightArm.current) rightArm.current.rotation.x = -Math.PI / 4;
      bodyRef.current.position.y = 1.3;
      bodyRef.current.rotation.x = 0.2;
    } else if (pose === "run") {
      const runTime = state.clock.elapsedTime * 15 + timeOffset.current * 2;
      const sw = Math.sin(runTime) * 0.6;
      bodyRef.current.position.y = 1.1 + Math.abs(Math.sin(runTime)) * 0.08;
      if (leftLeg.current) leftLeg.current.rotation.x = sw;
      if (rightLeg.current) rightLeg.current.rotation.x = -sw;
      if (leftArm.current) leftArm.current.rotation.x = -sw;
      if (rightArm.current) rightArm.current.rotation.x = sw;
    } else if (pose === "lift") {
      const runTime = state.clock.elapsedTime * 4 + timeOffset.current;
      const sw = (Math.sin(runTime) + 1) / 2;
      const armRot = -Math.PI / 1.2 + sw * (Math.PI / 1.5);

      if (leftLeg.current) leftLeg.current.rotation.x = 0;
      if (rightLeg.current) rightLeg.current.rotation.x = 0;
      if (leftArm.current) leftArm.current.rotation.x = armRot;
      if (rightArm.current) rightArm.current.rotation.x = armRot;

      bodyRef.current.position.y = 1.1;
      bodyRef.current.rotation.x = 0;
      bodyRef.current.rotation.y = 0;
    } else if (pose === "pullup") {
      const runTime = state.clock.elapsedTime * 4 + timeOffset.current;
      const sw = (Math.sin(runTime) + 1) / 2;

      if (leftLeg.current) leftLeg.current.rotation.x = -0.2;
      if (rightLeg.current) rightLeg.current.rotation.x = -0.2;
      if (leftArm.current) leftArm.current.rotation.x = Math.PI;
      if (rightArm.current) rightArm.current.rotation.x = Math.PI;

      bodyRef.current.position.y = 2.05 + sw * 0.6;
      bodyRef.current.rotation.x = 0;
      bodyRef.current.rotation.y = 0;
    } else if (pose === "punch") {
      const runTime = state.clock.elapsedTime * 8 + timeOffset.current;
      const leftPunch = Math.sin(runTime);
      const rightPunch = Math.sin(runTime + Math.PI);

      if (leftLeg.current) leftLeg.current.rotation.x = -0.1;
      if (rightLeg.current) rightLeg.current.rotation.x = 0.1;
      if (leftArm.current)
        leftArm.current.rotation.x = -Math.PI / 3 + leftPunch * 0.5;
      if (rightArm.current)
        rightArm.current.rotation.x = -Math.PI / 3 + rightPunch * 0.5;

      bodyRef.current.position.y = 1.1;
      bodyRef.current.rotation.x = 0;
      bodyRef.current.rotation.y = Math.sin(runTime) * 0.2;
    } else if (pose === "walk") {
      // Walking animation
      bodyRef.current.position.y = 1.1 + Math.abs(Math.sin(t)) * 0.08 + sitY;
      if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(t) * 0.5;
      if (rightLeg.current) rightLeg.current.rotation.x = -Math.sin(t) * 0.5;
      if (leftArm.current) leftArm.current.rotation.x = -Math.sin(t) * 0.5;
      if (rightArm.current) rightArm.current.rotation.x = Math.sin(t) * 0.5;
    } else {
      // Idle animation
      bodyRef.current.position.y =
        1.1 +
        Math.sin(state.clock.elapsedTime * 2 + timeOffset.current) * 0.04 +
        sitY;
      bodyRef.current.position.z = 0; // reset Z if previously benching
      if (barbellRef.current) barbellRef.current.visible = false;

      if (!isSitting) {
        if (leftLeg.current) leftLeg.current.rotation.x = 0;
        if (rightLeg.current) rightLeg.current.rotation.x = 0;
      } else {
        if (leftLeg.current) leftLeg.current.rotation.x = -Math.PI / 2;
        if (rightLeg.current) rightLeg.current.rotation.x = -Math.PI / 2;
      }

      if (pose === "work") {
        // Typing animation
        if (leftArm.current)
          leftArm.current.rotation.x = -Math.PI / 3 + Math.sin(t * 2) * 0.1;
        if (rightArm.current)
          rightArm.current.rotation.x = -Math.PI / 3 + Math.cos(t * 2.2) * 0.1;
      } else if (pose === "write") {
        // Writing (left hand resting, right hand scribbling)
        if (leftArm.current) leftArm.current.rotation.x = -Math.PI / 3;
        if (rightArm.current)
          rightArm.current.rotation.x = -Math.PI / 3.2 + Math.sin(t * 3) * 0.08;
      } else {
        if (leftArm.current) leftArm.current.rotation.x = 0;
        if (rightArm.current) rightArm.current.rotation.x = 0;
      }
    }
  });

  const SKIN_COLOR = "#FFD1B3"; // Peach/Skin tone
  const HAIR_COLOR = "#2D3436"; // Dark hair for NPCs
  const PANTS_COLOR = "#2D3436"; // Dark gray/black pants
  const SHOE_COLOR = "#111111"; // Black shoes

  return (
    <group>
      <group ref={bodyRef} position={[0, 1.1, 0]}>
        {/* Head Base (Skin) */}
        <mesh position={[0, 0.65, 0]} castShadow>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshLambertMaterial color={SKIN_COLOR} />
        </mesh>

        {/* Hair Top */}
        <mesh position={[0, 0.9, 0]} castShadow>
          <boxGeometry args={[0.47, 0.08, 0.47]} />
          <meshLambertMaterial color={HAIR_COLOR} />
        </mesh>

        {/* Hair Back */}
        <mesh position={[0, 0.68, -0.2]} castShadow>
          <boxGeometry args={[0.47, 0.38, 0.1]} />
          <meshLambertMaterial color={HAIR_COLOR} />
        </mesh>

        {/* Eyes */}
        <mesh position={[-0.1, 0.7, 0.23]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshLambertMaterial color="#111" />
        </mesh>
        <mesh position={[0.1, 0.7, 0.23]}>
          <boxGeometry args={[0.06, 0.06, 0.02]} />
          <meshLambertMaterial color="#111" />
        </mesh>

        {/* Smile (U-shape) */}
        <group position={[0, 0.58, 0.23]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.1, 0.02, 0.02]} />
            <meshLambertMaterial color="#111" />
          </mesh>{" "}
          {/* Bottom lip */}
          <mesh position={[-0.04, 0.02, 0]}>
            <boxGeometry args={[0.02, 0.03, 0.02]} />
            <meshLambertMaterial color="#111" />
          </mesh>{" "}
          {/* Left corner */}
          <mesh position={[0.04, 0.02, 0]}>
            <boxGeometry args={[0.02, 0.03, 0.02]} />
            <meshLambertMaterial color="#111" />
          </mesh>{" "}
          {/* Right corner */}
        </group>

        {/* Body (Shirt from NPC color) */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.55, 0.6, 0.35]} />
          <meshLambertMaterial color={color} />
        </mesh>

        {/* Left Arm Group */}
        <group position={[-0.4, 0.25, 0]} ref={leftArm}>
          <mesh position={[0, -0.05, 0]} castShadow>
            <boxGeometry args={[0.22, 0.2, 0.27]} />
            <meshLambertMaterial color={color} />
          </mesh>
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.18, 0.3, 0.22]} />
            <meshLambertMaterial color={SKIN_COLOR} />
          </mesh>
        </group>

        {/* Right Arm Group */}
        <group position={[0.4, 0.25, 0]} ref={rightArm}>
          <mesh position={[0, -0.05, 0]} castShadow>
            <boxGeometry args={[0.22, 0.2, 0.27]} />
            <meshLambertMaterial color={color} />
          </mesh>
          <mesh position={[0, -0.25, 0]} castShadow>
            <boxGeometry args={[0.18, 0.3, 0.22]} />
            <meshLambertMaterial color={SKIN_COLOR} />
          </mesh>
        </group>

        {/* Left Leg Group */}
        <group
          position={[-0.15, -0.15, 0]}
          ref={leftLeg}
          rotation={[
            pose === "sit" || pose === "work" || pose === "write"
              ? -Math.PI / 2
              : 0,
            0,
            0,
          ]}
        >
          {/* Pants */}
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.23, 0.8, 0.26]} />
            <meshLambertMaterial color={PANTS_COLOR} />
          </mesh>
          {/* Shoe */}
          <mesh position={[0, -0.875, 0.02]} castShadow>
            <boxGeometry args={[0.24, 0.15, 0.3]} />
            <meshLambertMaterial color={SHOE_COLOR} />
          </mesh>
        </group>

        {/* Right Leg Group */}
        <group
          position={[0.15, -0.15, 0]}
          ref={rightLeg}
          rotation={[
            pose === "sit" || pose === "work" || pose === "write"
              ? -Math.PI / 2
              : 0,
            0,
            0,
          ]}
        >
          <mesh position={[0, -0.4, 0]} castShadow>
            <boxGeometry args={[0.23, 0.8, 0.26]} />
            <meshLambertMaterial color={PANTS_COLOR} />
          </mesh>
          <mesh position={[0, -0.875, 0.02]} castShadow>
            <boxGeometry args={[0.24, 0.15, 0.3]} />
            <meshLambertMaterial color={SHOE_COLOR} />
          </mesh>
        </group>
      </group>

      {/* Interactive Objects (Only visible during specific poses) */}
      {pose === "lift" && (
        <group position={[0, 0.7, -0.6]}>
          <mesh
            position={[-0.4, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.08, 0.3]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh
            position={[0.4, 0, 0]}
            rotation={[0, 0, Math.PI / 2]}
            castShadow
          >
            <cylinderGeometry args={[0.08, 0.08, 0.3]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      )}
      {/* Barbell - always present, shown/hidden via useFrame */}
      <group ref={barbellRef} visible={false} position={[0, 1.2, -0.6]}>
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

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <circleGeometry args={[0.4, 16]} />
        <meshBasicMaterial color="#000" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

/**
 * NPCCharacters - Manages all NPCs, proximity detection
 */
// Office floor boundaries (half-widths from OFFICE_CONFIG 40x30)
const FLOOR_MIN_X = -19;
const FLOOR_MAX_X = 19;
const FLOOR_MIN_Z = -14;
const FLOOR_MAX_Z = 14;

function clampToFloor(x, z) {
  return [
    Math.max(FLOOR_MIN_X, Math.min(FLOOR_MAX_X, x)),
    Math.max(FLOOR_MIN_Z, Math.min(FLOOR_MAX_Z, z)),
  ];
}

// A list of all available Points of Interest (POIs) for autonomous NPCs
const POIs = [
  // 12 Work Desks
  { name: "Work Desk 1", x: -16, z: -9.6, r: 0, pose: "work" },
  { name: "Work Desk 2", x: -16, z: -6.4, r: Math.PI, pose: "work" },
  { name: "Work Desk 3", x: -16, z: -1.6, r: 0, pose: "work" },
  { name: "Work Desk 4", x: -16, z: 1.6, r: Math.PI, pose: "work" },
  { name: "Work Desk 5", x: -16, z: 6.4, r: 0, pose: "work" },
  { name: "Work Desk 6", x: -16, z: 9.6, r: Math.PI, pose: "work" },
  { name: "Work Desk 7", x: -8, z: -9.6, r: 0, pose: "work" },
  { name: "Work Desk 8", x: -8, z: -6.4, r: Math.PI, pose: "work" },
  { name: "Work Desk 9", x: -8, z: -1.6, r: 0, pose: "work" },
  { name: "Work Desk 10", x: -8, z: 1.6, r: Math.PI, pose: "work" },
  { name: "Work Desk 11", x: -8, z: 6.4, r: 0, pose: "work" },
  { name: "Work Desk 12", x: -8, z: 9.6, r: Math.PI, pose: "work" },

  // Meeting Room
  { name: "Meeting Chair 1", x: 2.0, z: -11.1, r: 0, pose: "sit" },
  { name: "Meeting Chair 2", x: 0.8, z: -8.9, r: Math.PI, pose: "write" },
  { name: "Meeting Chair 3", x: 3.2, z: -8.9, r: Math.PI, pose: "write" },
  { name: "Meeting Chair 4", x: 0.8, z: -11.1, r: 0, pose: "write" },
  { name: "Meeting Chair 5", x: 3.2, z: -11.1, r: 0, pose: "write" },

  // Lounge / Pantry / Reception
  { name: "Coffee Station", x: 15.5, z: -10.5, r: Math.PI, pose: "stand" },
  { name: "Lounge Sofa 1", x: 14, z: 0, r: 0, pose: "sit" },
  { name: "Lounge Sofa 2", x: 10, z: 2, r: 0, pose: "sit" },
  { name: "Lounge Seat", x: 11.8, z: 1.5, r: Math.PI / 2, pose: "sit" },
  { name: "Pantry Stool", x: 15, z: -7.8, r: Math.PI, pose: "sit" },
  { name: "Reception", x: 14.5, z: 10, r: 0, pose: "work" },
  // Fitness 2nd Floor (y = 6)
  {
    name: "Fitness Treadmill 1",
    x: -12,
    z: -10,
    r: Math.PI / 2,
    pose: "run",
    floorY: 6,
  },
  {
    name: "Fitness Treadmill 2",
    x: -8,
    z: -10,
    r: Math.PI / 2,
    pose: "run",
    floorY: 6,
  },
  {
    name: "Fitness Treadmill 3",
    x: -4,
    z: -10,
    r: Math.PI / 2,
    pose: "run",
    floorY: 6,
  },
  {
    name: "Fitness Treadmill 4",
    x: 0,
    z: -10,
    r: Math.PI / 2,
    pose: "run",
    floorY: 6,
  },
  {
    name: "Fitness Treadmill 5",
    x: 4,
    z: -10,
    r: Math.PI / 2,
    pose: "run",
    floorY: 6,
  },
  {
    name: "Fitness Yoga 1",
    x: -6,
    z: -2,
    r: Math.PI / 6,
    pose: "yoga",
    floorY: 6,
  },
  {
    name: "Fitness Yoga 2",
    x: -2,
    z: -1,
    r: -Math.PI / 8,
    pose: "yoga",
    floorY: 6,
  },
  { name: "Fitness Yoga 3", x: -4, z: 3, r: 0, pose: "yoga", floorY: 6 },
  {
    name: "Fitness Bench 1",
    x: 10,
    z: -2,
    r: Math.PI / 2,
    pose: "bench",
    floorY: 6,
  },
  {
    name: "Fitness Bench 2",
    x: 10,
    z: 3,
    r: Math.PI / 2,
    pose: "bench",
    floorY: 6,
  },
  { name: "Fitness Lift", x: -8, z: 11.5, r: Math.PI, pose: "lift", floorY: 6 },
  {
    name: "Fitness Pullup",
    x: 15,
    z: -4,
    r: -Math.PI / 2,
    pose: "pullup",
    floorY: 6,
  },
  {
    name: "Fitness Punch",
    x: 15,
    z: -10.2,
    r: Math.PI,
    pose: "punch",
    floorY: 6,
  },
  { name: "Fitness Bike 1", x: 4, z: 9.6, r: 0, pose: "bike", floorY: 6 },
  { name: "Fitness Bike 2", x: 0, z: 9.6, r: 0, pose: "bike", floorY: 6 },
  { name: "Fitness Bike 3", x: -4, z: 9.6, r: 0, pose: "bike", floorY: 6 },
  { name: "Rooftop Picnic 1", x: 6, z: -7, r: 0, pose: "sit", floorY: 12 },
  {
    name: "Rooftop Picnic 2",
    x: 6,
    z: -5,
    r: Math.PI,
    pose: "sit",
    floorY: 12,
  },
  {
    name: "Rooftop BBQ Grill",
    x: 12,
    z: -6,
    r: -Math.PI / 2,
    pose: "stand",
    floorY: 12,
  },
  {
    name: "Helicopter Viewing",
    x: -5,
    z: 0,
    r: -Math.PI / 2,
    pose: "stand",
    floorY: 12,
  },
];

import { useState } from "react";

function NPCController({ npc }) {
  const groupRef = useRef();

  // State machine for autonomous behavior
  const [currentPose, setCurrentPose] = useState(npc.pose);
  const targetRef = useRef({
    x: npc.position[0],
    z: npc.position[2],
    r: npc.rotation,
    pose: npc.pose,
    floorY: 0,
  });
  const isWalkingRef = useRef(false);
  const waitTimerRef = useRef(Math.random() * 5 + 2); // Initial wait 2-7 seconds
  const walkTimerRef = useRef(0); // จับเวลาว่าเดินนานแค่ไหนแล้ว
  const slideTimerRef = useRef(0); // จับเวลาว่าเดินติดกำแพงนานแค่ไหนแล้ว
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Manage Y level
    // groupRef.current.position.y is managed carefully now, no automatic teleportation unless taking elevator

    if (!isWalkingRef.current) {
      waitTimerRef.current -= delta;
      if (waitTimerRef.current <= 0) {
        // Decide next action: 100% chance to go to a POI (so they fill up desks)
        if (Math.random() < 1.0) {
          const availablePOIs = POIs.filter((poi) => {
            return !NPCs.some((n) => {
              if (n.id === npc.id) return false;
              const tx = n.target ? n.target.x : n.position[0];
              const tz = n.target ? n.target.z : n.position[2];
              return Math.abs(tx - poi.x) < 0.5 && Math.abs(tz - poi.z) < 0.5;
            });
          });

          if (availablePOIs.length > 0) {
            const poi =
              availablePOIs[Math.floor(Math.random() * availablePOIs.length)];
            const currentFloorY = groupRef.current.position.y;
            const targetFloorY = poi.floorY || 0;

            if (currentFloorY !== targetFloorY) {
              // Need to use elevator first
              targetRef.current = {
                x: -16 + (Math.random() - 0.5) * 2,
                z: 12 + (Math.random() - 0.5) * 2,
                r: null,
                pose: "stand",
                floorY: currentFloorY,
                finalTarget: {
                  x: poi.x,
                  z: poi.z,
                  r: poi.r,
                  pose: poi.pose,
                  floorY: targetFloorY,
                },
              };
            } else {
              targetRef.current = {
                x: poi.x,
                z: poi.z,
                r: poi.r,
                pose: poi.pose,
                floorY: targetFloorY,
              };
            }
            npc.target = { x: poi.x, z: poi.z };
          } else {
            // No POIs available, force wander
            let rx,
              rz,
              attempts = 0;
            do {
              rx = (Math.random() - 0.5) * 35;
              rz = (Math.random() - 0.5) * 25;
              attempts++;
            } while (
              npcCollides(rx, rz, undefined, undefined) &&
              attempts < 10
            );

            targetRef.current = {
              x: rx,
              z: rz,
              r: null,
              pose: "stand",
              floorY: groupRef.current.position.y,
            };
            waitTimerRef.current = 5 + Math.random() * 10;
            npc.target = { x: rx, z: rz };
          }
        } else {
          // Wander around floor randomly
          let rx,
            rz,
            attempts = 0;
          do {
            rx = (Math.random() - 0.5) * 35;
            rz = (Math.random() - 0.5) * 25;
            attempts++;
          } while (npcCollides(rx, rz, undefined, undefined) && attempts < 10);

          targetRef.current = {
            x: rx,
            z: rz,
            r: null,
            pose: "stand",
            floorY: groupRef.current.position.y,
          };
          waitTimerRef.current = 5 + Math.random() * 10;
          npc.target = { x: rx, z: rz };
        }
        isWalkingRef.current = true;
        walkTimerRef.current = 0; // Reset walk timer
        setCurrentPose("walk");
      }
    } else {
      // Walking State
      walkTimerRef.current += delta;

      // ถ้าระยะเวลาเดินเกิน 12 วินาที ถือว่าติดบัคชนกำแพงหรือโต๊ะ ให้ยกเลิกการเดินทันที
      if (walkTimerRef.current > 12) {
        isWalkingRef.current = false;
        waitTimerRef.current = 2 + Math.random() * 3;
        setCurrentPose("stand");
        npc.target = null;
        return;
      }

      const speed = 2.0;
      const current = groupRef.current.position;
      const dx = targetRef.current.x - current.x;
      const dz = targetRef.current.z - current.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist < 0.2) {
        if (targetRef.current.finalTarget) {
          // Arrived at elevator, instantly switch floors
          const ft = targetRef.current.finalTarget;
          groupRef.current.position.y = ft.floorY;
          npc.position[1] = ft.floorY;
          targetRef.current = ft;
          // Keep walking (do not set isWalkingRef to false)
        } else {
          // Arrived at final target
          isWalkingRef.current = false;
          waitTimerRef.current = 300 + Math.random() * 300; // Stay for 5-10 minutes
          setCurrentPose(targetRef.current.pose);

          // Snap to exact position and rotation for POIs
          current.x = targetRef.current.x;
          current.z = targetRef.current.z;
          if (targetRef.current.r !== null) {
            groupRef.current.rotation.y = targetRef.current.r;
          }
        }
      } else {
        // Move towards target
        const vx = (dx / dist) * speed * delta;
        const vz = (dz / dist) * speed * delta;

        const [nxRaw, nzRaw] = clampToFloor(current.x + vx, current.z + vz);
        let nx = nxRaw;
        let nz = nzRaw;

        // Check collision (only if on floor 1, skip check if on floor 2 to avoid complexities)
        if ((targetRef.current.floorY || 0) === 0) {
          if (npcCollides(nx, nz, current.x, current.z)) {
            // Try sliding Z only
            if (!npcCollides(current.x, nz, current.x, current.z)) {
              nx = current.x;
            } else if (!npcCollides(nx, current.z, current.x, current.z)) {
              nz = current.z;
            } else {
              // Completely blocked
              nx = current.x;
              nz = current.z;
            }
          }
        }

        // จับเวลาถ้าเกิดการชน (ไม่ว่าจะบล็อกเต็มๆ หรือว่าแค่ไถลขอบกำแพง)
        if (nx === current.x || nz === current.z) {
          slideTimerRef.current += delta;
        } else {
          slideTimerRef.current = 0;
        }

        if ((nx === current.x || nz === current.z) && dist <= 2.5) {
          // วิ่งมาชนกล่อง POI และอยู่ใกล้พอดี -> ให้นั่ง/ทำงานเลย
          isWalkingRef.current = false;
          waitTimerRef.current = 300 + Math.random() * 300; // Stay for 5-10 minutes!
          setCurrentPose(targetRef.current.pose);

          // Snap to exact position and rotation for POIs
          current.x = targetRef.current.x;
          current.z = targetRef.current.z;
          if (targetRef.current.r !== null) {
            groupRef.current.rotation.y = targetRef.current.r;
          }
        } else if (slideTimerRef.current > 1.0 && dist > 2.5) {
          // ถ้าไถลกำแพงอยู่นานเกิน 1 วินาที และยังไม่ถึงที่หมาย ให้ยกเลิกการเดินทันที (จะได้ไม่ดูเหมือนคนโง่เดินชนกำแพง)
          isWalkingRef.current = false;
          waitTimerRef.current = 5 + Math.random() * 5; // ยืนงงๆ พักเหนื่อย 5-10 วินาที
          setCurrentPose("stand");
          npc.target = null;
          slideTimerRef.current = 0;
        } else {
          current.x = nx;
          current.z = nz;
        }

        // Update global position for Player interaction distance checking
        npc.position[0] = current.x;
        npc.position[1] = targetRef.current.floorY || 0;
        npc.position[2] = current.z;

        // Smooth rotation
        const targetAngle = Math.atan2(dx, dz);
        let angleDiff = targetAngle - groupRef.current.rotation.y;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        groupRef.current.rotation.y += angleDiff * 8 * delta;
      }
    }

    // Dynamic visibility check (without triggering full React re-renders)
    const playerFloor = useGameStore.getState().currentFloor;
    const floorY = targetRef.current.floorY || 0;
    let npcFloor = 1;
    if (floorY >= 9) npcFloor = 3;
    else if (floorY >= 3) npcFloor = 2;

    // Player can see NPCs on their current floor and below
    groupRef.current.visible = npcFloor <= playerFloor;
  });

  return (
    <group
      ref={groupRef}
      position={[npc.position[0], npc.position[1] || 0, npc.position[2]]}
      rotation={[0, npc.rotation, 0]}
    >
      <VoxelCharacter color={npc.color} name={npc.name} pose={currentPose} />
    </group>
  );
}

export default function NPCCharacters({ playerRef }) {
  const { setNearby, gameState } = useGameStore();
  const lastNearby = useRef(null);

  useFrame(() => {
    if (!playerRef.current?.position || gameState !== "playing") return;
    const pp = playerRef.current.position;

    let closest = null;
    let closestDist = INTERACT_DISTANCE;

    for (const npc of NPCs) {
      const dx = pp.x - npc.position[0];
      const dy = pp.y - (npc.position[1] || 0);
      const dz = pp.z - npc.position[2];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (dist < closestDist) {
        closestDist = dist;
        closest = npc;
      }
    }

    if (closest?.id !== lastNearby.current?.id) {
      lastNearby.current = closest;
      setNearby(closest);
    }
  });

  return (
    <group>
      {NPCs.map((npc) => (
        <NPCController key={npc.id} npc={npc} />
      ))}
    </group>
  );
}
