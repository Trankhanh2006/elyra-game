// ============================================
// MAIN GAME CLASS
// ============================================

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.input = new InputManager();
        this.render = new RenderSystem(this.canvas);

        this.mapSystem = new MapSystem();
        this.storyEngine = new StoryEngine();
        this.player = new Player(CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        this.boss = null;

        this.gameRunning = true;
        this.gameWon = false;
        this.gameLost = false;

        this.lastTime = Date.now();
        this.lastSaveTime = Date.now();
        this.frameCount = 0;
        this.fps = 0;

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
        }

        // Start story
        this.storyEngine.playStory(map.id, this);

        // Reset player position
        this.player.x = CANVAS_WIDTH / 2;
        this.player.y = CANVAS_HEIGHT / 2;
    }

    update(deltaTime) {
        if (this.gameLost || this.gameWon) return;

        // Update player
        this.player.update(this.input, deltaTime);

        // Update boss
        if (this.boss) {
            this.boss.update(this.player, deltaTime);
        }

        // Update story
        this.storyEngine.update(deltaTime, this);

        // Collision detection
        this.handleCollisions();

        // Check map progression
        this.checkMapProgression();

        // Auto-save
        this.autoSave();
    }

    handleCollisions() {
        // Player vs Boss contact
        if (this.boss && this.boss.active && CollisionSystem.playerVsBoss(this.player, this.boss)) {
            if (this.player.performAttack()) {
                this.boss.takeDamage(PLAYER_CONFIG.ATTACK_DAMAGE);
            }
            this.player.takeDamage(1); // Boss contact damage
        }

        // Player vs Boss projectiles
        if (this.boss) {
            const projectilesToRemove = [];
            for (let i = 0; i < this.boss.projectiles.length; i++) {
                const proj = this.boss.projectiles[i];
                if (CollisionSystem.playerVsProjectile(this.player, proj)) {
                    this.player.takeDamage(proj.damage);
                    projectilesToRemove.push(i);
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
            console.log('Collected:', item.type);
        }
    }

    checkMapProgression() {
        // Check if boss is defeated
        if (this.boss && this.boss.isDead()) {
            this.boss.active = false;
            if (this.mapSystem.progressToNextMap()) {
                this.initializeMap();
            } else {
                // Game won!
                this.gameWon = true;
                this.storyEngine.isPlaying = false;
                document.getElementById('storyText').innerText = '🎉 ELYRA - HOÀN THÀNH! 🎉\n Bạn đã cứu Khánh và thế giới khỏi bóng tối!';
            }
            return;
        }

        // Check if map is cleared (no boss and all items collected)
        if (!this.boss && this.mapSystem.isMapComplete()) {
            if (this.mapSystem.progressToNextMap()) {
                this.initializeMap();
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

        // UI updates
        this.render.updateUI(this.player, map.name);
    }

    gameLoop() {
        const now = Date.now();
        const deltaTime = now - this.lastTime;
        this.lastTime = now;

        // Update
        this.update(deltaTime);

        // Render
        this.render();

        // Check game end
        if (this.player.isDead) {
            this.gameLost = true;
            document.getElementById('storyText').innerText = '💀 GAME OVER\n Vy đã rơi vào tối tăm...';
            return;
        }

        // Continue loop
        requestAnimationFrame(() => this.gameLoop());
    }

    start() {
        console.log('🎮 ELYRA Game Started!');
        this.gameLoop();
    }

    saveGame() {
        SaveSystem.save(this);
    }

    loadGame() {
        if (SaveSystem.load(this)) {
            console.log('Game loaded, restarting...');
            // Re-initialize after loading
            this.gameRunning = true;
            this.gameWon = false;
            this.gameLost = false;
            this.gameLoop();
        }
    }
}
