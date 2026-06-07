// ============================================
// ENHANCED RENDER SYSTEM WITH LAYERS
// ============================================

class RenderSystem {
    constructor(canvas, tileRenderer) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileRenderer = tileRenderer;
    }

    render(game) {
        const map = game.mapSystem.getCurrentMap();

        // LAYER 1: Tiles (Background)
        this.tileRenderer.updateCamera(game.player, map.width, map.height);
        this.tileRenderer.drawTiles(map.tiles, map.width, map.height, map.background, map.theme);

        // LAYER 2: Map Objects
        this.drawMapObjects(game, map);

        // LAYER 3: Entities (Player, Boss)
        this.drawEntities(game, map);

        // LAYER 4: Effects & Particles
        game.effects.draw(this.ctx);

        // LAYER 5: UI
        this.drawUI(game, map);
    }

    drawMapObjects(game, map) {
        const offsetX = -this.tileRenderer.cameraX;
        const offsetY = -this.tileRenderer.cameraY;

        for (let obj of map.objects) {
            const screenX = obj.x * 32 + offsetX;
            const screenY = obj.y * 32 + offsetY;

            if (screenX < -50 || screenX > CANVAS_WIDTH + 50 ||
                screenY < -50 || screenY > CANVAS_HEIGHT + 50) {
                continue;
            }

            const sprite = new Sprite(screenX + 16, screenY + 16, obj.type);
            sprite.draw(this.ctx, 12);

            // Draw label
            if (obj.name) {
                this.ctx.fillStyle = obj.color || '#ffff00';
                this.ctx.font = 'bold 10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(obj.name, screenX + 16, screenY - 5);
            }
        }
    }

    drawEntities(game, map) {
        const offsetX = -this.tileRenderer.cameraX;
        const offsetY = -this.tileRenderer.cameraY;

        // Draw player
        const playerScreenX = game.player.x + offsetX;
        const playerScreenY = game.player.y + offsetY;
        game.player.sprite.draw(this.ctx, 16);

        // Draw boss
        if (game.boss && game.boss.active) {
            const bossScreenX = game.boss.x + offsetX;
            const bossScreenY = game.boss.y + offsetY;
            
            // Only draw if on screen
            if (bossScreenX > -50 && bossScreenX < CANVAS_WIDTH + 50 &&
                bossScreenY > -50 && bossScreenY < CANVAS_HEIGHT + 50) {
                
                const bossSprite = new Sprite(bossScreenX, bossScreenY, 'boss');
                bossSprite.draw(this.ctx, 18);
                this.drawBossHealthBar(bossScreenX, bossScreenY, game.boss);
            }
        }

        // Draw projectiles
        for (let proj of (game.boss?.projectiles || [])) {
            const projScreenX = proj.x + offsetX;
            const projScreenY = proj.y + offsetY;
            
            this.ctx.fillStyle = '#ffff00';
            this.ctx.shadowColor = '#ffff00';
            this.ctx.shadowBlur = 5;
            this.ctx.beginPath();
            this.ctx.arc(projScreenX, projScreenY, 4, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        }
    }

    drawBossHealthBar(x, y, boss) {
        const barWidth = 60;
        const barHeight = 8;
        const barX = x - barWidth / 2;
        const barY = y - 40;

        // Background
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // HP fill
        const hpPercent = boss.hp / boss.maxHp;
        let fillColor = hpPercent > 0.5 ? '#ff0000' : hpPercent > 0.25 ? '#ff6600' : '#ff00ff';
        this.ctx.fillStyle = fillColor;
        this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);

        // Border
        this.ctx.strokeStyle = '#ff0000';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);

        // HP text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${Math.ceil(boss.hp)}/${boss.maxHp}`, x, barY + 7);
    }

    drawUI(game, map) {
        // Status bar (top)
        this.drawStatusBar(game, map);

        // Quest log (top-left corner)
        this.drawQuestLog(game);

        // Story panel (bottom)
        this.drawStoryPanel(game);
    }

    drawStatusBar(game, map) {
        const padding = 10;
        const barHeight = 50;
        const hpPercent = (game.player.hp / game.player.maxHp) * 100;

        // HP Bar
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(padding, padding, 200, barHeight);
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(padding, padding, 200, barHeight);

        // HP fill
        this.ctx.fillStyle = hpPercent > 50 ? '#00ff00' : hpPercent > 25 ? '#ffff00' : '#ff0000';
        this.ctx.fillRect(padding + 2, padding + 2, (200 - 4) * (hpPercent / 100), barHeight - 4);

        // HP text
        this.ctx.fillStyle = '#00ff00';
        this.ctx.font = 'bold 12px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText(`HP: ${Math.ceil(game.player.hp)}/${game.player.maxHp}`, padding + 8, padding + 20);
        this.ctx.font = '10px Arial';
        this.ctx.fillText(`Level: ${game.player.stats.level}`, padding + 8, padding + 35);

        // Map name (center)
        this.ctx.font = 'bold 14px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = '#00ffff';
        this.ctx.fillText(map.name, CANVAS_WIDTH / 2, padding + 25);

        // Gold (top-right)
        this.ctx.textAlign = 'right';
        this.ctx.font = '12px Arial';
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillText(`💰 ${game.player.stats.gold}`, CANVAS_WIDTH - padding - 10, padding + 20);
    }

    drawQuestLog(game) {
        if (!game.questSystem.activeQuest) return;

        const quest = game.questSystem.activeQuest;
        const padding = 10;
        const x = padding;
        const y = 70;
        const width = 250;
        const height = 80;

        // Background
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
        this.ctx.fillRect(x, y, width, height);
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(x, y, width, height);

        // Quest name
        this.ctx.fillStyle = '#ffff00';
        this.ctx.font = 'bold 11px Arial';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('📋 QUEST', x + 10, y + 15);

        // Quest title
        this.ctx.fillStyle = '#00ffff';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(quest.name, x + 10, y + 30);

        // Progress bar
        const barY = y + 40;
        const barWidth = width - 20;
        const barHeight = 12;
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(x + 10, barY, barWidth, barHeight);
        
        const progress = quest.progress / quest.required;
        this.ctx.fillStyle = progress > 0.5 ? '#00ff00' : progress > 0.25 ? '#ffff00' : '#ff6600';
        this.ctx.fillRect(x + 10, barY, barWidth * progress, barHeight);
        
        this.ctx.strokeStyle = '#ffff00';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(x + 10, barY, barWidth, barHeight);

        // Progress text
        this.ctx.fillStyle = '#fff';
        this.ctx.font = 'bold 9px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`${quest.progress}/${quest.required}`, x + 10 + barWidth / 2, barY + 9);
    }

    drawStoryPanel(game) {
        const storyText = document.getElementById('storyText');
        // Story is handled by HTML, so we just update the engine
    }
}
