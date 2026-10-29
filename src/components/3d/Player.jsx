import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { OFFICE_CONFIG, COLLISION_BOXES, NPCs } from '../../data/gameData';
import { useGameStore } from '../../store/gameStore';
import { Helicopter } from './office/RooftopZone';
import VoxelPlayerModel from './VoxelPlayerModel';

const ROTATION_SPEED = 10;
const BOUNDARY_MARGIN = 1;

const SITTABLE_SPOTS = [
  // Workspace Desks (Left Side) - 12 desks
  { x: -16, z: -9.6, r: 0, type: 'work' },
  { x: -16, z: -6.4, r: Math.PI, type: 'work' },
  { x: -16, z: -1.6, r: 0, type: 'work' },
  { x: -16, z: 1.6, r: Math.PI, type: 'work' },
  { x: -16, z: 6.4, r: 0, type: 'work' },
  { x: -16, z: 9.6, r: Math.PI, type: 'work' },
  { x: -8, z: -9.6, r: 0, type: 'work' },
  { x: -8, z: -6.4, r: Math.PI, type: 'work' },
  { x: -8, z: -1.6, r: 0, type: 'work' },
  { x: -8, z: 1.6, r: Math.PI, type: 'work' },
  { x: -8, z: 6.4, r: 0, type: 'work' },
  { x: -8, z: 9.6, r: Math.PI, type: 'work' },

  // Meeting Room
  { x: 0.8, z: -8.9, r: Math.PI, type: 'write' },
  { x: 2.0, z: -8.9, r: Math.PI, type: 'write' },
  { x: 3.2, z: -8.9, r: Math.PI, type: 'write' },
  { x: 0.8, z: -11.1, r: 0, type: 'write' },
  { x: 2.0, z: -11.1, r: 0, type: 'write' },
  { x: 3.2, z: -11.1, r: 0, type: 'write' },

  // Reception
  { x: 14.5, z: 10, r: 0, type: 'work' }, // Receptionist
  { x: 11, z: 12, r: -Math.PI / 2, type: 'sit' }, // Waiting chair 1
  { x: 11, z: 13, r: -Math.PI / 2, type: 'sit' }, // Waiting chair 2

  // Lounge Sofas
  { x: 14, z: 0, r: 0, type: 'sit' },
  { x: 11.8, z: 1.5, r: Math.PI / 2, type: 'sit' },

  // Pantry Stools
  { x: 15, z: -10.2, r: 0, type: 'sit' },
  { x: 17, z: -10.2, r: 0, type: 'sit' },
  { x: 15, z: -7.8, r: Math.PI, type: 'sit' },
  { x: 17, z: -7.8, r: Math.PI, type: 'sit' },

  // Treadmills (Floor 2, Y=6)
  { x: -12, y: 6, z: -10, r: Math.PI / 2, type: 'run' },
  { x: -8, y: 6, z: -10, r: Math.PI / 2, type: 'run' },
  { x: -4, y: 6, z: -10, r: Math.PI / 2, type: 'run' },
  { x: 0, y: 6, z: -10, r: Math.PI / 2, type: 'run' },
  { x: 4, y: 6, z: -10, r: Math.PI / 2, type: 'run' },

  // Yoga Mats (Floor 2, Y=6)
  { x: -6, y: 6, z: -2, r: Math.PI / 6, type: 'yoga' },
  { x: -2, y: 6, z: -1, r: -Math.PI / 8, type: 'yoga' },
  { x: -4, y: 6, z: 3, r: 0, type: 'yoga' },
  { x: -8, y: 6, z: 2, r: -Math.PI / 4, type: 'yoga' },
  { x: 0, y: 6, z: 2, r: Math.PI / 4, type: 'yoga' },

  // Bench Presses (Floor 2, Y=6)
  { x: 10, y: 6, z: -2, r: Math.PI / 2, type: 'bench' },
  { x: 10, y: 6, z: 3, r: Math.PI / 2, type: 'bench' },
  { x: -9.2, y: 6, z: 11.5, r: Math.PI, type: 'lift_large' }, // Dumbbell Rack (Large)
  { x: -6.8, y: 6, z: 11.5, r: Math.PI, type: 'lift_small' }, // Dumbbell Rack (Small)
  { x: 15, y: 6, z: -4, r: -Math.PI / 2, type: 'pullup' }, // MultiGym Pullup
  { x: 15, y: 6, z: -10.2, r: Math.PI, type: 'punch' }, // Punching Bag

  // Rooftop (Floor 3, Y=12)
  { x: 6, y: 12, z: -7, r: 0, type: 'sit' }, // Picnic bench 1 (facing table)
  { x: 6, y: 12, z: -5, r: Math.PI, type: 'sit' }, // Picnic bench 2 (facing table)
  { x: 12, y: 12, z: -6, r: -Math.PI / 2, type: 'stand' }, // BBQ Grill
  { x: -8, y: 12, z: 0, r: -Math.PI / 4, type: 'helicopter' },
];

