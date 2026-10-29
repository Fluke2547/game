import { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';

/**
 * CityBackground - Hybrid Procedural City with Grid Layout
 */
export default function CityBackground() {
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const { buildings, windows, roofProps, streetProps } = useMemo(() => {
    const bList = [];
    const wList = [];
    const rList = [];
    const sList = [];

    // City colors (Deep Purples, Blues, Oranges for Sunset Vibe)
    const palette = [
      '#2E1B4E', '#3D246C', '#4A235A', // Deep Purples
      '#283556', '#1E4471', '#154360', // Deep Blues
      '#B05B3B', '#D35400', '#E67E22', // Oranges/Browns
      '#4A6B82', '#6C7A89',            // Muted Blue/Gray
      '#8E44AD', '#9B59B6', '#C39BD3'  // Lighter purples
    ];
    const neonColors = ['#ff0055', '#00ffcc', '#ffff00', '#cc00ff'];
    const treeColors = ['#27AE60', '#F1C40F', '#E67E22', '#D35400', '#2ECC71']; // Autumn + Green
    const carColors = ['#F1C40F', '#F1C40F', '#F1C40F', '#E74C3C', '#3498DB', '#34495E']; // Many yellow taxis!

    const gridSize = 16;
    
    // Grid base city layout
    for (let r = -15; r <= 15; r++) {
      for (let c = -15; c <= 15; c++) {
        // Skip the center block where the office sits
        if (Math.abs(c) <= 2 && Math.abs(r) <= 1) continue;
        
        const x = c * gridSize;
        const z = r * gridSize;
        const dist = Math.sqrt(x*x + z*z);
        const isNear = dist < 80;

        // ฟุตบาท (Sidewalks)
        rList.push({ type: 'sidewalk', pos: [x, 0.25, z], size: [12, 0.5, 12], color: '#E5E7E9' });

        // บางบล็อคอาจจะไม่มีตึก ปล่อยเป็นสวนสาธารณะเล็กๆ
        if (Math.random() < 0.1 && isNear) {
           sList.push({ type: 'tree', pos: [x, 0.5, z], color: treeColors[Math.floor(Math.random() * treeColors.length)] });
           sList.push({ type: 'tree', pos: [x+3, 0.5, z+3], color: treeColors[Math.floor(Math.random() * treeColors.length)] });
           sList.push({ type: 'tree', pos: [x-3, 0.5, z-3], color: treeColors[Math.floor(Math.random() * treeColors.length)] });
           continue;
        }

        const w = 6 + Math.random() * 4;
        const d = 6 + Math.random() * 4;
        const h = 10 + Math.random() * (isNear ? 50 : 100); 
        const color = palette[Math.floor(Math.random() * palette.length)];
        
        // 1. กล่องตึกหลัก
        bList.push({ id: `${r}-${c}`, pos: [x, h / 2 + 0.5, z], size: [w, h, d], color });
        
        // 1.5 ขอบหลังคาตึก (Roof Rim)
        rList.push({ type: 'roof', pos: [x, h + 0.75, z], size: [w - 0.2, 0.5, d - 0.2], color: '#BDC3C7' });

        // 2. ดาดฟ้า (Roof Details)
        if (dist < 100) {
          if (Math.random() > 0.7) {
            rList.push({ type: 'antenna', pos: [x, h + 1, z] });
          } else if (Math.random() > 0.6) {
            rList.push({ type: 'watertank', pos: [x + w/4, h + 1.5, z - d/4] });
          }
          
          if (Math.random() > 0.4) {
            rList.push({ type: 'ac', pos: [x - w/4, h + 0.5, z + d/4] });
          }
          if (Math.random() > 0.5) {
            rList.push({ type: 'ac', pos: [x, h + 0.5, z - d/4] });
          }
          
          if (isNear && Math.random() > 0.8) {
             const neon = neonColors[Math.floor(Math.random() * neonColors.length)];
             rList.push({ type: 'billboard', pos: [x, h + 2.5, z + d/2 + 0.1], color: neon });
          }
        }

        // 3. หน้าต่างไฟ (Instanced Windows - สร้างทั้ง 4 ด้านของตึก)
        if (true) { // นำเงื่อนไขระยะ (dist < 120) ออกเพื่อให้สร้างหน้าต่างกับทุกตึก
          const rows = Math.floor(h / 3);
          const colsX = Math.floor(w / 2);
          const colsZ = Math.floor(d / 2);
          const windowChance = isNear ? 0.4 : 0.2; // เพิ่มโอกาสการเกิดหน้าต่างให้สว่างเยอะขึ้นเล็กน้อย
          
          for (let row = 1; row < rows; row++) {
            // ด้านหน้าและหลัง (Front & Back)
            for (let col = 0; col < colsX; col++) {
              if (Math.random() < windowChance) {
                // Front
                wList.push({ x: x + (col - colsX/2 + 0.5)*2, y: row*2.5 + 0.5, z: z + d/2 + 0.05, ry: 0 });
              }
              if (Math.random() < windowChance) {
                // Back
                wList.push({ x: x + (col - colsX/2 + 0.5)*2, y: row*2.5 + 0.5, z: z - d/2 - 0.05, ry: Math.PI });
              }
            }
            // ด้านซ้ายและขวา (Left & Right)
            for (let col = 0; col < colsZ; col++) {
              if (Math.random() < windowChance) {
                // Right
                wList.push({ x: x + w/2 + 0.05, y: row*2.5 + 0.5, z: z + (col - colsZ/2 + 0.5)*2, ry: Math.PI/2 });
              }
              if (Math.random() < windowChance) {
                // Left
                wList.push({ x: x - w/2 - 0.05, y: row*2.5 + 0.5, z: z + (col - colsZ/2 + 0.5)*2, ry: -Math.PI/2 });
              }
            }
          }
        }

        // 4. พร็อพตามพื้นถนน (Street Props & Cars)
        if (isNear) {
           // Trees at corners
           if (Math.random() > 0.4) sList.push({ type: 'tree', pos: [x + 5.5, 0.5, z + 5.5], color: treeColors[Math.floor(Math.random() * treeColors.length)] });
           if (Math.random() > 0.4) sList.push({ type: 'tree', pos: [x - 5.5, 0.5, z - 5.5], color: treeColors[Math.floor(Math.random() * treeColors.length)] });
           
           // Streetlights
           if (Math.random() > 0.3) sList.push({ type: 'streetlight', pos: [x + 5.8, 0, z - 5.8] });
           if (Math.random() > 0.3) sList.push({ type: 'streetlight', pos: [x - 5.8, 0, z + 5.8] });

           // Cars on the road
           if (Math.random() < 0.6) {
              const isHorizontal = Math.random() > 0.5;
              const cx = isHorizontal ? x + (Math.random() * 12 - 6) : x + 8 + (Math.random() > 0.5 ? 1 : -1);
              const cz = isHorizontal ? z + 8 + (Math.random() > 0.5 ? 1 : -1) : z + (Math.random() * 12 - 6);
              sList.push({ type: 'car', pos: [cx, 0.3, cz], color: carColors[Math.floor(Math.random() * carColors.length)], rot: isHorizontal ? 0 : Math.PI/2 });
           }

           // Crosswalks at intersections
           sList.push({ type: 'crosswalk', pos: [x + 8, 0.02, z + 8] });
        }
      }
    }
    
    // Export for collision detection
    window.CITY_BUILDINGS = bList;
    return { buildings: bList, windows: wList, roofProps: rList, streetProps: sList };
  }, []);

  // InstancedMesh Ref สำหรับหน้าต่าง
  const windowMeshRef = useRef();
  
  useEffect(() => {
    if (windowMeshRef.current) {
      windows.forEach((win, i) => {
        dummy.position.set(win.x, win.y, win.z);
        dummy.rotation.set(0, win.ry, 0);
        dummy.scale.set(1, 1, 1);
        dummy.updateMatrix();
        windowMeshRef.current.setMatrixAt(i, dummy.matrix);
      });
      windowMeshRef.current.instanceMatrix.needsUpdate = true;
    }
  }, [windows, dummy]);

  return (
    // ย้ายเมืองทั้งหมดลงไปอยู่ใต้ระดับออฟฟิศ
    <group position={[0, -45, 0]}>
      
      {/* ☀️ เพิ่มแสงสว่างให้ตัวเมือง (Global City Lighting) */}
      <ambientLight intensity={1.0} color="#ffffff" />
      <directionalLight position={[100, 150, -50]} intensity={1.5} color="#FDFEFE" castShadow />

      {/* Ground (พื้นเมืองสีถนนราดยางเข้ม) */}
      <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[600, 600]} />
        <meshLambertMaterial color="#1B2631" />
      </mesh>

      {/* ถนน (Road Lines) */}
      {/* เส้นถนนแนวนอน */}
      {[...Array(30)].map((_, i) => (
        <mesh key={`h-${i}`} position={[0, 0.05, (i - 15) * 16 + 8]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[600, 0.5]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      {/* เส้นถนนแนวตั้ง */}
      {[...Array(30)].map((_, i) => (
        <mesh key={`v-${i}`} position={[(i - 15) * 16 + 8, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.5, 600]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}

      {/* 1. Procedural City Buildings */}
      {buildings.map((b) => (
        <mesh key={`b-${b.id}`} position={b.pos} castShadow receiveShadow>
          <boxGeometry args={b.size} />
          <meshLambertMaterial color={b.color} />
        </mesh>
      ))}

      {/* 2. Window Instances */}
      {windows.length > 0 && (
        <instancedMesh ref={windowMeshRef} args={[null, null, windows.length]} frustumCulled={false}>
          <boxGeometry args={[0.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#FFF9C4" emissive="#FFB74D" emissiveIntensity={2.5} />
        </instancedMesh>
      )}

      {/* 3. Roof Details & Sidewalks */}
      {roofProps.map((prop, idx) => {
        if (prop.type === 'sidewalk') {
          return (
            <mesh key={`sw-${idx}`} position={prop.pos} receiveShadow>
              <boxGeometry args={prop.size} />
              <meshLambertMaterial color={prop.color} />
            </mesh>
          );
        }
        if (prop.type === 'roof') {
          return (
            <mesh key={`roof-${idx}`} position={prop.pos}>
              <boxGeometry args={prop.size} />
              <meshLambertMaterial color={prop.color} />
            </mesh>
          );
        }
        if (prop.type === 'antenna') {
          return (
            <group key={`roof-${idx}`} position={prop.pos}>
              <mesh position={[0, 1.5, 0]}><cylinderGeometry args={[0.05, 0.05, 3]} /><meshLambertMaterial color="#7f8c8d" /></mesh>
              <mesh position={[0, 3, 0]}><sphereGeometry args={[0.15]} /><meshLambertMaterial color="#e74c3c" emissive="#e74c3c" emissiveIntensity={2} /></mesh>
            </group>
          );
        }
        if (prop.type === 'watertank') {
          return (
            <group key={`roof-${idx}`} position={prop.pos}>
              {/* ตัวถัง */}
              <mesh position={[0, 0, 0]}><cylinderGeometry args={[1.5, 1.5, 2]} /><meshLambertMaterial color="#8B4513" /></mesh>
              {/* หลังคาทรงกรวย */}
              <mesh position={[0, 1.5, 0]}><coneGeometry args={[1.6, 1, 8]} /><meshLambertMaterial color="#3E2723" /></mesh>
            </group>
          );
        }
        if (prop.type === 'billboard') {
          return (
            <mesh key={`roof-${idx}`} position={prop.pos}>
              <boxGeometry args={[4, 2, 0.2]} />
              <meshStandardMaterial color={prop.color} emissive={prop.color} emissiveIntensity={2.5} />
            </mesh>
          );
        }
        if (prop.type === 'ac') {
          return (
            <group key={`roof-${idx}`} position={prop.pos}>
              <mesh><boxGeometry args={[1.5, 1, 1.5]} /><meshLambertMaterial color="#95A5A6" /></mesh>
              <mesh position={[0, 0.51, 0]} rotation={[-Math.PI/2, 0, 0]}><circleGeometry args={[0.5, 16]} /><meshBasicMaterial color="#2C3E50" /></mesh>
            </group>
          );
        }
        return null;
      })}

      {/* 4. Small Props Placeholders (Trees) */}
       {streetProps.map((prop, idx) => {
         if (prop.type === 'tree') {
           return (
             <group key={`street-${idx}`} position={prop.pos}>
               <mesh position={[0, 0.5, 0]}><boxGeometry args={[0.3, 1, 0.3]} /><meshLambertMaterial color="#5D4037" /></mesh>
               <mesh position={[0, 1.5, 0]}><boxGeometry args={[1.5, 1.5, 1.5]} /><meshLambertMaterial color={prop.color} /></mesh>
             </group>
           );
         }
         if (prop.type === 'streetlight') {
           return (
             <group key={`street-${idx}`} position={prop.pos}>
               <mesh position={[0, 2, 0]}><cylinderGeometry args={[0.05, 0.1, 4]} /><meshLambertMaterial color="#34495E" /></mesh>
               <mesh position={[0.3, 4, 0]} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.05, 0.05, 0.6]} /><meshLambertMaterial color="#34495E" /></mesh>
               <mesh position={[0.6, 3.9, 0]}><sphereGeometry args={[0.2]} /><meshStandardMaterial color="#FFE082" emissive="#FFB300" emissiveIntensity={3} /></mesh>
             </group>
           );
         }
         if (prop.type === 'car') {
           return (
             <group key={`street-${idx}`} position={prop.pos} rotation={[0, prop.rot, 0]}>
               {/* Car Body */}
               <mesh position={[0, 0.3, 0]} castShadow><boxGeometry args={[2.2, 0.6, 1.2]} /><meshLambertMaterial color={prop.color} /></mesh>
               {/* Car Cabin */}
               <mesh position={[0, 0.7, 0]} castShadow><boxGeometry args={[1.2, 0.5, 1.0]} /><meshLambertMaterial color="#ECF0F1" /></mesh>
               {/* Wheels */}
               <mesh position={[0.7, 0.1, 0.6]}><boxGeometry args={[0.4, 0.4, 0.1]} /><meshBasicMaterial color="#111" /></mesh>
               <mesh position={[-0.7, 0.1, 0.6]}><boxGeometry args={[0.4, 0.4, 0.1]} /><meshBasicMaterial color="#111" /></mesh>
               <mesh position={[0.7, 0.1, -0.6]}><boxGeometry args={[0.4, 0.4, 0.1]} /><meshBasicMaterial color="#111" /></mesh>
               <mesh position={[-0.7, 0.1, -0.6]}><boxGeometry args={[0.4, 0.4, 0.1]} /><meshBasicMaterial color="#111" /></mesh>
             </group>
           );
         }
         if (prop.type === 'crosswalk') {
           return (
             <group key={`street-${idx}`} position={prop.pos}>
               {/* Zebra stripes */}
               {[-2, -1, 0, 1, 2].map(i => (
                 <mesh key={`cw1-${i}`} position={[i * 0.8, 0, 0]} rotation={[-Math.PI/2, 0, 0]}>
                   <planeGeometry args={[0.4, 4]} />
                   <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} />
                 </mesh>
               ))}
               {[-2, -1, 0, 1, 2].map(i => (
                 <mesh key={`cw2-${i}`} position={[0, 0, i * 0.8]} rotation={[-Math.PI/2, 0, Math.PI/2]}>
                   <planeGeometry args={[0.4, 4]} />
                   <meshBasicMaterial color="#FFFFFF" transparent opacity={0.7} />
                 </mesh>
               ))}
             </group>
           );
         }
         return null;
      })}
    </group>
  );
}
