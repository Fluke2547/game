import { create } from 'zustand';

// LocalStorage helpers
const STORAGE_KEY = 'office-quest-data';

const DAILY_CHAOS_TASKS = [
  {
    id: 'standup',
    event: 'npc-chat',
    emoji: '🗣️',
    title: 'Stand-up ที่ยาวเกินกำหนด',
    description: 'คุยกับเพื่อนร่วมงาน 1 คน',
    reward: 15,
  },
  {
    id: 'meeting-escape',
    event: 'floor:2',
    emoji: '🏃',
    title: 'หนี Meeting ไปฟิตเนส',
    description: 'ขึ้นไปชั้น Fitness 1 ครั้ง',
    reward: 20,
  },
  {
    id: 'touch-grass',
    event: 'floor:3',
    emoji: '🌤️',
    title: 'Touch grass ฉบับดาดฟ้า',
    description: 'ขึ้นไปพักที่ Rooftop 1 ครั้ง',
    reward: 20,
  },
  {
    id: 'rainy-deploy',
    event: 'atmosphere:rain',
    emoji: '🌧️',
    title: 'Deploy วันฝนตก',
    description: 'เปลี่ยนอากาศเป็นฝนตก',
    reward: 15,
  },
  {
    id: 'team-building',
    event: 'minigame',
    emoji: '🎮',
    title: 'Team building (จริงจัง)',
    description: 'จบมินิเกม 1 รอบ',
    reward: 25,
  },
];

const DAILY_CHAOS_BONUS = 40;

function getTodayKey() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - offset).toISOString().slice(0, 10);
}

function hashString(value) {
  return [...value].reduce((hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0, 0);
}

function createDailyChaos(dateKey) {
  const offset = Math.abs(hashString(dateKey)) % DAILY_CHAOS_TASKS.length;
  const tasks = DAILY_CHAOS_TASKS.map((task, index) =>
    DAILY_CHAOS_TASKS[(index + offset) % DAILY_CHAOS_TASKS.length]
  ).slice(0, 3).map((task) => ({ ...task, progress: 0, completed: false }));

  return { dateKey, tasks, bonusClaimed: false };
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Ignore storage errors
  }
}

function getLeaderboardData() {
  const raw = loadFromStorage();
  if (!raw || !raw.leaderboard) return [];
  return raw.leaderboard
    .sort((a, b) => b.totalScore - a.totalScore)
    .slice(0, 10);
}

function saveScoreToLeaderboard(playerName, totalScore) {
  const raw = loadFromStorage() || { leaderboard: [] };
  const existing = raw.leaderboard.find(p => p.name === playerName);
  if (existing) {
    existing.totalScore = Math.max(existing.totalScore, totalScore);
  } else {
    raw.leaderboard.push({ name: playerName, totalScore });
  }
  saveToStorage(raw);
}

function loadDailyChaos(playerName) {
  const raw = loadFromStorage();
  const todayKey = getTodayKey();
  const saved = raw?.dailyChaosByPlayer?.[playerName];
  return saved?.dateKey === todayKey ? saved : createDailyChaos(todayKey);
}

function saveDailyChaos(playerName, dailyChaos) {
  const raw = loadFromStorage() || { leaderboard: [], dailyChaosByPlayer: {} };
  raw.dailyChaosByPlayer ||= {};
  raw.dailyChaosByPlayer[playerName] = dailyChaos;
  saveToStorage(raw);
}

