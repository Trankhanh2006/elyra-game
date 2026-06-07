// ============================================
// ANIMATION SYSTEM
// ============================================

class Animation {
    constructor(x, y, type = 'burst') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.life = 1.0;
        this.maxLife = 1.0;
        this.particles = [];
        this.initParticles();
    }

    initParticles() {
        if (this.type === 'burst') {
            for (let i = 0; i < 12; i++) {
                const angle = (Math.PI * 2 * i) / 12;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * 3,
                    vy: Math.sin(angle) * 3,
                    life: 1.0,
                    color: '#00ff00'
                });
            }
        } else if (this.type === 'damage') {
            for (let i = 0; i < 8; i++) {
                const angle = (Math.PI * 2 * i) / 8;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * 4,
                    vy: Math.sin(angle) * 4,
                    life: 1.0,
                    color: '#ff0000'
                });
            }
        } else if (this.type === 'heal') {
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI * 2 * i) / 10;
                this.particles.push({
                    x: this.x,
                    y: this.y,
                    vx: Math.cos(angle) * 2,
                    vy: Math.sin(angle) * 2,
                    life: 1.0,
                    color: '#00ffff'
                });
            }
        }
    }

    update(dt) {
        this.life -= dt / 500; // Decay over 500ms
        
        for (let particle of this.particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.1; // Gravity
            particle.life = Math.max(0, particle.life - dt / 500);
        }
    }

    draw(ctx) {
        for (let particle of this.particles) {
            ctx.fillStyle = particle.color;
            ctx.globalAlpha = particle.life * 0.8;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.globalAlpha = 1.0;
    }

    isDone() {
        return this.life <= 0;
    }
}

class DamageNumber {
    constructor(x, y, damage, isCritical = false) {
        this.x = x;
        this.y = y;
        this.damage = damage;
        this.isCritical = isCritical;
        this.life = 1.0;
        this.vy = -2;
    }

    update(dt) {
        this.y += this.vy;
        this.life -= dt / 800; // Fade over 800ms
    }

    draw(ctx) {
        ctx.fillStyle = this.isCritical ? '#ffff00' : '#ff0000';
        ctx.globalAlpha = this.life * 0.9;
        ctx.font = this.isCritical ? 'bold 20px Arial' : 'bold 16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('-' + this.damage, this.x, this.y);
        ctx.globalAlpha = 1.0;
    }

    isDone() {
        return this.life <= 0;
    }
}
