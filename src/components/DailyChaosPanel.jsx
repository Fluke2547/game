import { useGameStore } from '../store/gameStore';

export default function DailyChaosPanel() {
  const { dailyChaos, dailyChaosNotice, dismissDailyChaosNotice } = useGameStore();

  if (!dailyChaos) return null;

  const completedCount = dailyChaos.tasks.filter((task) => task.completed).length;

  return (
    <aside className="daily-chaos" aria-label="ภารกิจ Daily Office Chaos">
      <div className="daily-chaos__header">
        <span>⚡ Daily Office Chaos</span>
        <span className="daily-chaos__count">{completedCount}/{dailyChaos.tasks.length}</span>
      </div>
      <p className="daily-chaos__date">ภารกิจของวันนี้ · {dailyChaos.dateKey}</p>
      <ul className="daily-chaos__list">
        {dailyChaos.tasks.map((task) => (
          <li key={task.id} className={task.completed ? 'is-complete' : ''}>
            <span className="daily-chaos__emoji">{task.completed ? '✅' : task.emoji}</span>
            <span className="daily-chaos__task">
              <strong>{task.title}</strong>
              <small>{task.description}</small>
            </span>
            <span className="daily-chaos__reward">+{task.reward}</span>
          </li>
        ))}
      </ul>
      <div className="daily-chaos__bonus">
        {dailyChaos.bonusClaimed ? '🏆 โบนัสครบแล้ว' : `เคลียร์ครบ รับโบนัส +${40} XP`}
      </div>
      {dailyChaosNotice && (
        <button className="daily-chaos__notice" onClick={dismissDailyChaosNotice}>
          {dailyChaosNotice} <span aria-hidden="true">×</span>
        </button>
      )}
    </aside>
  );
}
