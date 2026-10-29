import { useState } from "react";

export default function StartScreen({ onStart }) {
  const [name, setName] = useState("");

  function handleStart() {
    const playerName = name.trim() || "Player";
    onStart(playerName);
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") handleStart();
  }

  return (
    <div className="start-screen">
      <h1 className="start-screen__title">COZY OFFICE</h1>
      <p className="start-screen__subtitle">MINI-GAMES</p>

      <div className="start-screen__input-group">
        <input
          className="start-screen__input"
          type="text"
          placeholder="ใส่ชื่อของคุณ..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={12}
          autoFocus
        />
        <button className="btn-primary" onClick={handleStart}>
          🎮 เริ่มเกม
        </button>
      </div>

      <div
        style={{
          marginTop: "2rem",
          display: "flex",
          gap: "2rem",
          fontSize: "0.85rem",
          color: "var(--color-text-light)",
        }}
      ></div>
    </div>
  );
}
