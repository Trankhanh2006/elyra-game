// ============================================
// RENDER SYSTEM
// ============================================

class RenderSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lastFrameTime = 0;
    }

    clear(backgroundColor) {
        this.ctx.fillStyle = backgroundColor || COLORS.background;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawGrid(gridColor) {
        this.ctx.strokeStyle = gridColor || COLORS.grid;
        this.ctx.lineWidth = 1;

        // Vertical lines
        for (let i = 0; i <= CANVAS_WIDTH; i += 64) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, CANVAS_HEIGHT);
            this.ctx.stroke();
        }

        // Horizontal lines
        for (let i = 0; i <= CANVAS_HEIGHT; i += 64) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(CANVAS_WIDTH, i);
            this.ctx.stroke();
        }
    }

    drawPlayer(player) {
        // Player circle
        this.ctx.fillStyle = COLORS.player;
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = COLORS.playerOutline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // HP indicator
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`Vy`, player.x, player.y - 35);
    }

    drawBoss(boss) {
        if (!boss || !boss.active) return;

        // Boss circle
        this.ctx.fillStyle = COLORS.boss;
        this.ctx.beginPath();
        this.ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = COLORS.bossOutline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // HP bar background
        const barWidth = 70;
        const barHeight = 8;
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(boss.x - barWidth / 2, boss.y - boss.size - 25, barWidth, barHeight);

        // HP bar fill
        const hpPercent = Math.max(0, boss.hp / boss.maxHp);
        this.ctx.fillStyle = hpPercent > 0.5 ? '#ff0000' : hpPercent > 0.25 ? '#ff6600' : '#ff00ff';
        this.ctx.fillRect(boss.x - barWidth / 2, boss.y - boss.size - 25, barWidth * hpPercent, barHeight);

        // HP bar border
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(boss.x - barWidth / 2, boss.y - boss.size - 25, barWidth, barHeight);

        // Boss name and HP text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 10px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${boss.type}`, boss.x, boss.y + boss.size + 15);
        this.ctx.font = '9px Arial';
        this.ctx.fillText(`${Math.ceil(boss.hp)}/${boss.maxHp}`, boss.x, boss.y + boss.size + 26);
    }

    drawProjectiles(projectiles) {
        this.ctx.fillStyle = COLORS.projectile;
        for (let proj of projectiles) {
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Glow effect
            this.ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    drawCrystal(item) {
        this.ctx.fillStyle = COLORS.crystal;
        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Inner glow
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawMirror(item) {
        this.ctx.fillStyle = item.broken ? 'rgba(0, 136, 255, 0.3)' : COLORS.mirror;
        this.ctx.fillRect(item.x - item.size, item.y - item.size, item.size * 2, item.size * 2);

        this.ctx.strokeStyle = item.broken ? '#666' : '#0088ff';
        this.ctx.lineWidth = item.broken ? 1 : 2;
        this.ctx.strokeRect(item.x - item.size, item.y - item.size, item.size * 2, item.size * 2);

        if (item.broken) {
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 1;
            this.ctx.beginPath();
            this.ctx.moveTo(item.x - item.size, item.y - item.size);
            this.ctx.lineTo(item.x + item.size, item.y + item.size);
            this.ctx.stroke();
            this.ctx.beginPath();
            this.ctx.moveTo(item.x + item.size, item.y - item.size);
            this.ctx.lineTo(item.x - item.size, item.y + item.size);
            this.ctx.stroke();
        }
    }

    drawMemory(item) {
        this.ctx.fillStyle = COLORS.memory;
        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = item.revealed ? '#666' : '#ff00ff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        if (item.revealed) {
            this.ctx.fillStyle = 'rgba(255, 255, 0, 0.7)';
            this.ctx.beginPath();
            this.ctx.arc(item.x, item.y, item.size * 0.5, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    drawItems(items) {
        for (let item of items) {
            if (item.collected) continue;

            if (item.type === 'crystal') {
                this.drawCrystal(item);
            } else if (item.type === 'mirror') {
                this.drawMirror(item);
            } else if (item.type === 'memory') {
                this.drawMemory(item);
            }
        }
    }

    drawNPC(npc) {
        if (!npc) return;

        this.ctx.fillStyle = COLORS.npc;
        this.ctx.fillRect(npc.x - npc.size, npc.y - npc.size, npc.size * 2, npc.size * 2);

        this.ctx.strokeStyle = '#ffaa00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(npc.x - npc.size, npc.y - npc.size, npc.size * 2, npc.size * 2);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(npc.name, npc.x, npc.y - npc.size - 12);
    }

    updateUI(player, mapName) {
        const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
        document.getElementById('hpFill').style.width = hpPercent + '%';
        document.getElementById('hpText').innerText = `${Math.ceil(player.hp)}/${player.maxHp}`;
        document.getElementById('mapName').innerText = `MAP: ${mapName}`;
    }
}
