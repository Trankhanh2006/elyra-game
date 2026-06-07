// ============================================
// STORY ENGINE
// ============================================

class StoryEngine {
    constructor() {
        this.currentStory = [];
        this.storyTime = 0;
        this.storyIndex = 0;
        this.storyStep = STORY_STEPS.INTRO;
        this.isPlaying = false;
        this.isPaused = false;
        this.events = {};

        this.initializeAllStories();
    }

    initializeAllStories() {
        // LUMINA MAP STORY
        this.events.lumina = [
            {
                time: 0,
                text: "Khởi đầu Elyra...",
                step: STORY_STEPS.INTRO
            },
            {
                time: 2000,
                text: "Khánh và Vy ở thư viện Lumina",
                step: STORY_STEPS.LUMINA_START
            },
            {
                time: 4500,
                text: "Trăng đỏ xuất hiện lên trời...",
            },
            {
                time: 6000,
                text: "Morzak thức tỉnh! Hãy chuẩn bị chiến đấu!",
                action: (game) => {
                    if (game.boss) game.boss.active = true;
                },
                step: STORY_STEPS.MORZAK_APPEARS
            },
            {
                time: 8000,
                text: "Khánh bị bắt cóc! Thu thập 3 tinh thể ánh sáng để mở cổng thoát!",
            }
        ];

        // FOREST OF MIRRORS STORY
        this.events.forestMirrors = [
            {
                time: 0,
                text: "Vào rừng gương...",
                step: STORY_STEPS.FOREST_START
            },
            {
                time: 2000,
                text: "Những hình ảnh ảo ảnh xuất hiện..."
            },
            {
                time: 4000,
                text: "Phá hủy 3 chiếc gương giả để tiếp tục!"
            }
        ];

        // LAKE OF MEMORY STORY
        this.events.lakeMemory = [
            {
                time: 0,
                text: "Đến hồ ký ức...",
                step: STORY_STEPS.LAKE_START
            },
            {
                time: 2000,
                text: "Những ký ức buồn của Khánh xuất hiện..."
            },
            {
                time: 4000,
                text: "Chạm vào chúng để tiết lộ sự thật ẩn giấu..."
            }
        ];

        // BLACK DRAGON MOUNTAIN STORY
        this.events.blackDragonMountain = [
            {
                time: 0,
                text: "Lên núi Rồng Đen...",
                step: STORY_STEPS.DRAGON_FIGHT
            },
            {
                time: 2000,
                text: "Rồng Đen đang chờ! Hãy chiến đấu!",
                action: (game) => {
                    if (game.boss) game.boss.active = true;
                }
            }
        ];

        // SHADOW ABYSS STORY
        this.events.shadowAbyss = [
            {
                time: 0,
                text: "Vào Shadow Abyss - Lâu đài bóng tối của Morzak...",
                step: STORY_STEPS.SHADOW_START
            },
            {
                time: 2000,
                text: "Morzak Phase 1: Đánh xa!",
                action: (game) => {
                    if (game.boss) {
                        game.boss.active = true;
                        game.boss.phase = 1;
                    }
                }
            },
            {
                time: 10000,
                text: "Phase 2: Morzak hút ký ức! Cẩn thận!",
                action: (game) => {
                    if (game.boss) {
                        game.boss.phase = 2;
                        game.boss.speed *= 1.5;
                    }
                },
                step: STORY_STEPS.MORZAK_PHASE_2
            }
        ];
    }

    playStory(mapKey, game) {
        this.currentStory = this.events[mapKey] || [];
        this.storyTime = 0;
        this.storyIndex = 0;
        this.isPlaying = true;
        this.isPaused = false;
    }

    update(deltaTime, game) {
        if (!this.isPlaying || this.isPaused) return;

        this.storyTime += deltaTime;

        // Process all events that should occur at current time
        while (
            this.storyIndex < this.currentStory.length &&
            this.storyTime >= this.currentStory[this.storyIndex].time
        ) {
            const event = this.currentStory[this.storyIndex];

            // Display text
            if (event.text) {
                document.getElementById('storyText').innerText = event.text;
            }

            // Execute action if provided
            if (event.action && typeof event.action === 'function') {
                event.action(game);
            }

            // Update story step
            if (event.step !== undefined) {
                this.storyStep = event.step;
                document.getElementById('stepInfo').innerText = `Step: ${this.storyStep}`;
            }

            this.storyIndex++;
        }

        // Story finished
        if (this.storyIndex >= this.currentStory.length) {
            this.isPlaying = false;
        }
    }

    pause() {
        this.isPaused = true;
    }

    resume() {
        this.isPaused = false;
    }

    getCurrentText() {
        if (this.storyIndex > 0 && this.storyIndex <= this.currentStory.length) {
            return this.currentStory[this.storyIndex - 1].text || '';
        }
        return '';
    }

    serialize() {
        return {
            storyTime: this.storyTime,
            storyIndex: this.storyIndex,
            storyStep: this.storyStep,
            isPlaying: this.isPlaying
        };
    }

    deserialize(data) {
        this.storyTime = data.storyTime;
        this.storyIndex = data.storyIndex;
        this.storyStep = data.storyStep;
        this.isPlaying = data.isPlaying;
    }
}
