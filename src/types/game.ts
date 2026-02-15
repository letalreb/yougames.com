// ============================================
// GAME TYPES
// ============================================

export type GameCategory =
  | 'platformer'
  | 'runner'
  | 'maze'
  | 'quiz'
  | 'math'
  | 'memory'
  | 'card-match'
  | 'story'
  | 'coloring'
  | 'puzzle';

export type Difficulty = 'easy' | 'medium' | 'hard';

// ============================================
// PLAYER CONFIG
// ============================================

export interface PlayerConfig {
  sprite: string; // emoji or shape descriptor
  speed: number; // pixels per frame
  jumpPower?: number; // for platformers
  size: number; // width/height in pixels
  color: string;
}

// ============================================
// WORLD CONFIG
// ============================================

export interface WorldConfig {
  backgroundColor: string;
  gravity?: number; // for physics-based games
  width: number;
  height: number;
  theme: 'sky' | 'forest' | 'space' | 'ocean' | 'candy' | 'abstract';
}

// ============================================
// MECHANICS
// ============================================

export type MechanicType =
  | 'jump'
  | 'run'
  | 'collect'
  | 'avoid'
  | 'answer'
  | 'match'
  | 'paint'
  | 'solve';

export interface MechanicConfig {
  type: MechanicType;
  params: Record<string, any>;
}

// ============================================
// GOAL CONFIG
// ============================================

export type GoalType = 'reach_score' | 'collect_items' | 'survive_time' | 'answer_questions' | 'complete_level';

export interface GoalConfig {
  type: GoalType;
  target: number; // score target, item count, time in seconds, etc.
  description: string; // kid-friendly description
}

// ============================================
// ASSET MANIFEST
// ============================================

export interface AssetManifest {
  sprites: Record<string, SpriteAsset>;
  sounds?: Record<string, SoundAsset>;
  fonts?: string[];
}

export interface SpriteAsset {
  type: 'emoji' | 'shape' | 'generated' | 'image';
  value: string; // emoji char, shape descriptor, or data URL
  width: number;
  height: number;
}

// ============================================
// CUSTOM IMAGES (User Uploaded)
// ============================================

export interface CustomImage {
  id: string; // unique id for this upload
  role: 'player' | 'collectible' | 'obstacle' | 'background' | 'platform';
  dataUrl: string; // base64 data URL
  width: number;
  height: number;
  filename?: string;
}

export interface SoundAsset {
  url: string;
  duration: number;
}

// ============================================
// COMPLETE GAME CONFIG
// ============================================

export interface GameConfig {
  player: PlayerConfig;
  world: WorldConfig;
  mechanics: MechanicConfig[];
  goal: GoalConfig;
  difficulty: Difficulty;
}

// ============================================
// FULL GAME OBJECT
// ============================================

export interface Game {
  id: string; // game_<uuid>
  title: string;
  prompt: string;
  category: GameCategory;
  difficulty: Difficulty;
  
  config: Partial<GameConfig> | { width: number; height: number; backgroundColor: string; isAIGenerated?: boolean };
  
  // Generated code as string (to be executed in sandboxed canvas or iframe)
  // Can be JavaScript code OR complete HTML for AI-generated games
  code: string;
  
  assets: Partial<AssetManifest> | { playerSprite?: string; collectibleSprite?: string; obstacleSprite?: string };
  
  // Custom uploaded images
  customImages?: CustomImage[];
  
  // AI-Generated flag
  aiGenerated?: boolean;
  
  // Metadata
  createdAt: string; // ISO date
  createdBy?: string; // userId or "guest"
  published?: boolean;
  publicUrl?: string;
  
  // Stats (optional)
  stats?: {
    plays: number;
    shares: number;
    likes?: number;
  };
}

// ============================================
// GAME TEMPLATE
// ============================================

export interface GameTemplate {
  category: GameCategory;
  name: string;
  description: string;
  icon: string; // emoji
  baseCode: string; // Template code with placeholders
  configurableParams: string[];
  defaultConfig: GameConfig;
  examplePrompts: string[];
}

// ============================================
// PROMPT GENERATION REQUEST/RESPONSE
// ============================================

export interface GenerateGameRequest {
  prompt: string;
  category: GameCategory;
  difficulty: Difficulty;
  userId?: string; // optional, null for guest
  customImages?: CustomImage[]; // optional custom sprites
}

export interface GenerateGameResponse {
  success: boolean;
  game?: Game;
  error?: string;
}

// ============================================
// CONTENT SAFETY
// ============================================

export interface ContentFilterRequest {
  text: string;
}

export interface ContentFilterResponse {
  safe: boolean;
  reason?: string;
  sanitized: string;
  flaggedWords?: string[];
}

// ============================================
// GAME PUBLISH
// ============================================

export interface PublishGameRequest {
  gameId: string;
}

export interface PublishGameResponse {
  success: boolean;
  publicUrl?: string;
  error?: string;
}
