export default function InteractPrompt({ npcName }) {
  return (
    <div className="interact-prompt">
      กด <span className="key-hint">E</span> พูดคุยกับ {npcName}
    </div>
  );
}
