import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { VoxelCharacter } from '../3d/NPCCharacters';

export default function FootballGame({ active, onScore, onEndGame, npc }) {
  const ballRef = useRef();
  const kickerRef = useRef();
  const goalieRef = useRef();
  
  const [gameState, setGameState] = useState('selectRole'); // สถานะ: selectRole, waitInput, action, result, gameOver
  const [playerRole, setPlayerRole] = useState(null); // บทบาท: 'kicker' (คนเตะ) | 'goalie' (ผู้รักษาประตู)
  const [pScore, setPScore] = useState(0);
  const [nScore, setNScore] = useState(0);
  const [round, setRound] = useState(1);
  const [feedback, setFeedback] = useState('');

  const WIN_SCORE = 10;
  
  // ตัวแปรอ้างอิงแอนิเมชัน
  const ballVel = useRef(new THREE.Vector3());
  const ballTarget = useRef(new THREE.Vector3());
  const goalieTargetX = useRef(0);
  const actionTimer = useRef(0);
  const isGoal = useRef(false);

  const POS_X = { left: -2.5, center: 0, right: 2.5 };

  const selectRole = (role) => {
    setPlayerRole(role);
    setGameState('waitInput');
  };

  const handleChoice = (dir) => {
    if (gameState !== 'waitInput') return;

    const dirs = ['left', 'center', 'right'];
    const aiChoice = dirs[Math.floor(Math.random() * 3)];
    
    let kickDir = playerRole === 'kicker' ? dir : aiChoice;
    let diveDir = playerRole === 'goalie' ? dir : aiChoice;

    // ประเมินผลการยิง/เซฟ
    isGoal.current = kickDir !== diveDir;
    
    // ตั้งเป้าหมายตำแหน่งการเคลื่อนที่
    ballTarget.current.set(POS_X[kickDir], 0.5, -6.5);
    goalieTargetX.current = POS_X[diveDir];
    
    // คำนวณความเร็วของลูกบอลสำหรับการลอย 0.5 วินาที
    ballVel.current.set(
      (ballTarget.current.x - 0) / 0.5,
      (ballTarget.current.y - 0.3) / 0.5 + (0.5 * 20 * 0.5), // v0 = (y - 0.5*g*t^2)/t, โดยใช้แรงโน้มถ่วง g=20
      (ballTarget.current.z - 3) / 0.5
    );

    actionTimer.current = 0;
    setGameState('action');
  };

  useFrame((state, delta) => {
    if (!active) return;

    if (gameState === 'action') {
      actionTimer.current += delta;
      
      // การเคลื่อนที่ของลูกบอล
      if (actionTimer.current <= 0.5 && ballRef.current) {
        ballVel.current.y -= 20 * delta; // แรงโน้มถ่วง
        ballRef.current.position.x += ballVel.current.x * delta;
        ballRef.current.position.y += ballVel.current.y * delta;
        ballRef.current.position.z += ballVel.current.z * delta;
        ballRef.current.rotation.x -= 10 * delta;
      } else if (ballRef.current && actionTimer.current > 0.5 && actionTimer.current < 2) {
        // ลูกบอลหยุดนิ่ง หรือกระดอนอยู่ข้างในตาข่าย
        if (isGoal.current) {
          ballRef.current.position.y = 0.3; // นอนนิ่งบนพื้น
        } else {
           // ลูกกระดอนชนตัวผู้รักษาประตู
           ballRef.current.position.x += (Math.random() - 0.5) * delta;
           ballRef.current.position.z += 2 * delta; 
           ballRef.current.position.y = 0.3;
        }
      }

      // การเคลื่อนที่ของผู้รักษาประตู
      if (goalieRef.current) {
        if (actionTimer.current <= 0.3) {
          goalieRef.current.position.x = THREE.MathUtils.lerp(0, goalieTargetX.current, actionTimer.current / 0.3);
          if (goalieTargetX.current < 0) goalieRef.current.rotation.z = Math.PI / 4;
          if (goalieTargetX.current > 0) goalieRef.current.rotation.z = -Math.PI / 4;
        }
      }

      // คำนวณสรุปผลเมื่อเวลาผ่านไป 0.6 วินาที
      if (actionTimer.current > 0.6 && gameState === 'action') {
        setGameState('result');
        if (isGoal.current) {
          setFeedback('GOAL!');
          if (playerRole === 'kicker') {
            setPScore(s => s + 1);
            onScore(2);
          } else {
            setNScore(s => s + 1);
          }
        } else {
          setFeedback('SAVED!');
          if (playerRole === 'goalie') {
            setPScore(s => s + 1);
            onScore(2);
          } else {
            setNScore(s => s + 1);
          }
        }
        
        setTimeout(() => {
          if (pScore + (isGoal.current && playerRole === 'kicker' ? 1 : !isGoal.current && playerRole === 'goalie' ? 1 : 0) >= WIN_SCORE ||
              nScore + (!isGoal.current && playerRole === 'kicker' ? 1 : isGoal.current && playerRole === 'goalie' ? 1 : 0) >= WIN_SCORE) {
            setGameState('gameOver');
            setTimeout(() => { if (onEndGame) onEndGame(); }, 2000);
          } else {
            setRound(r => r + 1);
            resetPositions();
            setGameState('waitInput');
          }
        }, 2000);
      }
    }
  });

  const resetPositions = () => {
    if (ballRef.current) {
      ballRef.current.position.set(0, 0.3, 3);
      ballRef.current.rotation.set(0, 0, 0);
    }
    if (goalieRef.current) {
      goalieRef.current.position.set(0, -0.5, -6);
      goalieRef.current.rotation.set(0, 0, 0); // หันหน้ามาหาคนเตะ (แกน Z บวก)
    }
  };

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
      {/* แสงแดดยามเย็นและบรรยากาศ (Warm lighting & Atmosphere) */}
      <pointLight position={[0, 6, -12]} intensity={2.0} color="#FFD700" distance={30} />
      <ambientLight intensity={0.4} color="#FFF3E0" />

      {/* พื้นสนามหญ้าลายทาง (Striped Grass Field) */}
      <group position={[0, 0, 0]}>
        {[...Array(10)].map((_, i) => (
          <mesh key={`grass_${i}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -8 + i * 2 + 1]} receiveShadow>
            <planeGeometry args={[16, 2]} />
            <meshLambertMaterial color={i % 2 === 0 ? '#68B033' : '#78C043'} />
          </mesh>
        ))}
      </group>
      
      {/* เส้นกรอบเขตโทษ */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -4]}>
        <planeGeometry args={[8, 0.05]} />
        <meshBasicMaterial color="#FFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-4, 0.01, -5.5]}>
        <planeGeometry args={[0.05, 3]} />
        <meshBasicMaterial color="#FFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[4, 0.01, -5.5]}>
        <planeGeometry args={[0.05, 3]} />
        <meshBasicMaterial color="#FFF" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 3]}>
        <circleGeometry args={[0.2, 32]} />
        <meshBasicMaterial color="#FFF" />
      </mesh>

      {/* ประตูฟุตบอลแบบสมจริง (Goal with net) */}
      <mesh position={[-3.5, 1.5, -7]} castShadow><cylinderGeometry args={[0.08, 0.08, 3, 16]} /><meshLambertMaterial color="#FFF" /></mesh>
      <mesh position={[3.5, 1.5, -7]} castShadow><cylinderGeometry args={[0.08, 0.08, 3, 16]} /><meshLambertMaterial color="#FFF" /></mesh>
      <mesh position={[0, 3.0, -7]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.08, 0.08, 7.1, 16]} /><meshLambertMaterial color="#FFF" /></mesh>
      
      {/* ตาข่าย */}
      <mesh position={[0, 1.5, -8]}><boxGeometry args={[7, 3, 0.02]} /><meshLambertMaterial color="#FFF" wireframe transparent opacity={0.5} /></mesh>
      <mesh position={[-3.5, 1.5, -7.5]} rotation={[0, Math.PI/2, 0]}><boxGeometry args={[1, 3, 0.02]} /><meshLambertMaterial color="#FFF" wireframe transparent opacity={0.5} /></mesh>
      <mesh position={[3.5, 1.5, -7.5]} rotation={[0, -Math.PI/2, 0]}><boxGeometry args={[1, 3, 0.02]} /><meshLambertMaterial color="#FFF" wireframe transparent opacity={0.5} /></mesh>

      {/* ป้ายโฆษณา (Billboards) */}
      <group position={[-6.5, 0.5, -1]}>
        <mesh position={[0, 0, -3]} rotation={[0, Math.PI/2, 0]} castShadow><boxGeometry args={[6, 1, 0.2]} /><meshLambertMaterial color="#2C82C9" /></mesh>
        <mesh position={[0, 0, 3]} rotation={[0, Math.PI/2, 0]} castShadow><boxGeometry args={[6, 1, 0.2]} /><meshLambertMaterial color="#E67E22" /></mesh>
      </group>
      <group position={[6.5, 0.5, -1]}>
        <mesh position={[0, 0, -3]} rotation={[0, -Math.PI/2, 0]} castShadow><boxGeometry args={[6, 1, 0.2]} /><meshLambertMaterial color="#E74C3C" /></mesh>
        <mesh position={[0, 0, 3]} rotation={[0, -Math.PI/2, 0]} castShadow><boxGeometry args={[6, 1, 0.2]} /><meshLambertMaterial color="#2C82C9" /></mesh>
      </group>

      {/* กองเชียร์บนอัฒจันทร์ (Spectators) */}
      {[...Array(6)].map((_, i) => (
        <group key={`spec_l_${i}`} position={[-7.5, 1.0, -6 + i*2]} rotation={[0, Math.PI/2, 0]}>
          <VoxelCharacter color={['#E74C3C', '#F1C40F', '#8E44AD'][i%3]} name={`FanL${i}`} />
        </group>
      ))}
      {[...Array(6)].map((_, i) => (
        <group key={`spec_r_${i}`} position={[7.5, 1.0, -6 + i*2]} rotation={[0, -Math.PI/2, 0]}>
          <VoxelCharacter color={['#3498DB', '#2ECC71', '#E67E22'][i%3]} name={`FanR${i}`} />
        </group>
      ))}

      {/* ลูกฟุตบอล */}
      <group ref={ballRef} position={[0, 0.3, 3]}>
        <mesh castShadow><sphereGeometry args={[0.3, 16, 16]} /><meshLambertMaterial color="#FFF" /></mesh>
        <mesh><sphereGeometry args={[0.31, 8, 8]} /><meshLambertMaterial color="#2D3436" wireframe /></mesh>
      </group>

      {/* ตัวละคร */}
      <group position={[0, -0.5, 4.5]} ref={kickerRef} rotation={[0, Math.PI, 0]}>
        {playerRole === 'kicker' ? (
          <VoxelCharacter color="#4ECDC4" name="Player" />
        ) : (
          <VoxelCharacter color={npc?.color || "#E67E22"} name={npc?.name || "Rival"} />
        )}
      </group>

      <group ref={goalieRef} position={[0, -0.5, -6]} rotation={[0, 0, 0]}>
        {playerRole === 'goalie' ? (
          <VoxelCharacter color="#4ECDC4" name="Player" />
        ) : (
          <VoxelCharacter color={npc?.color || "#E67E22"} name={npc?.name || "Rival"} />
        )}
      </group>

      {/* หน้าต่าง UI แบบซ้อนทับ (Overlay) */}
      <Html center style={{ pointerEvents: 'none', width: '100vw', height: '100vh', position: 'relative' }}>
        
        {/* โลโก้เกมมุมซ้ายบน */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', top: '20px', left: '20px', padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: '15px'
        }}>
          <span style={{ fontSize: '2.5rem' }}>🏆</span>
          <div style={{ lineHeight: '1.1' }}>
            <div style={{ color: '#009688', fontSize: '1.4rem', fontWeight: 'bold' }}>PENALTY</div>
            <div style={{ color: '#E53935', fontSize: '1.4rem', fontWeight: 'bold' }}>SHOOTOUT</div>
          </div>
        </div>

        {/* ป้ายแสดงคะแนนตรงกลาง */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: '40px', alignItems: 'center', padding: '12px 40px',
          fontSize: '1.5rem', width: 'auto', whiteSpace: 'nowrap'
        }}>
          <div style={{ color: '#00BCD4', fontWeight: 'bold' }}>YOU: {pScore}</div>
          <div style={{ color: '#5D4037', fontSize: '1.2rem' }}>Round {round} (First to {WIN_SCORE})</div>
          <div style={{ color: '#E53935', fontWeight: 'bold', textTransform: 'uppercase' }}>{npc?.name || 'RIVAL'}: {nScore}</div>
        </div>

        {/* เป้าหมายเกมมุมขวาบน */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', top: '20px', right: '20px', padding: '10px 20px',
          display: 'flex', alignItems: 'center', gap: '15px'
        }}>
          <span style={{ fontSize: '2.5rem' }}>⚽</span>
          <div style={{ lineHeight: '1.1' }}>
            <div style={{ color: '#5D4037', fontSize: '1.2rem', fontWeight: 'bold' }}>ROUND GOAL</div>
            <div style={{ color: '#009688', fontSize: '1rem' }}>First to {WIN_SCORE}</div>
          </div>
        </div>

        {/* วิธีการเล่น (HOW TO PLAY) ด้านซ้าย */}
        <div style={{
          ...uiBoxStyle,
          position: 'absolute', top: '50%', left: '20px', transform: 'translateY(-50%)',
          padding: '20px', width: '220px'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '20px', fontWeight: 'bold', fontSize: '1.2rem' }}>HOW TO PLAY</div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', marginBottom: '20px' }}>
             <span style={{ fontSize: '2.5rem' }}>⌨️</span>
             <span style={{ fontSize: '0.9rem', lineHeight: '1.3', color: '#555' }}>Choose your<br/>shot direction!</span>
          </div>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
             <span style={{ fontSize: '2.5rem' }}>🖱️</span>
             <span style={{ fontSize: '0.9rem', lineHeight: '1.3', color: '#555' }}>Click to shoot<br/>the ball!</span>
          </div>
        </div>

        {/* หน้าจอให้เลือกบทบาท คนเตะ หรือ ผู้รักษาประตู */}
        {gameState === 'selectRole' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--color-surface)', padding: '40px', border: '4px solid var(--color-accent)',
            borderRadius: '16px', textAlign: 'center', boxShadow: 'var(--shadow-md)', pointerEvents: 'auto'
          }}>
            <h2 style={{ fontFamily: 'var(--font-header)', fontSize: '2rem', marginBottom: '20px' }}>
              Choose Your Role
            </h2>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button className="btn-primary" onClick={() => selectRole('kicker')}>
                👟 Kicker
              </button>
              <button className="btn-secondary" onClick={() => selectRole('goalie')}>
                🧤 Goalkeeper
              </button>
            </div>
          </div>
        )}

        {/* หน้าจอรอรับคำสั่ง (ทิศทางการเตะ/การพุ่งตัวเซฟ) */}
        {gameState === 'waitInput' && (
          <div style={{
            position: 'absolute', bottom: '15vh', left: '50%', transform: 'translateX(-50%)',
            textAlign: 'center', pointerEvents: 'auto'
          }}>
            <div style={{ 
              fontFamily: 'var(--font-header)', fontSize: '2rem', marginBottom: '20px',
              color: '#FFF', textShadow: '0 4px 0 #333, 2px 2px 0 #333, -2px -2px 0 #333'
            }}>
              {playerRole === 'kicker' ? 'Choose Shot Direction!' : 'Choose Dive Direction!'}
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <button onClick={() => handleChoice('left')} style={{
                background: '#E74C3C', border: '4px solid #C0392B', color: '#FFF', borderRadius: '16px',
                padding: '15px 30px', fontSize: '1.5rem', fontFamily: 'var(--font-header)', display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 6px 0 #C0392B', cursor: 'pointer'
              }}>⬅️ LEFT</button>
              
              <button onClick={() => handleChoice('center')} style={{
                background: '#2ECC71', border: '4px solid #27AE60', color: '#FFF', borderRadius: '16px',
                padding: '15px 30px', fontSize: '1.5rem', fontFamily: 'var(--font-header)', display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 6px 0 #27AE60', cursor: 'pointer'
              }}>🎯 CENTER</button>

              <button onClick={() => handleChoice('right')} style={{
                background: '#3498DB', border: '4px solid #2980B9', color: '#FFF', borderRadius: '16px',
                padding: '15px 30px', fontSize: '1.5rem', fontFamily: 'var(--font-header)', display: 'flex', alignItems: 'center', gap: '10px',
                boxShadow: '0 6px 0 #2980B9', cursor: 'pointer'
              }}>➡️ RIGHT</button>
            </div>
          </div>
        )}

        {/* ข้อความแจ้งผล (GOAL/SAVED) */}
        {gameState === 'result' && (
          <div style={{
            position: 'absolute', top: '40vh', left: '50%', transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-header)', fontSize: '4rem', color: isGoal.current ? '#4CAF50' : '#E53935',
            textShadow: '2px 2px 0 #FFF, -2px -2px 0 #FFF, 2px -2px 0 #FFF, -2px 2px 0 #FFF',
            animation: 'bounceIn 0.5s ease-out'
          }}>
            {feedback}
          </div>
        )}

        {/* หน้าจอจบเกม */}
        {gameState === 'gameOver' && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
            background: 'var(--color-surface)', padding: '30px 50px', border: '4px solid var(--color-accent)',
            borderRadius: '16px', textAlign: 'center', fontFamily: 'var(--font-header)', boxShadow: 'var(--shadow-md)'
          }}>
            <div style={{ fontSize: '3rem', color: pScore >= WIN_SCORE ? '#4CAF50' : '#E53935', marginBottom: '10px' }}>
              {pScore >= WIN_SCORE ? 'YOU WIN!' : `${npc?.name?.toUpperCase() || 'RIVAL'} WINS!`}
            </div>
          </div>
        )}
      </Html>
    </group>
  );
}
