// ============================================
// MAP SYSTEM
// ============================================

class MapSystem {
    constructor() {
        this.currentMapId = MAP_IDS.LUMINA;
        this.maps = {};
        this.initializeMaps();
    }

    initializeMaps() {
        // LUMINA - Starting map
        this.maps[MAP_IDS.LUMINA] = {
            id: MAP_IDS.LUMINA,
            name: MAP_NAMES.lumina,
            background: '#0a0a0a',
            gridColor: 'rgba(0, 255, 0, 0.05)',
            items: [
                { x: 200, y: 250, type: 'crystal', collected: false, size: 12 },
                { x: 800, y: 280, type: 'crystal', collected: false, size: 12 },
                { x: 500, y: 600, type: 'crystal', collected: false, size: 12 }
            ],
            npc: { x: 100, y: 100, name: 'Khánh', size: 12 },
            boss: 'morzak',
            requiredItemsToProgress: 3, // Collect all crystals
            nextMapId: MAP_IDS.FOREST_MIRRORS
        };

        // FOREST OF MIRRORS
        this.maps[MAP_IDS.FOREST_MIRRORS] = {
            id: MAP_IDS.FOREST_MIRRORS,
            name: MAP_NAMES.forestMirrors,
            background: '#1a3a3a',
            gridColor: 'rgba(0, 255, 255, 0.05)',
            items: [
                { x: 250, y: 350, type: 'mirror', broken: false, size: 20 },
                { x: 500, y: 300, type: 'mirror', broken: false, size: 20 },
                { x: 750, y: 400, type: 'mirror', broken: false, size: 20 }
            ],
            npc: null,
            boss: null,
            requiredItemsToProgress: 3,
            nextMapId: MAP_IDS.LAKE_MEMORY
        };

        // LAKE OF MEMORY
        this.maps[MAP_IDS.LAKE_MEMORY] = {
            id: MAP_IDS.LAKE_MEMORY,
            name: MAP_NAMES.lakeMemory,
            background: '#1a1a3a',
            gridColor: 'rgba(255, 0, 255, 0.05)',
            items: [
                { x: 300, y: 300, type: 'memory', text: 'Ký ức 1: Ngày xưa...', revealed: false, size: 15 },
                { x: 700, y: 280, type: 'memory', text: 'Ký ức 2: Morzak xuất hiện...', revealed: false, size: 15 },
                { x: 500, y: 600, type: 'memory', text: 'Ký ức 3: Tìm 3 tinh thể để cứu Khánh!', revealed: false, size: 15 }
            ],
            npc: null,
            boss: null,
            requiredItemsToProgress: 3,
            nextMapId: MAP_IDS.BLACK_DRAGON_MOUNTAIN
        };

        // BLACK DRAGON MOUNTAIN
        this.maps[MAP_IDS.BLACK_DRAGON_MOUNTAIN] = {
            id: MAP_IDS.BLACK_DRAGON_MOUNTAIN,
            name: MAP_NAMES.blackDragonMountain,
            background: '#2a0a0a',
            gridColor: 'rgba(255, 0, 0, 0.05)',
            items: [],
            npc: null,
            boss: 'blackDragon',
            requiredItemsToProgress: 0,
            nextMapId: MAP_IDS.SHADOW_ABYSS
        };

        // SHADOW ABYSS - Final map
        this.maps[MAP_IDS.SHADOW_ABYSS] = {
            id: MAP_IDS.SHADOW_ABYSS,
            name: MAP_NAMES.shadowAbyss,
            background: '#0a0000',
            gridColor: 'rgba(255, 0, 0, 0.03)',
            items: [],
            npc: { x: 512, y: 200, name: 'Khánh (Bị giam)', size: 12 },
            boss: 'morzakFinal',
            requiredItemsToProgress: 0,
            nextMapId: null // Final map
        };
    }

    getCurrentMap() {
        return this.maps[this.currentMapId];
    }

    getMapName() {
        const map = this.getCurrentMap();
        return map ? map.name : 'Unknown';
    }

    getItems() {
        const map = this.getCurrentMap();
        return map ? map.items : [];
    }

    getNPC() {
        const map = this.getCurrentMap();
        return map ? map.npc : null;
    }

    getBossType() {
        const map = this.getCurrentMap();
        return map ? map.boss : null;
    }

    checkItemCollision(player) {
        const items = this.getItems();
        for (let item of items) {
            if (!item.collected && !item.broken && !item.revealed) {
                if (CollisionSystem.playerVsItem(player, item)) {
                    return item;
                }
            }
        }
        return null;
    }

    collectItem(item) {
        if (item.type === 'crystal' || item.type === 'memory') {
            item.collected = true;
        } else if (item.type === 'mirror') {
            item.broken = true;
            item.collected = true;
        } else if (item.type === 'memory') {
            item.revealed = true;
            item.collected = true;
        }
    }

    isMapComplete() {
        const map = this.getCurrentMap();
        if (!map) return false;

        const items = map.items;
        const collectedCount = items.filter(i => i.collected || i.broken || i.revealed).length;
        return collectedCount >= map.requiredItemsToProgress;
    }

    progressToNextMap() {
        const map = this.getCurrentMap();
        if (map && map.nextMapId) {
            this.currentMapId = map.nextMapId;
            return true;
        }
        return false;
    }

    serialize() {
        return {
            currentMapId: this.currentMapId,
            maps: JSON.parse(JSON.stringify(this.maps))
        };
    }

    deserialize(data) {
        this.currentMapId = data.currentMapId;
        this.maps = data.maps;
    }
}
