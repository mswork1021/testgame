/* ========================================
   Tap Quest - ゲームロジック
   ======================================== */

class Game {
    constructor() {
        // ゲーム状態
        this.state = {
            // リソース
            gold: 0,
            souls: 0,
            gems: 100,

            // ステージ情報
            currentStage: 1,
            currentZone: 1,
            monstersKilled: 0,
            maxStageReached: 1,

            // ヒーローレベル
            heroLevels: {},
            companionLevels: {},

            // 装備
            equipment: {
                weapon: null,
                armor: null,
                accessory: null
            },
            inventory: [],

            // アーティファクト
            artifactLevels: {},

            // スキルクールダウン
            skillCooldowns: {},
            activeEffects: [],

            // 統計
            totalTaps: 0,
            totalGoldEarned: 0,
            totalMonstersKilled: 0,
            rebirthCount: 0,

            // 時間
            lastSaveTime: Date.now(),
            lastOnlineTime: Date.now(),

            // デイリーボーナス
            lastDailyClaimDate: null,
            loginStreak: 0,

            // ストーリーモード
            completedChapters: [],

            // スキルツリー
            skillTreeLevels: {},
            skillPoints: 0,

            // 図鑑
            discoveredMonsters: [],
            discoveredBosses: [],
            obtainedEquipment: {},

            // 実績
            unlockedAchievements: [],
            claimedAchievements: [],

            // 宝箱ストック
            treasureChestCount: 0,

            // ラッキータイムストック
            luckyTimeStock: 0,

            // 宝箱から獲得した未開封報酬（一括開封用）
            pendingTreasureRewards: [],

            // 召喚システム
            summonedHeroes: {},  // { heroId: level }
            gachaPityCount: 0,   // 天井カウンター
            battleHeroes: []     // バトル画面に表示するキャラID（最大6体）
        };

        // 現在のモンスター
        this.currentMonster = null;
        this.isBossFight = false;
        this.bossTimer = null;
        this.bossTimeLeft = 0;

        // ラッキータイム
        this.luckyTimeEndTime = 0;

        // ゲームループ
        this.lastTick = Date.now();
        this.gameLoopId = null;
        this.autoTapInterval = null;

        // イベントコールバック
        this.onUpdate = null;
        this.onMonsterKill = null;
        this.onBossFailed = null;
        this.onLevelUp = null;
        this.onLoot = null;
        this.onTreasureChestCollect = null;  // 宝箱自動獲得時
        this.onTreasureChestBatchOpen = null; // 一括開封時
        this.onLuckyTimeStart = null;
        this.onLuckyTimeEnd = null;
        this.onLuckyTimeStockUpdate = null;  // ストック変化時
    }

    // ========================================
    // 初期化
    // ========================================
    init() {
        // ヒーロー初期化
        GameData.HEROES.forEach(hero => {
            if (!this.state.heroLevels[hero.id]) {
                this.state.heroLevels[hero.id] = 0;
            }
        });

        // 仲間初期化
        GameData.COMPANIONS.forEach(comp => {
            if (!this.state.companionLevels[comp.id]) {
                this.state.companionLevels[comp.id] = 0;
            }
        });

        // アーティファクト初期化
        GameData.ARTIFACTS.forEach(art => {
            if (!this.state.artifactLevels[art.id]) {
                this.state.artifactLevels[art.id] = 0;
            }
        });

        // 最初のモンスター生成
        this.spawnMonster();

        // ゲームループ開始
        this.startGameLoop();
    }

    // ========================================
    // ゲームループ
    // ========================================
    startGameLoop() {
        this.gameLoopId = setInterval(() => {
            this.tick();
        }, 100); // 100msごとに更新
    }

    stopGameLoop() {
        if (this.gameLoopId) {
            clearInterval(this.gameLoopId);
        }
    }

    tick() {
        const now = Date.now();
        const deltaTime = (now - this.lastTick) / 1000;
        this.lastTick = now;

        // DPSダメージ適用
        const dps = this.getTotalDPS();
        if (dps > 0 && this.currentMonster) {
            this.dealDamage(dps * deltaTime, false);

            // 攻撃エフェクト（0.5秒ごと）
            this.attackEffectTimer = (this.attackEffectTimer || 0) + deltaTime;
            if (this.attackEffectTimer >= 0.5 && this.getBattleHeroesDPS() > 0) {
                this.attackEffectTimer = 0;
                if (this.onHeroAttack) this.onHeroAttack();
            }
        }

        // スキルエフェクト更新
        this.updateActiveEffects(deltaTime);

        // ボスタイマー更新
        if (this.isBossFight && this.bossTimeLeft > 0) {
            this.bossTimeLeft -= deltaTime;
            if (this.bossTimeLeft <= 0) {
                this.onBossTimeout();
            }
        }

        // ラッキータイム終了チェック
        if (this.isLuckyTimeActive() && Date.now() >= this.luckyTimeEndTime) {
            this.luckyTimeEndTime = 0;
            if (this.onLuckyTimeEnd) this.onLuckyTimeEnd();
        }

        // UI更新コールバック
        if (this.onUpdate) {
            this.onUpdate();
        }
    }

    // ========================================
    // モンスター管理
    // ========================================
    spawnMonster() {
        console.log(`[DEBUG] spawnMonster 開始 (ステージ ${this.state.currentStage})`);

        // 宝箱をクリア
        this.currentTreasureChest = null;

        const isBoss = this.state.currentStage % GameData.BALANCE.BOSS_EVERY_STAGES === 0;
        this.isBossFight = isBoss;

        // ボス戦でない場合、宝箱が出現する可能性（モンスターと同時に出現）
        if (!isBoss && Math.random() * 100 < GameData.TREASURE_CHEST.SPAWN_CHANCE) {
            this.spawnTreasureChest();
            // モンスターも通常通り生成（returnしない）
        }

        if (isBoss) {
            const bossIndex = Math.floor((this.state.currentStage / GameData.BALANCE.BOSS_EVERY_STAGES - 1) % GameData.BOSSES.length);
            const bossData = GameData.BOSSES[bossIndex];
            const baseHp = this.getBaseMonsterHp() * bossData.hpMultiplier;

            this.currentMonster = {
                name: bossData.name,
                svg: bossData.svg,
                color: bossData.color,
                maxHp: baseHp,
                currentHp: baseHp,
                isBoss: true
            };

            // 図鑑に記録
            this.discoverBoss(bossData.name);

            // ボスタイマー開始
            this.bossTimeLeft = this.getBossTimeLimit();

            // ボス戦BGMに切り替え
            if (window.soundManager) window.soundManager.switchToBossBgm();

            // ボス出現コールバック
            if (this.onBossSpawn) this.onBossSpawn();
        } else {
            // 通常BGMに切り替え
            if (window.soundManager) window.soundManager.switchToNormalBgm();
            // 現在のワールドを取得
            const currentWorld = this.getCurrentWorld();

            // ワールドに対応するモンスターからランダムに選択
            const availableMonsters = this.getAvailableMonstersForWorld(currentWorld);
            const monsterData = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
            const hp = this.getBaseMonsterHp();

            // レアモンスター判定 (5%の確率)
            const isRare = Math.random() < 0.05;

            this.currentMonster = {
                name: isRare ? `✨${monsterData.name}✨` : monsterData.name,
                svg: monsterData.svg,
                color: isRare ? '#ffd700' : monsterData.color, // レアは金色
                maxHp: hp,
                currentHp: hp,
                isBoss: false,
                isRare: isRare,
                monsterType: monsterData.name, // 元のタイプを保存
                traits: this.getMonsterTraits(monsterData.name) // 特性を付与
            };

            // 図鑑に記録
            this.discoverMonster(monsterData.name);
        }
    }

