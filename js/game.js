// ============================================
// COMPLETE GAME SYSTEM
// ============================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.input = new InputManager();
        this.worldBuilder = new WorldBuilder();
        this.tileRenderer = new TileRenderer(this.canvas);
        this.render = new RenderSystem(this.canvas, this.tileRenderer);
        this.effects = new EffectSystem();
        this.sound = new SoundSystem();
        this.questSystem = new QuestSystem();

        this.mapSystem = new MapSystem();
        this.storyEngine = new StoryEngine();
        this.player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        this.boss = null;
        this.currentMap = null;

        this.gameRunning = true;
        this.gameWon = false;
        this.gameLost = false;
        this.lastTime = Date.now();
        this.lastSaveTime = Date.now();

        this.initializeMap();
    }

    initializeMap() {
        const mapId = this.mapSystem.currentMapId;
        this.currentMap = this.worldBuilder.getMap(mapId);

        // Spawn player at safe location
        this.player.x = 16 * 32 + 16; // Center of map
        this.player.y = 12 * 32 + 16;

        // Create boss if needed
        if (this.currentMap.objects.find(o => o.type === 'portal')) {
            const bossType = this.mapSystem.maps[mapId].boss;
            if (bossType) {
                const bossPos = this.currentMap.objects.find(o => o.type === 'portal');
                this.boss = new Boss(bossPos.x * 32 + 16, bossPos.y * 32 + 16, bossType);
            }
        }

        // Start first quest if not started
        if (!this.questSystem.activeQuest) {
            this.questSystem.startQuest('lumina_collect_crystals');
        }

        // Start story
        this.storyEngine.playStory(mapId, this);
        console.log('📍 Map loaded:', this.currentMap.name);
    }

    update(deltaTime) {
        if (this.gameLost || this.gameWon) return;

        // Update systems
        this.player.update(this.input, deltaTime, this.currentMap.tiles);
        if (this.boss) this.boss.update(this.player, deltaTime);
        this.storyEngine.update(deltaTime, this);
        this.effects.update(deltaTime);

        // Check collisions
        this.checkCollisions();
        this.checkMapProgression();
        this.autoSave();
    }

    checkCollisions() {
        // Player vs Boss
        if (this.boss && this.boss.active && CollisionSystem.playerVsBoss(this.player, this.boss)) {
            if (this.player.performAttack()) {
                const isCritical = Math.random() < 0.2;
                const damage = isCritical ? PLAYER_CONFIG.ATTACK_DAMAGE * 1.5 : PLAYER_CONFIG.ATTACK_DAMAGE;
                
                this.boss.takeDamage(damage);
                this.effects.addAnimation(this.boss.x, this.boss.y, 'damage');
                this.effects.addDamageNumber(this.boss.x, this.boss.y, Math.ceil(damage), isCritical);
                this.effects.screenShake(3, 100);
                this.sound.playAttack();

                if (this.boss.isDead()) {
                    this.questSystem.updateProgress('boss', this.boss.type);
                    this.sound.playVictory();
                }
            }
            this.player.takeDamage(1);
            this.effects.screenShake(5, 150);
        }

        // Player vs Projectiles
        if (this.boss) {
            for (let i = this.boss.projectiles.length - 1; i >= 0; i--) {
                if (CollisionSystem.playerVsProjectile(this.player, this.boss.projectiles[i])) {
                    const damage = this.boss.projectiles[i].damage;
                    this.player.takeDamage(damage);
                    this.effects.addAnimation(this.player.x, this.player.y, 'damage');
                    this.effects.addDamageNumber(this.player.x, this.player.y, damage);
                    this.sound.playDamage();
                    this.boss.projectiles.splice(i, 1);
                }
            }
        }

        // Player vs Map Objects
        for (let obj of this.currentMap.objects) {
            const objX = obj.x * 32 + 16;
            const objY = obj.y * 32 + 16;
            const distance = Math.hypot(this.player.x - objX, this.player.y - objY);

            if (distance < 40) {
                if (obj.type === 'crystal') {
                    this.questSystem.updateProgress('collect', 'crystal');
                    obj.type = 'collected';
                    this.effects.addAnimation(objX, objY, 'heal');
                    this.sound.playCollect();
                } else if (obj.type === 'mirror') {
                    this.questSystem.updateProgress('collect', 'mirror');
                    obj.type = 'collected';
                    this.effects.addAnimation(objX, objY, 'damage');
                    this.sound.playCollect();
                } else if (obj.type === 'memory') {
                    this.questSystem.updateProgress('collect', 'memory');
                    obj.type = 'collected';
                    this.effects.addAnimation(objX, objY, 'heal');
                    this.sound.playCollect();
                }
            }
        }
    }

    checkMapProgression() {
        // Boss defeated
        if (this.boss && this.boss.isDead()) {
            this.boss.active = false;
            if (this.questSystem.isQuestComplete()) {
                const reward = this.questSystem.completeQuest();
                this.player.addXP(reward.xp);
                this.player.addGold(reward.gold);
                
                setTimeout(() => {
                    if (this.mapSystem.progressToNextMap()) {
                        this.initializeMap();
                    } else {
                        this.winGame();
                    }
                }, 1500);
            }
        }

        // Quest complete
        if (this.questSystem.isQuestComplete() && !this.boss) {
            const reward = this.questSystem.completeQuest();
            this.player.addXP(reward.xp);
            this.player.addGold(reward.gold);
            
            if (this.mapSystem.progressToNextMap()) {
                setTimeout(() => this.initializeMap(), 1500);
            }
        }
    }

    winGame() {
        this.gameWon = true;
        this.storyEngine.isPlaying = false;
        document.getElementById('storyText').innerText = 
            '🎉 ELYRA - HOÀN THÀNH! 🎉\n' +
            'Bạn đã cứu Khánh và thế giới khỏi bóng tối!\n' +
            `\n⭐ Final Stats:\n` +
            `🏆 Level: ${this.player.stats.level}\n` +
            `💰 Gold: ${this.player.stats.gold}\n` +
            `✨ XP: ${this.player.stats.xp}`;
        this.sound.playVictory();
    }

    autoSave() {
        const now = Date.now();
        if (now - this.lastSaveTime >= SAVE_CONFIG.autoSaveInterval) {
            SaveSystem.save(this);
            this.lastSaveTime = now;
        }
    }

    render() {
        this.render.render(this);
    }

    gameLoop() {
        const now = Date.now();
        const deltaTime = Math.min(now - this.lastTime, 16);
        this.lastTime = now;

        this.update(deltaTime);
        this.render();

        if (this.player.isDead) {
            this.gameLost = true;
            document.getElementById('storyText').innerText = 
                '💀 GAME OVER\nVy đã rơi vào tối tăm...\n\nPress F5 to restart';
            this.sound.playGameOver();
            return;
        }

        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        console.log('🎮 ELYRA - Complete Game Started!');
        this.gameLoop();
    }

    saveGame() {
        SaveSystem.save(this);
    }

    loadGame() {
        if (SaveSystem.load(this)) {
            this.gameLoop();
        }
    }
}