const keys = {};

function setupKeyListeners() {
  const down = (e) => { keys[e.code] = true; };
  const up = (e) => { keys[e.code] = false; };
  window.addEventListener('keydown', down);
  window.addEventListener('keyup', up);
  return () => { window.removeEventListener('keydown', down); window.removeEventListener('keyup', up); };
}

import { forwardRef, useImperativeHandle } from 'react';

export const globalPlayerState = {
  position: new THREE.Vector3(),
  isBenching: false,
  isLifting: false,
  isPunching: false
};

const Player = forwardRef(function Player(props, ref) {
  const groupRef = useRef();
  const bodyRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const targetRotation = useRef(0);
  const walkTime = useRef(0);
  const barbellRef = useRef();
  const leftDumbbellRef = useRef();
  const rightDumbbellRef = useRef();

  useImperativeHandle(ref, () => ({
    get position() { return groupRef.current?.position; },
    get group() { return groupRef.current; }
  }));

  const { camera } = useThree();

  const currentPose = useRef('stand');
  const isJumping = useRef(false);
  const velocityY = useRef(0);

  const isFlying = useGameStore(s => s.isFlying);
  const playerCust = useGameStore(s => s.playerCustomization) || {};
  
  useEffect(() => {
    const cleanup = setupKeyListeners();
    const handleAction = (e) => {
      // Allow user to sit/fly by pressing 'F'
      if (e.code === 'KeyF') {
        const isCurrentlyFlying = useGameStore.getState().isFlying;
        if (isCurrentlyFlying) {
          useGameStore.getState().setFlying(false);
          currentPose.current = 'stand';
          
          // Clamp position to rooftop to prevent getting stuck outside boundaries
          const g = groupRef.current;
          if (g) {
            const { floorSize } = OFFICE_CONFIG;
            const hW = floorSize.width / 2 - BOUNDARY_MARGIN;
            const hD = floorSize.depth / 2 - BOUNDARY_MARGIN;
            if (g.position.x < -hW) g.position.x = -hW;
            if (g.position.x > hW) g.position.x = hW;
            if (g.position.z < -hD) g.position.z = -hD;
            if (g.position.z > hD) g.position.z = hD;
          }
          return;
        }

        if (currentPose.current !== 'stand') {
          currentPose.current = 'stand';
        } else {
          const g = groupRef.current;
          if (!g) return;
          
          let closest = null;
          let minD = 2.2; // Max distance to snap
          
          for (const spot of SITTABLE_SPOTS) {
            // Check Y level
            const spotY = spot.y || 0;
            if (Math.abs(g.position.y - spotY) > 2) continue; // Only snap to spots on the same floor

            // Check if an NPC is occupying it
            const occupied = NPCs.some(npc => 
              Math.abs(npc.position[0] - spot.x) < 0.5 && 
              Math.abs(npc.position[2] - spot.z) < 0.5 &&
              Math.abs((npc.position[1] || 0) - spotY) < 2
            );
            if (occupied) continue;

            const dx = g.position.x - spot.x;
            const dz = g.position.z - spot.z;
            const dist = Math.sqrt(dx*dx + dz*dz);
            
            if (dist < minD) {
              minD = dist;
              closest = spot;
            }
          }
          
          if (closest) {
            g.position.x = closest.x;
            g.position.z = closest.z;
            g.rotation.y = closest.r;
            targetRotation.current = closest.r;
            currentPose.current = closest.type;

            if (closest.type === 'helicopter') {
               useGameStore.getState().setFlying(true);
               // นำการเปลี่ยนสภาพอากาศเป็น evening ออก เพื่อให้ใช้สภาพอากาศเดิม
            }
          }
        }
      }
    };
    window.addEventListener('keydown', handleAction);
    return () => {
      cleanup();
      window.removeEventListener('keydown', handleAction);
    };
  }, []);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    const g = groupRef.current;
    const { floorSize } = OFFICE_CONFIG;
    const hW = floorSize.width / 2 - BOUNDARY_MARGIN;
    const hD = floorSize.depth / 2 - BOUNDARY_MARGIN;

    let mx = 0, mz = 0;
    if (keys['KeyW'] || keys['ArrowUp']) mz -= 1;
    if (keys['KeyS'] || keys['ArrowDown']) mz += 1;
    if (keys['KeyA'] || keys['ArrowLeft']) mx -= 1;
    if (keys['KeyD'] || keys['ArrowRight']) mx += 1;

    // Calculate camera yaw angle
    const angle = Math.atan2(camera.position.x - g.position.x, camera.position.z - g.position.z);
    
    const rx = mx * Math.cos(angle) + mz * Math.sin(angle);
    const rz = -mx * Math.sin(angle) + mz * Math.cos(angle);
    const moving = mx !== 0 || mz !== 0;

    const isFlyingNow = useGameStore.getState().isFlying;

    if (moving) {
      if (!isFlyingNow) currentPose.current = 'stand'; // Auto stand up when moving on foot
      
      const len = Math.sqrt(rx * rx + rz * rz);
      const nx = rx / len, nz = rz / len;
      
      const moveSpeed = isFlyingNow ? 25 : 6;
      let nextX = g.position.x + nx * moveSpeed * delta;
      let nextZ = g.position.z + nz * moveSpeed * delta;
      
      const playerRadius = 0.4;
      
      // Collision check function
      const checkCollision = (px, pz) => {
        // Walls
        if (px < -hW || px > hW || pz < -hD || pz > hD) return true;
        
        // Furniture boxes
        for (const box of COLLISION_BOXES) {
          const by = box.y || 0;
          const bh = box.h || 4;
          
          // Check if player is on the same floor level as the furniture
          if (g.position.y + 2 <= by || g.position.y >= by + bh) continue;

          // If we are ALREADY inside this box (e.g. from snapping to a seat), 
          // we ignore it so the player can walk out!
          const alreadyInside = (
              g.position.x + playerRadius > box.x - box.w / 2 &&
              g.position.x - playerRadius < box.x + box.w / 2 &&
              g.position.z + playerRadius > box.z - box.d / 2 &&
              g.position.z - playerRadius < box.z + box.d / 2
          );
          if (alreadyInside) continue;

          if (px + playerRadius > box.x - box.w / 2 && 
              px - playerRadius < box.x + box.w / 2 &&
              pz + playerRadius > box.z - box.d / 2 && 
              pz - playerRadius < box.z + box.d / 2) {
            return true;
          }
        }
        
        // NPCs (simple circle collision)
        for (const npc of NPCs) {
          const npcY = npc.position[1] || 0;
          if (Math.abs(g.position.y - npcY) > 2) continue; // Not on same floor

          // If we are ALREADY intersecting this NPC, ignore collision so the player can walk out
          const currDx = g.position.x - npc.position[0];
          const currDz = g.position.z - npc.position[2];
          if (Math.sqrt(currDx * currDx + currDz * currDz) < 0.8) {
            continue;
          }

          const dx = px - npc.position[0];
          const dz = pz - npc.position[2];
          if (Math.sqrt(dx * dx + dz * dz) < 0.8) { // NPC radius + player radius
            return true;
          }
        }
        
        return false;
      };

      const checkHelicopterCollision = (px, pz, py) => {
        if (!window.CITY_BUILDINGS) return false;
        const heliRadius = 2.0; // รัศมีของ ฮ.
        for (const b of window.CITY_BUILDINGS) {
           // CityBackground มี group position [0, -45, 0] ดังนั้นต้องลบ 45 ออกจาก Y
           const bx = b.pos[0];
           const by = b.pos[1] - 45; 
           const bz = b.pos[2];
           const bw = b.size[0];
           const bh = b.size[1];
           const bd = b.size[2];

           const minX = bx - bw / 2 - heliRadius;
           const maxX = bx + bw / 2 + heliRadius;
           const minZ = bz - bd / 2 - heliRadius;
           const maxZ = bz + bd / 2 + heliRadius;
           const minY = by - bh / 2 - heliRadius;
           const maxY = by + bh / 2 + heliRadius;

           if (px > minX && px < maxX && pz > minZ && pz < maxZ && py > minY && py < maxY) {
             return true;
           }
        }
        return false;
      };

      // Try moving both axes
      if (isFlyingNow) {
        if (checkHelicopterCollision(nextX, nextZ, g.position.y)) {
          if (!checkHelicopterCollision(g.position.x, nextZ, g.position.y)) {
            nextX = g.position.x;
          } else if (!checkHelicopterCollision(nextX, g.position.z, g.position.y)) {
            nextZ = g.position.z;
          } else {
            nextX = g.position.x;
            nextZ = g.position.z;
          }
        }
      } else {
        if (checkCollision(nextX, nextZ)) {
          // Try sliding on Z axis only
          if (!checkCollision(g.position.x, nextZ)) {
            nextX = g.position.x;
          } 
          // Try sliding on X axis only
          else if (!checkCollision(nextX, g.position.z)) {
            nextZ = g.position.z;
          } 
          // Can't move in either direction
          else {
            nextX = g.position.x;
            nextZ = g.position.z;
          }
        }
      }

      g.position.x = nextX;
      g.position.z = nextZ;
      targetRotation.current = Math.atan2(nx, nz);
      
      // Elevator Teleport Logic (Front-Left Corner: X = -17 to -14, Z = 10 to 14)
      if (g.position.x > -17 && g.position.x < -14 && g.position.z > 10 && g.position.z < 14) {
        if (!keys['teleporting']) {
          keys['teleporting'] = true;
          // Cycle: 0 -> 6 -> 12 -> 0
          if (g.position.y < 3) g.position.y = 6;
          else if (g.position.y < 9) g.position.y = 12;
          else g.position.y = 0;
          
          // Slight push out so we don't immediately re-trigger
          g.position.x = -13; 
        }
      } else {
        keys['teleporting'] = false;
      }
    }

    let diff = targetRotation.current - g.rotation.y;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    g.rotation.y += diff * ROTATION_SPEED * delta;
    
    // Determine floor height based on position
    const floorY = g.position.y > 9 ? 12 : (g.position.y > 3 ? 6 : 0);
    const currentFloor = floorY === 12 ? 3 : (floorY === 6 ? 2 : 1);
    if (useGameStore.getState().currentFloor !== currentFloor) {
      useGameStore.getState().setCurrentFloor(currentFloor);
    }

    // Jumping Logic (Disable while flying)
    if (keys['Space'] && !isJumping.current && !isFlyingNow) {
      isJumping.current = true;
      currentPose.current = 'stand';
      velocityY.current = 6.5; // Jump strength
    }
    
    if (isJumping.current) {
      velocityY.current -= 20 * delta; // Gravity
      g.position.y += velocityY.current * delta;
      
      if (g.position.y <= floorY) {
        g.position.y = floorY;
        isJumping.current = false;
      }
    } else {
      const isFlyingNow = useGameStore.getState().isFlying;
      if (isFlyingNow) {
        g.position.y += (30 - g.position.y) * delta * 2; // Fly up to Y=30
      } else {
        if (g.position.y > floorY) {
           g.position.y -= 20 * delta; // Fall down
           if (g.position.y < floorY) g.position.y = floorY;
        } else {
           g.position.y = floorY;
        }
      }
    }

    if (moving && !isJumping.current && !useGameStore.getState().isFlying) {
      walkTime.current += delta * 8;
      const sw = Math.sin(walkTime.current) * 0.4;
      if (leftLegRef.current) leftLegRef.current.rotation.x = sw;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -sw;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -sw;
      if (rightArmRef.current) rightArmRef.current.rotation.x = sw;
      if (bodyRef.current) {
        bodyRef.current.position.y = 1.1 + Math.abs(Math.sin(walkTime.current)) * 0.05;
        bodyRef.current.rotation.x = 0;
      }
    } else {
      walkTime.current = 0;
      if (currentPose.current !== 'stand') {
        const t = state.clock.elapsedTime * 8;

        if (currentPose.current === 'run') {
          // Running on treadmill
          const runTime = state.clock.elapsedTime * 15;
          const sw = Math.sin(runTime) * 0.6;
          if (leftLegRef.current) leftLegRef.current.rotation.x = sw;
          if (rightLegRef.current) rightLegRef.current.rotation.x = -sw;
          if (leftArmRef.current) leftArmRef.current.rotation.x = -sw;
          if (rightArmRef.current) rightArmRef.current.rotation.x = sw;
          if (bodyRef.current) {
            bodyRef.current.position.y = 1.1 + Math.abs(Math.sin(runTime)) * 0.08;
            bodyRef.current.rotation.x = 0;
          }
        } else if (currentPose.current === 'yoga') {
          // ซิทอัพบนเสื่อโยคะ
          const runTime = state.clock.elapsedTime * 4;
          const sitUp = (Math.sin(runTime) + 1) / 2; // 0 ถึง 1
          const bendAngle = sitUp * (Math.PI / 2.2);
          
          if (leftLegRef.current) leftLegRef.current.rotation.x = -bendAngle;
          if (rightLegRef.current) rightLegRef.current.rotation.x = -bendAngle;
          if (leftArmRef.current) leftArmRef.current.rotation.x = Math.PI / 1.5;
          if (rightArmRef.current) rightArmRef.current.rotation.x = Math.PI / 1.5;
          
          if (bodyRef.current) {
            bodyRef.current.position.y = 0.5 + sitUp * 0.15;
            bodyRef.current.rotation.x = -Math.PI / 2 + bendAngle;
          }
        } else if (currentPose.current === 'bench') {
          if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
          if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
          
          const runTime = state.clock.elapsedTime * 4;
          const sw = (Math.sin(runTime) + 1) / 2; // 0 to 1
          // sw=1: Barbell is UP, Arms should point UP (-Math.PI/2)
          // sw=0: Barbell is DOWN, Arms should point DOWN (-Math.PI/4)
          const armRot = -Math.PI / 4 - (sw * Math.PI / 4); 
          
          if (leftArmRef.current) leftArmRef.current.rotation.x = armRot;
          if (rightArmRef.current) rightArmRef.current.rotation.x = armRot;
          if (bodyRef.current) {
            bodyRef.current.position.y = 0.65; // lie on bench
            bodyRef.current.position.z = -0.3; // shift back slightly to align with rack
            bodyRef.current.rotation.x = -Math.PI / 2;
          }
          if (barbellRef.current) {
             barbellRef.current.visible = true;
             barbellRef.current.position.y = 1.0 + sw * 0.4; // Barbell goes up and down
             barbellRef.current.position.z = -0.4 + sw * 0.2;
          }
        } else if (currentPose.current === 'lift_small' || currentPose.current === 'lift_large') {
          // Standing and lifting dumbbells
          const runTime = state.clock.elapsedTime * 4;
          const sw = (Math.sin(runTime) + 1) / 2; // 0 to 1
          
          if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
          if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
          
          // ยกแขนขึ้นลง
          const armRot = -Math.PI / 1.2 + sw * (Math.PI / 1.5);
          if (leftArmRef.current) leftArmRef.current.rotation.x = armRot;
          if (rightArmRef.current) rightArmRef.current.rotation.x = armRot;
          
          if (leftDumbbellRef.current) leftDumbbellRef.current.visible = true;
          if (rightDumbbellRef.current) rightDumbbellRef.current.visible = true;

          if (bodyRef.current) {
            bodyRef.current.position.y = 1.1; 
            bodyRef.current.position.z = 0;
            bodyRef.current.rotation.x = 0;
          }
        } else if (currentPose.current === 'pullup') {
          const runTime = state.clock.elapsedTime * 4;
          const sw = (Math.sin(runTime) + 1) / 2; // 0 to 1
          
          if (leftLegRef.current) leftLegRef.current.rotation.x = -0.2;
          if (rightLegRef.current) rightLegRef.current.rotation.x = -0.2;
          
          // ชูแขนขึ้นตลอด
          if (leftArmRef.current) leftArmRef.current.rotation.x = Math.PI;
          if (rightArmRef.current) rightArmRef.current.rotation.x = Math.PI;
          
          if (bodyRef.current) {
            bodyRef.current.position.y = 2.05 + sw * 0.6; // ลอยขึ้นไปจับบาร์ดึงข้อ
            bodyRef.current.position.z = 0;
            bodyRef.current.rotation.x = 0;
          }
        } else if (currentPose.current === 'punch') {
          const runTime = state.clock.elapsedTime * 8;
          // ต่อยสลับซ้ายขวา
          const leftPunch = Math.sin(runTime);
          const rightPunch = Math.sin(runTime + Math.PI);
          
          if (leftLegRef.current) leftLegRef.current.rotation.x = -0.1;
          if (rightLegRef.current) rightLegRef.current.rotation.x = 0.1;
          
          if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.PI / 3 + leftPunch * 0.5;
          if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.PI / 3 + rightPunch * 0.5;
          
          if (bodyRef.current) {
            bodyRef.current.position.y = 1.1;
            bodyRef.current.position.z = 0;
            bodyRef.current.rotation.x = 0;
            bodyRef.current.rotation.y = Math.sin(runTime) * 0.2; // เอี้ยวตัว
          }
        } else if (currentPose.current === 'bike') {
          const runTime = state.clock.elapsedTime * 10;
          const sw = Math.sin(runTime) * Math.PI / 6;
          if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI / 4 + sw;
          if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI / 4 - sw;
          // Holding handles
          if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.PI / 4;
          if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.PI / 4;
          if (bodyRef.current) {
            bodyRef.current.position.y = 1.3; // sit on bike seat
            bodyRef.current.rotation.x = 0.2; // lean forward
          }
        } else {
          // Sitting poses
          if (leftLegRef.current) leftLegRef.current.rotation.x = -Math.PI / 2;
          if (rightLegRef.current) rightLegRef.current.rotation.x = -Math.PI / 2;
          if (bodyRef.current) {
            bodyRef.current.position.y = 1.1 - 0.4; // lower body
            bodyRef.current.rotation.x = 0;
          }
          
          if (currentPose.current === 'work') {
            // Typing
            if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.PI / 3 + Math.sin(t * 2) * 0.1;
            if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.PI / 3 + Math.cos(t * 2.2) * 0.1;
          } else if (currentPose.current === 'write') {
            // Writing (left hand resting, right hand scribbling)
            if (leftArmRef.current) leftArmRef.current.rotation.x = -Math.PI / 3;
            if (rightArmRef.current) rightArmRef.current.rotation.x = -Math.PI / 3.2 + Math.sin(t * 3) * 0.08;
          } else {
            // Just sit
            if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
            if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
          }
        }
      } else {
        [leftLegRef, rightLegRef, leftArmRef, rightArmRef].forEach(r => { if (r.current) r.current.rotation.x = 0; });
        if (bodyRef.current) {
          bodyRef.current.position.y = 1.1; // stand up
          bodyRef.current.position.z = 0;
          bodyRef.current.rotation.x = 0;
        }
        if (barbellRef.current) barbellRef.current.visible = false;
        if (leftDumbbellRef.current) leftDumbbellRef.current.visible = false;
        if (rightDumbbellRef.current) rightDumbbellRef.current.visible = false;
      }
    }
    
    globalPlayerState.position.copy(g.position);
    globalPlayerState.isBenching = (currentPose.current === 'bench');
    globalPlayerState.isLifting = currentPose.current === 'lift_small' ? 'small' : currentPose.current === 'lift_large' ? 'large' : false;
    globalPlayerState.isPunching = (currentPose.current === 'punch');
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {isFlying ? (
        <group position={[0, -0.5, 0]}>
           <Helicopter position={[0,0,0]} rotation={[0,0,0]} />
        </group>
      ) : (
      <VoxelPlayerModel
        custom={playerCust}
        bodyRef={bodyRef}
        leftArmRef={leftArmRef}
        rightArmRef={rightArmRef}
        leftLegRef={leftLegRef}
        rightLegRef={rightLegRef}
        leftDumbbellRef={leftDumbbellRef}
        rightDumbbellRef={rightDumbbellRef}
      />
      )}

      {/* Active Barbell (Only visible when benching via useFrame) */}
      <group ref={barbellRef} visible={false} position={[0, 1.2, -0.6]}>
        <mesh rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.03, 0.03, 1.8]} /><meshStandardMaterial color="#ecf0f1" /></mesh>
        <mesh position={[-0.7, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
        <mesh position={[0.7, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.3, 0.3, 0.1]} /><meshStandardMaterial color="#2d3436" /></mesh>
      </group>
      
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}><circleGeometry args={[0.4, 16]} /><meshBasicMaterial color="#000" transparent opacity={0.15} /></mesh>
    </group>
  );
});

export default Player;
