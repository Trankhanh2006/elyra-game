// ============================================
// GAME ENTRY POINT - ENHANCED
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    window.game = new Game();
    window.game.start();

    // Log startup message
    console.log(
        '%c🎮 ELYRA - ENHANCED ADVENTURE GAME\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '✨ Features:\n' +
        '  • Advanced Boss AI Patterns\n' +
        '  • Particle & Animation System\n' +
        '  • Sound Effects (Web Audio)\n' +
        '  • Screen Shake & Effects\n' +
        '  • Difficulty Levels\n' +
        '  • Critical Hits\n' +
        '  • Stats Tracking\n' +
        '  • Phase Transitions\n' +
        '\n⌨️ Controls:\n' +
        '  • WASD or Arrow Keys to move\n' +
        '  • Get close to boss to attack\n' +
        '  • Collect items to progress\n' +
        '\n💾 Save/Load:\n' +
        '  • Automatic every 10 seconds\n' +
        '  • Manual save/load buttons\n' +
        '\n🎯 Good luck, adventurer! 🎯',
        'color: #00ff00; background: #000; padding: 10px; font-weight: bold; font-family: monospace;'
    );

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            console.log('Game paused (Press Escape again to resume)');
        }
        if (e.key === 'p') {
            console.log('Current Stats:', window.game.statsPanel);
        }
    });
});