    // モンスター特性を取得
    getMonsterTraits(monsterName) {
        const traits = {
            'スライム': { goldBonus: 1.5, dropBonus: 1.0, desc: 'ゴールド+50%' },
            'ゴースト': { goldBonus: 1.0, dropBonus: 2.0, desc: 'ドロップ率2倍' },
            'コウモリ': { goldBonus: 1.2, dropBonus: 1.2, desc: 'バランス型' },
            'マッシュルーム': { goldBonus: 1.0, dropBonus: 2.5, desc: 'ドロップ率2.5倍' },
            'オバケツリー': { goldBonus: 2.0, dropBonus: 1.0, desc: 'ゴールド2倍' },
            'ウルフ': { goldBonus: 1.3, dropBonus: 1.5, desc: 'やや高報酬' },
            'ミミック': { goldBonus: 1.5, dropBonus: 3.0, desc: '宝箱！ドロップ3倍' },
            'ゴーレム': { goldBonus: 2.0, dropBonus: 1.5, desc: '高報酬' },
            'ワイバーン': { goldBonus: 1.5, dropBonus: 2.0, desc: '竜の財宝' },
            'デーモン': { goldBonus: 2.5, dropBonus: 2.0, desc: '魔王の宝' }
        };
        return traits[monsterName] || { goldBonus: 1.0, dropBonus: 1.0, desc: '' };
    }

    // 現在のワールドを取得
    getCurrentWorld() {
        const stage = this.state.currentStage;
        for (const world of GameData.WORLDS) {
            if (stage >= world.stageRange[0] && stage <= world.stageRange[1]) {
                return world;
            }
        }
        // デフォルトで最後のワールド
        return GameData.WORLDS[GameData.WORLDS.length - 1];
    }

    // ワールドで出現可能なモンスターを取得
    getAvailableMonstersForWorld(world) {
        // ワールドのmonsters配列に含まれる名前でフィルタリング
        const worldMonsterNames = world.monsters || [];
        const available = GameData.MONSTERS.filter(m => worldMonsterNames.includes(m.name));

        // もし見つからなければ、ステージ範囲に基づいてモンスターを選択
        if (available.length === 0) {
            const startIndex = Math.floor((world.stageRange[0] - 1) / 50) * 3;
            const endIndex = Math.min(startIndex + 4, GameData.MONSTERS.length);
            return GameData.MONSTERS.slice(startIndex, endIndex);
        }

        return available;
    }

    getBaseMonsterHp() {
        const baseMonster = GameData.MONSTERS[Math.min(
            Math.floor((this.state.currentStage - 1) / 10),
            GameData.MONSTERS.length - 1
        )];
        return Math.floor(
            baseMonster.baseHp *
            Math.pow(GameData.BALANCE.MONSTER_HP_SCALING, this.state.currentStage - 1)
        );
    }

    getBossTimeLimit() {
        let timeLimit = GameData.BALANCE.BOSS_TIME_LIMIT;

        // 防具ボーナス
        if (this.state.equipment.armor) {
            timeLimit += this.state.equipment.armor.value;
        }

        // アーティファクトボーナス
        const timeCrystal = GameData.ARTIFACTS.find(a => a.id === 'timeCrystal');
        if (timeCrystal && this.state.artifactLevels.timeCrystal > 0) {
            timeLimit += timeCrystal.effect.baseValue * this.state.artifactLevels.timeCrystal;
        }

        // スキルツリー: ボス戦時間
        timeLimit += this.getSkillTreeEffect('bossTime');
        timeLimit += this.getSkillTreeEffect('bossTimeFlat');

        return timeLimit;
    }

    // ========================================
    // 宝箱システム（自動収集・ストック方式）
    // ========================================
    spawnTreasureChest() {
        console.log('[DEBUG] 宝箱出現！自動収集');
        // 自動収集：カウンターを増やすだけ
        this.state.treasureChestCount++;

        // サウンド再生
        if (window.soundManager) window.soundManager.playTreasureChest();

        // コールバック（UIに通知を表示）
        if (this.onTreasureChestCollect) {
            this.onTreasureChestCollect(this.state.treasureChestCount);
        }
    }

    // 宝箱を1つ開ける（報酬を決定してストックに追加）
    rollTreasureReward() {
        const rewards = GameData.TREASURE_CHEST_REWARDS;
        const totalWeight = rewards.reduce((sum, r) => sum + r.weight, 0);
        let random = Math.random() * totalWeight;

        let selectedReward = rewards[0];
        for (const reward of rewards) {
            random -= reward.weight;
            if (random <= 0) {
                selectedReward = reward;
                break;
            }
        }

        return {
            reward: selectedReward,
            data: selectedReward.getReward(this.state.currentStage)
        };
    }

    // 宝箱を一括開封
    openAllTreasureChests() {
        if (this.state.treasureChestCount <= 0) return [];

        const results = [];
        const count = this.state.treasureChestCount;

        for (let i = 0; i < count; i++) {
            const result = this.rollTreasureReward();
            results.push(result);

            // 報酬を適用（ラッキータイムはストックに）
            this.applyTreasureReward(result.data, result.reward);
        }

        // カウンターをリセット
        this.state.treasureChestCount = 0;

        // コールバック
        if (this.onTreasureChestBatchOpen) {
            this.onTreasureChestBatchOpen(results);
        }

        return results;
    }

