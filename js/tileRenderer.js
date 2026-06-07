// ============================================
// TILE RENDERER
// ============================================

class TileRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = 32;
        this.cameraX = 0;
        this.cameraY = 0;
    }

    updateCamera(player, mapWidth, mapHeight) {
        const canvasPixelWidth = CANVAS_WIDTH;
        const canvasPixelHeight = CANVAS_HEIGHT;
        const mapPixelWidth = mapWidth * this.tileSize;
        const mapPixelHeight = mapHeight * this.tileSize;

        // Center camera on player
        this.cameraX = player.x - canvasPixelWidth / 2;
        this.cameraY = player.y - canvasPixelHeight / 2;

        // Clamp to map bounds
        this.cameraX = Math.max(0, Math.min(this.cameraX, mapPixelWidth - canvasPixelWidth));
        this.cameraY = Math.max(0, Math.min(this.cameraY, mapPixelHeight - canvasPixelHeight));
    }

    drawTiles(tiles, mapWidth, mapHeight, background, theme) {
        // Background
        this.ctx.fillStyle = background;
        this.ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Draw each tile
        for (let tile of tiles) {
            const screenX = tile.x * this.tileSize - this.cameraX;
            const screenY = tile.y * this.tileSize - this.cameraY;

            // Skip if off-screen
            if (screenX < -this.tileSize || screenX > CANVAS_WIDTH ||
                screenY < -this.tileSize || screenY > CANVAS_HEIGHT) {
                continue;
            }

            this.drawTile(screenX, screenY, tile, theme);
        }
    }

    drawTile(x, y, tile, theme) {
        switch (tile.type) {
            case 'wall':
                this.ctx.fillStyle = '#404040';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                this.ctx.strokeStyle = '#606060';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                break;

            case 'floor':
                this.ctx.fillStyle = '#1a2a3a';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                if (Math.random() < 0.1) {
                    this.ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
                    this.ctx.fillRect(x + 2, y + 2, 4, 4);
                }
                break;

            case 'obstacle':
                this.ctx.fillStyle = '#2a3a4a';
                this.ctx.beginPath();
                this.ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, 12, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.strokeStyle = '#4a5a6a';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
                break;

            case 'forest_floor':
                this.ctx.fillStyle = '#1a3a2a';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                break;

            case 'tree':
                this.ctx.fillStyle = '#2a5a3a';
                this.ctx.fillRect(x + 4, y + 4, this.tileSize - 8, this.tileSize - 8);
                this.ctx.strokeStyle = '#4a7a5a';
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(x + 4, y + 4, this.tileSize - 8, this.tileSize - 8);
                break;

            case 'grass':
                this.ctx.fillStyle = '#1a3a1a';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                break;

            case 'water':
                this.ctx.fillStyle = '#0a2a4a';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                this.ctx.strokeStyle = '#0a4a8a';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
                break;

            case 'rock':
                this.ctx.fillStyle = '#3a3a3a';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                this.ctx.fillStyle = '#4a4a4a';
                this.ctx.fillRect(x + 4, y + 4, this.tileSize - 8, this.tileSize - 8);
                break;

            case 'lava':
                this.ctx.fillStyle = '#4a0a0a';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                this.ctx.fillStyle = '#8a2a0a';
                this.ctx.beginPath();
                this.ctx.arc(x + this.tileSize / 2, y + this.tileSize / 2, 6, 0, Math.PI * 2);
                this.ctx.fill();
                break;

            case 'dark_stone':
                this.ctx.fillStyle = '#1a1a2a';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                this.ctx.fillStyle = '#2a2a3a';
                this.ctx.fillRect(x + 2, y + 2, 12, 12);
                break;

            case 'void':
                this.ctx.fillStyle = '#0a0000';
                this.ctx.fillRect(x, y, this.tileSize, this.tileSize);
                break;
        }
    }
}
