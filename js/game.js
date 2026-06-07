// ============================================
// MAIN GAME CLASS - ENHANCED
// ============================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.input = new InputManager();
        this.render = new RenderSystem(this.canvas);
        this.effects = new EffectSystem();
        this.sound = new SoundSystem();

        this.mapSystem = new MapSystem();
        this.storyEngine = new StoryEngine();
        this.player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        this.boss = null;

        this.gameRunning = true;
        this.gameWon = false;
        this.gameLost = false;
        this.difficulty = 'normal'; // easy, normal, hard

        this.lastTime = Date.now();
        this.lastSaveTime = Date.now();
        this.frameCount = 0;
        this.fps = 0;
        this.statsPanel = {
            bossesDefeated: 0,
            itemsCollected: 0,
            damageDealt: 0,
            damageTaken: 0
        };

        this.initializeMap();
    }

    initializeMap() {
        const map = this.mapSystem.getCurrentMap();

        // Create boss if map has one
        if (map.boss) {
            this.boss = new Boss(
                CANVAS_WIDTH / 2 + 150,
                CANVAS_HEIGHT / 2 - 100,
                map.boss
            );
            
            // Apply difficulty modifiers
            this.applyDifficultyToBoss(this.boss);
        }

        // Start story
        this.storyEngine.playStory(map.id, this);
        this.sound.playBossAppear();
    }

    applyDifficultyToBoss(boss) {
        switch (this.difficulty) {
            case 'easy':
                boss.hp *= 0.7;
                boss.maxHp = boss.hp;
                boss.attackDamage *= 0.8;
                boss.speed *= 0.8;
                break;
            case 'hard':
                boss.hp *= 1.5;
                boss.maxHp = boss.hp;
                boss.attackDamage *= 1.3;
                boss.speed *= 1.2;
                break;
        }
    }

    update(deltaTime) {
        if (this.gameLost || this.gameWon) return;

        // Update systems
        this.player.update(this.input, deltaTime);
        if (this.boss) this.boss.update(this.player, deltaTime);
        this.storyEngine.update(deltaTime, this);
        this.effects.update(deltaTime);

        // Collision detection
        this.handleCollisions();

        // Map progression
        this.checkMapProgression();

        // Auto-save
        this.autoSave();
    }

    handleCollisions() {
        // Player vs Boss contact
        if (this.boss && this.boss.active && CollisionSystem.playerVsBoss(this.player, this.boss)) {
            if (this.player.performAttack()) {
                const isCritical = Math.random() < 0.2; // 20% crit chance
                const damage = isCritical 
                    ? PLAYER_CONFIG.ATTACK_DAMAGE * 1.5 
                    : PLAYER_CONFIG.ATTACK_DAMAGE;
                
                this.boss.takeDamage(damage);
                this.statsPanel.damageDealt += damage;
                
                // Effects
                this.effects.addAnimation(this.boss.x, this.boss.y, 'damage');
                this.effects.addDamageNumber(this.boss.x, this.boss.y, Math.ceil(damage), isCritical);
                this.effects.screenShake(3, 100);
                this.sound.playAttack();
            }
            
            // Take contact damage
            this.player.takeDamage(1);
            this.statsPanel.damageTaken += 1;
            this.sound.playDamage();
        }

        // Player vs Boss projectiles
        if (this.boss) {
            const projectilesToRemove = [];
            for (let i = 0; i < this.boss.projectiles.length; i++) {
                const proj = this.boss.projectiles[i];
                if (CollisionSystem.playerVsProjectile(this.player, proj)) {
                    this.player.takeDamage(proj.damage);
                    this.statsPanel.damageTaken += proj.damage;
                    projectilesToRemove.push(i);
                    
                    // Effects
                    this.effects.addAnimation(this.player.x, this.player.y, 'damage');
                    this.effects.addDamageNumber(this.player.x, this.player.y, proj.damage);
                    this.effects.screenShake(5, 150);
                    this.sound.playDamage();
                }
            }
            // Remove hit projectiles
            for (let i = projectilesToRemove.length - 1; i >= 0; i--) {
                this.boss.projectiles.splice(projectilesToRemove[i], 1);
            }
        }

        // Player vs Items
        const item = this.mapSystem.checkItemCollision(this.player);
        if (item) {
            this.mapSystem.collectItem(item);
            this.statsPanel.itemsCollected += 1;
            
            // Effects
            this.effects.addAnimation(item.x, item.y, 'heal');
            this.sound.playCollect();
            console.log('Collected:', item.type);
        }
    }

    checkMapProgression() {
        // Boss defeated
        if (this.boss && this.boss.isDead()) {
            this.boss.active = false;
            this.statsPanel.bossesDefeated += 1;
            this.sound.playVictory();
            
            if (this.mapSystem.progressToNextMap()) {
                setTimeout(() => this.initializeMap(), 1000);
            } else {
                // Game won!
                this.gameWon = true;
                this.storyEngine.isPlaying = false;
                document.getElementById('storyText').innerText = 
                    '🎉 ELYRA - HOÀN THÀNH! 🎉\n' +
                    'Bạn đã cứu Khánh và thế giới khỏi bóng tối!\n' +
                    `\nBosses Defeated: ${this.statsPanel.bossesDefeated}\n` +
                    `Items Collected: ${this.statsPanel.itemsCollected}\n` +
                    `Damage Dealt: ${Math.ceil(this.statsPanel.damageDealt)}`;
            }
            return;
        }

        // Map cleared
        if (!this.boss && this.mapSystem.isMapComplete()) {
            if (this.mapSystem.progressToNextMap()) {
                setTimeout(() => this.initializeMap(), 1000);
            }
        }
    }

    autoSave() {
        const now = Date.now();
        if (now - this.lastSaveTime >= SAVE_CONFIG.autoSaveInterval) {
            SaveSystem.save(this);
            this.lastSaveTime = now;
        }
    }

    render() {
        const map = this.mapSystem.getCurrentMap();
        const shakeOffset = this.effects.getScreenShakeOffset();

        // Save context state
        this.render.ctx.save();
        
        // Apply screen shake
        this.render.ctx.translate(shakeOffset.x, shakeOffset.y);

        // Background and grid
        this.render.clear(map.background);
        this.render.drawGrid(map.gridColor);

        // Map objects
        this.render.drawItems(map.items);
        if (map.npc) this.render.drawNPC(map.npc);

        // Game entities
        this.render.drawPlayer(this.player);
        if (this.boss) {
            this.render.drawProjectiles(this.boss.projectiles);
            this.render.drawBoss(this.boss);
        }

        // Effects
        this.effects.draw(this.render.ctx);

        // Restore context state
        this.render.ctx.restore();

        // UI
        this.render.updateUI(this.player, map.name, this.storyEngine.storyStep);
    }

    gameLoop() {
        const now = Date.now();
        const deltaTime = Math.min(now - this.lastTime, 16); // Cap at 60 FPS
        this.lastTime = now;

        // Update
        this.update(deltaTime);

        // Render
        this.render();

        // Check game end
        if (this.player.isDead) {
            this.gameLost = true;
            document.getElementById('storyText').innerText = 
                '💀 GAME OVER\n' +
                'Vy đã rơi vào tối tăm...\n' +
                `\nBosses Defeated: ${this.statsPanel.bossesDefeated}\n` +
                `Items Collected: ${this.statsPanel.itemsCollected}`;
            this.sound.playGameOver();
            return;
        }

        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        console.log('🎮 ELYRA Enhanced Game Started!');
        this.gameLoop();
    }

    saveGame() {
        SaveSystem.save(this);
    }

    loadGame() {
        if (SaveSystem.load(this)) {
            console.log('Game loaded, restarting...');
            this.gameRunning = true;
            this.gameWon = false;
            this.gameLost = false;
            this.gameLoop();
        }
    }

    setDifficulty(level) {
        this.difficulty = level; // easy, normal, hard
        console.log('Difficulty set to:', level);
    }
}