    applyTreasureReward(rewardData, rewardInfo) {
        switch (rewardData.type) {
            case 'gold':
                const goldAmount = Math.floor(rewardData.amount * this.getGoldMultiplier());
                this.state.gold += goldAmount;
                this.state.totalGoldEarned += goldAmount;
                break;

            case 'gems':
                this.state.gems += rewardData.amount;
                break;

            case 'souls':
                this.state.souls += rewardData.amount;
                break;

            case 'luckyTime':
                // ストックに追加（即時発動しない）
                this.state.luckyTimeStock++;
                if (this.onLuckyTimeStockUpdate) {
                    this.onLuckyTimeStockUpdate(this.state.luckyTimeStock);
                }
                break;

            case 'skillReset':
                this.state.skillCooldowns = {};
                break;

            case 'equipment':
                this.dropTreasureEquipment(rewardData.minRarity);
                break;
        }
    }

    dropTreasureEquipment(minRarity) {
        // 装備タイプを選択
        const types = ['WEAPONS', 'ARMORS', 'ACCESSORIES'];
        const typeKey = types[Math.floor(Math.random() * types.length)];
        const templates = GameData.EQUIPMENT[typeKey];

        // ステージに応じた装備を選択
        const maxIndex = Math.min(
            Math.floor(this.state.currentStage / 20),
            templates.length - 1
        );
        const template = templates[Math.floor(Math.random() * (maxIndex + 1))];

        // レアリティ決定（最低レアリティ保証）
        const rarities = ['COMMON', 'UNCOMMON', 'RARE', 'EPIC', 'LEGENDARY'];
        const minIndex = rarities.indexOf(minRarity);
        const roll = Math.random() * 100;

        let rarity;
        if (roll < 60) {
            rarity = rarities[minIndex]; // 最低レアリティ
        } else if (roll < 85) {
            rarity = rarities[Math.min(minIndex + 1, rarities.length - 1)];
        } else if (roll < 97) {
            rarity = rarities[Math.min(minIndex + 2, rarities.length - 1)];
        } else {
            rarity = 'LEGENDARY';
        }

        // 装備生成
        const equipment = this.generateEquipment(template, rarity);
        this.state.inventory.push(equipment);
        this.recordEquipment(equipment);

        if (this.onLoot) {
            this.onLoot(equipment);
        }
    }

    // ========================================
    // ラッキータイム
    // ========================================
    isLuckyTimeActive() {
        return Date.now() < this.luckyTimeEndTime;
    }

    getLuckyTimeRemaining() {
        if (!this.isLuckyTimeActive()) return 0;
        return Math.ceil((this.luckyTimeEndTime - Date.now()) / 1000);
    }

    // ストックからラッキータイムを1つ使用
    useLuckyTime() {
        if (this.state.luckyTimeStock <= 0) return false;

        this.state.luckyTimeStock--;
        this.startLuckyTime(30); // 30秒間

        // ストック更新コールバック
        if (this.onLuckyTimeStockUpdate) {
            this.onLuckyTimeStockUpdate(this.state.luckyTimeStock);
        }

        return true;
    }

    startLuckyTime(duration) {
        // 既にアクティブな場合は時間を延長
        if (this.isLuckyTimeActive()) {
            this.luckyTimeEndTime += duration * 1000;
        } else {
            this.luckyTimeEndTime = Date.now() + duration * 1000;
        }

        // サウンド再生
        if (window.soundManager) window.soundManager.playLuckyTime();

        if (this.onLuckyTimeStart) this.onLuckyTimeStart(duration);
    }

    // ========================================
    // ダメージ計算
    // ========================================
    tap() {
        // 宝箱はバナーをタップで開く（ここでは処理しない）

        if (!this.currentMonster) return;

        this.state.totalTaps++;
        const damage = this.getTapDamage();
        const isCritical = this.rollCritical();
        const finalDamage = isCritical ? damage * (this.getCriticalDamage() / 100) : damage;

        this.dealDamage(finalDamage, true, isCritical);
    }

    dealDamage(amount, showNumber = false, isCritical = false) {
        const monster = this.currentMonster;
        if (!monster) {
            console.log('[DEBUG] dealDamage: モンスターなし');
            return;
        }

        // 既に死亡処理済みのモンスターには何もしない
        if (monster._processed) {
            return;
        }

        const hpBefore = monster.currentHp;
        monster.currentHp -= amount;

        if (showNumber && this.onDamageDealt) {
            this.onDamageDealt(amount, isCritical);
        }

        // モンスターが死亡したら撃破処理
        if (monster.currentHp <= 0 && !monster._processed) {
            console.log(`[DEBUG] HP: ${hpBefore} → ${monster.currentHp}, killMonster呼び出し`);
            this.killMonster();
        }
    }

    getTapDamage() {
        let baseDamage = 1;

        // ヒーローボーナス
        GameData.HEROES.forEach(hero => {
            const level = this.state.heroLevels[hero.id] || 0;
            baseDamage += hero.baseDamage * level;
        });

        // 武器ボーナス
        if (this.state.equipment.weapon) {
            baseDamage += this.state.equipment.weapon.value;
        }

        // パーセントボーナス適用
        let multiplier = 1;

        // アーティファクト: タップダメージ%
        const swordOfHeroes = GameData.ARTIFACTS.find(a => a.id === 'swordOfHeroes');
        if (swordOfHeroes && this.state.artifactLevels.swordOfHeroes > 0) {
            multiplier += (swordOfHeroes.effect.baseValue * this.state.artifactLevels.swordOfHeroes) / 100;
        }

        // アーティファクト: 全ステータス
        const infinityStone = GameData.ARTIFACTS.find(a => a.id === 'infinityStone');
        if (infinityStone && this.state.artifactLevels.infinityStone > 0) {
            multiplier += (infinityStone.effect.baseValue * this.state.artifactLevels.infinityStone) / 100;
        }

        // スキルツリー: タップダメージ%
        multiplier += this.getSkillTreeEffect('tapDamagePercent') / 100;

        // スキルツリー: 全攻撃力%
        multiplier += this.getSkillTreeEffect('allDamagePercent') / 100;

        // スキルエフェクト
        const tapMultiplier = this.getActiveEffectValue('tapMultiplier');
        if (tapMultiplier > 1) {
            multiplier *= tapMultiplier;
        }

        return Math.floor(baseDamage * multiplier);
    }

