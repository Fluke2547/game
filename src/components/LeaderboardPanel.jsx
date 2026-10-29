import { useGameStore } from '../store/gameStore';

export default function LeaderboardPanel({ onClose }) {
  const { getLeaderboard } = useGameStore();
  const entries = getLeaderboard();

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <>
      <div className="leaderboard__backdrop" onClick={onClose} />
      <div className="leaderboard cozy-panel">
        <div className="cozy-header">
          <span>Weekly Leaderboard</span>
          <button className="cozy-close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="leaderboard__body">
          {entries.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--color-text-light)', padding: '20px' }}>
              ยังไม่มีคะแนน เล่นเกมเพื่อขึ้นอันดับ!
            </div>
          ) : (
            <ul className="leaderboard__list">
              {entries.map((entry, i) => (
                <li key={entry.name} className="leaderboard__item">
                  <span className="leaderboard__rank">
                    {medals[i] || `#${i + 1}`}
                  </span>
                  <span className="leaderboard__player-name">{entry.name}</span>
                  <span className="leaderboard__player-score">{entry.totalScore}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
