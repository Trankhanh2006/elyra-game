// ============================================
// EFFECT & PARTICLE SYSTEM
// ============================================

class EffectSystem {
    constructor() {
        this.animations = [];
        this.damageNumbers = [];
        this.screenShakeIntensity = 0;
        this.screenShakeDuration = 0;
    }

    update(deltaTime) {
        // Update animations
        this.animations = this.animations.filter(anim => {
            anim.update(deltaTime);
            return !anim.isDone();
        });

        // Update damage numbers
        this.damageNumbers = this.damageNumbers.filter(num => {
            num.update(deltaTime);
            return !num.isDone();
        });

        // Update screen shake
        if (this.screenShakeDuration > 0) {
            this.screenShakeDuration -= deltaTime;
        }
    }

    addAnimation(x, y, type) {
        this.animations.push(new Animation(x, y, type));
    }

    addDamageNumber(x, y, damage, isCritical = false) {
        this.damageNumbers.push(new DamageNumber(x, y, damage, isCritical));
    }

    screenShake(intensity = 5, duration = 200) {
        this.screenShakeIntensity = intensity;
        this.screenShakeDuration = duration;
    }

    getScreenShakeOffset() {
        if (this.screenShakeDuration <= 0) return { x: 0, y: 0 };

        return {
            x: (Math.random() - 0.5) * this.screenShakeIntensity,
            y: (Math.random() - 0.5) * this.screenShakeIntensity
        };
    }

    draw(ctx) {
        for (let anim of this.animations) {
            anim.draw(ctx);
        }
        for (let num of this.damageNumbers) {
            num.draw(ctx);
        }
    }
}