    getTotalDPS() {
        let baseDps = 0;

        // 仲間ボーナス
        GameData.COMPANIONS.forEach(comp => {
            const level = this.state.companionLevels[comp.id] || 0;
            baseDps += comp.baseDps * level;
        });

        // 召喚キャラのDPS（バトル参加キャラのみ）
        baseDps += this.getBattleHeroesDPS();

        // パーセントボーナス適用
        let multiplier = 1;

        // アーティファクト: DPS%
        const ancientScroll = GameData.ARTIFACTS.find(a => a.id === 'ancientScroll');
        if (ancientScroll && this.state.artifactLevels.ancientScroll > 0) {
            multiplier += (ancientScroll.effect.baseValue * this.state.artifactLevels.ancientScroll) / 100;
        }

        // アーティファクト: 全ステータス
        const infinityStone = GameData.ARTIFACTS.find(a => a.id === 'infinityStone');
        if (infinityStone && this.state.artifactLevels.infinityStone > 0) {
            multiplier += (infinityStone.effect.baseValue * this.state.artifactLevels.infinityStone) / 100;
        }

        // スキルツリー: DPS%
        multiplier += this.getSkillTreeEffect('dpsPercent') / 100;

        // スキルツリー: 全攻撃力%
        multiplier += this.getSkillTreeEffect('allDamagePercent') / 100;

        return Math.floor(baseDps * multiplier);
    }

    // バトル参加キャラのDPS合計
    getBattleHeroesDPS() {
        if (!this.state.battleHeroes || this.state.battleHeroes.length === 0) return 0;

        let totalDps = 0;
        this.state.battleHeroes.forEach(heroId => {
            totalDps += this.getHeroDPS(heroId);
        });
        return totalDps;
    }

    // ========================================
    // クリティカル
    // ========================================
    rollCritical() {
        return Math.random() * 100 < this.getCriticalChance();
    }

    getCriticalChance() {
        let chance = GameData.BALANCE.BASE_CRIT_CHANCE;

        // アーティファクトボーナス
        const luckyCharm = GameData.ARTIFACTS.find(a => a.id === 'luckyCharm');
        if (luckyCharm && this.state.artifactLevels.luckyCharm > 0) {
            chance += luckyCharm.effect.baseValue * this.state.artifactLevels.luckyCharm;
        }

        // アクセサリーボーナス
        if (this.state.equipment.accessory && this.state.equipment.accessory.stat === 'critChance') {
            chance += this.state.equipment.accessory.value;
        }

        // スキルツリー: クリティカル率
        chance += this.getSkillTreeEffect('critChance');

        // スキルエフェクト
        const skillCrit = this.getActiveEffectValue('criticalChance');
        if (skillCrit > 0) {
            chance += skillCrit;
        }

        return Math.min(chance, 100);
    }

    getCriticalDamage() {
        let damage = GameData.BALANCE.BASE_CRIT_DAMAGE;

        // アーティファクトボーナス
        const dragonHeart = GameData.ARTIFACTS.find(a => a.id === 'dragonHeart');
        if (dragonHeart && this.state.artifactLevels.dragonHeart > 0) {
            damage += dragonHeart.effect.baseValue * this.state.artifactLevels.dragonHeart;
        }

        // アクセサリーボーナス
        if (this.state.equipment.accessory && this.state.equipment.accessory.stat === 'critDamage') {
            damage += this.state.equipment.accessory.value;
        }

        // スキルツリー: クリティカルダメージ
        damage += this.getSkillTreeEffect('critDamage');

        return damage;
    }

    // ========================================
    // モンスター撃破
    // ========================================
    killMonster() {
        console.log('[DEBUG] killMonster 開始');
        const monster = this.currentMonster;
        if (!monster) {
            console.log('[DEBUG] killMonster: モンスターなし、中断');
            return;
        }

        // 既に処理済みならスキップ
        if (monster._processed) {
            console.log('[DEBUG] killMonster: 処理済み、スキップ');
            return;
        }
        monster._processed = true;

        try {
            // 統計更新
            this.state.monstersKilled++;
            this.state.totalMonstersKilled++;
            console.log(`[DEBUG] モンスター撃破 #${this.state.monstersKilled}`);

            // 実績チェック
            this.checkAchievements();

            // モンスター特性を取得
            const traits = monster.traits || { goldBonus: 1.0, dropBonus: 1.0 };
            const rareMultiplier = monster.isRare ? 2.0 : 1.0; // レアは2倍

            // ゴールド報酬（特性とレアボーナス適用）
            let goldReward = Math.floor(monster.maxHp * GameData.BALANCE.GOLD_PER_HP_RATIO);
            if (monster.isBoss) {
                goldReward *= GameData.BALANCE.BOSS_GOLD_MULTIPLIER;
            }
            goldReward = Math.floor(goldReward * this.getGoldMultiplier() * traits.goldBonus * rareMultiplier);
            this.state.gold += goldReward;
            this.state.totalGoldEarned += goldReward;

            // ドロップチェック（特性とレアボーナス適用）
            try {
                const dropMultiplier = traits.dropBonus * (monster.isRare ? 3.0 : 1.0);
                this.checkEquipmentDrop(monster.isBoss, dropMultiplier);
            } catch (e) {
                console.error('[DEBUG] ドロップエラー:', e);
            }

            // コールバック（エラーでも続行）
            try {
                if (this.onMonsterKill) {
                    this.onMonsterKill(monster, goldReward);
                }
            } catch (e) {
                console.error('[DEBUG] コールバックエラー:', e);
            }
        } catch (e) {
            console.error('[DEBUG] killMonster エラー:', e);
        }

        // 【重要】必ず次のモンスターを生成
        console.log('[DEBUG] 次のモンスター生成へ...');
        this.currentMonster = null; // 古いモンスターをクリア

        if (monster.isBoss || this.state.monstersKilled >= GameData.BALANCE.MONSTERS_PER_STAGE) {
            this.advanceStage();
        } else {
            this.spawnMonster();
        }

        console.log(`[DEBUG] killMonster 完了, 新モンスターHP: ${this.currentMonster ? this.currentMonster.currentHp : 'なし'}`);
    }

    getGoldMultiplier() {
        let multiplier = 1;

        // アーティファクトボーナス
        const goldenCrown = GameData.ARTIFACTS.find(a => a.id === 'goldenCrown');
        if (goldenCrown && this.state.artifactLevels.goldenCrown > 0) {
            multiplier += (goldenCrown.effect.baseValue * this.state.artifactLevels.goldenCrown) / 100;
        }

        // アクセサリーボーナス
        if (this.state.equipment.accessory && this.state.equipment.accessory.stat === 'goldBonus') {
            multiplier += this.state.equipment.accessory.value / 100;
        }

        // スキルツリー: ゴールド%
        multiplier += this.getSkillTreeEffect('goldPercent') / 100;

        // スキルエフェクト
        const goldMultiplier = this.getActiveEffectValue('goldMultiplier');
        if (goldMultiplier > 1) {
            multiplier *= goldMultiplier;
        }

        // ラッキータイムボーナス（ゴールド2倍）
        if (this.isLuckyTimeActive()) {
            multiplier *= 2;
        }

        return multiplier;
    }

