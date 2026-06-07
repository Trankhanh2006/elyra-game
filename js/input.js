// ============================================
// INPUT MANAGER
// ============================================

class InputManager {
    constructor() {
        this.keys = {};
        this.lastMovement = { dx: 0, dy: 0 };
        this.setupKeyboardListeners();
        this.setupMobileButtonListeners();
    }

    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }

    setupMobileButtonListeners() {
        // D-Pad buttons
        const dpadButtons = document.querySelectorAll('.dpadBtn');
        dpadButtons.forEach(btn => {
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                const dir = btn.id.replace('btn', '').toLowerCase();
                this.keys[dir] = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                const dir = btn.id.replace('btn', '').toLowerCase();
                this.keys[dir] = false;
            });
            btn.addEventListener('mousedown', (e) => {
                const dir = btn.id.replace('btn', '').toLowerCase();
                this.keys[dir] = true;
            });
            btn.addEventListener('mouseup', (e) => {
                const dir = btn.id.replace('btn', '').toLowerCase();
                this.keys[dir] = false;
            });
        });

        // Save/Load buttons
        document.getElementById('btnSave').addEventListener('click', () => {
            if (window.game) window.game.saveGame();
        });
        document.getElementById('btnLoad').addEventListener('click', () => {
            if (window.game) window.game.loadGame();
        });
    }

    getMovementInput() {
        let dx = 0;
        let dy = 0;

        // Keyboard/Arrow keys
        if (this.keys['w'] || this.keys['arrowup'] || this.keys['up']) {
            dy -= PLAYER_CONFIG.SPEED;
        }
        if (this.keys['s'] || this.keys['arrowdown'] || this.keys['down']) {
            dy += PLAYER_CONFIG.SPEED;
        }
        if (this.keys['a'] || this.keys['arrowleft'] || this.keys['left']) {
            dx -= PLAYER_CONFIG.SPEED;
        }
        if (this.keys['d'] || this.keys['arrowright'] || this.keys['right']) {
            dx += PLAYER_CONFIG.SPEED;
        }

        this.lastMovement = { dx, dy };
        return { dx, dy };
    }

    isKeyPressed(key) {
        return this.keys[key.toLowerCase()] || false;
    }
}
