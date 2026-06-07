// ============================================
// GAME ENTRY POINT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Create and start game
    window.game = new Game();
    window.game.start();

    // Setup event listeners
    document.getElementById('btnSave').addEventListener('click', () => {
        window.game.saveGame();
    });

    document.getElementById('btnLoad').addEventListener('click', () => {
        if (SaveSystem.hasSave()) {
            window.game.loadGame();
        } else {
            alert('No save file found!');
        }
    });

    document.getElementById('btnHelp').addEventListener('click', () => {
        alert(
            'ELYRA - Adventure Game\n\n' +
            'WASD/Arrow Keys: Move\n' +
            'Get close to boss: Attack\n' +
            'Touch items: Collect\n' +
            'Complete quests to progress\n\n' +
            'Goal: Save Khánh from Morzak!'
        );
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'p') {
            console.log('Game Stats:', window.game.player.stats);
            console.log('Current Map:', window.game.currentMap.name);
            console.log('Active Quest:', window.game.questSystem.activeQuest?.name);
        }
    });

    console.log(
        '%c🎮 ELYRA - Complete Adventure Game\n' +
        'Loaded successfully!\n' +
        'Press P for debug info',
        'color: #00ff00; background: #000; padding: 10px; font-weight: bold;'
    );
});