    advanceStage() {
        this.state.currentStage++;
        this.state.monstersKilled = 0;

        if (this.state.currentStage > this.state.maxStageReached) {
            this.state.maxStageReached = this.state.currentStage;
        }

        this.spawnMonster();
    }

    onBossTimeout() {
        // ボス戦失敗
        this.bossTimeLeft = 0;
        this.isBossFight = false;

        // 1ステージ戻る（最低1）
        this.state.currentStage = Math.max(1, this.state.currentStage - 1);
        this.state.monstersKilled = 0;

        if (this.onBossFailed) {
            this.onBossFailed();
        }

        this.spawnMonster();
    }

    // ========================================
    // 装備ドロップ
    // ========================================
    checkEquipmentDrop(isBoss, dropMultiplier = 1.0) {
        let dropChance = isBoss
            ? GameData.BALANCE.BOSS_EQUIPMENT_DROP_CHANCE
            : GameData.BALANCE.EQUIPMENT_DROP_CHANCE;

        // ドロップ倍率を適用
        dropChance *= dropMultiplier;

        // ラッキータイムボーナス（ドロップ率2倍）
        if (this.isLuckyTimeActive()) {
            dropChance *= 2;
        }

        if (Math.random() * 100 >= dropChance) return;

        // 装備タイプを選択
        const types = ['WEAPONS', 'ARMORS', 'ACCESSORIES'];
        const typeKey = types[Math.floor(Math.random() * types.length)];
        const templates = GameData.EQUIPMENT[typeKey];

        // ステージに応じた装備を選択
        const maxIndex = Math.min(
            Math.floor(this.state.currentStage / 20),
            templates.length - 1
        );
        const template = templates[Math.floor(Math.random() * (maxIndex + 1))];

        // レアリティ決定
        const rarity = this.rollRarity(isBoss);

        // 装備生成
        const equipment = this.generateEquipment(template, rarity);
        this.state.inventory.push(equipment);

        // 図鑑に記録
        this.recordEquipment(equipment);

        if (this.onLoot) {
            this.onLoot(equipment);
        }
    }

    rollRarity(isBoss) {
        const roll = Math.random() * 100;
        const bossBonus = isBoss ? 20 : 0;

        if (roll < 1 + bossBonus * 0.1) return 'LEGENDARY';
        if (roll < 5 + bossBonus * 0.3) return 'EPIC';
        if (roll < 15 + bossBonus * 0.5) return 'RARE';
        if (roll < 40 + bossBonus) return 'UNCOMMON';
        return 'COMMON';
    }

    generateEquipment(template, rarityKey) {
        const rarity = GameData.RARITY[rarityKey];
        const value = Math.floor(template.baseValue * rarity.multiplier * (0.8 + Math.random() * 0.4));

        return {
            id: Date.now() + Math.random(),
            name: template.name,
            emoji: template.emoji,
            type: template.type,
            stat: template.stat,
            value: value,
            rarity: rarityKey,
            rarityName: rarity.name,
            rarityClass: rarity.class
        };
    }

    // ========================================
    // 装備管理
    // ========================================
    equipItem(item) {
        const slot = item.type;
        const currentEquipped = this.state.equipment[slot];

        // 現在装備中のアイテムをインベントリに戻す
        if (currentEquipped) {
            this.state.inventory.push(currentEquipped);
        }

        // 新しいアイテムを装備
        this.state.equipment[slot] = item;

        // インベントリから削除
        const index = this.state.inventory.findIndex(i => i.id === item.id);
        if (index > -1) {
            this.state.inventory.splice(index, 1);
        }
    }

    unequipItem(slot) {
        const item = this.state.equipment[slot];
        if (item) {
            this.state.inventory.push(item);
            this.state.equipment[slot] = null;
        }
    }

    sellItem(item) {
        const rarity = GameData.RARITY[item.rarity];
        const sellValue = Math.floor(item.value * rarity.multiplier * 10);
        this.state.gold += sellValue;

        const index = this.state.inventory.findIndex(i => i.id === item.id);
        if (index > -1) {
            this.state.inventory.splice(index, 1);
        }

        return sellValue;
    }

    // ========================================
    // アップグレード
    // ========================================
    getHeroCost(heroId) {
        const hero = GameData.HEROES.find(h => h.id === heroId);
        const level = this.state.heroLevels[heroId] || 0;
        return Math.floor(hero.baseCost * Math.pow(GameData.BALANCE.HERO_COST_MULTIPLIER, level));
    }

    upgradeHero(heroId) {
        const cost = this.getHeroCost(heroId);
        if (this.state.gold >= cost) {
            this.state.gold -= cost;
            this.state.heroLevels[heroId] = (this.state.heroLevels[heroId] || 0) + 1;
            return true;
        }
        return false;
    }

    getCompanionCost(companionId) {
        const comp = GameData.COMPANIONS.find(c => c.id === companionId);
        const level = this.state.companionLevels[companionId] || 0;
        return Math.floor(comp.baseCost * Math.pow(GameData.BALANCE.COMPANION_COST_MULTIPLIER, level));
    }

    upgradeCompanion(companionId) {
        const cost = this.getCompanionCost(companionId);
        if (this.state.gold >= cost) {
            this.state.gold -= cost;
            this.state.companionLevels[companionId] = (this.state.companionLevels[companionId] || 0) + 1;
            return true;
        }
        return false;
    }

    getArtifactCost(artifactId) {
        const artifact = GameData.ARTIFACTS.find(a => a.id === artifactId);
        const level = this.state.artifactLevels[artifactId] || 0;
        return Math.floor(artifact.baseCost * Math.pow(artifact.costMultiplier, level));
    }

    upgradeArtifact(artifactId) {
        const cost = this.getArtifactCost(artifactId);
        if (this.state.souls >= cost) {
            this.state.souls -= cost;
            this.state.artifactLevels[artifactId] = (this.state.artifactLevels[artifactId] || 0) + 1;
            return true;
        }
        return false;
    }

    // ========================================
    // スキル
    // ========================================
    useSkill(skillId) {
        const skill = GameData.SKILLS.find(s => s.id === skillId);
        if (!skill) return false;

        // 解放チェック
        if (this.state.maxStageReached < skill.unlockStage) return false;

        // クールダウンチェック
        const cooldownEnd = this.state.skillCooldowns[skillId] || 0;
        if (Date.now() < cooldownEnd) return false;

        // スキル発動
        this.state.skillCooldowns[skillId] = Date.now() + skill.cooldown * 1000;

        // エフェクト適用
        if (skill.duration > 0) {
            this.state.activeEffects.push({
                type: skill.effect.type,
                value: skill.effect.value,
                endTime: Date.now() + skill.duration * 1000
            });
        } else {
            // 即時効果
            this.applyImmediateEffect(skill.effect);
        }

        return true;
    }

