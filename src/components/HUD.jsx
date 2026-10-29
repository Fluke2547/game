import { useGameStore } from "../store/gameStore";

export default function HUD({ playerName, totalScore }) {
  const { atmosphere, setAtmosphere } = useGameStore();

  const atmospheres = [
    { id: "morning", label: "Morning", icon: "🌅" },
    { id: "noon", label: "Noon", icon: "☀️" },
    { id: "evening", label: "Evening", icon: "🌇" },
    { id: "night", label: "Night", icon: "🌙" },
    { id: "rain", label: "Rain", icon: "🌧️" },
    { id: "snow", label: "Snow", icon: "❄️" },
    { id: "hot", label: "Hot", icon: "🔥" },
  ];

  return (
    <div className="hud">
      <div className="hud__player-info" style={{ marginBottom: "10px" }}>
        <div className="hud__avatar" />
        <div>
          <div className="hud__name">{playerName}</div>
          <div className="hud__score">
            คะแนนรวม: <span>{totalScore}</span>
          </div>
        </div>
      </div>

      {/* Beautiful Weather / Atmosphere Selector */}
      <div
        style={{
          pointerEvents: "auto",
          marginTop: "16px",
          padding: "12px",
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(10px)",
          borderRadius: "16px",
          boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
          border: "1px solid rgba(255,255,255,0.5)",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >
        <div
          style={{
            fontSize: "0.85rem",
            fontWeight: "bold",
            color: "var(--color-text)",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          🌍 สภาพอากาศ
        </div>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
          {atmospheres.map((a) => (
            <button
              key={a.id}
              onClick={() => setAtmosphere(a.id)}
              title={a.label}
              style={{
                background:
                  atmosphere === a.id
                    ? "var(--color-primary)"
                    : "rgba(255, 255, 255, 0.9)",
                color: atmosphere === a.id ? "#FFF" : "#333",
                border: atmosphere === a.id ? "none" : "1px solid #E0E0E0",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                boxShadow:
                  atmosphere === a.id
                    ? "0 4px 10px rgba(78, 205, 196, 0.4)"
                    : "none",
                transform: atmosphere === a.id ? "scale(1.1)" : "scale(1)",
              }}
              onMouseEnter={(e) => {
                if (atmosphere !== a.id)
                  e.currentTarget.style.transform = "scale(1.1)";
              }}
              onMouseLeave={(e) => {
                if (atmosphere !== a.id)
                  e.currentTarget.style.transform = "scale(1)";
              }}
            >
              {a.icon}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
