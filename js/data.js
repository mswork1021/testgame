/* ========================================
   Tap Quest - ゲームデータ定義
   ======================================== */

const GameData = {
    // レアリティ定義
    RARITY: {
        COMMON: { name: 'コモン', class: 'common', multiplier: 1, color: '#b8b8b8' },
        UNCOMMON: { name: 'アンコモン', class: 'uncommon', multiplier: 1.5, color: '#2ecc71' },
        RARE: { name: 'レア', class: 'rare', multiplier: 2.5, color: '#3498db' },
        EPIC: { name: 'エピック', class: 'epic', multiplier: 4, color: '#9b59b6' },
        LEGENDARY: { name: 'レジェンダリー', class: 'legendary', multiplier: 7, color: '#f39c12' }
    },

    // モンスター定義
    MONSTERS: [
        { name: 'スライム', emoji: '🟢', baseHp: 10 },
        { name: 'ゴブリン', emoji: '👺', baseHp: 15 },
        { name: 'コウモリ', emoji: '🦇', baseHp: 20 },
        { name: 'スケルトン', emoji: '💀', baseHp: 30 },
        { name: 'オーク', emoji: '👹', baseHp: 45 },
        { name: 'ウルフ', emoji: '🐺', baseHp: 60 },
        { name: 'トロール', emoji: '👾', baseHp: 80 },
        { name: 'ゴーレム', emoji: '🗿', baseHp: 100 },
        { name: 'ワイバーン', emoji: '🐉', baseHp: 130 },
        { name: 'デーモン', emoji: '😈', baseHp: 170 }
    ],

    // ボスモンスター定義
    BOSSES: [
        { name: 'キングスライム', emoji: '👑', hpMultiplier: 10 },
        { name: 'ゴブリンキング', emoji: '🤴', hpMultiplier: 12 },
        { name: 'ヴァンパイア', emoji: '🧛', hpMultiplier: 15 },
        { name: 'リッチ', emoji: '☠️', hpMultiplier: 18 },
        { name: 'ドラゴン', emoji: '🐲', hpMultiplier: 25 }
    ],

    // ヒーロー（タップダメージ強化）
    HEROES: [
        {
            id: 'warrior',
            name: '戦士',
            emoji: '⚔️',
            baseDamage: 1,
            baseCost: 10,
            description: 'タップダメージ +{damage}'
        },
        {
            id: 'archer',
            name: '弓使い',
            emoji: '🏹',
            baseDamage: 5,
            baseCost: 100,
            description: 'タップダメージ +{damage}'
        },
        {
            id: 'mage',
            name: '魔法使い',
            emoji: '🧙',
            baseDamage: 25,
            baseCost: 1000,
            description: 'タップダメージ +{damage}'
        },
        {
            id: 'knight',
            name: '騎士',
            emoji: '🛡️',
            baseDamage: 100,
            baseCost: 10000,
            description: 'タップダメージ +{damage}'
        },
        {
            id: 'ninja',
            name: '忍者',
            emoji: '🥷',
            baseDamage: 400,
            baseCost: 100000,
            description: 'タップダメージ +{damage}'
        }
    ],

    // 仲間（自動DPS）
    COMPANIONS: [
        {
            id: 'squire',
            name: '従者',
            emoji: '👦',
            baseDps: 1,
            baseCost: 50,
            description: '自動DPS +{dps}'
        },
        {
            id: 'wolf',
            name: 'オオカミ',
            emoji: '🐕',
            baseDps: 5,
            baseCost: 500,
            description: '自動DPS +{dps}'
        },
        {
            id: 'golem',
            name: 'ゴーレム',
            emoji: '🤖',
            baseDps: 25,
            baseCost: 5000,
            description: '自動DPS +{dps}'
        },
        {
            id: 'dragon',
            name: 'ドラゴン',
            emoji: '🐲',
            baseDps: 100,
            baseCost: 50000,
            description: '自動DPS +{dps}'
        },
        {
            id: 'phoenix',
            name: 'フェニックス',
            emoji: '🔥',
            baseDps: 400,
            baseCost: 500000,
            description: '自動DPS +{dps}'
        }
    ],

    // スキル定義
    SKILLS: [
        {
            id: 'powerTap',
            name: 'パワータップ',
            emoji: '💥',
            description: '10秒間タップダメージ2倍',
            cooldown: 60,
            duration: 10,
            effect: { type: 'tapMultiplier', value: 2 },
            unlockStage: 1
        },
        {
            id: 'goldRush',
            name: 'ゴールドラッシュ',
            emoji: '💰',
            description: '30秒間ゴールド獲得2倍',
            cooldown: 120,
            duration: 30,
            effect: { type: 'goldMultiplier', value: 2 },
            unlockStage: 20
        },
        {
            id: 'criticalWave',
            name: 'クリティカルウェーブ',
            emoji: '⚡',
            description: '15秒間クリティカル率100%',
            cooldown: 90,
            duration: 15,
            effect: { type: 'criticalChance', value: 100 },
            unlockStage: 50
        },
        {
            id: 'timeStop',
            name: 'タイムストップ',
            emoji: '⏰',
            description: 'ボス戦タイマーを10秒追加',
            cooldown: 180,
            duration: 0,
            effect: { type: 'bossTime', value: 10 },
            unlockStage: 80
        },
        {
            id: 'meteor',
            name: 'メテオストライク',
            emoji: '☄️',
            description: '現在HPの30%ダメージ',
            cooldown: 150,
            duration: 0,
            effect: { type: 'percentDamage', value: 30 },
            unlockStage: 100
        },
        {
            id: 'autoTap',
            name: 'オートタップ',
            emoji: '🤖',
            description: '30秒間自動タップ(10回/秒)',
            cooldown: 120,
            duration: 30,
            effect: { type: 'autoTap', value: 10 },
            unlockStage: 30
        }
    ],

    // 装備テンプレート
    EQUIPMENT: {
        WEAPONS: [
            { name: '木の剣', emoji: '🗡️', baseValue: 5, type: 'weapon', stat: 'tapDamage' },
            { name: '鉄の剣', emoji: '⚔️', baseValue: 15, type: 'weapon', stat: 'tapDamage' },
            { name: '魔法の杖', emoji: '🪄', baseValue: 30, type: 'weapon', stat: 'tapDamage' },
            { name: '伝説の剣', emoji: '🔱', baseValue: 50, type: 'weapon', stat: 'tapDamage' },
            { name: 'ドラゴンスレイヤー', emoji: '🌟', baseValue: 100, type: 'weapon', stat: 'tapDamage' }
        ],
        ARMORS: [
            { name: '布の服', emoji: '👕', baseValue: 2, type: 'armor', stat: 'bossTime' },
            { name: '革の鎧', emoji: '🥋', baseValue: 4, type: 'armor', stat: 'bossTime' },
            { name: '鎖かたびら', emoji: '⛓️', baseValue: 6, type: 'armor', stat: 'bossTime' },
            { name: 'プレートメイル', emoji: '🛡️', baseValue: 8, type: 'armor', stat: 'bossTime' },
            { name: '神聖な鎧', emoji: '✨', baseValue: 12, type: 'armor', stat: 'bossTime' }
        ],
        ACCESSORIES: [
            { name: '銅の指輪', emoji: '💍', baseValue: 5, type: 'accessory', stat: 'goldBonus' },
            { name: '幸運のお守り', emoji: '🍀', baseValue: 10, type: 'accessory', stat: 'goldBonus' },
            { name: 'クリスタルペンダント', emoji: '📿', baseValue: 15, type: 'accessory', stat: 'critChance' },
            { name: 'ドラゴンの牙', emoji: '🦷', baseValue: 20, type: 'accessory', stat: 'critDamage' },
            { name: '王家の紋章', emoji: '👑', baseValue: 30, type: 'accessory', stat: 'allStats' }
        ]
    },

    // アーティファクト定義
    ARTIFACTS: [
        {
            id: 'swordOfHeroes',
            name: '英雄の剣',
            emoji: '⚔️',
            description: 'タップダメージ +{value}%',
            baseCost: 5,
            costMultiplier: 1.5,
            effect: { type: 'tapDamagePercent', baseValue: 10 }
        },
        {
            id: 'goldenCrown',
            name: '黄金の冠',
            emoji: '👑',
            description: 'ゴールド獲得 +{value}%',
            baseCost: 5,
            costMultiplier: 1.5,
            effect: { type: 'goldPercent', baseValue: 10 }
        },
        {
            id: 'ancientScroll',
            name: '古代の巻物',
            emoji: '📜',
            description: '自動DPS +{value}%',
            baseCost: 8,
            costMultiplier: 1.6,
            effect: { type: 'dpsPercent', baseValue: 15 }
        },
        {
            id: 'timeCrystal',
            name: '時の結晶',
            emoji: '💎',
            description: 'ボス戦時間 +{value}秒',
            baseCost: 10,
            costMultiplier: 1.8,
            effect: { type: 'bossTimeFlat', baseValue: 2 }
        },
        {
            id: 'luckyCharm',
            name: '幸運のチャーム',
            emoji: '🍀',
            description: 'クリティカル率 +{value}%',
            baseCost: 12,
            costMultiplier: 1.7,
            effect: { type: 'critChance', baseValue: 2 }
        },
        {
            id: 'dragonHeart',
            name: 'ドラゴンの心臓',
            emoji: '❤️‍🔥',
            description: 'クリティカルダメージ +{value}%',
            baseCost: 15,
            costMultiplier: 1.8,
            effect: { type: 'critDamage', baseValue: 25 }
        },
        {
            id: 'soulVessel',
            name: '魂の器',
            emoji: '👻',
            description: '転生時ソウル +{value}%',
            baseCost: 20,
            costMultiplier: 2.0,
            effect: { type: 'soulBonus', baseValue: 10 }
        },
        {
            id: 'infinityStone',
            name: '無限の石',
            emoji: '💠',
            description: '全ステータス +{value}%',
            baseCost: 50,
            costMultiplier: 2.5,
            effect: { type: 'allStats', baseValue: 5 }
        }
    ],

    // ゲームバランス設定
    BALANCE: {
        // ステージ関連
        MONSTERS_PER_STAGE: 10,
        BOSS_EVERY_STAGES: 10,
        BOSS_TIME_LIMIT: 30,

        // コスト増加率
        HERO_COST_MULTIPLIER: 1.15,
        COMPANION_COST_MULTIPLIER: 1.12,

        // HP増加率（ステージごと）
        MONSTER_HP_SCALING: 1.15,

        // ゴールド報酬
        GOLD_PER_HP_RATIO: 0.1,
        BOSS_GOLD_MULTIPLIER: 10,

        // クリティカル
        BASE_CRIT_CHANCE: 5,
        BASE_CRIT_DAMAGE: 200,

        // 転生関連
        MIN_REBIRTH_STAGE: 100,
        SOULS_PER_STAGE: 1,
        SOULS_SCALING: 1.1,

        // オフライン報酬
        MAX_OFFLINE_HOURS: 8,
        OFFLINE_EFFICIENCY: 0.1,

        // ドロップ率
        EQUIPMENT_DROP_CHANCE: 5,
        BOSS_EQUIPMENT_DROP_CHANCE: 25
    }
};

// グローバルにエクスポート
window.GameData = GameData;
