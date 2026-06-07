// ============================================
// BOSS CLASS
// ============================================

class Boss {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        
        const config = BOSS_CONFIG[type];
        this.size = config.size;
        this.hp = config.hp;
        this.maxHp = config.hp;
        this.speed = config.speed;
        this.attackCooldown = config.attackCooldown;
        this.attackDamage = config.attackDamage;
        
        this.active = false;
        this.phase = 1; // For multi-phase bosses
        this.lastAttackTime = 0;
        this.projectiles = [];
        this.isDead = false;
        this.chaseDistance = 500;
    }

    update(player, deltaTime) {
        if (!this.active) return;

        this.updateAI(player);
        this.updateProjectiles(deltaTime);
    }

    updateAI(player) {
        const distToPlayer = this.distanceTo(player.x, player.y);

        // Chase player within chase distance
        if (distToPlayer < this.chaseDistance) {
            const dx = player.x - this.x;
            const dy = player.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance > 0) {
                this.x += (dx / distance) * this.speed;
                this.y += (dy / distance) * this.speed;
            }
        }

        // Attack
        if (Date.now() - this.lastAttackTime >= this.attackCooldown) {
            this.fireProjectile(player);
            this.lastAttackTime = Date.now();
        }

        // Boundary collision
        this.x = Math.max(this.size, Math.min(CANVAS_WIDTH - this.size, this.x));
        this.y = Math.max(this.size, Math.min(CANVAS_HEIGHT - this.size, this.y));
    }

    fireProjectile(player) {
        const dx = player.x - this.x;
        const dy = player.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.projectiles.push({
                x: this.x,
                y: this.y,
                vx: (dx / distance) * PROJECTILE_CONFIG.speed,
                vy: (dy / distance) * PROJECTILE_CONFIG.speed,
                size: PROJECTILE_CONFIG.size,
                damage: this.attackDamage,
                createdAt: Date.now()
            });
        }
    }

    updateProjectiles(deltaTime) {
        this.projectiles = this.projectiles.filter(proj => {
            proj.x += proj.vx;
            proj.y += proj.vy;

            const age = Date.now() - proj.createdAt;
            const isAlive = age < PROJECTILE_CONFIG.lifetime &&
                           proj.x > 0 && proj.x < CANVAS_WIDTH &&
                           proj.y > 0 && proj.y < CANVAS_HEIGHT;

            return isAlive;
        });
    }

    takeDamage(amount) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        if (this.hp <= 0) this.isDead = true;
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
            type: this.type,
            hp: this.hp,
            maxHp: this.maxHp,
            active: this.active,
            phase: this.phase,
            isDead: this.isDead
        };
    }

    deserialize(data) {
        this.x = data.x;
        this.y = data.y;
        this.hp = data.hp;
        this.maxHp = data.maxHp;
        this.active = data.active;
        this.phase = data.phase;
        this.isDead = data.isDead;
    }
}
