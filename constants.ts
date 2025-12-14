import { GameType, Tournament, TournamentMode, TournamentStatus, UserProfile, Transaction } from './types';

export const INITIAL_USER: UserProfile = {
  id: 'u1',
  username: 'ShadowSlayer',
  avatar: 'https://picsum.photos/200/200?random=user',
  walletBalance: 450,
  gamesPlayed: 142,
  wins: 18,
  kills: 423,
  kdRatio: 3.14,
};

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 't1',
    title: 'Erangel Elite Championship',
    game: GameType.PUBG,
    map: 'Erangel',
    mode: TournamentMode.SQUAD,
    entryFee: 50,
    prizePool: 5000,
    startTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: TournamentStatus.FILLING_FAST,
    maxSlots: 25,
    filledSlots: 18,
    image: 'https://picsum.photos/800/400?random=1',
    description: 'The ultimate squad showdown on the classic Erangel map. High stakes, intense rotations.',
  },
  {
    id: 't2',
    title: 'Bermuda Blitz',
    game: GameType.FREE_FIRE,
    map: 'Bermuda',
    mode: TournamentMode.SOLO,
    entryFee: 20,
    prizePool: 1500,
    startTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour
    status: TournamentStatus.OPEN,
    maxSlots: 48,
    filledSlots: 12,
    image: 'https://picsum.photos/800/400?random=2',
    description: 'Fast-paced solo action. Only the quickest survive the Bermuda triangle.',
  },
  {
    id: 't3',
    title: 'Miramar Snipers Only',
    game: GameType.PUBG,
    map: 'Miramar',
    mode: TournamentMode.DUO,
    entryFee: 100,
    prizePool: 10000,
    startTime: new Date(Date.now() + 172800000).toISOString(), // 2 days
    status: TournamentStatus.OPEN,
    maxSlots: 50,
    filledSlots: 5,
    image: 'https://picsum.photos/800/400?random=3',
    description: 'Long range battles only. Bring your A-game and your 8x scopes.',
  },
  {
    id: 't4',
    title: 'Purgatory Survival',
    game: GameType.FREE_FIRE,
    map: 'Purgatory',
    mode: TournamentMode.SQUAD,
    entryFee: 0,
    prizePool: 500,
    startTime: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    status: TournamentStatus.LIVE,
    maxSlots: 12,
    filledSlots: 12,
    image: 'https://picsum.photos/800/400?random=4',
    description: 'Free entry tournament for beginners. Prove your worth.',
  },
    {
    id: 't5',
    title: 'Sanhok Rush',
    game: GameType.PUBG,
    map: 'Sanhok',
    mode: TournamentMode.SQUAD,
    entryFee: 200,
    prizePool: 20000,
    startTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    status: TournamentStatus.COMPLETED,
    maxSlots: 20,
    filledSlots: 20,
    image: 'https://picsum.photos/800/400?random=5',
    description: 'Close quarters combat in the rain forests of Sanhok.',
  },
];

export const GAME_ICONS = {
  [GameType.PUBG]: '🔫',
  [GameType.FREE_FIRE]: '🔥',
};

export const PRE_GENERATED_RULES = [
  "No teaming up with other squads.",
  "Emulators are strictly prohibited for mobile tournaments.",
  "Screenshots of results must be uploaded within 10 minutes of match end.",
  "Toxic behavior in voice chat results in immediate disqualification.",
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx1', type: 'DEPOSIT', amount: 500, date: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Added via UPI', status: 'COMPLETED' },
  { id: 'tx2', type: 'ENTRY_FEE', amount: 50, date: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Entry: Erangel Elite', status: 'COMPLETED' },
  { id: 'tx3', type: 'PRIZE_WIN', amount: 200, date: new Date(Date.now() - 43200000).toISOString(), description: 'Win: Sanhok Rush', status: 'COMPLETED' },
  { id: 'tx4', type: 'WITHDRAWAL', amount: 100, date: new Date(Date.now() - 3600000).toISOString(), description: 'Withdrawal to Bank', status: 'PENDING' },
];