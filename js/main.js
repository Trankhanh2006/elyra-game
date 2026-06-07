// ============================================
// GAME ENTRY POINT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize game
    window.game = new Game();
    window.game.start();

    console.log('\n' +
        '╔══════════════════════════════════════╗\n' +
        '║        🎮 ELYRA - ADVENTURE GAME 🎮  ║\n' +
        '║                                      ║\n' +
        '║  Controls:                           ║\n' +
        '║  - WASD or Arrow Keys to move       ║\n' +
        '║  - Get close to boss to attack      ║\n' +
        '║  - Collect items to progress        ║\n' +
        '║  - Save/Load with buttons           ║\n' +
        '║                                      ║\n' +
        '║  Good luck, adventurer! ⚔️          ║\n' +
        '╚══════════════════════════════════════╝\n'
    );
});
