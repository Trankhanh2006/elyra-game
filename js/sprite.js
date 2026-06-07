// ============================================
// ANIMATED SPRITE SYSTEM
// ============================================

class Sprite {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.animationFrame = 0;
        this.animationCounter = 0;
        this.direction = 'down';
    }

    update(deltaTime) {
        this.animationCounter += deltaTime;
        if (this.animationCounter > 100) {
            this.animationFrame = (this.animationFrame + 1) % 4;
            this.animationCounter = 0;
        }
    }

    draw(ctx, size = 20) {
        const frameOffset = this.animationFrame * 5;

        switch (this.type) {
            case 'player':
                this.drawPlayer(ctx, size);
                break;
            case 'boss':
                this.drawBoss(ctx, size);
                break;
            case 'crystal':
                this.drawCrystal(ctx, size);
                break;
            case 'mirror':
                this.drawMirror(ctx, size);
                break;
            case 'memory':
                this.drawMemory(ctx, size);
                break;
            case 'npc':
                this.drawNPC(ctx, size);
                break;
        }
    }

    drawPlayer(ctx, size) {
        ctx.save();
        ctx.fillStyle = '#00ff00';
        ctx.shadowColor = '#00ff00';
        ctx.shadowBlur = 10;

        // Body
        ctx.fillRect(this.x - size / 2, this.y - size / 2, size, size);

        // Head
        ctx.fillStyle = '#00aa00';
        ctx.fillRect(this.x - size / 3, this.y - size / 1.5, size * 0.66, size * 0.5);

        // Eyes (animated)
        ctx.fillStyle = '#000';
        const eyeOffset = Math.sin(this.animationCounter / 100) * 2;
        ctx.fillRect(this.x - size / 5, this.y - size / 1.2 + eyeOffset, 3, 3);
        ctx.fillRect(this.x + size / 5, this.y - size / 1.2 + eyeOffset, 3, 3);

        ctx.restore();
    }

    drawBoss(ctx, size) {
        ctx.save();
        ctx.fillStyle = '#ff0000';
        ctx.shadowColor = '#ff0000';
        ctx.shadowBlur = 15;

        // Main body
        ctx.beginPath();
        ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
        ctx.fill();

        // Spikes (animated)
        const spikeCount = 8;
        for (let i = 0; i < spikeCount; i++) {
            const angle = (Math.PI * 2 * i) / spikeCount;
            const spikeLength = size + 8 + Math.sin(this.animationCounter / 100 + i) * 4;
            ctx.fillStyle = '#ff6600';
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(
                this.x + Math.cos(angle) * spikeLength,
                this.y + Math.sin(angle) * spikeLength
            );
            ctx.lineWidth = 2;
            ctx.stroke();
        }

        // Eyes
        ctx.fillStyle = '#ffff00';
        ctx.beginPath();
        ctx.arc(this.x - size / 3, this.y - size / 3, 3, 0, Math.PI * 2);
        ctx.arc(this.x + size / 3, this.y - size / 3, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }

    drawCrystal(ctx, size) {
        ctx.save();
        ctx.fillStyle = '#00ffff';
        ctx.shadowColor = '#00ffff';
        ctx.shadowBlur = 12;

        // Crystal shape
        const angle = (this.animationCounter / 100) * Math.PI * 2;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(angle);

        // Main crystal
        ctx.fillStyle = '#00ffff';
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size * 0.7, -size * 0.5);
        ctx.lineTo(size * 0.5, size);
        ctx.lineTo(0, size * 0.7);
        ctx.lineTo(-size * 0.5, size);
        ctx.lineTo(-size * 0.7, -size * 0.5);
        ctx.closePath();
        ctx.fill();

        // Inner glow
        ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
        ctx.restore();
    }

    drawMirror(ctx, size) {
        ctx.save();
        ctx.fillStyle = '#0088ff';
        ctx.shadowColor = '#0088ff';
        ctx.shadowBlur = 8;

        // Mirror frame
        ctx.fillRect(this.x - size, this.y - size, size * 2, size * 2);

        // Mirror reflection (animated)
        ctx.fillStyle = 'rgba(0, 136, 255, 0.6)';
        const shimmer = Math.sin(this.animationCounter / 50) * size * 0.1;
        ctx.fillRect(this.x - size + shimmer, this.y - size, 5, size * 2);

        // Border
        ctx.strokeStyle = '#0088ff';
        ctx.lineWidth = 2;
        ctx.strokeRect(this.x - size, this.y - size, size * 2, size * 2);

        ctx.restore();
    }

    drawMemory(ctx, size) {
        ctx.save();
        ctx.fillStyle = '#ff00ff';
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 10;

        // Memory orb (pulsing)
        const pulse = 1 + Math.sin(this.animationCounter / 100) * 0.2;
        ctx.beginPath();
        ctx.arc(this.x, this.y, size * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Inner core
        ctx.fillStyle = 'rgba(255, 0, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, size * pulse * 0.4, 0, Math.PI * 2);
        ctx.fill();

        // Particles orbiting
        for (let i = 0; i < 3; i++) {
            const angle = (this.animationCounter / 200) + (Math.PI * 2 * i) / 3;
            const px = this.x + Math.cos(angle) * size * 1.5;
            const py = this.y + Math.sin(angle) * size * 1.5;
            ctx.fillStyle = '#ff00ff';
            ctx.beginPath();
            ctx.arc(px, py, 2, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.restore();
    }

    drawNPC(ctx, size) {
        ctx.save();
        ctx.fillStyle = '#ffff00';
        ctx.shadowColor = '#ffff00';
        ctx.shadowBlur = 8;

        // Body
        ctx.fillRect(this.x - size * 0.6, this.y - size * 0.8, size * 1.2, size * 1.6);

        // Head
        ctx.beginPath();
        ctx.arc(this.x, this.y - size * 0.8, size * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Crown
        ctx.fillStyle = '#ffaa00';
        ctx.beginPath();
        ctx.moveTo(this.x - size * 0.6, this.y - size * 1.3);
        ctx.lineTo(this.x - size * 0.3, this.y - size * 1.6);
        ctx.lineTo(this.x, this.y - size * 1.4);
        ctx.lineTo(this.x + size * 0.3, this.y - size * 1.6);
        ctx.lineTo(this.x + size * 0.6, this.y - size * 1.3);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    }
}
