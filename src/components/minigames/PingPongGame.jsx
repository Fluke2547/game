import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, Trail } from '@react-three/drei';
import * as THREE from 'three';
import { VoxelCharacter } from '../3d/NPCCharacters';

export default function PingPongGame({ active, onScore, onEndGame, npc }) {
  const ballRef = useRef();
  const playerRef = useRef();
  const npcRef = useRef();
  
  const [pScore, setPScore] = useState(0);
  const [nScore, setNScore] = useState(0);
  const [rallyCount, setRallyCount] = useState(0);
  const [gameState, setGameState] = useState('playing'); // สถานะเกม: playing (กำลังเล่น), gameOver (จบเกม)
  const [feedback, setFeedback] = useState(null); // เก็บข้อความและสี: { text, color }

  const WIN_SCORE = 10;
  const ballVel = useRef(new THREE.Vector3(0, 0, 0));
  const isSmashing = useRef(false);
  const isServing = useRef(true);
  const serveTimer = useRef(1);

  // เอฟเฟกต์ (Effects)
  const ballMatRef = useRef();
  const shakeTime = useRef(0);
  const isSmashBall = useRef(false);
  const tempColor = useRef(new THREE.Color());
  const playerPaddleMatRef = useRef();
  const npcPaddleMatRef = useRef();
  const spectatorRefs = useRef([]);
  const spectatorJumpTimer = useRef(0);

  // การจัดการพิกัดและการควบคุมด้วยเมาส์
  const mouseX = useRef(0);
  
  const showFeedback = (text, color) => {
    setFeedback({ text, color });
    setTimeout(() => setFeedback(null), 1000);
  };

  useEffect(() => {
    if (pScore >= WIN_SCORE || nScore >= WIN_SCORE) {
      setGameState('gameOver');
      setTimeout(() => { if (onEndGame) onEndGame(); }, 2000);
    }
  }, [pScore, nScore, onEndGame]);

  useEffect(() => {
    const handleMouseDown = () => { isSmashing.current = true; };
    const handleMouseUp = () => { isSmashing.current = false; };
    const handleMouseMove = (e) => {
      // แปลงพิกัดหน้าจอ X เป็น -1 ถึง 1 ให้แม่นยำ ไม่ว่า Canvas จะมีขนาดเท่าใด
      mouseX.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const resetBall = (server) => {
    isServing.current = true;
    serveTimer.current = 1.5; // หน่วงเวลาก่อนเสิร์ฟลูก
    setRallyCount(0);
    isSmashBall.current = false;
    
    if (ballRef.current) {
      if (server === 'player') {
        ballRef.current.position.set(0, 0.5, 3);
        ballVel.current.set(0, 0, -4);
      } else {
        ballRef.current.position.set(0, 0.5, -3);
        ballVel.current.set(0, 0, 4);
      }
    }
  };

  useFrame((state, delta) => {
    if (!active || gameState !== 'playing') return;
    const b = ballRef.current;
    const p = playerRef.current;
    const np = npcRef.current;

    // การติดตามเมาส์: แปลงค่า mouseX.current (-1 ถึง 1) ไปยังช่วงพิกัด X ของโต๊ะ
    // คูณ 4.0 เพื่อไม่ให้ผู้เล่นต้องลากเมาส์ไปจนสุดขอบหน้าจอ
    const mouseTargetX = mouseX.current * 4.0;
    const clampedPaddleX = THREE.MathUtils.clamp(mouseTargetX, -2.6, 2.6);

    if (p) {
      // ผู้เล่นถูกหมุนด้วย Math.PI (180 องศา) ดังนั้นไม้ที่พิกัด X=0.4 จะมีค่า X ในโลกเท่ากับ -0.4 เมื่อเทียบกับจุดกึ่งกลางของตัวละคร
      // เราต้องการให้พิกัดไม้ในโลก = clampedPaddleX ดังนั้น p.position.x - 0.4 = clampedPaddleX
      p.position.x = clampedPaddleX + 0.4;
    }

    if (isServing.current) {
      serveTimer.current -= delta;
      if (serveTimer.current <= 0) {
        isServing.current = false;
      } else {
        // ให้ลูกบอลอยู่กับไม้ของคนเสิร์ฟในระหว่างนับถอยหลัง
        if (b) {
          b.position.x = ballVel.current.z < 0 ? (p?.position.x - 0.4) || 0 : (np?.position.x + 0.4) || 0;
        }
        return; // รอเสิร์ฟลูก
      }
    }

    if (!b || !p || !np) return;

    // การเคลื่อนที่ของลูกปิงปอง
    b.position.x += ballVel.current.x * delta;
    b.position.z += ballVel.current.z * delta;

    // ความโค้งและระดับความสูงของลูกปิงปอง
    // ฟิสิกส์การกระดอนโต๊ะแบบง่าย: y = 0.5 คือความสูงเป้าหมายที่ลูกกระดอน
    b.position.y = 0.2 + Math.abs(Math.sin((b.position.z / 3.5) * Math.PI)) * 0.5;

    // การกระดอนชิ่งขอบโต๊ะด้านข้าง
    if (b.position.x > 2.6 || b.position.x < -2.6) {
      ballVel.current.x *= -1;
      b.position.x = THREE.MathUtils.clamp(b.position.x, -2.6, 2.6);
      shakeTime.current = 0.15; // หน้าจอสั่นตอนลูกชิ่งขอบ
    }

    // ตรรกะการรับลูกของผู้เล่น (เมื่อแกน z อยู่ประมาณ 3.5)
    if (b.position.z > 3.4 && ballVel.current.z > 0) {
      const playerPaddleWorldX = p.position.x - 0.4;
      if (Math.abs(b.position.x - playerPaddleWorldX) < 0.8) {
        // ตีโดนลูก!
        const hitOffset = b.position.x - playerPaddleWorldX;
        let speedMult = 1 + (rallyCount / 10); // ความเร็วเพิ่มขึ้นตามจำนวนการโต้ลูก
        let isSmash = isSmashing.current;
        
        if (Math.abs(hitOffset) < 0.2) {
          showFeedback('Perfect!', '#4CAF50');
          onScore(2);
          speedMult += 0.2;
          shakeTime.current = 0.2; // สั่นเบาๆ
          isSmashBall.current = false;
        } else if (isSmash) {
          showFeedback('SMASH!', '#FF5722');
          onScore(3);
          speedMult += 0.5;
          shakeTime.current = 0.4; // สั่นแรงสะใจ!
          isSmashBall.current = true; // เปิดโหมดลูกไฟ
        } else {
          isSmashBall.current = false;
        }

        ballVel.current.z = -5 * speedMult;
        ballVel.current.x = hitOffset * 6 + (isSmash ? hitOffset * 4 : 0); // ความโค้ง/องศาการฉีกของลูก
        setRallyCount(r => r + 1);
      }
    }

    // ตรรกะการรับลูกของ NPC (เมื่อแกน z อยู่ประมาณ -3.5)
    if (b.position.z < -3.4 && ballVel.current.z < 0) {
      const npcPaddleWorldX = np.position.x + 0.4;
      if (Math.abs(b.position.x - npcPaddleWorldX) < 0.8) {
        const hitOffset = b.position.x - npcPaddleWorldX;
        const speedMult = 1 + (rallyCount / 10);
        ballVel.current.z = 5 * speedMult;
        ballVel.current.x = hitOffset * 4 + (Math.random() - 0.5) * 2;
        
        // NPC ตบกลับเมื่อโต้กันหลายครั้ง
        if (rallyCount > 4) {
          shakeTime.current = 0.25;
          isSmashBall.current = true;
        } else {
          isSmashBall.current = false;
        }
        
        setRallyCount(r => r + 1);
      }
    }

    // การเคลื่อนไหวของ NPC (เดินตามลูกปิงปองแบบหน่วงเวลา)
    // ไม้ของ NPC อยู่ที่ np.position.x + 0.4 เราต้องการให้มันตรงกับตำแหน่งลูกปิงปอง b.position.x
    const npcTargetX = b.position.x - 0.4;
    const npcSpeed = 3 + (rallyCount * 0.5); // NPC เดินเร็วขึ้นตามจำนวนตีโต้
    np.position.x = THREE.MathUtils.lerp(np.position.x, npcTargetX, npcSpeed * delta);
    np.position.x = THREE.MathUtils.clamp(np.position.x, -3.0, 2.2);

    // การประเมินคะแนน (ตรวจสอบการพลาดลูก)
    if (b.position.z > 4.5) {
      // ผู้เล่นพลาดรับไม่ได้
      setNScore(s => s + 1);
      showFeedback('Miss!', '#E53935');
      resetBall('player');
      spectatorJumpTimer.current = 1.5; // ให้กองเชียร์กระโดดเฮ
    } else if (b.position.z < -4.5) {
      // NPC พลาดรับไม่ได้
      setPScore(s => s + 1);
      onScore(5);
      showFeedback('Score!', '#2196F3');
      resetBall('npc');
      spectatorJumpTimer.current = 1.5; // ให้กองเชียร์กระโดดเฮ
    }
    
    // จำกัดความเร็วสูงสุดของลูกปิงปองในแกน Z
    ballVel.current.z = THREE.MathUtils.clamp(ballVel.current.z, -15, 15);

    // ---------------------------------------------
    // กล้องสั่น (Camera Shake)
    // ---------------------------------------------
    if (shakeTime.current > 0) {
      shakeTime.current -= delta;
      const intensity = shakeTime.current * 0.5; // ความแรงของการสั่น
      state.camera.position.x = (Math.random() - 0.5) * intensity;
      state.camera.position.y = 8 + (Math.random() - 0.5) * intensity;
    } else {
      // ค่อยๆ คืนกล้องกลับสู่ตำแหน่งเดิม (x=0, y=8)
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, delta * 5);
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 8, delta * 5);
    }

    // ---------------------------------------------
    // แอนิเมชันลูกปิงปองเรืองแสง (Dynamic Emissive)
    // ---------------------------------------------
    if (ballMatRef.current) {
      // สี: ถ้า Smash จะเป็นสีส้มแดง, ถ้าลูกลอยไปหา NPC จะเป็นสีฟ้า, ถ้า NPC ตีกลับมาจะเป็นสีเขียว
      const targetEmissive = isSmashBall.current ? 0xFF3D00 : (ballVel.current.z > 0 ? 0x2196F3 : 0x4CAF50);
      const targetIntensity = isSmashBall.current ? 3.0 : 1.0;
      
      ballMatRef.current.emissive.lerp(tempColor.current.setHex(targetEmissive), delta * 10);
      ballMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(ballMatRef.current.emissiveIntensity, targetIntensity, delta * 10);
    }

    // ---------------------------------------------
    // เอฟเฟกต์ไม้ปิงปองติดไฟ (Combo Aura)
    // ---------------------------------------------
    const isHighRally = rallyCount >= 5;
    if (playerPaddleMatRef.current) {
      const pIntensity = isHighRally ? 2.0 : 0;
      playerPaddleMatRef.current.emissive.setHex(0xFF5722);
      playerPaddleMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(playerPaddleMatRef.current.emissiveIntensity, pIntensity, delta * 5);
    }
    if (npcPaddleMatRef.current) {
      const nIntensity = isHighRally ? 2.0 : 0;
      npcPaddleMatRef.current.emissive.setHex(0xFF5722);
      npcPaddleMatRef.current.emissiveIntensity = THREE.MathUtils.lerp(npcPaddleMatRef.current.emissiveIntensity, nIntensity, delta * 5);
    }

    // ---------------------------------------------
    // แอนิเมชันกองเชียร์กระโดด (Spectator Jump)
    // ---------------------------------------------
    if (spectatorJumpTimer.current > 0) {
      spectatorJumpTimer.current -= delta;
      // คำนวณความสูงการกระโดด (Sine wave แบบ absolute)
      const jumpY = Math.abs(Math.sin(spectatorJumpTimer.current * Math.PI * 4)) * 0.8 - 1.0; // ฐานอยู่ที่ -1.0
      spectatorRefs.current.forEach(spec => {
        if (spec) spec.position.y = jumpY;
      });
    } else {
      spectatorRefs.current.forEach(spec => {
        if (spec) spec.position.y = THREE.MathUtils.lerp(spec.position.y, -1.0, delta * 10);
      });
    }
  });

  // การตั้งค่าเริ่มต้นของเกม
  useEffect(() => {
    resetBall('player');
  }, []);

  return (
    <group>
      {/* ฐานสีขาว (เพื่อสร้างขอบโต๊ะ) */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[5.8, 0.2, 8.3]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>
      
      {/* พื้นผิวโต๊ะสีน้ำเงิน */}
      <mesh position={[0, 0.11, 0]} receiveShadow>
        <boxGeometry args={[5.5, 0.05, 8.0]} />
        <meshLambertMaterial color="#1565C0" />
      </mesh>
      
      {/* เส้นสีขาวกลางโต๊ะ (แนวยาว) */}
      <mesh position={[0, 0.14, 0]}>
        <boxGeometry args={[0.04, 0.01, 8.0]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>

      {/* ตาข่ายและเสาจับตาข่าย */}
      <mesh position={[0, 0.35, 0]}>
        {/* ตาข่ายสีดำโปร่งแสง */}
        <boxGeometry args={[6.0, 0.4, 0.02]} />
        <meshLambertMaterial color="#212121" transparent opacity={0.8} />
      </mesh>
      <mesh position={[0, 0.55, 0]}>
        {/* แถบสีขาวขอบบนตาข่าย */}
        <boxGeometry args={[6.0, 0.04, 0.04]} />
        <meshBasicMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[-2.95, 0.3, 0]}><boxGeometry args={[0.1, 0.5, 0.1]} /><meshLambertMaterial color="#424242" /></mesh>
      <mesh position={[2.95, 0.3, 0]}><boxGeometry args={[0.1, 0.5, 0.1]} /><meshLambertMaterial color="#424242" /></mesh>

      {/* โครงสร้างใต้โต๊ะ (คานสีแดง) */}
      <mesh position={[0, -0.15, -3.5]}><boxGeometry args={[4.5, 0.1, 0.1]} /><meshLambertMaterial color="#D32F2F" /></mesh>
      <mesh position={[0, -0.15, 3.5]}><boxGeometry args={[4.5, 0.1, 0.1]} /><meshLambertMaterial color="#D32F2F" /></mesh>
      <mesh position={[-2.2, -0.15, 0]}><boxGeometry args={[0.1, 0.1, 7]} /><meshLambertMaterial color="#D32F2F" /></mesh>
      <mesh position={[2.2, -0.15, 0]}><boxGeometry args={[0.1, 0.1, 7]} /><meshLambertMaterial color="#D32F2F" /></mesh>

      {/* ลูกปิงปอง พร้อมเอฟเฟกต์เส้นแสง (Trail) */}
      <Trail
        width={0.25}
        length={8}
        color={new THREE.Color('#FF5722')}
        attenuation={(t) => t * t}
      >
        <mesh ref={ballRef} position={[0, 0.2, 0]} castShadow>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial ref={ballMatRef} color="#FFF" emissive="#FFF" emissiveIntensity={1} />
        </mesh>
      </Trail>

      {/* ผู้เล่น (ถูกควบคุมด้วยเมาส์) */}
      <group ref={playerRef} position={[0, -1, 4.5]} rotation={[0, Math.PI, 0]}>
        <VoxelCharacter color="#4ECDC4" name="Player" />
        {/* มือที่ถือไม้ปิงปอง */}
        <group position={[0.4, 1.2, 0.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.3]} /><meshLambertMaterial color="#5D4037" /></mesh>
          <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05]} />
            <meshStandardMaterial ref={playerPaddleMatRef} color="#E53935" emissive="#FF0000" emissiveIntensity={0} />
          </mesh>
        </group>
      </group>

      {/* ตัวละครบอท NPC */}
      <group ref={npcRef} position={[0, -1, -4.5]} rotation={[0, 0, 0]}>
        <VoxelCharacter color={npc?.color || "#E67E22"} name={npc?.name || "Rival"} />
        {/* มือที่ถือไม้ปิงปองของ NPC */}
        <group position={[0.4, 1.2, 0.5]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.02, 0.02, 0.3]} /><meshLambertMaterial color="#5D4037" /></mesh>
          <mesh position={[0, 0, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 0.05]} />
            <meshStandardMaterial ref={npcPaddleMatRef} color="#212121" emissive="#FF0000" emissiveIntensity={0} />
          </mesh>
        </group>
      </group>

      {/* กองเชียร์รอบโต๊ะ (Spectators) */}
      <group ref={el => spectatorRefs.current[0] = el} position={[-4, -1, 0]} rotation={[0, Math.PI / 2, 0]}>
        <VoxelCharacter color="#8E44AD" name="Fan 1" />
      </group>
      <group ref={el => spectatorRefs.current[1] = el} position={[4, -1, 2]} rotation={[0, -Math.PI / 2, 0]}>
        <VoxelCharacter color="#F1C40F" name="Fan 2" />
      </group>
      <group ref={el => spectatorRefs.current[2] = el} position={[4, -1, -2]} rotation={[0, -Math.PI / 2, 0]}>
        <VoxelCharacter color="#2ECC71" name="Fan 3" />
      </group>

      {/* ต้นไม้ประดับตกแต่ง */}
      <group position={[5, -1, -2]} rotation={[0, Math.PI/4, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[1, 1, 1]} /><meshLambertMaterial color="#F5F5F5" /></mesh>
        <mesh position={[0, 1.5, 0]} castShadow><coneGeometry args={[0.8, 1.5, 5]} /><meshLambertMaterial color="#4CAF50" /></mesh>
      </group>

      {/* ขาโต๊ะปิงปอง */}
      {[[-2.2, -1.1, -3.5], [2.2, -1.1, -3.5], [-2.2, -1.1, 3.5], [2.2, -1.1, 3.5]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.2, 2, 0.2]} />
          <meshLambertMaterial color="#212121" />
        </mesh>
      ))}

      {/* หน้าต่าง UI แบบซ้อนทับ (Overlay) */}
      <Html center style={{ pointerEvents: 'none', width: '100vw', height: '100vh', position: 'relative' }}>
        
        {/* มุมซ้ายบน: คะแนนเป้าหมาย (First to X) */}
        <div style={{
          position: 'absolute', top: '30px', left: '30px',
          background: 'var(--color-surface)', padding: '12px 24px',
          borderRadius: '24px', border: '3px solid #E6D2B5',
          fontFamily: 'var(--font-header)', fontSize: '1.2rem',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 8px 0px rgba(0,0,0,0.05)'
        }}>
          <span style={{ fontSize: '1.8rem' }}>🏆</span> First to {WIN_SCORE}
        </div>

        {/* ตรงกลางด้านบน: ป้ายแสดงคะแนน */}
        <div style={{
          position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)',
          background: 'var(--color-surface)',
          borderRadius: '30px', border: '3px solid #E6D2B5',
          display: 'flex', overflow: 'hidden',
          fontFamily: 'var(--font-header)', fontSize: '1.5rem',
          boxShadow: '0 8px 0px rgba(0,0,0,0.05)'
        }}>
          <div style={{ padding: '12px 30px', color: '#1976D2', borderBottom: '5px solid #1976D2' }}>
            YOU: {pScore}
          </div>
          <div style={{ padding: '12px 20px', color: '#757575', background: '#F5F5F5' }}>
            VS
          </div>
          <div style={{ padding: '12px 30px', color: '#D32F2F', borderBottom: '5px solid #D32F2F', textTransform: 'uppercase' }}>
            {npc?.name || 'RIVAL'}: {nScore}
          </div>
        </div>

        {/* มุมขวาบน: ตัวนับจำนวนครั้งที่ตีโต้กัน (Rally) */}
        <div style={{
          position: 'absolute', top: '30px', right: '30px',
          background: 'var(--color-surface)', padding: '12px 24px',
          borderRadius: '24px', border: '3px solid #E6D2B5',
          fontFamily: 'var(--font-header)', textAlign: 'center',
          boxShadow: '0 8px 0px rgba(0,0,0,0.05)'
        }}>
          <div style={{ fontSize: '0.9rem', color: '#757575', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: '#E53935', fontSize: '1.2rem' }}>🏓</span> TABLE RALLY
          </div>
          <div style={{ fontSize: '2.5rem', color: '#F57C00', lineHeight: '1' }}>
            {rallyCount}
          </div>
        </div>

        {/* ซ้ายมือ: วิธีการเล่นเบื้องต้น */}
        <div style={{
          position: 'absolute', top: '50%', left: '30px', transform: 'translateY(-50%)',
          background: 'var(--color-surface)', padding: '24px',
          borderRadius: '20px', border: '3px solid #E6D2B5',
          boxShadow: '0 8px 0px rgba(0,0,0,0.05)',
          width: '240px'
        }}>
          <div style={{ fontFamily: 'var(--font-header)', color: '#1976D2', marginBottom: '20px', textAlign: 'center' }}>
            HOW TO PLAY
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem' }}>🖱️</div>
            <div style={{ fontFamily: 'var(--font-main)', fontSize: '0.9rem', color: '#555' }}>
              <strong style={{ color: '#1976D2' }}>Move your MOUSE</strong><br/>to control the paddle!
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ fontSize: '2rem', color: '#D32F2F' }}>🖱️</div>
            <div style={{ fontFamily: 'var(--font-main)', fontSize: '0.9rem', color: '#555' }}>
              <strong style={{ color: '#D32F2F' }}>Click & Hold</strong><br/>for Smash!
            </div>
          </div>
        </div>

        {/* มุมซ้ายล่าง: คำขวัญ Focus React Smash */}
        <div style={{
          position: 'absolute', bottom: '30px', left: '30px',
          fontFamily: 'var(--font-header)', fontSize: '1rem', color: '#1976D2',
          display: 'flex', gap: '8px', alignItems: 'center'
        }}>
          ✨ FOCUS <span style={{ color: '#F57C00' }}>• REACT •</span> <span style={{ color: '#D32F2F' }}>SMASH!</span>
        </div>

        {/* มุมขวาล่าง: ปุ่มตั้งค่า Settings */}
        <div style={{
          position: 'absolute', bottom: '30px', right: '30px',
          background: 'var(--color-surface)', padding: '12px 24px',
          borderRadius: '24px', border: '3px solid #E6D2B5',
          fontFamily: 'var(--font-header)', fontSize: '1rem', color: '#555',
          boxShadow: '0 4px 0px rgba(0,0,0,0.05)', cursor: 'pointer', pointerEvents: 'auto'
        }}>
          ⚙️ SETTINGS
        </div>

        {/* หน้าจอสรุปผลคะแนนเมื่อจบเกม */}
        {gameState === 'gameOver' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--color-surface)', padding: '30px 50px', border: '4px solid var(--color-accent)',
            borderRadius: '16px', textAlign: 'center', fontFamily: 'var(--font-header)', boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ fontSize: '3rem', color: pScore >= WIN_SCORE ? '#4CAF50' : '#E53935', marginBottom: '10px' }}>
              {pScore >= WIN_SCORE ? 'YOU WIN!' : `${npc?.name?.toUpperCase() || 'RIVAL'} WINS!`}
            </div>
            <div style={{ fontSize: '1.5rem', color: 'var(--color-text)' }}>
              Final Score: {pScore} - {nScore}
            </div>
          </div>
        )}
      </Html>
    </group>
  );
}
