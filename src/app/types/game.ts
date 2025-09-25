export interface Monster {
  id: string;
  name: string;
  owner: string;
  power: number;
  health: number;
  xp: number;
  image: string;
}

export interface Battle {
  id: string;
  challenger: string;
  opponent: string | null;
  betAmount: number;
  status: 'open' | 'inProgress' | 'completed';
  winner: string | null;
  challengerMonster: Monster;
  opponentMonster?: Monster;
  createdAt: number;
}

export interface CreateBattleInput {
  monsterId: string;
  betAmount: number;
}

export interface JoinBattleInput {
  battleId: string;
  monsterId: string;
}