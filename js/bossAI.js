// ============================================
// ADVANCED BOSS AI
// ============================================

class BossAI {
    constructor(boss) {
        this.boss = boss;
        this.pattern = 0;
        this.patternTimer = 0;
        this.patternDuration = 3000; // 3 seconds per pattern
        this.attackPattern = this.getAttackPattern(boss.type);
    }

    getAttackPattern(type) {
        switch (type) {
            case 'morzak':
                return [
                    'chase', 'chase', 'singleShot',
                    'chase', 'burstShot', 'chase'
                ];
            case 'blackDragon':
                return [
                    'chase', 'spreadShot', 'chase',
                    'diveAttack', 'circleShot', 'chase'
                ];
            case 'morzakFinal':
                return this.boss.phase === 1
                    ? ['chase', 'singleShot', 'chase', 'burstShot']
                    : ['spiralShot', 'chase', 'dualShot', 'drainAttack'];
            default:
                return ['chase', 'singleShot'];
        }
    }

    update(deltaTime, player) {
        this.patternTimer += deltaTime;

        // Switch pattern
        if (this.patternTimer >= this.patternDuration) {
            this.pattern = (this.pattern + 1) % this.attackPattern.length;
            this.patternTimer = 0;
        }

        const currentPattern = this.attackPattern[this.pattern];
        this.executePattern(currentPattern, player);
    }

    executePattern(pattern, player) {
        switch (pattern) {
            case 'chase':
                this.chase(player);
                break;
            case 'singleShot':
                this.singleShot(player);
                break;
            case 'burstShot':
                this.burstShot(player);
                break;
            case 'spreadShot':
                this.spreadShot(player);
                break;
            case 'circleShot':
                this.circleShot(player);
                break;
            case 'diveAttack':
                this.diveAttack(player);
                break;
            case 'spiralShot':
                this.spiralShot(player);
                break;
            case 'dualShot':
                this.dualShot(player);
                break;
            case 'drainAttack':
                this.drainAttack(player);
                break;
        }
    }

    chase(player) {
        const dx = player.x - this.boss.x;
        const dy = player.y - this.boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.boss.x += (dx / distance) * this.boss.speed;
            this.boss.y += (dy / distance) * this.boss.speed;
        }
    }

    singleShot(player) {
        if (Date.now() - this.boss.lastAttackTime >= this.boss.attackCooldown) {
            this.boss.fireProjectile(player);
            this.boss.lastAttackTime = Date.now();
        }
    }

    burstShot(player) {
        if (Date.now() - this.boss.lastAttackTime >= this.boss.attackCooldown / 2) {
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    this.boss.fireProjectile(player);
                }, i * 100);
            }
            this.boss.lastAttackTime = Date.now();
        }
    }

    spreadShot(player) {
        if (Date.now() - this.boss.lastAttackTime >= this.boss.attackCooldown) {
            const baseAngle = Math.atan2(player.y - this.boss.y, player.x - this.boss.x);
            
            for (let i = -1; i <= 1; i++) {
                const angle = baseAngle + (i * Math.PI / 6);
                this.boss.projectiles.push({
                    x: this.boss.x,
                    y: this.boss.y,
                    vx: Math.cos(angle) * PROJECTILE_CONFIG.speed,
                    vy: Math.sin(angle) * PROJECTILE_CONFIG.speed,
                    size: PROJECTILE_CONFIG.size,
                    damage: this.boss.attackDamage,
                    createdAt: Date.now()
                });
            }
            this.boss.lastAttackTime = Date.now();
        }
    }

    circleShot(player) {
        if (Date.now() - this.boss.lastAttackTime >= this.boss.attackCooldown) {
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                this.boss.projectiles.push({
                    x: this.boss.x,
                    y: this.boss.y,
                    vx: Math.cos(angle) * PROJECTILE_CONFIG.speed,
                    vy: Math.sin(angle) * PROJECTILE_CONFIG.speed,
                    size: PROJECTILE_CONFIG.size,
                    damage: this.boss.attackDamage,
                    createdAt: Date.now()
                });
            }
            this.boss.lastAttackTime = Date.now();
        }
    }

    diveAttack(player) {
        // Boss charges toward player
        const dx = player.x - this.boss.x;
        const dy = player.y - this.boss.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 0) {
            this.boss.x += (dx / distance) * this.boss.speed * 1.5;
            this.boss.y += (dy / distance) * this.boss.speed * 1.5;
        }
    }

    spiralShot(player) {
        if (Date.now() - this.boss.lastAttackTime >= this.boss.attackCooldown / 3) {
            const time = Date.now() / 1000;
            const angle = (time % 2) * Math.PI * 3; // Rotating angle
            
            this.boss.projectiles.push({
                x: this.boss.x,
                y: this.boss.y,
                vx: Math.cos(angle) * PROJECTILE_CONFIG.speed,
                vy: Math.sin(angle) * PROJECTILE_CONFIG.speed,
                size: PROJECTILE_CONFIG.size,
                damage: this.boss.attackDamage,
                createdAt: Date.now()
            });
            this.boss.lastAttackTime = Date.now();
        }
    }

    dualShot(player) {
        if (Date.now() - this.boss.lastAttackTime >= this.boss.attackCooldown) {
            // Fire two projectiles at angles
            for (let offset of [-0.3, 0.3]) {
                const angle = Math.atan2(player.y - this.boss.y, player.x - this.boss.x) + offset;
                this.boss.projectiles.push({
                    x: this.boss.x,
                    y: this.boss.y,
                    vx: Math.cos(angle) * PROJECTILE_CONFIG.speed,
                    vy: Math.sin(angle) * PROJECTILE_CONFIG.speed,
                    size: PROJECTILE_CONFIG.size,
                    damage: this.boss.attackDamage,
                    createdAt: Date.now()
                });
            }
            this.boss.lastAttackTime = Date.now();
        }
    }

    drainAttack(player) {
        // Boss steals health from player
        const distance = this.boss.distanceTo(player.x, player.y);
        if (distance < 150) {
            player.takeDamage(3);
            this.boss.heal(1);
        }
    }
}
