// ============================================
// QUEST SYSTEM
// ============================================

class QuestSystem {
    constructor() {
        this.activeQuest = null;
        this.quests = {};
        this.completedQuests = [];
        this.initializeQuests();
    }

    initializeQuests() {
        this.quests = {
            // LUMINA QUESTS
            lumina_collect_crystals: {
                id: 'lumina_collect_crystals',
                name: 'Thu thập 3 Tinh Thể Ánh Sáng',
                description: 'Thu thập 3 tinh thể để mở cổng dịch chuyển',
                map: 'lumina',
                type: 'collect',
                target: 'crystal',
                required: 3,
                progress: 0,
                reward: { xp: 100, gold: 50 },
                nextQuest: 'lumina_defeat_morzak'
            },
            lumina_defeat_morzak: {
                id: 'lumina_defeat_morzak',
                name: 'Đánh Bại Morzak',
                description: 'Đánh bại sorcerer Morzak để cứu Khánh',
                map: 'lumina',
                type: 'boss',
                target: 'morzak',
                required: 1,
                progress: 0,
                reward: { xp: 200, gold: 100 },
                nextQuest: 'forestMirrors_break_mirrors'
            },

            // FOREST QUESTS
            forestMirrors_break_mirrors: {
                id: 'forestMirrors_break_mirrors',
                name: 'Phá 3 Chiếc Gương Giả',
                description: 'Phá vỡ những chiếc gương ảo để vượt qua rừng',
                map: 'forestMirrors',
                type: 'collect',
                target: 'mirror',
                required: 3,
                progress: 0,
                reward: { xp: 150, gold: 75 },
                nextQuest: 'lakeMemory_reveal_memories'
            },

            // LAKE QUESTS
            lakeMemory_reveal_memories: {
                id: 'lakeMemory_reveal_memories',
                name: 'Tiết Lộ 3 Ký Ức Ẩn Giấu',
                description: 'Khám phá những ký ức buồn của Khánh',
                map: 'lakeMemory',
                type: 'collect',
                target: 'memory',
                required: 3,
                progress: 0,
                reward: { xp: 200, gold: 100 },
                nextQuest: 'blackDragon_defeat'
            },

            // MOUNTAIN QUEST
            blackDragon_defeat: {
                id: 'blackDragon_defeat',
                name: 'Đánh Bại Rồng Đen',
                description: 'Chinh phục Rồng Đen trên núi cao',
                map: 'blackDragonMountain',
                type: 'boss',
                target: 'blackDragon',
                required: 1,
                progress: 0,
                reward: { xp: 300, gold: 150 },
                nextQuest: 'shadowAbyss_final'
            },

            // FINAL QUEST
            shadowAbyss_final: {
                id: 'shadowAbyss_final',
                name: 'Đánh Bại Morzak Cuối Cùng',
                description: 'Xâm nhập Lâu Đài Tối và đánh bại Morzak lần cuối',
                map: 'shadowAbyss',
                type: 'boss',
                target: 'morzakFinal',
                required: 1,
                progress: 0,
                reward: { xp: 500, gold: 250 },
                nextQuest: null
            }
        };
    }

    startQuest(questId) {
        const quest = this.quests[questId];
        if (quest) {
            this.activeQuest = quest;
            console.log('📋 Quest Started:', quest.name);
            return true;
        }
        return false;
    }

    updateProgress(type, target) {
        if (!this.activeQuest) return false;

        if (this.activeQuest.type === type && this.activeQuest.target === target) {
            this.activeQuest.progress += 1;
            console.log(`📊 Progress: ${this.activeQuest.progress}/${this.activeQuest.required}`);
            return this.isQuestComplete();
        }
        return false;
    }

    isQuestComplete() {
        if (!this.activeQuest) return false;
        return this.activeQuest.progress >= this.activeQuest.required;
    }

    completeQuest() {
        if (!this.activeQuest) return null;

        const completedQuest = this.activeQuest;
        this.completedQuests.push(completedQuest.id);
        console.log('✅ Quest Completed:', completedQuest.name);
        console.log('🎁 Reward: XP', completedQuest.reward.xp, 'Gold', completedQuest.reward.gold);

        // Auto-start next quest
        if (completedQuest.nextQuest) {
            setTimeout(() => {
                this.startQuest(completedQuest.nextQuest);
            }, 1500);
        }

        return completedQuest.reward;
    }

    getActiveQuestText() {
        if (!this.activeQuest) return '';
        const quest = this.activeQuest;
        return `${quest.name}\n(${quest.progress}/${quest.required})`;
    }

    serialize() {
        return {
            activeQuestId: this.activeQuest ? this.activeQuest.id : null,
            completedQuests: this.completedQuests,
            questProgress: this.activeQuest ? {
                progress: this.activeQuest.progress,
                required: this.activeQuest.required
            } : null
        };
    }

    deserialize(data) {
        this.completedQuests = data.completedQuests || [];
        if (data.activeQuestId && this.quests[data.activeQuestId]) {
            this.activeQuest = this.quests[data.activeQuestId];
            if (data.questProgress) {
                this.activeQuest.progress = data.questProgress.progress;
            }
        }
    }
}
