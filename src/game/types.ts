/**
 * Game state types and interface definitions
 */

export interface GameStats {
  score: number;
  highScore: number;
  level: number;
  enemiesDestroyed: number;
  playerHealth: number;
  playerMaxHealth: number;
  playerShield: number;
  playerMaxShield: number;
  enemyHealth: number;
  enemyMaxHealth: number;
  enemyName: string;
  isPaused: boolean;
  isGameOver: boolean;
  gameStarted: boolean;
  waveClearNotice: string | null;
}

export interface InputState {
  moveX: number; // -1 to 1
  moveY: number; // -1 to 1 (3D vertical / elevation)
  isShooting: boolean;
  isBoosting: boolean;
}

export type EnemyType = {
  name: string;
  color: number;
  accentColor: number;
  maxHealth: number;
  speed: number;
  shotSpeed: number;
  fireInterval: number;
  shotPattern: 'single' | 'double' | 'spread' | 'burst';
  scale: number;
};
