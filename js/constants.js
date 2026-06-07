// ============================================
// ELYRA GAME - CONSTANTS
// ============================================

// Canvas Configuration
const CANVAS_WIDTH = 1024;
const CANVAS_HEIGHT = 768;
const FPS = 60;
const FRAME_TIME = 1000 / FPS; // ~16.67ms

// Player Configuration
const PLAYER_CONFIG = {
    HP_MAX: 100,
    SPEED: 5,
    SIZE: 18,
    ATTACK_RANGE: 80,
    ATTACK_DAMAGE: 10,
    ATTACK_COOLDOWN: 300 // ms
};

// Boss Configuration
const BOSS_CONFIG = {
    morzak: {
        size: 28,
        hp: 80,
        speed: 2.5,
        attackCooldown: 1200,
        attackDamage: 15
    },
    blackDragon: {
        size: 45,
        hp: 150,
        speed: 3,
        attackCooldown: 1500,
        attackDamage: 20
    },
    morzakFinal: {
        size: 35,
        hp: 200,
        speed: 2.8,
        attackCooldown: 1000,
        attackDamage: 25
    }
};

// Projectile Configuration
const PROJECTILE_CONFIG = {
    speed: 4,
    size: 6,
    lifetime: 5000 // ms
};

// Map IDs
const MAP_IDS = {
    LUMINA: 'lumina',
    FOREST_MIRRORS: 'forestMirrors',
    LAKE_MEMORY: 'lakeMemory',
    BLACK_DRAGON_MOUNTAIN: 'blackDragonMountain',
    SHADOW_ABYSS: 'shadowAbyss'
};

// Colors & Styling
const COLORS = {
    background: '#0a0a0a',
    player: '#00ff00',
    playerOutline: '#00aa00',
    boss: '#ff0000',
    bossOutline: '#aa0000',
    projectile: '#ffff00',
    crystal: '#00ffff',
    mirror: '#0088ff',
    memory: '#ff00ff',
    npc: '#ffff00',
    portal: '#ff00ff',
    grid: 'rgba(0, 255, 0, 0.05)'
};

// Map Names
const MAP_NAMES = {
    lumina: 'Lumina - Vùng Khởi Đầu',
    forestMirrors: 'Rừng Gương',
    lakeMemory: 'Hồ Ký Ức',
    blackDragonMountain: 'Núi Rồng Đen',
    shadowAbyss: 'Shadow Abyss'
};

// Save Configuration
const SAVE_CONFIG = {
    storageKey: 'elyra_save_v1',
    autoSaveInterval: 10000, // 10 seconds
    debounceDelay: 1000 // 1 second
};

// Story Steps
const STORY_STEPS = {
    INTRO: 0,
    LUMINA_START: 1,
    MORZAK_APPEARS: 2,
    LUMINA_COMPLETE: 3,
    FOREST_START: 4,
    FOREST_COMPLETE: 5,
    LAKE_START: 6,
    LAKE_COMPLETE: 7,
    DRAGON_FIGHT: 8,
    SHADOW_START: 9,
    MORZAK_PHASE_2: 10,
    GAME_END: 11
};
