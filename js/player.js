// ============================================
// PLAYER CLASS
// ============================================

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.hp = PLAYER_CONFIG.HP_MAX;
        this.maxHp = PLAYER_CONFIG.HP_MAX;
        this.size = PLAYER_CONFIG.SIZE;
        this.speed = PLAYER_CONFIG.SPEED;
        this.vx = 0;
        this.vy = 0;
        this.lastAttackTime = 0;
        this.attackRange = PLAYER_CONFIG.ATTACK_RANGE;
        this.attackDamage = PLAYER_CONFIG.ATTACK_DAMAGE;
        this.isDead = false;
    }

    update(input, deltaTime) {
        const { dx, dy } = input.getMovementInput();
        
        // Apply movement
        this.x += dx;
        this.y += dy;

        // Boundary collision
        this.x = Math.max(this.size, Math.min(CANVAS_WIDTH - this.size, this.x));
        this.y = Math.max(this.size, Math.min(CANVAS_HEIGHT - this.size, this.y));
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        if (this.hp <= 0) this.isDead = true;
    }

    heal(amount) {
        this.hp = Math.min(this.hp + amount, this.maxHp);
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
            isDead: this.isDead
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this.isDead = data.isDead;
    }
}
