import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { VoxelCharacter } from '../3d/NPCCharacters';

export default function BadmintonGame({ active, onScore, onEndGame, npc }) {
  const shuttleRef = useRef();
  const pointerRef = useRef();
  const playerRef = useRef();
  const npcRef = useRef();
  const playerHitTime = useRef(0);
  const npcHitTime = useRef(0);
  
  // ตัวแปรอ้างอิงตรรกะของเกม
  const pointerPos = useRef(0);
  const pointerDir = useRef(1);
  const pointerSpeed = useRef(1.5); // ความเร็วพื้นฐาน
  const shuttleT = useRef(0);
  const shuttleStart = useRef(new THREE.Vector3());
  const shuttleEnd = useRef(new THREE.Vector3());
  
  const [gameState, setGameState] = useState('playerTurn'); // สถานะ: playerTurn, npcTurn, flyingToNpc, flyingToPlayer, gameOver
  const [combo, setCombo] = useState(0);
  const [pScore, setPScore] = useState(0);
  const [nScore, setNScore] = useState(0);
  const [hitFeedback, setHitFeedback] = useState(null); // เก็บข้อความตอบกลับและสี: { text, color }

  // สถานะของเมนูตั้งค่า
  const [isPaused, setIsPaused] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState('Normal'); // 'Normal', 'Easy'

  // ค่าคงที่ของพิกัดต่างๆ
  const PLAYER_POS = new THREE.Vector3(0, 1.5, 3);
  const NPC_POS = new THREE.Vector3(0, 1.5, -4);
  const WIN_SCORE = 7;

  const showFeedback = (text, color) => {
    setHitFeedback({ text, color });
    setTimeout(() => setHitFeedback(null), 1000);
  };

  const handlePlayerWinRally = () => {
    setPScore(s => s + 1);
    onScore(1); // เพิ่มคะแนน/EXP ในระบบหลัก
    showFeedback(`${npc?.name?.toUpperCase() || 'RIVAL'} MISSED! +1`, '#4CAF50');
    setGameState('pointLost');
    setTimeout(() => {
      resetRally('npcServe');
    }, 1500);
  };

  const handleNpcWinRally = () => {
    setNScore(s => s + 1);
    showFeedback(`MISS! ${npc?.name?.toUpperCase() || 'RIVAL'} +1`, '#E53935');
    setGameState('pointLost');
    setTimeout(() => {
      resetRally('npcServe');
    }, 1500);
  };

  const getBaseSpeed = () => difficulty === 'Easy' ? 1.0 : 1.5;

  const resetRally = (newState) => {
    if (pScore >= WIN_SCORE || nScore >= WIN_SCORE) return;
    pointerPos.current = 0;
    pointerSpeed.current = getBaseSpeed();
    
    setGameState(newState);
    if (newState === 'npcServe') {
      setTimeout(() => {
        if (pScore < WIN_SCORE && nScore < WIN_SCORE) {
           const targetX = (Math.random() - 0.5) * 5;
           launchShuttle(NPC_POS.clone().setX(npcRef.current?.position.x || 0), PLAYER_POS.clone().setX(targetX), 'flyingToPlayer');
        }
      }, 800);
    }
  };

  // เริ่มการตีโต้ครั้งแรกเมื่อโหลดหน้าต่างนี้
  useEffect(() => {
    if (active && gameState === 'playerTurn' && pScore === 0 && nScore === 0) {
      resetRally('npcServe');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  useEffect(() => {
    function onKey(e) {
      if (e.code === 'Space' && active && !isPaused && gameState === 'playerTurn') {
        e.preventDefault();
        
        const pos = pointerPos.current;
        const dist = Math.abs(pos - 50);
        
        let result = '';
        if (dist <= 10) result = 'perfect';
        else if (dist <= 30) result = 'good';
        else result = 'miss';

        playerHitTime.current = 0.3; // เวลาของแอนิเมชันตอนสวิงไม้

        if (result === 'perfect') {
          setCombo(c => c + 1);
          showFeedback('PERFECT!', '#4CAF50');
          pointerSpeed.current += (difficulty === 'Easy' ? 0.15 : 0.3); // ความเร็วเกมเพิ่มขึ้น
          const targetX = (Math.random() - 0.5) * 5;
          launchShuttle(PLAYER_POS.clone().setX(playerRef.current.position.x), NPC_POS.clone().setX(targetX), 'flyingToNpc');
        } else if (result === 'good') {
          setCombo(0);
          showFeedback('GOOD!', '#FFCA28');
          pointerSpeed.current = getBaseSpeed();
          const targetX = (Math.random() - 0.5) * 5;
          launchShuttle(PLAYER_POS.clone().setX(playerRef.current.position.x), NPC_POS.clone().setX(targetX), 'flyingToNpc');
        } else {
          setCombo(0);
          handleNpcWinRally();
        }
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, gameState, onScore, pScore, nScore, isPaused, difficulty]);

  useEffect(() => {
    if ((pScore >= WIN_SCORE || nScore >= WIN_SCORE) && gameState !== 'gameOver') {
      setGameState('gameOver');
      setTimeout(() => {
        if (onEndGame) onEndGame();
      }, 2500);
    }
  }, [pScore, nScore, onEndGame, gameState]);

  const launchShuttle = (start, end, nextState) => {
    shuttleStart.current.copy(start);
    shuttleEnd.current.copy(end);
    shuttleT.current = 0;
    setGameState(nextState);
  };

  const toggleSettings = () => {
    setShowSettings(prev => !prev);
    setIsPaused(prev => !prev);
  };

  const handleQuit = () => {
    if (onEndGame) onEndGame();
  };

  const toggleDifficulty = () => {
    setDifficulty(prev => {
      const newDiff = prev === 'Normal' ? 'Easy' : 'Normal';
      if (gameState === 'playerTurn') {
         pointerSpeed.current = newDiff === 'Easy' ? 1.0 + (combo * 0.15) : 1.5 + (combo * 0.3);
      }
      return newDiff;
    });
  };

  useFrame((state, delta) => {
    if (!active || isPaused) return;

    // ตรรกะของเกจจับเวลา - วิ่งจากซ้ายไปขวาหนึ่งรอบ
    if (gameState === 'playerTurn' && pointerRef.current) {
      pointerPos.current += pointerSpeed.current * 100 * delta;
      if (pointerPos.current >= 100) {
        pointerPos.current = 100;
        // หมดเวลาตีลูก (พลาด)
        setCombo(0);
        playerHitTime.current = 0.3;
        handleNpcWinRally();
      }
      pointerRef.current.style.left = `${pointerPos.current}%`;
    }

    // ตรรกะการลอยของลูกขนไก่
    if (gameState === 'flyingToNpc' || gameState === 'flyingToPlayer') {
      const speedMultiplier = difficulty === 'Easy' ? 0.7 : 1.0;
      shuttleT.current += delta * (1.5 + combo * 0.15) * speedMultiplier; // ลูกขนไก่จะลอยเร็วขึ้นตามคอมโบ
      if (shuttleT.current >= 1) {
        shuttleT.current = 1;
        // ลอยถึงจุดหมายแล้ว
        if (gameState === 'flyingToNpc') {
          npcHitTime.current = 0.3; // แอนิเมชันสวิงไม้ของ NPC
          
          const npcMissChance = combo >= 3 ? 0.35 : 0.18;
          if (Math.random() < npcMissChance) {
             handlePlayerWinRally();
          } else {
             // NPC ตีโต้กลับมา
             setGameState('npcTurn');
             setTimeout(() => {
               if (pScore < WIN_SCORE && nScore < WIN_SCORE && gameState !== 'gameOver') {
                 const targetX = (Math.random() - 0.5) * 5; 
                 launchShuttle(NPC_POS.clone().setX(npcRef.current.position.x), PLAYER_POS.clone().setX(targetX), 'flyingToPlayer');
               }
             }, 300);
          }
        } else {
          // ลูกลอยถึงตัวผู้เล่น เริ่มจับเวลาเกจใหม่
          pointerPos.current = 0; // รีเซ็ตตำแหน่งเกจ
          setGameState('playerTurn');
        }
      }

      if (shuttleRef.current) {
        // คำนวณความโค้งพาราโบลาของการลอย
        const t = shuttleT.current;
        const s = shuttleStart.current;
        const e = shuttleEnd.current;
        
        const currentX = THREE.MathUtils.lerp(s.x, e.x, t);
        const currentZ = THREE.MathUtils.lerp(s.z, e.z, t);
        const currentY = THREE.MathUtils.lerp(s.y, e.y, t) + Math.sin(t * Math.PI) * 2;

        shuttleRef.current.position.set(currentX, currentY, currentZ);
        shuttleRef.current.rotation.x = t * Math.PI * 4; // การหมุนของลูกขนไก่
      }
    }

    // การเคลื่อนไหวและแอนิเมชันของตัวละคร
    if (playerRef.current) {
      if (gameState === 'flyingToPlayer') {
        playerRef.current.position.x = THREE.MathUtils.lerp(playerRef.current.position.x, shuttleEnd.current.x, 5 * delta);
      }
      
      // แอนิเมชันการสวิงไม้ตี
      if (playerHitTime.current > 0) {
        playerHitTime.current -= delta;
        playerRef.current.rotation.x = -Math.PI / 4 * (playerHitTime.current / 0.3);
      } else {
        playerRef.current.rotation.x = 0;
      }
    }

    if (npcRef.current) {
      if (gameState === 'flyingToNpc') {
        npcRef.current.position.x = THREE.MathUtils.lerp(npcRef.current.position.x, shuttleEnd.current.x, 5 * delta);
      }

      // แอนิเมชันการสวิงไม้ตี
      if (npcHitTime.current > 0) {
        npcHitTime.current -= delta;
        npcRef.current.rotation.x = Math.PI / 4 * (npcHitTime.current / 0.3);
      } else {
        npcRef.current.rotation.x = 0;
      }
    }
  });

  // สไตล์ UI หลัก
  const uiBoxStyle = {
    background: '#FFF8EE',
    borderRadius: '16px',
    border: '3px solid #8D6E63',
    fontFamily: 'var(--font-header)',
    color: '#5D4037',
    boxShadow: '0 6px 0px rgba(141, 110, 99, 0.3)',
  };

  return (
    <group>
      {/* แสงไฟสนามกีฬา (Stadium Lighting) */}
      <pointLight position={[0, 8, -6]} intensity={2.0} color="#FFD700" distance={30} />
      <ambientLight intensity={0.4} color="#FFF3E0" />

      {/* พื้นสนามไม้ (Wood Floor) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[20, 24]} />
        <meshLambertMaterial color="#DEB887" />
      </mesh>
      
      {/* กรอบเส้นขาวรอบนอกสุด */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[8.4, 13.4]} />
        <meshLambertMaterial color="#FFF" />
      </mesh>
      
      {/* พื้นสนามสีน้ำเงิน (Blue Court) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[8.0, 13.0]} />
        <meshLambertMaterial color="#2962FF" />
      </mesh>
      
      {/* เส้นสนามภายใน (Court lines) */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]}>
        <planeGeometry args={[8.0, 0.05]} />
        <meshBasicMaterial color="#FFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-3.6, 0.01, 0]}><planeGeometry args={[0.05, 13]} /><meshBasicMaterial color="#FFF" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[3.6, 0.01, 0]}><planeGeometry args={[0.05, 13]} /><meshBasicMaterial color="#FFF" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -5.5]}><planeGeometry args={[8, 0.05]} /><meshBasicMaterial color="#FFF" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 5.5]}><planeGeometry args={[8, 0.05]} /><meshBasicMaterial color="#FFF" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -3.5]}><planeGeometry args={[8, 0.05]} /><meshBasicMaterial color="#FFF" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3.5]}><planeGeometry args={[8, 0.05]} /><meshBasicMaterial color="#FFF" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -4.5]}><planeGeometry args={[0.05, 2]} /><meshBasicMaterial color="#FFF" /></mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 4.5]}><planeGeometry args={[0.05, 2]} /><meshBasicMaterial color="#FFF" /></mesh>

      {/* ตาข่าย (Net) */}
      <mesh position={[0, 1.2, 0]}>
        <boxGeometry args={[8, 0.8, 0.02]} />
        <meshLambertMaterial color="#FFF" wireframe transparent opacity={0.6} />
      </mesh>
      {/* แถบขาวบนตาข่าย */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[8.1, 0.05, 0.05]} />
        <meshLambertMaterial color="#FFF" />
      </mesh>
      
      {/* เสาตาข่าย */}
      <mesh position={[-4.0, 0.8, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 1.6, 16]} /><meshLambertMaterial color="#0D47A1" /></mesh>
      <mesh position={[4.0, 0.8, 0]} castShadow><cylinderGeometry args={[0.08, 0.08, 1.6, 16]} /><meshLambertMaterial color="#0D47A1" /></mesh>

      {/* ป้ายโฆษณาข้างสนาม (Billboards) */}
      <group position={[-5.5, 0.4, 0]}>
        <mesh position={[0, 0, -3]} rotation={[0, Math.PI/2, 0]} castShadow><boxGeometry args={[4, 0.8, 0.2]} /><meshLambertMaterial color="#E67E22" /></mesh>
        <mesh position={[0, 0, 1]} rotation={[0, Math.PI/2, 0]} castShadow><boxGeometry args={[4, 0.8, 0.2]} /><meshLambertMaterial color="#2980B9" /></mesh>
      </group>
      <group position={[5.5, 0.4, 0]}>
        <mesh position={[0, 0, -3]} rotation={[0, -Math.PI/2, 0]} castShadow><boxGeometry args={[4, 0.8, 0.2]} /><meshLambertMaterial color="#2980B9" /></mesh>
        <mesh position={[0, 0, 1]} rotation={[0, -Math.PI/2, 0]} castShadow><boxGeometry args={[4, 0.8, 0.2]} /><meshLambertMaterial color="#E67E22" /></mesh>
      </group>

      {/* กองเชียร์บนอัฒจันทร์ (Spectators) */}
      {[...Array(8)].map((_, i) => (
        <group key={`spec_l_${i}`} position={[-8, 1.0, -5 + i*1.5]} rotation={[0, Math.PI/2, 0]}>
          <VoxelCharacter color={['#2980B9', '#E67E22', '#2C3E50'][i%3]} name={`FanL${i}`} />
        </group>
      ))}
      {[...Array(8)].map((_, i) => (
        <group key={`spec_r_${i}`} position={[8, 1.0, -5 + i*1.5]} rotation={[0, -Math.PI/2, 0]}>
          <VoxelCharacter color={['#E67E22', '#2C3E50', '#2980B9'][i%3]} name={`FanR${i}`} />
        </group>
      ))}


      {/* ลูกขนไก่ */}
      <group ref={shuttleRef} position={PLAYER_POS.toArray()}>
        <mesh castShadow>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshLambertMaterial color="#FFF" />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <coneGeometry args={[0.12, 0.2, 6]} />
          <meshLambertMaterial color="#E53935" />
        </mesh>
      </group>

      {/* ตัวละคร */}
      <group position={[0, -0.5, 3]} ref={playerRef} rotation={[0, Math.PI, 0]}>
        <VoxelCharacter color="#4ECDC4" name="Player" />
        {/* Racket */}
        <group position={[0.5, 1, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh><cylinderGeometry args={[0.02, 0.02, 0.8]} /><meshLambertMaterial color="#333" /></mesh>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.2, 0.2, 0.05]} /><meshLambertMaterial color="#E53935" /></mesh>
        </group>
      </group>

      <group position={[0, -0.5, -4]} ref={npcRef} rotation={[0, 0, 0]}>
        <VoxelCharacter color={npc?.color || "#E67E22"} name={npc?.name || "Rival"} />
        {/* ไม้แบดมินตัน */}
        <group position={[0.5, 1, 0.2]} rotation={[Math.PI / 4, 0, 0]}>
          <mesh><cylinderGeometry args={[0.02, 0.02, 0.8]} /><meshLambertMaterial color="#333" /></mesh>
          <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.2, 0.2, 0.05]} /><meshLambertMaterial color="#212121" /></mesh>
        </group>
      </group>

      {/* ต้นไม้ประดับตกแต่ง */}
      <group position={[5, -0.5, 0]} rotation={[0, Math.PI/4, 0]}>
        <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[1, 1, 1]} /><meshLambertMaterial color="#F5F5F5" /></mesh>
        <mesh position={[0, 1.5, 0]} castShadow><coneGeometry args={[0.8, 1.5, 5]} /><meshLambertMaterial color="#4CAF50" /></mesh>
      </group>

      {/* หน้าจอ UI & เกจจับเวลาแบบวางซ้อนทับ */}
      <Html center style={{ pointerEvents: 'none', width: '100vw', height: '100vh', position: 'relative' }}>
        
        {/* มุมซ้ายบน: คะแนนเป้าหมาย (First to X) */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', top: '30px', left: '30px', padding: '12px 24px',
          display: 'flex', alignItems: 'center', gap: '15px'
        }}>
          <span style={{ fontSize: '2rem' }}>🏆</span> 
          <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>First to {WIN_SCORE}</span>
        </div>

        {/* ตรงกลางด้านบน: ป้ายแสดงคะแนน */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', top: '30px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', overflow: 'hidden', padding: '0',
          fontSize: '1.5rem'
        }}>
          <div style={{ padding: '12px 30px', color: '#1976D2', borderBottom: '5px solid #1976D2', fontWeight: 'bold' }}>
            YOU: {pScore}
          </div>
          <div style={{ padding: '12px 20px', color: '#757575', background: '#F5F5F5' }}>
            VS
          </div>
          <div style={{ padding: '12px 30px', color: '#D32F2F', borderBottom: '5px solid #D32F2F', fontWeight: 'bold', textTransform: 'uppercase' }}>
            {npc?.name || 'RIVAL'}: {nScore}
          </div>
        </div>

        {/* มุมขวาบน: ตัวนับคอมโบ/คะแนน */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', top: '30px', right: '30px', padding: '12px 30px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '1rem', color: '#5D4037', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }}>
            <span style={{ fontSize: '1.2rem' }}>🏸</span> SHUTTLE SMASH
          </div>
          <div style={{ fontSize: '3rem', color: '#F57C00', lineHeight: '1', marginTop: '5px' }}>
            {combo > 0 ? combo : 0}
          </div>
        </div>

        {/* ซ้ายมือ: วิธีการเล่นเบื้องต้น */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', top: '50%', left: '30px', transform: 'translateY(-50%)',
          padding: '24px', width: '260px'
        }}>
          <div style={{ color: '#1976D2', marginBottom: '20px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}>
            ⭐ HOW TO PLAY ⭐
          </div>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: '#F5F5F5', border: '2px solid #CCC', borderRadius: '8px', fontWeight: 'bold', fontSize: '0.8rem', color: '#555' }}>
              SPACE
            </div>
            <div style={{ fontFamily: 'var(--font-main)', fontSize: '0.95rem', color: '#555' }}>
              <strong style={{ color: '#1976D2' }}>Press SPACE</strong><br/>to swing the racket!
            </div>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div style={{ padding: '8px', background: '#4CAF50', border: '2px solid #2E7D32', borderRadius: '8px', color: '#FFF', fontSize: '1.2rem' }}>
              🏸
            </div>
            <div style={{ fontFamily: 'var(--font-main)', fontSize: '0.95rem', color: '#555' }}>
              <strong style={{ color: '#4CAF50' }}>Hit Green Zone</strong><br/>for Perfect Smash!
            </div>
          </div>
        </div>

        {/* มุมซ้ายล่าง: คำขวัญ Focus React Smash */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', bottom: '30px', left: '30px',
          padding: '12px 24px', fontSize: '1.1rem', color: '#1976D2',
          display: 'flex', gap: '8px', alignItems: 'center'
        }}>
          ⭐ FOCUS <span style={{ color: '#F57C00' }}>• REACT •</span> <span style={{ color: '#D32F2F' }}>SMASH!</span>
        </div>

        {/* มุมขวาล่าง: ปุ่มตั้งค่า Settings */}
        <div 
          onClick={toggleSettings}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          style={{
            ...uiBoxStyle,
            position: 'absolute', bottom: '30px', right: '30px',
            padding: '12px 24px', fontSize: '1.1rem', color: '#5D4037',
            cursor: 'pointer', pointerEvents: 'auto', fontWeight: 'bold',
            transition: 'transform 0.2s'
          }}
        >
          ⚙️ SETTINGS
        </div>

        {/* ข้อความตอบรับจังหวะการตี (Feedback) */}
        {hitFeedback && (
          <div style={{
            position: 'absolute', top: '40vh', left: '50%', transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-header)', fontSize: '3rem', color: hitFeedback.color,
            textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF',
            animation: 'bounceIn 0.3s ease-out'
          }}>
            {hitFeedback.text}
          </div>
        )}

        {/* เกจแถบสีจับเวลาตีลูก */}
        {gameState === 'playerTurn' && (
          <div style={{
            position: 'absolute', bottom: '15vh', left: '50%', transform: 'translateX(-50%)',
            width: '450px', background: '#FFF8EE', padding: '16px',
            border: '4px solid #8D6E63', borderRadius: '24px',
            boxShadow: '0 8px 0px rgba(141, 110, 99, 0.3)', textAlign: 'center'
          }}>
            <div style={{
              position: 'relative', height: '30px', width: '100%', borderRadius: '15px', overflow: 'hidden',
              display: 'flex', border: '3px solid #5D4037'
            }}>
              <div style={{ flex: 1.5, background: '#E74C3C' }}></div>
              <div style={{ flex: 2, background: '#F1C40F' }}></div>
              <div style={{ flex: 3, background: '#2ECC71' }}></div>
              <div style={{ flex: 2, background: '#F1C40F' }}></div>
              <div style={{ flex: 1.5, background: '#E74C3C' }}></div>
              
              <div ref={pointerRef} style={{
                position: 'absolute', top: '-4px', bottom: '-4px', width: '10px',
                background: '#FFF', border: '2px solid #333', borderRadius: '5px',
                transform: 'translateX(-50%)', zIndex: 2,
                boxShadow: '0 0 10px rgba(255,255,255,0.8)'
              }}>
                 {/* ลูกศรสามเหลี่ยม */}
                 <div style={{
                   position: 'absolute', bottom: '-15px', left: '50%', transform: 'translateX(-50%)',
                   borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
                   borderBottom: '10px solid #FFF', filter: 'drop-shadow(0 2px 0 #333)'
                 }} />
              </div>
            </div>
          </div>
        )}

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

        {/* หน้าต่างตั้งค่า (Settings Modal) */}
        {showSettings && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
            display: 'flex', justifyContent: 'center', alignItems: 'center',
            pointerEvents: 'auto', zIndex: 10
          }}>
            <div style={{
              ...uiBoxStyle,
              padding: '40px', width: '400px', display: 'flex', flexDirection: 'column', gap: '20px',
              boxShadow: '0 15px 30px rgba(0,0,0,0.3)', position: 'relative'
            }}>
              <h2 style={{ textAlign: 'center', margin: '0 0 10px 0', fontSize: '2rem' }}>SETTINGS</h2>
              
              {/* ปิดหน้าต่าง */}
              <button 
                onClick={toggleSettings}
                style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                ❌
              </button>

              <button 
                onClick={() => setSoundEnabled(!soundEnabled)}
                style={{
                  ...uiBoxStyle, padding: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', boxShadow: 'none'
                }}
              >
                <span>🔊 Sound Effects</span>
                <span style={{ color: soundEnabled ? '#4CAF50' : '#E53935', fontWeight: 'bold' }}>{soundEnabled ? 'ON' : 'OFF'}</span>
              </button>

              <button 
                onClick={toggleDifficulty}
                style={{
                  ...uiBoxStyle, padding: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '1.2rem', boxShadow: 'none'
                }}
              >
                <span>🎮 Difficulty</span>
                <span style={{ color: difficulty === 'Normal' ? '#F57C00' : '#4CAF50', fontWeight: 'bold' }}>{difficulty}</span>
              </button>

              <button 
                onClick={handleQuit}
                style={{
                  ...uiBoxStyle, padding: '15px', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '1.2rem',
                  background: '#E53935', color: '#FFF', border: '3px solid #B71C1C', marginTop: '10px'
                }}
              >
                🚪 Quit Match
              </button>
            </div>
          </div>
        )}
      </Html>
    </group>
  );
}
