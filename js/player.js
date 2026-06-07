// ============================================
// ENHANCED PLAYER CLASS
// ============================================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hp = PLAYER_CONFIG.HP_MAX;
        this.maxHp = PLAYER_CONFIG.HP_MAX;
        this.size = PLAYER_CONFIG.SIZE;
        this.speed = PLAYER_CONFIG.SPEED;
        this.lastAttackTime = 0;
        this.isDead = false;
        this.sprite = new Sprite(x, y, 'player');
        this.vx = 0;
        this.vy = 0;
        this.isMoving = false;
        this.stats = {
            level: 1,
            xp: 0,
            xpToLevel: 100,
            gold: 0
        };
    }

    update(input, deltaTime, tileMap) {
        const { dx, dy } = input.getMovementInput();
        
        // Smooth movement
        this.vx = dx;
        this.vy = dy;
        this.isMoving = dx !== 0 || dy !== 0;

        // Apply velocity
        const newX = this.x + this.vx;
        const newY = this.y + this.vy;

        // Check collision with tiles
        if (!this.checkTileCollision(newX, this.y, tileMap)) {
            this.x = newX;
        }
        if (!this.checkTileCollision(this.x, newY, tileMap)) {
            this.y = newY;
        }

        // Update sprite
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        this.sprite.update(deltaTime);
    }

    checkTileCollision(x, y, tileMap) {
        const tileSize = 32;
        const tileX = Math.floor(x / tileSize);
        const tileY = Math.floor(y / tileSize);

        if (!tileMap) return false;

        for (let tile of tileMap) {
            if (tile.x === tileX && tile.y === tileY && tile.solid) {
                return true;
            }
        }
        return false;
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        if (this.hp <= 0) this.isDead = true;
    }

    addXP(xp) {
        this.stats.xp += xp;
        if (this.stats.xp >= this.stats.xpToLevel) {
            this.levelUp();
        }
    }

    addGold(gold) {
        this.stats.gold += gold;
    }

    levelUp() {
        this.stats.level += 1;
        this.stats.xp = 0;
        this.stats.xpToLevel = Math.floor(this.stats.xpToLevel * 1.5);
        this.hp = this.maxHp; // Full heal on level up
        this.maxHp += 10;
        console.log('⬆️ Level Up! Now Level', this.stats.level);
    }

    canAttack() {
        return Date.now() - this.lastAttackTime >= PLAYER_CONFIG.ATTACK_COOLDOWN;
    }

    performAttack() {
        if (this.canAttack()) {
            this.lastAttackTime = Date.now();
            return true;
        }
        return false;
    }

    distanceTo(x, y) {
        const dx = this.x - x;
        const dy = this.y - y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    serialize() {
        return {
            x: this.x,
            y: this.y,
            hp: this.hp,
            maxHp: this.maxHp,
            stats: { ...this.stats },
            isDead: this.isDead
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this.stats = { ...data.stats };
        this.isDead = data.isDead;
    }
}
