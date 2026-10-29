import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useGameStore } from "../store/gameStore";
import VoxelPlayerModel from "./3d/VoxelPlayerModel";
import officeBg from "../assets/character-creator-office-bg.png";

const DEFAULT_CUSTOM = {
  gender: "male",
  skinTone: "#f7d4ab",
  hairStyle: "short",
  hairColor: "#3b2419",
  shirtColor: "#36beb4",
  pantsColor: "#12345a",
  shoeColor: "#161719",
  faceStyle: "calm",
  accessory: "none",
};

const SKIN_TONES = [
  "#f7d4ab",
  "#efc08f",
  "#e4a05c",
  "#d4813f",
  "#a95b25",
  "#743714",
];

const HAIR_OPTIONS = [
  { id: "brown", style: "short", color: "#3b2419" },
  { id: "copper", style: "short", color: "#7c3d12" },
  { id: "blonde", style: "short", color: "#cda247" },
  { id: "gray", style: "short", color: "#6f706c" },
  { id: "red", style: "short", color: "#b51618" },
  { id: "white", style: "short", color: "#ffffff" },

  { id: "brown", style: "long", color: "#3b2419" },
  { id: "copper", style: "long", color: "#7c3d12" },
  { id: "blonde", style: "long", color: "#cda247" },
  { id: "gray", style: "long", color: "#6f706c" },
  { id: "red", style: "long", color: "#b51618" },
  { id: "white", style: "long", color: "#ffffff" },
];

const FACE_OPTIONS = [
  { id: "calm", label: "นิ่ง" },
  { id: "happy", label: "ยิ้ม" },
  { id: "sharp", label: "เท่" },
];

const SHIRT_OPTIONS = [
  { id: "teal", color: "#36beb4" },
  { id: "blue", color: "#2369b5" },
  { id: "red", color: "#b71618" },
  { id: "yellow", color: "#d3a824" },
  { id: "black", color: "#22252a" },
  { id: "white", color: "#ffffff" },
  { id: "pink", color: "#e84393" },
  { id: "purple", color: "#9b59b6" },
];

const PANTS_OPTIONS = [
  { id: "teal", color: "#36beb4" },
  { id: "blue", color: "#2369b5" },
  { id: "red", color: "#b71618" },
  { id: "yellow", color: "#d3a824" },
  { id: "black", color: "#22252a" },
  { id: "white", color: "#ffffff" },
  { id: "pink", color: "#e84393" },
  { id: "purple", color: "#9b59b6" },
];

const SHOE_OPTIONS = [
  { id: "black", color: "#161719" },
  { id: "blue", color: "#1557a2" },
  { id: "brown", color: "#482616" },
  { id: "red", color: "#b32622" },
  { id: "white", color: "#eeeae3" },
];

const CATEGORIES = [
  { id: "body", label: "รูปร่าง", icon: "person" },
  { id: "hair", label: "ทรงผม", icon: "hair" },
  { id: "face", label: "ใบหน้า", icon: "face" },
  { id: "clothes", label: "เสื้อ", icon: "shirt" },
  { id: "pants", label: "กางเกง", icon: "person" },
  { id: "shoes", label: "รองเท้า", icon: "shoes" },
];

function CategoryIcon({ type }) {
  return (
    <span
      className={`creator-category-icon creator-category-icon--${type}`}
      aria-hidden="true"
    />
  );
}

function PersonIcon() {
  return <span className="cc-person-icon" aria-hidden="true" />;
}

function CharacterPreview3D({ custom }) {
  return (
    <>
      <ambientLight intensity={0.86} />
      <directionalLight position={[3, 5, 5]} intensity={1.22} castShadow />
      <pointLight
        position={[-2.2, 2.2, 2.5]}
        intensity={0.75}
        color="#fff1d2"
      />
      <VoxelPlayerModel custom={custom} />
      <mesh
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <circleGeometry args={[1.08, 40]} />
        <meshBasicMaterial color="#4c3326" transparent opacity={0.14} />
      </mesh>
    </>
  );
}

