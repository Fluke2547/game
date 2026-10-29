import { useState, useRef, useEffect } from 'react';
import { MINI_GAMES } from '../data/gameData';

export default function NPCPopup({ npc, onSelectGame, onClose }) {
  const [tab, setTab] = useState('chat');
  const [chatHistory, setChatHistory] = useState([
    { sender: npc.name, message: npc.greeting }
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatEndRef = useRef(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, tab]);

  const primaryGame = npc.game;
  const games = Object.values(MINI_GAMES);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue.trim();
    setChatHistory(prev => [...prev, { sender: 'You', message: userMsg }]);
    setInputValue("");
    
    // Fake NPC reply
    setTimeout(() => {
      const replies = [
        "ตอนนี้ฉันยุ่งอยู่นิดหน่อยนะ",
        "ฮ่าๆ น่าสนใจดีนะ",
        "ไว้ค่อยคุยกันได้ไหม ขอปั่นงานก่อน",
        "เรามาเล่นมินิเกมกันดีกว่าไหม?",
        "อืมม เข้าใจแล้วล่ะ",
        "ฉันเห็นด้วย!",
        "เดี๋ยวตอนพักเที่ยงค่อยว่ากันนะ",
        "คุณนี่ตลกดีนะเนี่ย"
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      setChatHistory(prev => [...prev, { sender: npc.name, message: reply }]);
    }, 1000);
  };

  return (
    <>
      <div className="npc-popup__backdrop" onClick={onClose} />
      <div className="npc-popup cozy-panel">
        <div className="cozy-header">
          <span>Talk with {npc.name}</span>
          <button className="cozy-close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="npc-popup__body">
          <div className="npc-popup__tabs">
            <button className={`tab-btn ${tab === 'chat' ? 'active' : ''}`} onClick={() => setTab('chat')}>💬 แชท</button>
            <button className={`tab-btn ${tab === 'games' ? 'active' : ''}`} onClick={() => setTab('games')}>🎮 มินิเกม</button>
          </div>

          {tab === 'chat' && (
            <div className="npc-popup__chat">
              <div className="chat-history">
                {chatHistory.map((msg, idx) => (
                  <div key={idx} className={`chat-bubble ${msg.sender === 'You' ? 'sent' : 'received'}`}>
                    <strong>{msg.sender}:</strong> {msg.message}
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form className="chat-input-form" onSubmit={handleSendMessage}>
                <input 
                  value={inputValue} 
                  onChange={e => setInputValue(e.target.value)} 
                  placeholder="พิมพ์ข้อความที่นี่..." 
                />
                <button type="submit">ส่ง</button>
              </form>
            </div>
          )}

          {tab === 'games' && (
            <div className="npc-popup__games">
              {games.map((game) => (
                <button
                  key={game.id}
                  className={`npc-popup__game-btn ${game.id === primaryGame ? 'selected' : ''}`}
                  onClick={() => onSelectGame(game.id)}
                >
                  <span className="emoji">{game.emoji}</span>
                  <div>
                    <div className="npc-popup__game-title">{game.name}</div>
                    <div className="npc-popup__game-desc">
                      {game.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