    applyImmediateEffect(effect) {
        switch (effect.type) {
            case 'bossTime':
                if (this.isBossFight) {
                    this.bossTimeLeft += effect.value;
                }
                break;
            case 'percentDamage':
                if (this.currentMonster) {
                    const damage = this.currentMonster.maxHp * (effect.value / 100);
                    this.dealDamage(damage, true);
                }
                break;
        }
    }

    getActiveEffectValue(effectType) {
        let value = effectType === 'goldMultiplier' || effectType === 'tapMultiplier' ? 1 : 0;

        this.state.activeEffects.forEach(effect => {
            if (effect.type === effectType && Date.now() < effect.endTime) {
                if (effectType === 'goldMultiplier' || effectType === 'tapMultiplier') {
                    value *= effect.value;
                } else {
                    value += effect.value;
                }
            }
        });

        return value;
    }

    updateActiveEffects(deltaTime) {
        const now = Date.now();
        this.state.activeEffects = this.state.activeEffects.filter(effect => effect.endTime > now);
    }

    getSkillCooldownRemaining(skillId) {
        const cooldownEnd = this.state.skillCooldowns[skillId] || 0;
        return Math.max(0, Math.ceil((cooldownEnd - Date.now()) / 1000));
    }

    isSkillUnlocked(skillId) {
        const skill = GameData.SKILLS.find(s => s.id === skillId);
        return skill && this.state.maxStageReached >= skill.unlockStage;
    }

    // ========================================
    // 転生
    // ========================================
    canRebirth() {
        return this.state.currentStage >= GameData.BALANCE.MIN_REBIRTH_STAGE;
    }

    getPendingSouls() {
        if (!this.canRebirth()) return 0;

        let souls = 0;
        for (let i = GameData.BALANCE.MIN_REBIRTH_STAGE; i <= this.state.currentStage; i++) {
            souls += Math.floor(GameData.BALANCE.SOULS_PER_STAGE * Math.pow(GameData.BALANCE.SOULS_SCALING, i - GameData.BALANCE.MIN_REBIRTH_STAGE));
        }

        // ソウルボーナス適用
        const soulVessel = GameData.ARTIFACTS.find(a => a.id === 'soulVessel');
        if (soulVessel && this.state.artifactLevels.soulVessel > 0) {
            souls = Math.floor(souls * (1 + soulVessel.effect.baseValue * this.state.artifactLevels.soulVessel / 100));
        }

        // スキルツリー: ソウルボーナス
        const soulBonus = this.getSkillTreeEffect('soulBonus');
        if (soulBonus > 0) {
            souls = Math.floor(souls * (1 + soulBonus / 100));
        }

        return souls;
    }

    rebirth() {
        if (!this.canRebirth()) return false;

        const soulsGained = this.getPendingSouls();
        this.state.souls += soulsGained;
        this.state.rebirthCount++;

        // スキルポイント獲得（ステージ進行に基づく）
        // 50ステージごとに1ポイント
        const skillPointsGained = Math.floor(this.state.maxStageReached / 50);
        this.state.skillPoints += skillPointsGained;

        // リセット
        this.state.gold = 0;
        this.state.currentStage = 1;
        this.state.monstersKilled = 0;

        // ヒーロー・仲間レベルリセット
        Object.keys(this.state.heroLevels).forEach(key => {
            this.state.heroLevels[key] = 0;
        });
        Object.keys(this.state.companionLevels).forEach(key => {
            this.state.companionLevels[key] = 0;
        });

        // スキルクールダウンリセット
        this.state.skillCooldowns = {};
        this.state.activeEffects = [];

        // モンスター再生成
        this.spawnMonster();

        return soulsGained;
    }

    // ========================================
    // オフライン報酬
    // ========================================
    calculateOfflineReward(offlineSeconds) {
        const maxSeconds = GameData.BALANCE.MAX_OFFLINE_HOURS * 3600;
        const effectiveSeconds = Math.min(offlineSeconds, maxSeconds);

        const dps = this.getTotalDPS();
        const goldPerSecond = dps * GameData.BALANCE.GOLD_PER_HP_RATIO * this.getGoldMultiplier();

        return Math.floor(goldPerSecond * effectiveSeconds * GameData.BALANCE.OFFLINE_EFFICIENCY);
    }

    // ========================================
    // オートタップ（スキル用）
    // ========================================
    startAutoTap(tapsPerSecond) {
        this.stopAutoTap();
        const interval = 1000 / tapsPerSecond;
        this.autoTapInterval = setInterval(() => {
            this.tap();
        }, interval);
    }

    stopAutoTap() {
        if (this.autoTapInterval) {
            clearInterval(this.autoTapInterval);
            this.autoTapInterval = null;
        }
    }

    // ========================================
    // デイリーログインボーナス
    // ========================================
    getDateString(date) {
        return date.toISOString().split('T')[0];
    }

    canClaimDailyBonus() {
        const today = this.getDateString(new Date());
        return this.state.lastDailyClaimDate !== today;
    }

