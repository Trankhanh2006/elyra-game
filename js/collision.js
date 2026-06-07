// ============================================
// COLLISION SYSTEM
// ============================================

class CollisionSystem {
    // Circle-to-circle collision
    static circleCollision(x1, y1, r1, x2, y2, r2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < r1 + r2;
    }

    // Circle-to-rect collision
    static circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
        const closestX = Math.max(rx, Math.min(cx, rx + rw));
        const closestY = Math.max(ry, Math.min(cy, ry + rh));
        const dx = cx - closestX;
        const dy = cy - closestY;
        return (dx * dx + dy * dy) < (cr * cr);
    }

    // Player vs Boss collision
    static playerVsBoss(player, boss) {
        return this.circleCollision(
            player.x, player.y, player.size,
            boss.x, boss.y, boss.size
        );
    }

    // Player vs Projectile collision
    static playerVsProjectile(player, projectile) {
        return this.circleCollision(
            player.x, player.y, player.size,
            projectile.x, projectile.y, projectile.size
        );
    }

    // Player vs Item collision
    static playerVsItem(player, item) {
        return this.circleCollision(
            player.x, player.y, player.size,
            item.x, item.y, item.size || 15
        );
    }
}
