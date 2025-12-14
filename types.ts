
export enum GameType {
  PUBG = 'PUBG Mobile',
  FREE_FIRE = 'Free Fire',
}

export enum TournamentStatus {
  OPEN = 'Registration Open',
  FILLING_FAST = 'Filling Fast',
  CLOSED = 'Closed',
  LIVE = 'Live Now',
  COMPLETED = 'Completed',
}

export enum TournamentMode {
  SOLO = 'Solo',
  DUO = 'Duo',
  SQUAD = 'Squad',
}

export interface PrizeDistribution {
  rank: number;
  amount: number;
}

export interface Tournament {
  id: string;
  title: string;
  game: GameType;
  map: string;
  mode: TournamentMode;
  entryFee: number; // Changed from entryFee to match common JS casing, mapped from DB
  prizePool: number;
  startTime: string;
  status: TournamentStatus;
  maxSlots: number;
  filledSlots: number;
  image: string;
  description?: string;
  rules?: string[]; 
}

// Helper to map DB columns (snake_case) to App types (camelCase)
export const mapTournamentFromDB = (data: any): Tournament => ({
  id: data.id,
  title: data.title,
  game: data.game as GameType,
  map: data.map,
  mode: data.mode as TournamentMode,
  entryFee: Number(data.entry_fee),
  prizePool: Number(data.prize_pool),
  startTime: data.start_time,
  status: data.status as TournamentStatus,
  maxSlots: data.max_slots,
  filledSlots: data.filled_slots,
  image: data.image,
  description: data.description,
  rules: [] 
});

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  walletBalance: number;
  gamesPlayed: number;
  wins: number;
  kills: number;
  kdRatio: number;
  isAdmin: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL' | 'ENTRY_FEE' | 'PRIZE_WIN';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string;
  description: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  user_id?: string; // For Admin view
}