    checkLoginStreak() {
        if (!this.state.lastDailyClaimDate) {
            return 1;
        }

        const lastDate = new Date(this.state.lastDailyClaimDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        lastDate.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today - lastDate) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // 連続ログイン
            return this.state.loginStreak + 1;
        } else if (diffDays === 0) {
            // 同じ日
            return this.state.loginStreak;
        } else {
            // 連続が途切れた
            return 1;
        }
    }

    getDailyReward() {
        const streak = this.checkLoginStreak();
        const dayIndex = ((streak - 1) % 7);
        return GameData.DAILY_REWARDS[dayIndex];
    }

    claimDailyBonus() {
        if (!this.canClaimDailyBonus()) return null;

        const streak = this.checkLoginStreak();
        const reward = this.getDailyReward();

        // 報酬付与
        switch (reward.type) {
            case 'gold':
                this.state.gold += reward.amount;
                break;
            case 'gems':
                this.state.gems += reward.amount;
                break;
            case 'equipment':
                const types = ['WEAPONS', 'ARMORS', 'ACCESSORIES'];
                const typeKey = types[Math.floor(Math.random() * types.length)];
                const templates = GameData.EQUIPMENT[typeKey];
                const template = templates[Math.floor(Math.random() * templates.length)];
                const equipment = this.generateEquipment(template, reward.rarity);
                this.state.inventory.push(equipment);
                break;
        }

        // 状態更新
        this.state.lastDailyClaimDate = this.getDateString(new Date());
        this.state.loginStreak = streak;

        return { reward, streak };
    }

    // ========================================
    // スキルツリー
    // ========================================
    getSkillTreeLevel(skillId) {
        return this.state.skillTreeLevels[skillId] || 0;
    }

    getAvailableSkillPoints() {
        // 累計獲得スキルポイント
        const totalPoints = this.state.skillPoints || 0;
        // 使用済みポイントを計算
        let usedPoints = 0;
        GameData.SKILL_TREE.SKILLS.forEach(skill => {
            const level = this.getSkillTreeLevel(skill.id);
            usedPoints += level * skill.costPerLevel;
        });
        return totalPoints - usedPoints;
    }

    // 転生時に獲得予定のスキルポイントを計算
    getPendingSkillPoints() {
        return Math.floor(this.state.maxStageReached / 50);
    }

    canUpgradeSkillTree(skillId) {
        const skill = GameData.SKILL_TREE.SKILLS.find(s => s.id === skillId);
        if (!skill) return false;

        const currentLevel = this.getSkillTreeLevel(skillId);
        if (currentLevel >= skill.maxLevel) return false;

        // スキルポイントチェック
        if (this.getAvailableSkillPoints() < skill.costPerLevel) return false;

        // 前提スキルチェック
        if (skill.requires) {
            const reqLevel = this.getSkillTreeLevel(skill.requires);
            if (reqLevel < skill.requiresLevel) return false;
        }

        return true;
    }

    upgradeSkillTree(skillId) {
        if (!this.canUpgradeSkillTree(skillId)) return false;

        this.state.skillTreeLevels[skillId] = this.getSkillTreeLevel(skillId) + 1;
        return true;
    }

    getSkillTreeEffect(effectType) {
        let value = 0;
        GameData.SKILL_TREE.SKILLS.forEach(skill => {
            if (skill.effect.type === effectType) {
                const level = this.getSkillTreeLevel(skill.id);
                value += level * skill.effect.valuePerLevel;
            }
        });
        return value;
    }

    resetSkillTree() {
        this.state.skillTreeLevels = {};
    }

    // ========================================
    // 図鑑
    // ========================================
    discoverMonster(monsterName) {
        if (!this.state.discoveredMonsters) this.state.discoveredMonsters = [];
        if (!this.state.discoveredMonsters.includes(monsterName)) {
            this.state.discoveredMonsters.push(monsterName);
            this.checkAchievements();
            return true;
        }
        return false;
    }

    discoverBoss(bossName) {
        if (!this.state.discoveredBosses) this.state.discoveredBosses = [];
        if (!this.state.discoveredBosses.includes(bossName)) {
            this.state.discoveredBosses.push(bossName);
            return true;
        }
        return false;
    }

    recordEquipment(equipment) {
        if (!this.state.obtainedEquipment) this.state.obtainedEquipment = {};
        const key = `${equipment.name}_${equipment.rarity}`;
        if (!this.state.obtainedEquipment[key]) {
            this.state.obtainedEquipment[key] = {
                name: equipment.name,
                emoji: equipment.emoji,
                rarity: equipment.rarity,
                type: equipment.type,
                obtainedAt: Date.now()
            };
            this.checkAchievements();
            return true;
        }
        return false;
    }

    getDiscoveredMonsterCount() {
        const monsters = this.state.discoveredMonsters || [];
        const bosses = this.state.discoveredBosses || [];
        return monsters.length + bosses.length;
    }

    hasObtainedRarity(rarity) {
        const equipment = this.state.obtainedEquipment || {};
        return Object.values(equipment).some(eq => eq.rarity === rarity);
    }

    // ========================================
    // 実績
    // ========================================
    checkAchievements() {
        // セーフティチェック
        if (!this.state.unlockedAchievements) this.state.unlockedAchievements = [];
        if (!this.state.claimedAchievements) this.state.claimedAchievements = [];

        const newlyUnlocked = [];

        GameData.ACHIEVEMENTS.forEach(achievement => {
            if (this.state.unlockedAchievements.includes(achievement.id)) return;

            let met = false;
            const req = achievement.requirement;

            switch (req.type) {
                case 'totalTaps':
                    met = this.state.totalTaps >= req.value;
                    break;
                case 'totalMonstersKilled':
                    met = this.state.totalMonstersKilled >= req.value;
                    break;
                case 'maxStageReached':
                    met = this.state.maxStageReached >= req.value;
                    break;
                case 'rebirthCount':
                    met = this.state.rebirthCount >= req.value;
                    break;
                case 'totalGoldEarned':
                    met = this.state.totalGoldEarned >= req.value;
                    break;
                case 'discoveredMonsters':
                    met = this.getDiscoveredMonsterCount() >= req.value;
                    break;
                case 'hasRarity':
                    met = this.hasObtainedRarity(req.value);
                    break;
            }

            if (met) {
                this.state.unlockedAchievements.push(achievement.id);
                newlyUnlocked.push(achievement);
            }
        });

        return newlyUnlocked;
    }

    claimAchievement(achievementId) {
        if (!this.state.unlockedAchievements.includes(achievementId)) return null;
        if (this.state.claimedAchievements.includes(achievementId)) return null;

        const achievement = GameData.ACHIEVEMENTS.find(a => a.id === achievementId);
        if (!achievement) return null;

        // 報酬付与
        switch (achievement.reward.type) {
            case 'gold':
                this.state.gold += achievement.reward.amount;
                break;
            case 'gems':
                this.state.gems += achievement.reward.amount;
                break;
        }

        this.state.claimedAchievements.push(achievementId);
        return achievement;
    }

    getAchievementProgress(achievement) {
        const req = achievement.requirement;
        let current = 0;
        let target = req.value;

        switch (req.type) {
            case 'totalTaps':
                current = this.state.totalTaps;
                break;
            case 'totalMonstersKilled':
                current = this.state.totalMonstersKilled;
                break;
            case 'maxStageReached':
                current = this.state.maxStageReached;
                break;
            case 'rebirthCount':
                current = this.state.rebirthCount;
                break;
            case 'totalGoldEarned':
                current = this.state.totalGoldEarned;
                break;
            case 'discoveredMonsters':
                current = this.getDiscoveredMonsterCount();
                break;
            case 'hasRarity':
                current = this.hasObtainedRarity(req.value) ? 1 : 0;
                target = 1;
                break;
        }

        return { current, target, percent: Math.min(100, (current / target) * 100) };
    }

    getUnclaimedAchievementCount() {
        return this.state.unlockedAchievements.filter(
            id => !this.state.claimedAchievements.includes(id)
        ).length;
    }

    // ========================================
    // 召喚システム
    // ========================================

    // 単発召喚
    summonSingle() {
        const cost = GameData.GACHA.SINGLE_COST;
        if (this.state.gems < cost) return null;

        this.state.gems -= cost;
        const result = this.performSummon(1);
        return result;
    }

    // 10連召喚
    summonMulti() {
        const cost = GameData.GACHA.MULTI_COST;
        if (this.state.gems < cost) return null;

        this.state.gems -= cost;
        const result = this.performSummon(GameData.GACHA.MULTI_COUNT);
        return result;
    }

    // 召喚実行
    performSummon(count) {
        const results = [];

        for (let i = 0; i < count; i++) {
            this.state.gachaPityCount++;
            const hero = this.rollGacha();
            const isNew = !this.state.summonedHeroes[hero.id];

            if (isNew) {
                this.state.summonedHeroes[hero.id] = 1;
            } else {
                this.state.summonedHeroes[hero.id]++;
            }

            results.push({
                hero: hero,
                isNew: isNew,
                level: this.state.summonedHeroes[hero.id]
            });

            // 天井100でリセット
            if (this.state.gachaPityCount >= GameData.GACHA.PITY_100) {
                this.state.gachaPityCount = 0;
            }
        }

        return results;
    }

    // ガチャを回す（レアリティ決定→キャラ決定）
    rollGacha() {
        let rarity = this.determineRarity();

        // 天井チェック: 100連で★★★★★確定
        if (this.state.gachaPityCount >= GameData.GACHA.PITY_100) {
            rarity = 'LEGENDARY';
        }
        // 10連ごとに★★★以上確定
        else if (this.state.gachaPityCount % GameData.GACHA.PITY_10 === 0 && this.state.gachaPityCount > 0) {
            if (rarity === 'COMMON' || rarity === 'UNCOMMON') {
                rarity = 'RARE';
            }
        }

        // そのレアリティのキャラからランダム選択
        const heroesOfRarity = GameData.SUMMON_HEROES.filter(h => h.rarity === rarity);
        const hero = heroesOfRarity[Math.floor(Math.random() * heroesOfRarity.length)];

        return hero;
    }

    // レアリティ決定
    determineRarity() {
        const roll = Math.random() * 100;
        const rates = GameData.GACHA.RATES;

        let cumulative = 0;
        cumulative += rates.LEGENDARY;
        if (roll < cumulative) return 'LEGENDARY';

        cumulative += rates.EPIC;
        if (roll < cumulative) return 'EPIC';

        cumulative += rates.RARE;
        if (roll < cumulative) return 'RARE';

        cumulative += rates.UNCOMMON;
        if (roll < cumulative) return 'UNCOMMON';

        return 'COMMON';
    }

    // 所持キャラ一覧を取得
    getOwnedHeroes() {
        const owned = [];
        for (const heroId in this.state.summonedHeroes) {
            const hero = GameData.SUMMON_HEROES.find(h => h.id === heroId);
            if (hero) {
                owned.push({
                    ...hero,
                    level: this.state.summonedHeroes[heroId]
                });
            }
        }
        return owned;
    }

    // 召喚キャラからのボーナス計算
    getSummonHeroBonus(effectType) {
        let bonus = 0;
        for (const heroId in this.state.summonedHeroes) {
            const hero = GameData.SUMMON_HEROES.find(h => h.id === heroId);
            if (hero && hero.effect.type === effectType) {
                const level = this.state.summonedHeroes[heroId];
                bonus += hero.effect.baseValue + (hero.effect.perLevel * (level - 1));
            }
        }
        return bonus;
    }

    // 全ステータスボーナス（覇王など）
    getAllStatsBonus() {
        let bonus = 0;
        for (const heroId in this.state.summonedHeroes) {
            const hero = GameData.SUMMON_HEROES.find(h => h.id === heroId);
            if (hero && hero.effect.type === 'allStats') {
                const level = this.state.summonedHeroes[heroId];
                bonus += hero.effect.baseValue + (hero.effect.perLevel * (level - 1));
            }
        }
        return bonus;
    }

    // 召喚キャラ数を取得
    getOwnedHeroCount() {
        return Object.keys(this.state.summonedHeroes).length;
    }

    // 召喚キャラのDPS合計を取得
    getSummonHeroesDPS() {
        let totalDps = 0;
        for (const heroId in this.state.summonedHeroes) {
            const hero = GameData.SUMMON_HEROES.find(h => h.id === heroId);
            if (hero) {
                const level = this.state.summonedHeroes[heroId];
                // レアリティに応じた基礎DPS
                const baseDps = this.getHeroBaseDPS(hero.rarity);
                // レベルで増加（レベル1で基礎、レベルごとに20%増加）
                totalDps += baseDps * (1 + (level - 1) * 0.2);
            }
        }
        return Math.floor(totalDps);
    }

    // レアリティ別基礎DPS
    getHeroBaseDPS(rarity) {
        const dpsTable = {
            'COMMON': 5,
            'UNCOMMON': 15,
            'RARE': 40,
            'EPIC': 100,
            'LEGENDARY': 300
        };
        return dpsTable[rarity] || 5;
    }

    // 特定キャラのDPSを取得
    getHeroDPS(heroId) {
        const hero = GameData.SUMMON_HEROES.find(h => h.id === heroId);
        if (!hero) return 0;
        const level = this.state.summonedHeroes[heroId] || 0;
        if (level === 0) return 0;
        const baseDps = this.getHeroBaseDPS(hero.rarity);
        return Math.floor(baseDps * (1 + (level - 1) * 0.2));
    }

    // バトル画面に表示するキャラを切り替え
    toggleBattleHero(heroId) {
        if (!this.state.battleHeroes) this.state.battleHeroes = [];

        const index = this.state.battleHeroes.indexOf(heroId);
        if (index >= 0) {
            // 既に入っている場合は削除
            this.state.battleHeroes.splice(index, 1);
            return false;
        } else {
            // 最大6体まで
            if (this.state.battleHeroes.length >= 6) {
                return null; // 最大数に達している
            }
            this.state.battleHeroes.push(heroId);
            return true;
        }
    }

    // バトル画面に表示するキャラ一覧を取得
    getBattleHeroes() {
        if (!this.state.battleHeroes) this.state.battleHeroes = [];

        return this.state.battleHeroes
            .map(heroId => {
                const hero = GameData.SUMMON_HEROES.find(h => h.id === heroId);
                if (hero && this.state.summonedHeroes[heroId]) {
                    return {
                        ...hero,
                        level: this.state.summonedHeroes[heroId]
                    };
                }
                return null;
            })
            .filter(h => h !== null);
    }

    // キャラがバトル画面に表示されているか
    isHeroInBattle(heroId) {
        if (!this.state.battleHeroes) return false;
        return this.state.battleHeroes.includes(heroId);
    }
}

// グローバルにエクスポート
window.Game = Game;
