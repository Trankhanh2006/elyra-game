// ============================================
// WORLD BUILDER - Map Tile System
// ============================================

class WorldBuilder {
    constructor() {
        this.tileSize = 32;
        this.maps = {};
        this.buildAllMaps();
    }

    buildAllMaps() {
        // LUMINA - Starting map with light theme
        this.maps.lumina = {
            id: 'lumina',
            name: 'Lumina - Vùng Khởi Đầu',
            width: 32,
            height: 24,
            background: '#0a1a2e',
            theme: 'light',
            tiles: this.generateLuminaTiles(),
            objects: this.generateLuminaObjects(),
            description: 'Thư viện cổ Lumina - nơi mọi thứ bắt đầu'
        };

        // FOREST OF MIRRORS - Mirror/illusion theme
        this.maps.forestMirrors = {
            id: 'forestMirrors',
            name: 'Rừng Gương - Ảo Ảnh',
            width: 32,
            height: 24,
            background: '#1a3a3a',
            theme: 'mirror',
            tiles: this.generateForestTiles(),
            objects: this.generateForestObjects(),
            description: 'Rừng đầy những chiếc gương giả'
        };

        // LAKE OF MEMORY - Memory/emotion theme
        this.maps.lakeMemory = {
            id: 'lakeMemory',
            name: 'Hồ Ký Ức',
            width: 32,
            height: 24,
            background: '#1a1a3a',
            theme: 'memory',
            tiles: this.generateLakeTiles(),
            objects: this.generateLakeObjects(),
            description: 'Hồ nước tâm linh - nơi lưu giữ ký ức'
        };

        // BLACK DRAGON MOUNTAIN - Dark/danger theme
        this.maps.blackDragonMountain = {
            id: 'blackDragonMountain',
            name: 'Núi Rồng Đen',
            width: 32,
            height: 24,
            background: '#2a0a0a',
            theme: 'danger',
            tiles: this.generateMountainTiles(),
            objects: this.generateMountainObjects(),
            description: 'Núi đen với lửa tối - nơi Rồng Đen cư trú'
        };

        // SHADOW ABYSS - Final dark theme
        this.maps.shadowAbyss = {
            id: 'shadowAbyss',
            name: 'Shadow Abyss - Lâu Đài Tối',
            width: 32,
            height: 24,
            background: '#0a0000',
            theme: 'abyss',
            tiles: this.generateAbyssTiles(),
            objects: this.generateAbyssObjects(),
            description: 'Lâu đài bóng tối của Morzak - nơi ở của tối tăm'
        };
    }

    generateLuminaTiles() {
        const tiles = [];
        const width = 32, height = 24;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                // Border walls
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    tiles.push({ x, y, type: 'wall', solid: true });
                }
                // Random obstacles (20% chance)
                else if (Math.random() < 0.05) {
                    tiles.push({ x, y, type: 'obstacle', solid: true });
                }
                // Floor
                else {
                    tiles.push({ x, y, type: 'floor', solid: false });
                }
            }
        }
        return tiles;
    }

    generateForestTiles() {
        const tiles = [];
        const width = 32, height = 24;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    tiles.push({ x, y, type: 'wall', solid: true });
                }
                else if (Math.random() < 0.1) {
                    tiles.push({ x, y, type: 'tree', solid: true });
                }
                else {
                    tiles.push({ x, y, type: 'forest_floor', solid: false });
                }
            }
        }
        return tiles;
    }

    generateLakeTiles() {
        const tiles = [];
        const width = 32, height = 24;
        const centerX = width / 2, centerY = height / 2;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const dist = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
                
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    tiles.push({ x, y, type: 'wall', solid: true });
                }
                else if (dist < 8) {
                    tiles.push({ x, y, type: 'water', solid: false });
                }
                else {
                    tiles.push({ x, y, type: 'grass', solid: false });
                }
            }
        }
        return tiles;
    }

    generateMountainTiles() {
        const tiles = [];
        const width = 32, height = 24;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    tiles.push({ x, y, type: 'wall', solid: true });
                }
                else if (y > height * 0.7 || Math.random() < 0.08) {
                    tiles.push({ x, y, type: 'rock', solid: true });
                }
                else {
                    tiles.push({ x, y, type: 'lava', solid: false });
                }
            }
        }
        return tiles;
    }

    generateAbyssTiles() {
        const tiles = [];
        const width = 32, height = 24;
        
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (x === 0 || x === width - 1 || y === 0 || y === height - 1) {
                    tiles.push({ x, y, type: 'wall', solid: true });
                }
                else if (Math.random() < 0.15) {
                    tiles.push({ x, y, type: 'dark_stone', solid: true });
                }
                else {
                    tiles.push({ x, y, type: 'void', solid: false });
                }
            }
        }
        return tiles;
    }

    generateLuminaObjects() {
        return [
            { x: 5, y: 5, type: 'crystal', color: '#00ffff' },
            { x: 26, y: 5, type: 'crystal', color: '#00ffff' },
            { x: 16, y: 20, type: 'crystal', color: '#00ffff' },
            { x: 16, y: 2, type: 'npc', name: 'Khánh', color: '#ffff00' },
            { x: 16, y: 22, type: 'portal', color: '#ff00ff' }
        ];
    }

    generateForestObjects() {
        return [
            { x: 8, y: 8, type: 'mirror', color: '#0088ff' },
            { x: 24, y: 8, type: 'mirror', color: '#0088ff' },
            { x: 16, y: 16, type: 'mirror', color: '#0088ff' },
            { x: 16, y: 22, type: 'portal', color: '#ff00ff' }
        ];
    }

    generateLakeObjects() {
        return [
            { x: 8, y: 12, type: 'memory', color: '#ff00ff' },
            { x: 24, y: 12, type: 'memory', color: '#ff00ff' },
            { x: 16, y: 8, type: 'memory', color: '#ff00ff' },
            { x: 16, y: 22, type: 'portal', color: '#ff00ff' }
        ];
    }

    generateMountainObjects() {
        return [
            { x: 16, y: 22, type: 'portal', color: '#ff00ff' }
        ];
    }

    generateAbyssObjects() {
        return [
            { x: 16, y: 2, type: 'npc', name: 'Khánh (Bị Giam)', color: '#ffff00' }
        ];
    }

    getMap(mapId) {
        return this.maps[mapId];
    }
}
