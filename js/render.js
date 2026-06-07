// ============================================
// RENDER SYSTEM - ENHANCED
// ============================================

class RenderSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.lastFrameTime = 0;
        this.debugMode = false;
    }

    clear(backgroundColor) {
        this.ctx.fillStyle = backgroundColor || COLORS.background;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    }

    drawGrid(gridColor) {
        this.ctx.strokeStyle = gridColor || COLORS.grid;
        this.ctx.lineWidth = 1;

        for (let i = 0; i <= CANVAS_WIDTH; i += 64) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, 0);
            this.ctx.lineTo(i, CANVAS_HEIGHT);
            this.ctx.stroke();
        }

        for (let i = 0; i <= CANVAS_HEIGHT; i += 64) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, i);
            this.ctx.lineTo(CANVAS_WIDTH, i);
            this.ctx.stroke();
        }
    }

    drawPlayer(player) {
        // Player circle with glow
        this.drawGlow(player.x, player.y, player.size + 5, COLORS.player, 0.3);
        
        this.ctx.fillStyle = COLORS.player;
        this.ctx.beginPath();
        this.ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = COLORS.playerOutline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Eyes animation
        const eyeY = player.y - 5;
        this.ctx.fillStyle = '#000';
        this.ctx.beginPath();
        this.ctx.arc(player.x - 5, eyeY, 2, 0, Math.PI * 2);
        this.ctx.arc(player.x + 5, eyeY, 2, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawBoss(boss) {
        if (!boss || !boss.active) return;

        // Damage flash effect
        let alpha = 1.0;
        if (boss.damageFlash > 0) {
            alpha = 0.5 + (boss.damageFlash / 100) * 0.5;
        }
        this.ctx.globalAlpha = alpha;

        // Boss with glow
        this.drawGlow(boss.x, boss.y, boss.size + 8, COLORS.boss, 0.4);
        
        this.ctx.fillStyle = COLORS.boss;
        this.ctx.beginPath();
        this.ctx.arc(boss.x, boss.y, boss.size, 0, Math.PI * 2);
        this.ctx.fill();

        // Outline
        this.ctx.strokeStyle = COLORS.bossOutline;
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        this.ctx.globalAlpha = 1.0;

        // HP bar
        this.drawBossHPBar(boss);

        // Boss name
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(boss.type.toUpperCase(), boss.x, boss.y - boss.size - 35);
        
        // Phase indicator
        if (boss.phase > 1) {
            this.ctx.fillStyle = '#ffff00';
            this.ctx.font = 'bold 9px Arial';
            this.ctx.fillText(`PHASE ${boss.phase}`, boss.x, boss.y + boss.size + 30);
        }
    }

    drawBossHPBar(boss) {
        const barWidth = 80;
        const barHeight = 10;
        const barX = boss.x - barWidth / 2;
        const barY = boss.y - boss.size - 25;

        // Background
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // HP fill with gradient
        const hpPercent = Math.max(0, boss.hp / boss.maxHp);
        let fillColor;
        if (hpPercent > 0.5) {
            fillColor = '#ff0000';
        } else if (hpPercent > 0.25) {
            fillColor = '#ff6600';
        } else {
            fillColor = '#ff00ff';
        }
        
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // Border
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);

        // HP text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.ceil(boss.hp)}/${boss.maxHp}`, boss.x, barY + 8);
    }

    drawProjectiles(projectiles) {
        for (let proj of projectiles) {
            // Glow effect
            this.drawGlow(proj.x, proj.y, proj.size + 4, COLORS.projectile, 0.4);
            
            this.ctx.fillStyle = COLORS.projectile;
            this.ctx.beginPath();
            this.ctx.arc(proj.x, proj.y, proj.size, 0, Math.PI * 2);
            this.ctx.fill();

            // Border
            this.ctx.strokeStyle = '#ffff00';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }

    drawCrystal(item) {
        // Rotating glow
        const rotation = (Date.now() / 20) % 360;
        this.drawGlow(item.x, item.y, item.size + 6, COLORS.crystal, 0.5);
        
        this.ctx.fillStyle = COLORS.crystal;
        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = '#00ffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Inner animation
        this.ctx.fillStyle = 'rgba(0, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.size * 0.6, 0, Math.PI * 2);
        this.ctx.fill();
    }

    drawMirror(item) {
        const opacity = item.broken ? 0.3 : 1.0;
        this.ctx.globalAlpha = opacity;

        this.drawGlow(item.x, item.y, item.size + 3, COLORS.mirror, 0.3);
        
        this.ctx.fillStyle = COLORS.mirror;
        this.ctx.fillRect(item.x - item.size, item.y - item.size, item.size * 2, item.size * 2);

        this.ctx.strokeStyle = item.broken ? '#666' : '#0088ff';
        this.ctx.lineWidth = item.broken ? 1 : 2;
        this.ctx.strokeRect(item.x - item.size, item.y - item.size, item.size * 2, item.size * 2);

        // Crack effect if broken
        if (item.broken) {
            this.ctx.strokeStyle = '#666';
            this.ctx.lineWidth = 1;
            const cracks = 4;
            for (let i = 0; i < cracks; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(item.x - item.size + i * (item.size * 2 / cracks), item.y - item.size);
                this.ctx.lineTo(item.x - item.size + (i + 1) * (item.size * 2 / cracks), item.y + item.size);
                this.ctx.stroke();
            }
        }

        this.ctx.globalAlpha = 1.0;
    }

    drawMemory(item) {
        this.drawGlow(item.x, item.y, item.size + 5, COLORS.memory, 0.4);
        
        this.ctx.fillStyle = COLORS.memory;
        this.ctx.beginPath();
        this.ctx.arc(item.x, item.y, item.size, 0, Math.PI * 2);
        this.ctx.fill();

        this.ctx.strokeStyle = item.revealed ? '#666' : '#ff00ff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Revealed effect
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

        this.drawGlow(npc.x, npc.y, npc.size + 5, COLORS.npc, 0.3);
        
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

    drawGlow(x, y, radius, color, alpha) {
        const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, color + '88');
        gradient.addColorStop(1, color + '00');
        
        this.ctx.fillStyle = gradient;
        this.ctx.globalAlpha = alpha;
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.globalAlpha = 1.0;
    }

    updateUI(player, mapName, storyStep) {
        const hpPercent = Math.max(0, (player.hp / player.maxHp) * 100);
        document.getElementById('hpFill').style.width = hpPercent + '%';
        document.getElementById('hpText').innerText = `${Math.ceil(player.hp)}/${player.maxHp}`;
        document.getElementById('mapName').innerText = `MAP: ${mapName}`;
        document.getElementById('stepInfo').innerText = `Step: ${storyStep}`;
    }
}
