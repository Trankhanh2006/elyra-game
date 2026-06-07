// ============================================
// SAVE SYSTEM
// ============================================

class SaveSystem {
    static save(game) {
        try {
            const gameState = {
                player: game.player.serialize(),
                boss: game.boss ? game.boss.serialize() : null,
                map: game.mapSystem.serialize(),
                story: game.storyEngine.serialize(),
                timestamp: new Date().toISOString(),
                version: '1.0'
            };

            const json = JSON.stringify(gameState);
            localStorage.setItem(SAVE_CONFIG.storageKey, json);
            
            console.log('💾 Game saved successfully!');
            document.getElementById('storyText').innerText = '💾 Game saved!';
            
            return true;
        } catch (e) {
            console.error('Save error:', e);
            document.getElementById('storyText').innerText = '❌ Save failed!';
            return false;
        }
    }

    static load(game) {
        try {
            const json = localStorage.getItem(SAVE_CONFIG.storageKey);
            if (!json) {
                console.log('No save file found');
                return false;
            }

            const gameState = JSON.parse(json);

            // Restore player
            game.player.deserialize(gameState.player);

            // Restore boss if exists
            if (gameState.boss) {
                game.boss = new Boss(
                    gameState.boss.x,
                    gameState.boss.y,
                    gameState.boss.type
                );
                game.boss.deserialize(gameState.boss);
            }

            // Restore map
            game.mapSystem.deserialize(gameState.map);

            // Restore story
            game.storyEngine.deserialize(gameState.story);

            console.log('📂 Game loaded successfully!');
            document.getElementById('storyText').innerText = '📂 Game loaded!';
            
            return true;
        } catch (e) {
            console.error('Load error:', e);
            document.getElementById('storyText').innerText = '❌ Load failed!';
            return false;
        }
    }

    static deleteSave() {
        localStorage.removeItem(SAVE_CONFIG.storageKey);
        console.log('Save deleted');
    }

    static hasSave() {
        return localStorage.getItem(SAVE_CONFIG.storageKey) !== null;
    }
}
