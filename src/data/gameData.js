/**
 * NPC Data - เพื่อนร่วมงานในออฟฟิศ
 * แต่ละ NPC มีชื่อ สี ตำแหน่ง และเกมที่ถนัด
 */
export const NPCs = [
  {
    id: 'somchai',
    name: 'สมชาย',
    color: '#F44336', // Red
    position: [-8, 0, -6.4], // Workspace Chair
    rotation: Math.PI,
    pose: 'work',
    game: 'badminton',
    greeting: 'ทำงานเหนื่อยจัง... ไปตีแบดไหม! 🏸',
  },
  {
    id: 'nida',
    name: 'นิดา',
    color: '#00BCD4', // Cyan
    position: [2.0, 0, -11.1], // Meeting Room Chair
    rotation: 0,
    pose: 'sit',
    game: 'pingpong',
    greeting: 'เคลียร์เอกสารเสร็จแล้ว... แข่งปิงปองกันไหม? 🏓',
  },
  {
    id: 'ton',
    name: 'ต้น',
    color: '#FF7043', // Orange
    position: [0, 0, 0], // Walking around Center
    rotation: -Math.PI * 0.5,
    pose: 'stand',
    patrol: [[-4, 0, 0], [4, 0, 0], [4, 0, 5], [-4, 0, 5]],
    game: 'football',
    greeting: 'เดินยืดเส้นยืดสายหน่อย... มาเตะบอลกัน! ⚽',
  },
  {
    id: 'plaa',
    name: 'ปลา',
    color: '#FFEB3B', // Yellow
    position: [15.5, 0, -10.5], // Pantry Counter
    rotation: Math.PI,
    pose: 'stand',
    game: 'badminton',
    greeting: 'ดื่มกาแฟไหม? ตีแบดผ่อนคลายกัน 🏸',
  },
  {
    id: 'bank',
    name: 'แบงค์',
    color: '#FF00FF', // Magenta
    position: [14, 0, 0], // Lounge Sofa
    rotation: 0,
    pose: 'sit',
    game: 'football',
    greeting: 'โซฟานุ่มดีจัง... ยิงจุดโทษกันเถอะ! ⚽',
  },
  {
    id: 'aum',
    name: 'อั้ม',
    color: '#AB47BC', // Purple
    position: [14.5, 0, 10], // Receptionist Chair
    rotation: 0,
    pose: 'work',
    game: 'pingpong',
    greeting: 'ยินดีต้อนรับ! ว่างๆ มาตีปิงปองได้นะ 🏓',
  },
  {
    id: 'boy',
    name: 'บอย',
    color: '#4CAF50', // Mint Green
    position: [12, 0, 6], // Standing near Lounge
    rotation: -Math.PI / 2,
    pose: 'stand',
    game: 'badminton',
    greeting: 'ใครท้าตีปิงปอง เข้ามาเลย! 🏓',
  },
];

/**
 * Mini-game metadata
 */
export const MINI_GAMES = {
  badminton: {
    id: 'badminton',
    name: 'Shuttle Smash',
    emoji: '🏸',
    description: 'ตีลูกขนไก่ให้ได้มากที่สุด!',
    duration: 15,
    controls: 'กด Space เพื่อตีลูก',
  },
  football: {
    id: 'football',
    name: 'Goal Kick',
    emoji: '⚽',
    description: 'ยิงประตูให้เข้า หลบผู้รักษาประตู!',
    duration: 15,
    controls: '← → เลือกทิศ, Space เตะ',
  },
  pingpong: {
    id: 'pingpong',
    name: 'Table Rally',
    emoji: '🏓',
    description: 'ตีโต้ลูกปิงปองให้นานที่สุด!',
    duration: 15,
    controls: '← → ขยับไม้ตี',
  },
};

/**
 * Office map layout config
 */
export const OFFICE_CONFIG = {
  floorSize: { width: 40, depth: 30 },
  wallHeight: 4,
  wallThickness: 0.3,
};

/**
 * AABB Collision boxes for furniture and walls
 * Format: { x, z, w, d } (center x, center z, width, depth)
 */
