export default function GameResult({ result, onClose }) {
  const emoji = result.score > 50 ? '👑' : result.score > 20 ? '👏' : '💪';
  const message = result.score > 50 ? 'WINNER!' : result.score > 20 ? 'Good Job!' : 'Keep Trying!';

  return (
    <>
      <div className="game-result__backdrop" onClick={onClose} />
      <div className="game-result cozy-panel">
        <div className="cozy-header">
          <span>Match Result</span>
          <button className="cozy-close-btn" onClick={onClose}>✕</button>
        </div>
        <div className="game-result__body">
          <div className="game-result__emoji">{emoji}</div>
          <div className="game-result__title">{message}</div>
          <div className="game-result__score">{result.score}</div>
          <div className="game-result__label">XP Earned</div>
          <div style={{ fontSize: '1rem', color: 'var(--color-text-light)', marginBottom: '24px', fontWeight: 'bold' }}>
            Total Score: <strong style={{ color: 'var(--color-button-primary)' }}>{result.totalScore}</strong>
          </div>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn-secondary" onClick={onClose}>
              Back to Office
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
