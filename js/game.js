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
            gems: 0,

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
            completedChapters: []
        };

        // 現在のモンスター
        this.currentMonster = null;
        this.isBossFight = false;
        this.bossTimer = null;
        this.bossTimeLeft = 0;

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
        const isBoss = this.state.currentStage % GameData.BALANCE.BOSS_EVERY_STAGES === 0;
        this.isBossFight = isBoss;

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

            // ボスタイマー開始
            this.bossTimeLeft = this.getBossTimeLimit();
        } else {
            // 現在のワールドを取得
            const currentWorld = this.getCurrentWorld();

            // ワールドに対応するモンスターからランダムに選択
            const availableMonsters = this.getAvailableMonstersForWorld(currentWorld);
            const monsterData = availableMonsters[Math.floor(Math.random() * availableMonsters.length)];
            const hp = this.getBaseMonsterHp();

            this.currentMonster = {
                name: monsterData.name,
                svg: monsterData.svg,
                color: monsterData.color,
                maxHp: hp,
                currentHp: hp,
                isBoss: false
            };
        }
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

        return timeLimit;
    }

    // ========================================
    // ダメージ計算
    // ========================================
    tap() {
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

        return Math.floor(baseDps * multiplier);
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

            // ゴールド報酬
            let goldReward = Math.floor(monster.maxHp * GameData.BALANCE.GOLD_PER_HP_RATIO);
            if (monster.isBoss) {
                goldReward *= GameData.BALANCE.BOSS_GOLD_MULTIPLIER;
            }
            goldReward = Math.floor(goldReward * this.getGoldMultiplier());
            this.state.gold += goldReward;
            this.state.totalGoldEarned += goldReward;

            // ドロップチェック（エラーでも続行）
            try {
                this.checkEquipmentDrop(monster.isBoss);
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

        // スキルエフェクト
        const goldMultiplier = this.getActiveEffectValue('goldMultiplier');
        if (goldMultiplier > 1) {
            multiplier *= goldMultiplier;
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
    checkEquipmentDrop(isBoss) {
        const dropChance = isBoss
            ? GameData.BALANCE.BOSS_EQUIPMENT_DROP_CHANCE
            : GameData.BALANCE.EQUIPMENT_DROP_CHANCE;

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

        return souls;
    }

    rebirth() {
        if (!this.canRebirth()) return false;

        const soulsGained = this.getPendingSouls();
        this.state.souls += soulsGained;
        this.state.rebirthCount++;

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
}

// グローバルにエクスポート
window.Game = Game;
