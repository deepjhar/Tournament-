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
  entryFee: number;
  prizePool: number;
  startTime: string;
  status: TournamentStatus;
  maxSlots: number;
  filledSlots: number;
  image: string;
  description?: string;
  rules?: string[]; // Can be AI generated
}

export interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  walletBalance: number;
  gamesPlayed: number;
  wins: number;
  kills: number;
  kdRatio: number;
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
}