function HairThumb({ option, custom }) {
  return (
    <span
      className={`hair-thumb hair-thumb--${option.style}`}
      style={{ "--skin": custom.skinTone, "--hair": option.color }}
    >
      <span className="hair-thumb__face" />
      <span className="hair-thumb__back" />
      <span />
      <span className="hair-thumb__eye hair-thumb__eye--left" />
      <span className="hair-thumb__eye hair-thumb__eye--right" />
      <span className="hair-thumb__mouth" />
    </span>
  );
}

function OutfitThumb({ option, custom }) {
  return (
    <span
      className="outfit-thumb"
      style={{
        "--skin": custom.skinTone,
        "--hair": custom.hairColor,
        "--shirt": option.shirt,
        "--pants": option.pants,
      }}
    >
      <span />
    </span>
  );
}

function ShoeThumb({ option }) {
  return <span className="shoe-thumb" style={{ "--shoes": option.color }} />;
}

export default function CharacterCreator({ onComplete }) {
  const { playerCustomization, setPlayerCustomization, startGame } =
    useGameStore();
  const [name, setName] = useState("");
  const [activeCategory, setActiveCategory] = useState("body");

  const custom = {
    ...DEFAULT_CUSTOM,
    ...playerCustomization,
  };

  const updateCustom = (updates) => {
    setPlayerCustomization(updates);
  };

  const randomize = () => {
    const hair = HAIR_OPTIONS[Math.floor(Math.random() * HAIR_OPTIONS.length)];
    const shirt =
      SHIRT_OPTIONS[Math.floor(Math.random() * SHIRT_OPTIONS.length)];
    const pants =
      PANTS_OPTIONS[Math.floor(Math.random() * PANTS_OPTIONS.length)];
    const shoes = SHOE_OPTIONS[Math.floor(Math.random() * SHOE_OPTIONS.length)];
    const face = FACE_OPTIONS[Math.floor(Math.random() * FACE_OPTIONS.length)];

    updateCustom({
      skinTone: SKIN_TONES[Math.floor(Math.random() * SKIN_TONES.length)],
      hairStyle: hair.style,
      hairColor: hair.color,
      shirtColor: shirt.color,
      pantsColor: pants.color,
      shoeColor: shoes.color,
      faceStyle: face.id,
      accessory: "none",
    });
  };

  const handleStart = () => {
    startGame(name.trim() || "พนักงานใหม่");
    onComplete?.();
  };

  return (
    <main className="character-creator" aria-label="สร้างตัวละคร">
      <img
        className="creator-bg-image"
        src={officeBg}
        alt=""
        aria-hidden="true"
      />
      <div className="creator-bg-soften" aria-hidden="true" />

      <section className="creator-left" aria-label="ข้อมูลตัวละคร">
        <header className="creator-heading">
          <h1>สร้างตัวละคร</h1>
          <p>เริ่มต้นชีวิตออฟฟิศของคุณ</p>
        </header>

        <div className="cc-panel gender-panel">
          <h2>เพศ</h2>
          <button
            type="button"
            className={`gender-choice gender-choice--male ${custom.gender === "male" ? "is-active" : ""}`}
            onClick={() => updateCustom({ gender: "male", hairStyle: "short" })}
          >
            <PersonIcon />
            ชาย
          </button>
          <button
            type="button"
            className={`gender-choice gender-choice--female ${custom.gender === "female" ? "is-active" : ""}`}
            onClick={() =>
              updateCustom({ gender: "female", hairStyle: "long" })
            }
          >
            <PersonIcon />
            หญิง
          </button>
        </div>
      </section>

      <section className="creator-character" aria-label="พรีวิวตัวละคร 3D">
        <div className="creator-pedestal">
          <Canvas
            shadows
            camera={{ position: [0, 1.05, 4.8], fov: 31 }}
            gl={{ alpha: true, antialias: true }}
          >
            <CharacterPreview3D custom={custom} />
            <OrbitControls
              enablePan={false}
              minDistance={4.15}
              maxDistance={6.25}
              minPolarAngle={Math.PI / 3.15}
              maxPolarAngle={Math.PI / 2.06}
              target={[0, 1.05, 0]}
            />
          </Canvas>
        </div>
      </section>

      <section className="creator-right" aria-label="ปรับแต่งตัวละคร">
        <div className="customizer-shell">
          <nav className="creator-category-tabs" aria-label="หมวดปรับแต่ง">
            {CATEGORIES.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`creator-category-tab ${activeCategory === category.id ? "is-active" : ""}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <CategoryIcon type={category.icon} />
                <span>{category.label}</span>
              </button>
            ))}
          </nav>

          <div className="customizer-content">
            {activeCategory === "body" && (
              <section className="option-band">
                <h2>โทนผิว</h2>
                <div className="skin-row">
                  {SKIN_TONES.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`skin-swatch ${custom.skinTone === color ? "is-active" : ""}`}
                      style={{ "--swatch": color }}
                      aria-label={`เลือกโทนผิว ${color}`}
                      onClick={() => updateCustom({ skinTone: color })}
                    />
                  ))}
                </div>
              </section>
            )}

            {activeCategory === "hair" && (
              <section className="option-band">
                <h2>ทรงผม</h2>
                <div className="choice-grid">
                  {HAIR_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`preview-choice ${custom.hairStyle === option.style && custom.hairColor === option.color ? "is-active" : ""}`}
                      aria-label={`เลือกทรงผม ${option.id}`}
                      onClick={() =>
                        updateCustom({
                          hairStyle: option.style,
                          hairColor: option.color,
                        })
                      }
                    >
                      <HairThumb option={option} custom={custom} />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeCategory === "face" && (
              <section className="option-band">
                <h2>ใบหน้า</h2>
                <div className="face-row">
                  {FACE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`text-choice ${custom.faceStyle === option.id ? "is-active" : ""}`}
                      onClick={() => updateCustom({ faceStyle: option.id })}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeCategory === "clothes" && (
              <section className="option-band">
                <h2>สีเสื้อ</h2>
                <div className="choice-grid">
                  {SHIRT_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`preview-choice ${custom.shirtColor === option.color ? "is-active" : ""}`}
                      aria-label={`เลือกสีเสื้อ ${option.id}`}
                      onClick={() => updateCustom({ shirtColor: option.color })}
                    >
                      <OutfitThumb
                        custom={custom}
                        option={{
                          shirt: option.color,
                          pants: custom.pantsColor,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeCategory === "pants" && (
              <section className="option-band">
                <h2>สีกางเกง</h2>
                <div className="choice-grid">
                  {PANTS_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`preview-choice ${custom.pantsColor === option.color ? "is-active" : ""}`}
                      aria-label={`เลือกสีกางเกง ${option.id}`}
                      onClick={() => updateCustom({ pantsColor: option.color })}
                    >
                      <OutfitThumb
                        custom={custom}
                        option={{
                          shirt: custom.shirtColor,
                          pants: option.color,
                        }}
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {activeCategory === "shoes" && (
              <section className="option-band">
                <h2>รองเท้า</h2>
                <div className="shoe-row">
                  {SHOE_OPTIONS.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={`preview-choice shoe-choice ${custom.shoeColor === option.color ? "is-active" : ""}`}
                      aria-label={`เลือกรองเท้า ${option.id}`}
                      onClick={() => updateCustom({ shoeColor: option.color })}
                    >
                      <ShoeThumb option={option} />
                    </button>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </section>

      <section className="creator-bottom" aria-label="เริ่มเกม">
        <label className="name-panel">
          <span>ชื่อของคุณ</span>
          <div className="name-input-row">
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={12}
              placeholder="กรอกชื่อของคุณ..."
            />
            <span className="pencil-icon" aria-hidden="true" />
          </div>
        </label>

        <button
          type="button"
          className="cc-button random-button"
          onClick={randomize}
        >
          <span aria-hidden="true">❖</span>
          สุ่ม
        </button>

        <button
          type="button"
          className="start-game-button"
          onClick={handleStart}
        >
          <span aria-hidden="true">✦</span>
          เริ่มเกม
          <span aria-hidden="true">✦</span>
        </button>
      </section>
    </main>
  );
}