export const useGameStore = create((set, get) => ({
  gameState: 'create', // Start at create character screen
  playerName: '',
  playerCustomization: {
    gender: 'male',
    skinTone: '#FFD1B3',
    hairColor: '#3E2723',
    hairStyle: 'short',
    shirtColor: '#4ECDC4',
    pantsColor: '#1A365D',
    shoeColor: '#2D3436'
  },
  atmosphere: 'noon', // 'morning', 'noon', 'evening', 'night', 'rain', 'snow', 'hot'
  totalScore: 0,
  nearbyNPC: null,
  selectedNPC: null,
  currentMiniGame: null,
  lastResult: null,
  showLeaderboard: false,
  currentFloor: 1,
  isFlying: false,
  dailyChaos: null,
  dailyChaosNotice: null,

  setFlying: (val) => set({ isFlying: val }),
  setCurrentFloor: (f) => {
    set({ currentFloor: f });
    get().trackChaosEvent(`floor:${f}`);
  },
  setAtmosphere: (atmos) => {
    set({ atmosphere: atmos });
    get().trackChaosEvent(`atmosphere:${atmos}`);
  },
  startGame: (name) => {
    // โหลดคะแนนเดิมจาก LocalStorage ถ้ามีชื่อซ้ำ
    const raw = loadFromStorage();
    let loadedScore = 0;
    if (raw && raw.leaderboard) {
      const existing = raw.leaderboard.find(p => p.name === name);
      if (existing) {
        loadedScore = existing.totalScore;
      }
    }
    set({
      playerName: name,
      totalScore: loadedScore,
      dailyChaos: loadDailyChaos(name),
      dailyChaosNotice: null,
      gameState: 'playing',
    });
  },
  setPlayerCustomization: (updates) => set((state) => ({
    playerCustomization: { ...state.playerCustomization, ...updates }
  })),
  
  setNearby: (npc) => set({ nearbyNPC: npc }),
  
  interactWithNPC: () => {
    const { nearbyNPC } = get();
    if (nearbyNPC) {
      get().trackChaosEvent('npc-chat');
      set({ selectedNPC: nearbyNPC, gameState: 'dialog' });
    }
  },
  
  closeNPCPopup: () => set({ selectedNPC: null, gameState: 'playing' }),
  
  startMiniGame: (gameType) => set({ currentMiniGame: gameType, gameState: 'minigame' }),
  
  endMiniGame: (score) => {
    const { totalScore, currentMiniGame, selectedNPC, playerName } = get();
    const newTotal = totalScore + score;
    
    saveScoreToLeaderboard(playerName, newTotal);
    
    set({
      totalScore: newTotal,
      lastResult: {
        gameType: currentMiniGame,
        score,
        npcName: selectedNPC?.name || '',
        totalScore: newTotal,
      },
      currentMiniGame: null,
      gameState: 'result'
    });
    get().trackChaosEvent('minigame');
  },
  
  closeResult: () => set({ lastResult: null, selectedNPC: null, gameState: 'playing' }),
  
  toggleLeaderboard: () => set((state) => ({ showLeaderboard: !state.showLeaderboard })),

  dismissDailyChaosNotice: () => set({ dailyChaosNotice: null }),

  trackChaosEvent: (event) => {
    const { dailyChaos, playerName, totalScore } = get();
    if (!dailyChaos || !playerName || dailyChaos.bonusClaimed) return;

    let earned = 0;
    let completedTask = null;
    const tasks = dailyChaos.tasks.map((task) => {
      if (task.event !== event || task.completed) return task;
      const updated = { ...task, progress: task.progress + 1 };
      if (updated.progress >= 1) {
        updated.completed = true;
        earned += updated.reward;
        completedTask = updated;
      }
      return updated;
    });

    if (!completedTask) return;

    const allCompleted = tasks.every((task) => task.completed);
    if (allCompleted && !dailyChaos.bonusClaimed) earned += DAILY_CHAOS_BONUS;

    const updatedChaos = {
      ...dailyChaos,
      tasks,
      bonusClaimed: allCompleted || dailyChaos.bonusClaimed,
    };
    const newTotal = totalScore + earned;

    saveDailyChaos(playerName, updatedChaos);
    saveScoreToLeaderboard(playerName, newTotal);
    set({
      dailyChaos: updatedChaos,
      totalScore: newTotal,
      dailyChaosNotice: allCompleted
        ? `🎉 Daily Office Chaos จบแล้ว! โบนัส +${DAILY_CHAOS_BONUS} XP`
        : `${completedTask.emoji} ${completedTask.title} สำเร็จ! +${completedTask.reward} XP`,
    });
  },
  
  getLeaderboard: () => getLeaderboardData(),
}));

// Global keyboard listeners
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    const state = useGameStore.getState();
    if (state.gameState === 'playing' && e.code === 'KeyE' && state.nearbyNPC) {
      state.interactWithNPC();
    }
    if (state.gameState === 'playing' && e.code === 'Tab') {
      e.preventDefault();
      state.toggleLeaderboard();
    }
    if (e.code === 'Escape') {
      if (state.showLeaderboard) state.toggleLeaderboard();
      if (state.selectedNPC && !state.currentMiniGame) state.closeNPCPopup();
    }
  });
}