export const COLLISION_BOXES = [
  // Workspace Desks (6 clusters of 2 desks)
  { x: -16, z: -8, w: 2.0, d: 2.6 },
  { x: -16, z: 0, w: 2.0, d: 2.6 },
  { x: -16, z: 8, w: 2.0, d: 2.6 },
  { x: -8, z: -8, w: 2.0, d: 2.6 },
  { x: -8, z: 0, w: 2.0, d: 2.6 },
  { x: -8, z: 8, w: 2.0, d: 2.6 },

  // Workspace Decor
  { x: -19.5, z: -11, w: 3, d: 0.2 }, // Whiteboard

  // Meeting Room
  { x: 2, z: -10, w: 4, d: 1.5 }, // Table
  { x: -2.5, z: -6, w: 5, d: 0.5 }, // Front glass wall LEFT of door
  { x: 6.5, z: -6, w: 5, d: 0.5 }, // Front glass wall RIGHT of door
  { x: 2, z: -14, w: 12, d: 0.5 }, // Back glass wall
  { x: -4, z: -10, w: 0.5, d: 8 }, // Left glass wall
  { x: 8, z: -10, w: 0.5, d: 8 }, // Right glass wall

  // Reception
  { x: 14, z: 11, w: 3.5, d: 1.0 }, // Counter
  { x: 14, z: 9, w: 5, d: 0.5 }, // Backdrop

  // Pantry
  { x: 16, z: -11.5, w: 4.5, d: 1.2 }, // Counter
  { x: 13.5, z: -11.5, w: 1.0, d: 1.0 }, // Fridge
  { x: 18.5, z: -11.5, w: 1.0, d: 1.0 }, // Vending Machine
  { x: 16, z: -12.5, w: 6.0, d: 0.5 }, // Back wall
  { x: 16, z: -9, w: 3.2, d: 2.8 }, // Dining Table & Stools

  // Lounge
  { x: 14, z: -1, w: 3.0, d: 0.8 }, // Bookshelf
  { x: 14, z: 0, w: 2.0, d: 1.0 }, // Back sofa
  { x: 11.8, z: 1.5, w: 1.0, d: 2.0 }, // Left sofa
  { x: 14, z: 1.5, w: 1.5, d: 1.0 }, // Coffee table

  // Exterior Glass Facade bounds (to prevent falling off map)
  { x: 0, z: -15, w: 40, d: 0.5 }, // Back outer
  { x: -20, z: 0, w: 0.5, d: 30 }, // Left outer
  { x: 20, z: 0, w: 0.5, d: 30 },  // Right outer
  { x: 0, z: 15, w: 40, d: 0.5 },  // Front outer

  // Fitness Zone (Floor 2, Y=6)
  { x: -8, y: 6, z: 10, w: 4.5, d: 1.5, h: 2 }, // Dumbbell Rack
  { x: 15, y: 6, z: -4, w: 3.5, d: 2.5, h: 3 }, // MultiGym
  { x: 10, y: 6, z: 12, w: 4.5, d: 1.5, h: 1.5 }, // Lounge Counter
  { x: 15, y: 6, z: -11, w: 1.5, d: 1.5, h: 3 }, // Punching Bag
  { x: 10, y: 6, z: -2, w: 1.5, d: 2, h: 1.5 }, // Bench Press 1
  { x: 10, y: 6, z: 3, w: 1.5, d: 2, h: 1.5 }, // Bench Press 2
  { x: -12, y: 6, z: -10, w: 1.5, d: 3, h: 2 }, // Treadmill 1
  { x: -8, y: 6, z: -10, w: 1.5, d: 3, h: 2 }, // Treadmill 2
  { x: -4, y: 6, z: -10, w: 1.5, d: 3, h: 2 }, // Treadmill 3
  { x: 0, y: 6, z: -10, w: 1.5, d: 3, h: 2 }, // Treadmill 4
  { x: 4, y: 6, z: -10, w: 1.5, d: 3, h: 2 }, // Treadmill 5

  // Rooftop Zone (Floor 3, Y=12)
  { x: -8, y: 12, z: 0, w: 2.5, d: 6, h: 4 }, // Helicopter
  { x: 12, y: 12, z: -6, w: 1.5, d: 1.5, h: 2 }, // BBQ Grill
  { x: 6, y: 12, z: -6, w: 3, d: 3, h: 2 }, // Picnic Table 1
  { x: 6, y: 12, z: 6, w: 3, d: 3, h: 2 }, // Picnic Table 2
  { x: 16, y: 12, z: -12, w: 2, d: 2, h: 3 }, // Decorative Plant 1
  { x: 16, y: 12, z: 12, w: 2, d: 2, h: 3 }, // Decorative Plant 2
];
