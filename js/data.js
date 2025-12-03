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

    // モンスター定義（SVGでかわいいオリジナルデザイン）
    MONSTERS: [
        {
            name: 'スライム',
            baseHp: 10,
            color: '#7ed56f',
            svg: `<svg viewBox="0 0 100 100">
                <ellipse cx="50" cy="75" rx="40" ry="20" fill="#5a9" opacity="0.3"/>
                <path d="M20,60 Q10,40 25,25 Q40,10 50,15 Q60,10 75,25 Q90,40 80,60 Q75,80 50,85 Q25,80 20,60" fill="#7ed56f"/>
                <path d="M25,55 Q20,40 30,30 Q40,20 50,22" fill="#9f9" opacity="0.5"/>
                <ellipse cx="38" cy="45" rx="8" ry="10" fill="#fff"/>
                <ellipse cx="62" cy="45" rx="8" ry="10" fill="#fff"/>
                <circle cx="40" cy="47" r="4" fill="#333"/>
                <circle cx="64" cy="47" r="4" fill="#333"/>
                <circle cx="41" cy="45" r="1.5" fill="#fff"/>
                <circle cx="65" cy="45" r="1.5" fill="#fff"/>
                <path d="M45,60 Q50,65 55,60" stroke="#333" stroke-width="2" fill="none" stroke-linecap="round"/>
            </svg>`
        },
        {
            name: 'ゴースト',
            baseHp: 15,
            color: '#e8e8e8',
            svg: `<svg viewBox="0 0 100 100">
                <ellipse cx="50" cy="85" rx="25" ry="8" fill="#333" opacity="0.2"/>
                <path d="M25,45 Q25,15 50,15 Q75,15 75,45 L75,75 Q70,70 65,75 Q60,80 55,75 Q50,70 45,75 Q40,80 35,75 Q30,70 25,75 Z" fill="#e8e8e8"/>
                <path d="M30,40 Q30,20 50,20 Q55,20 58,22" fill="#fff" opacity="0.5"/>
                <ellipse cx="40" cy="40" rx="10" ry="12" fill="#333"/>
                <ellipse cx="60" cy="40" rx="10" ry="12" fill="#333"/>
                <circle cx="43" cy="38" r="3" fill="#fff"/>
                <circle cx="63" cy="38" r="3" fill="#fff"/>
                <ellipse cx="50" cy="58" rx="6" ry="8" fill="#333"/>
            </svg>`
        },
        {
            name: 'コウモリ',
            baseHp: 20,
            color: '#9b7bb8',
            svg: `<svg viewBox="0 0 100 100">
                <path d="M5,40 Q15,25 25,35 Q30,30 35,35 L40,45 L45,40 Q48,35 50,40 Q52,35 55,40 L60,45 L65,35 Q70,30 75,35 Q85,25 95,40 Q85,55 75,50 L70,55 Q65,70 50,75 Q35,70 30,55 L25,50 Q15,55 5,40" fill="#9b7bb8"/>
                <ellipse cx="40" cy="50" rx="6" ry="7" fill="#fff"/>
                <ellipse cx="60" cy="50" rx="6" ry="7" fill="#fff"/>
                <circle cx="41" cy="51" r="3" fill="#ff6b9d"/>
                <circle cx="61" cy="51" r="3" fill="#ff6b9d"/>
                <path d="M45,62 L48,68 L50,62 L52,68 L55,62" fill="#fff"/>
            </svg>`
        },
        {
            name: 'マッシュルーム',
            baseHp: 30,
            color: '#e74c3c',
            svg: `<svg viewBox="0 0 100 100">
                <ellipse cx="50" cy="88" rx="15" ry="5" fill="#333" opacity="0.2"/>
                <rect x="40" y="60" width="20" height="30" rx="5" fill="#f5deb3"/>
                <ellipse cx="50" cy="50" rx="35" ry="30" fill="#e74c3c"/>
                <circle cx="35" cy="40" r="8" fill="#fff"/>
                <circle cx="55" cy="35" r="6" fill="#fff"/>
                <circle cx="70" cy="50" r="5" fill="#fff"/>
                <circle cx="30" cy="55" r="4" fill="#fff"/>
                <ellipse cx="42" cy="55" rx="5" ry="6" fill="#333"/>
                <ellipse cx="58" cy="55" rx="5" ry="6" fill="#333"/>
                <circle cx="43" cy="53" r="2" fill="#fff"/>
                <circle cx="59" cy="53" r="2" fill="#fff"/>
                <ellipse cx="50" cy="65" rx="4" ry="2" fill="#ff9999"/>
            </svg>`
        },
        {
            name: 'オバケツリー',
            baseHp: 45,
            color: '#8b5a2b',
            svg: `<svg viewBox="0 0 100 100">
                <rect x="42" y="65" width="16" height="30" fill="#8b5a2b"/>
                <ellipse cx="50" cy="40" rx="35" ry="35" fill="#228b22"/>
                <ellipse cx="35" cy="30" rx="15" ry="15" fill="#2d9e2d"/>
                <ellipse cx="65" cy="30" rx="15" ry="15" fill="#2d9e2d"/>
                <ellipse cx="50" cy="25" rx="12" ry="12" fill="#32b232"/>
                <circle cx="38" cy="45" r="8" fill="#1a1a1a"/>
                <circle cx="62" cy="45" r="8" fill="#1a1a1a"/>
                <circle cx="40" cy="43" r="2.5" fill="#ff6b6b"/>
                <circle cx="64" cy="43" r="2.5" fill="#ff6b6b"/>
                <path d="M42,60 Q50,70 58,60" stroke="#1a1a1a" stroke-width="3" fill="none"/>
            </svg>`
        },
        {
            name: 'ウルフ',
            baseHp: 60,
            color: '#7f8c8d',
            svg: `<svg viewBox="0 0 100 100">
                <ellipse cx="50" cy="85" rx="30" ry="8" fill="#333" opacity="0.2"/>
                <ellipse cx="50" cy="65" rx="25" ry="18" fill="#7f8c8d"/>
                <circle cx="50" cy="45" r="22" fill="#7f8c8d"/>
                <polygon points="30,30 38,45 22,45" fill="#7f8c8d"/>
                <polygon points="70,30 78,45 62,45" fill="#7f8c8d"/>
                <polygon points="32,33 37,42 27,42" fill="#ffb6c1"/>
                <polygon points="68,33 73,42 63,42" fill="#ffb6c1"/>
                <ellipse cx="42" cy="42" rx="6" ry="7" fill="#fff"/>
                <ellipse cx="58" cy="42" rx="6" ry="7" fill="#fff"/>
                <circle cx="43" cy="43" r="3" fill="#ffd700"/>
                <circle cx="59" cy="43" r="3" fill="#ffd700"/>
                <circle cx="44" cy="42" r="1" fill="#333"/>
                <circle cx="60" cy="42" r="1" fill="#333"/>
                <ellipse cx="50" cy="55" rx="6" ry="4" fill="#333"/>
                <path d="M44,62 Q50,58 56,62" stroke="#333" stroke-width="2" fill="none"/>
            </svg>`
        },
        {
            name: 'ミミック',
            baseHp: 80,
            color: '#c9a227',
            svg: `<svg viewBox="0 0 100 100">
                <rect x="15" y="40" width="70" height="45" rx="5" fill="#8b4513"/>
                <rect x="15" y="35" width="70" height="15" rx="3" fill="#c9a227"/>
                <rect x="20" y="38" width="60" height="8" fill="#daa520"/>
                <path d="M20,50 Q25,45 30,50 L30,55 Q25,60 20,55 Z" fill="#ff6b6b"/>
                <path d="M35,50 Q40,45 45,50 L45,55 Q40,60 35,55 Z" fill="#ff6b6b"/>
                <path d="M55,50 Q60,45 65,50 L65,55 Q60,60 55,55 Z" fill="#ff6b6b"/>
                <path d="M70,50 Q75,45 80,50 L80,55 Q75,60 70,55 Z" fill="#ff6b6b"/>
                <circle cx="35" cy="65" r="8" fill="#fff"/>
                <circle cx="65" cy="65" r="8" fill="#fff"/>
                <circle cx="37" cy="66" r="4" fill="#ff0"/>
                <circle cx="67" cy="66" r="4" fill="#ff0"/>
                <circle cx="38" cy="65" r="2" fill="#333"/>
                <circle cx="68" cy="65" r="2" fill="#333"/>
            </svg>`
        },
        {
            name: 'ゴーレム',
            baseHp: 100,
            color: '#708090',
            svg: `<svg viewBox="0 0 100 100">
                <rect x="35" y="70" width="12" height="20" rx="3" fill="#708090"/>
                <rect x="53" y="70" width="12" height="20" rx="3" fill="#708090"/>
                <rect x="25" y="40" width="50" height="35" rx="8" fill="#708090"/>
                <rect x="15" y="45" width="15" height="25" rx="5" fill="#708090"/>
                <rect x="70" y="45" width="15" height="25" rx="5" fill="#708090"/>
                <rect x="30" y="20" width="40" height="30" rx="10" fill="#708090"/>
                <rect cx="50" cy="38" width="30" height="8" rx="2" fill="#333"/>
                <circle cx="40" cy="32" r="5" fill="#5df"/>
                <circle cx="60" cy="32" r="5" fill="#5df"/>
                <path d="M35,32 L45,32" stroke="#fff" stroke-width="2" opacity="0.5"/>
                <path d="M55,32 L65,32" stroke="#fff" stroke-width="2" opacity="0.5"/>
                <rect x="40" y="55" width="20" height="15" rx="3" fill="#5a6570"/>
                <path d="M43,60 L43,67 M50,60 L50,67 M57,60 L57,67" stroke="#444" stroke-width="2"/>
            </svg>`
        },
        {
            name: 'ワイバーン',
            baseHp: 130,
            color: '#9b59b6',
            svg: `<svg viewBox="0 0 100 100">
                <path d="M5,35 Q15,15 30,30 L35,40" fill="#9b59b6"/>
                <path d="M95,35 Q85,15 70,30 L65,40" fill="#9b59b6"/>
                <ellipse cx="50" cy="60" rx="22" ry="18" fill="#9b59b6"/>
                <ellipse cx="50" cy="40" rx="18" ry="15" fill="#9b59b6"/>
                <polygon points="42,28 50,15 58,28" fill="#9b59b6"/>
                <polygon points="44,28 50,20 56,28" fill="#ff69b4"/>
                <ellipse cx="43" cy="38" rx="5" ry="6" fill="#fff"/>
                <ellipse cx="57" cy="38" rx="5" ry="6" fill="#fff"/>
                <circle cx="44" cy="39" r="3" fill="#e74c3c"/>
                <circle cx="58" cy="39" r="3" fill="#e74c3c"/>
                <circle cx="45" cy="38" r="1" fill="#333"/>
                <circle cx="59" cy="38" r="1" fill="#333"/>
                <path d="M47,48 L50,52 L53,48" fill="#ff69b4"/>
                <ellipse cx="50" cy="72" rx="8" ry="5" fill="#f5deb3"/>
            </svg>`
        },
        {
            name: 'デーモン',
            baseHp: 170,
            color: '#c0392b',
            svg: `<svg viewBox="0 0 100 100">
                <ellipse cx="50" cy="88" rx="20" ry="6" fill="#333" opacity="0.3"/>
                <ellipse cx="50" cy="60" rx="23" ry="28" fill="#c0392b"/>
                <circle cx="50" cy="38" r="20" fill="#c0392b"/>
                <path d="M30,25 Q25,10 35,18 L38,28" fill="#c0392b"/>
                <path d="M70,25 Q75,10 65,18 L62,28" fill="#c0392b"/>
                <ellipse cx="42" cy="35" rx="6" ry="7" fill="#ff0"/>
                <ellipse cx="58" cy="35" rx="6" ry="7" fill="#ff0"/>
                <ellipse cx="43" cy="36" r="3" fill="#333"/>
                <ellipse cx="59" cy="36" r="3" fill="#333"/>
                <path d="M40,50 Q50,58 60,50" stroke="#000" stroke-width="2" fill="none"/>
                <path d="M42,50 L44,54 M50,52 L50,56 M58,50 L56,54" stroke="#fff" stroke-width="2"/>
                <path d="M20,40 Q15,50 20,60 L30,55" fill="#c0392b"/>
                <path d="M80,40 Q85,50 80,60 L70,55" fill="#c0392b"/>
            </svg>`
        }
    ],

    // ボスモンスター定義（より大きく威厳のあるデザイン）
    BOSSES: [
        {
            name: 'キングスライム',
            hpMultiplier: 10,
            color: '#4ecdc4',
            svg: `<svg viewBox="0 0 100 100">
                <ellipse cx="50" cy="82" rx="45" ry="15" fill="#3ab" opacity="0.3"/>
                <path d="M10,55 Q0,30 20,15 Q35,-5 50,5 Q65,-5 80,15 Q100,30 90,55 Q85,80 50,88 Q15,80 10,55" fill="#4ecdc4"/>
                <path d="M18,50 Q12,30 28,18 Q40,8 50,12" fill="#7ef" opacity="0.4"/>
                <path d="M35,0 L42,15 L50,0 L58,15 L65,0" fill="#ffd700"/>
                <ellipse cx="38" cy="40" rx="10" ry="12" fill="#fff"/>
                <ellipse cx="62" cy="40" rx="10" ry="12" fill="#fff"/>
                <circle cx="40" cy="42" r="5" fill="#333"/>
                <circle cx="64" cy="42" r="5" fill="#333"/>
                <circle cx="42" cy="40" r="2" fill="#fff"/>
                <circle cx="66" cy="40" r="2" fill="#fff"/>
                <path d="M42,60 Q50,70 58,60" stroke="#333" stroke-width="3" fill="none" stroke-linecap="round"/>
            </svg>`
        },
        {
            name: 'ゴーストロード',
            hpMultiplier: 12,
            color: '#dda0dd',
            svg: `<svg viewBox="0 0 100 100">
                <ellipse cx="50" cy="90" rx="30" ry="8" fill="#333" opacity="0.2"/>
                <path d="M18,40 Q18,5 50,5 Q82,5 82,40 L82,75 Q75,68 68,75 Q61,82 54,75 Q47,68 40,75 Q33,82 26,75 Q19,68 18,75 Z" fill="#dda0dd"/>
                <path d="M25,35 Q25,15 50,15 Q58,15 63,18" fill="#fff" opacity="0.4"/>
                <path d="M40,0 L50,12 L60,0" fill="#9932cc"/>
                <ellipse cx="38" cy="35" rx="12" ry="14" fill="#4b0082"/>
                <ellipse cx="62" cy="35" rx="12" ry="14" fill="#4b0082"/>
                <circle cx="42" cy="33" r="4" fill="#ff69b4"/>
                <circle cx="66" cy="33" r="4" fill="#ff69b4"/>
                <ellipse cx="50" cy="55" rx="10" ry="12" fill="#4b0082"/>
            </svg>`
        },
        {
            name: 'ヴァンパイア',
            hpMultiplier: 15,
            color: '#2c3e50',
            svg: `<svg viewBox="0 0 100 100">
                <path d="M15,25 Q10,5 30,10 L35,25 M85,25 Q90,5 70,10 L65,25" fill="#2c3e50"/>
                <circle cx="50" cy="45" r="28" fill="#ecf0f1"/>
                <ellipse cx="50" cy="70" rx="18" ry="20" fill="#2c3e50"/>
                <path d="M20,30 Q50,10 80,30 L75,50 Q50,35 25,50 Z" fill="#2c3e50"/>
                <ellipse cx="40" cy="42" rx="7" ry="8" fill="#c0392b"/>
                <ellipse cx="60" cy="42" rx="7" ry="8" fill="#c0392b"/>
                <circle cx="42" cy="43" r="3" fill="#000"/>
                <circle cx="62" cy="43" r="3" fill="#000"/>
                <path d="M40,58 Q50,52 60,58" stroke="#c0392b" stroke-width="2" fill="none"/>
                <path d="M42,58 L44,65 M58,58 L56,65" stroke="#fff" stroke-width="2"/>
            </svg>`
        },
        {
            name: 'リッチ',
            hpMultiplier: 18,
            color: '#1a1a2e',
            svg: `<svg viewBox="0 0 100 100">
                <ellipse cx="50" cy="88" rx="20" ry="6" fill="#9b59b6" opacity="0.3"/>
                <path d="M25,50 Q25,15 50,15 Q75,15 75,50 L75,85 L25,85 Z" fill="#1a1a2e"/>
                <path d="M30,45 Q30,22 50,22 Q55,22 60,25" fill="#2a2a3e" opacity="0.5"/>
                <ellipse cx="50" cy="45" rx="22" ry="20" fill="#f5deb3"/>
                <circle cx="42" cy="42" r="6" fill="#000"/>
                <circle cx="58" cy="42" r="6" fill="#000"/>
                <circle cx="42" cy="42" r="3" fill="#9b59b6"/>
                <circle cx="58" cy="42" r="3" fill="#9b59b6"/>
                <path d="M35,55 L40,55 M45,57 L55,57 M60,55 L65,55" stroke="#333" stroke-width="2"/>
                <circle cx="50" cy="5" r="8" fill="#9b59b6"/>
                <circle cx="50" cy="5" r="4" fill="#fff" opacity="0.5"/>
            </svg>`
        },
        {
            name: 'エンシェントドラゴン',
            hpMultiplier: 25,
            color: '#c0392b',
            svg: `<svg viewBox="0 0 100 100">
                <path d="M0,50 Q10,20 25,40 Q30,30 40,42 L45,50" fill="#c0392b"/>
                <path d="M100,50 Q90,20 75,40 Q70,30 60,42 L55,50" fill="#c0392b"/>
                <ellipse cx="50" cy="60" rx="30" ry="25" fill="#c0392b"/>
                <ellipse cx="50" cy="38" rx="25" ry="22" fill="#c0392b"/>
                <path d="M30,15 Q25,0 35,8 L40,20" fill="#c0392b"/>
                <path d="M70,15 Q75,0 65,8 L60,20" fill="#c0392b"/>
                <polygon points="25,20 35,5 45,20" fill="#ffd700"/>
                <polygon points="55,20 65,5 75,20" fill="#ffd700"/>
                <ellipse cx="40" cy="35" rx="8" ry="10" fill="#ffd700"/>
                <ellipse cx="60" cy="35" rx="8" ry="10" fill="#ffd700"/>
                <ellipse cx="42" cy="36" rx="4" ry="5" fill="#000"/>
                <ellipse cx="62" cy="36" rx="4" ry="5" fill="#000"/>
                <path d="M40,55 Q50,48 60,55" fill="#f39c12"/>
                <path d="M35,58 L40,55 L45,58 M55,58 L60,55 L65,58" fill="#fff"/>
                <ellipse cx="50" cy="75" rx="15" ry="10" fill="#f5deb3"/>
                <path d="M38,73 L38,80 M45,72 L45,82 M55,72 L55,82 M62,73 L62,80" stroke="#e67e22" stroke-width="2"/>
            </svg>`
        }
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

    // 宝箱報酬定義
    TREASURE_CHEST_REWARDS: [
        {
            id: 'gold',
            name: 'ゴールド',
            emoji: '💰',
            weight: 966,
            description: 'ゴールドを獲得！',
            getReward: (stage) => ({ type: 'gold', amount: Math.floor(stage * 100 * (1 + Math.random())) })
        },
        {
            id: 'gems',
            name: 'ジェム',
            emoji: '💎',
            weight: 1,
            description: 'ジェムを獲得！',
            getReward: (stage) => ({ type: 'gems', amount: Math.floor(1 + stage / 50) })
        },
        {
            id: 'luckyTime',
            name: 'ラッキータイム',
            emoji: '🌟',
            weight: 20,
            description: '30秒間ゴールド2倍＆ドロップ率UP！',
            getReward: (stage) => ({ type: 'luckyTime', duration: 30 })
        },
        {
            id: 'skillReset',
            name: 'スキルリセット',
            emoji: '⚡',
            weight: 1,
            description: '全スキルのクールダウンをリセット！',
            getReward: (stage) => ({ type: 'skillReset' })
        },
        {
            id: 'rareEquip',
            name: 'レア装備',
            emoji: '🎁',
            weight: 10,
            description: 'レア以上の装備を獲得！',
            getReward: (stage) => ({ type: 'equipment', minRarity: 'RARE' })
        },
        {
            id: 'souls',
            name: 'ソウル',
            emoji: '👻',
            weight: 1,
            description: 'ソウルを獲得！',
            getReward: (stage) => ({ type: 'souls', amount: Math.floor(1 + stage / 20) })
        }
    ],

    // 宝箱出現設定
    TREASURE_CHEST: {
        SPAWN_CHANCE: 5, // 5%の確率で宝箱出現
        SVG: `<svg viewBox="0 0 100 100">
            <ellipse cx="50" cy="85" rx="35" ry="10" fill="#333" opacity="0.3"/>
            <rect x="15" y="40" width="70" height="40" rx="5" fill="#8b4513"/>
            <rect x="15" y="35" width="70" height="20" rx="5" fill="#daa520"/>
            <rect x="18" y="38" width="64" height="14" fill="#ffd700"/>
            <rect x="42" y="45" width="16" height="25" rx="3" fill="#ffd700"/>
            <circle cx="50" cy="57" r="6" fill="#fff"/>
            <circle cx="50" cy="57" r="4" fill="#333"/>
            <rect x="20" y="55" width="60" height="20" rx="3" fill="#a0522d"/>
            <path d="M25,60 L75,60" stroke="#8b4513" stroke-width="2"/>
            <path d="M25,70 L75,70" stroke="#8b4513" stroke-width="2"/>
            <!-- キラキラエフェクト -->
            <circle cx="30" cy="42" r="2" fill="#fff" opacity="0.8"/>
            <circle cx="70" cy="38" r="1.5" fill="#fff" opacity="0.6"/>
            <circle cx="25" cy="50" r="1" fill="#fff" opacity="0.7"/>
        </svg>`
    },

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
    },

    // ワールドマップ定義
    WORLDS: [
        {
            id: 'greenfield',
            name: '緑の草原',
            description: '冒険の始まり。穏やかな草原が広がる',
            stageRange: [1, 50],
            unlockStage: 1,
            icon: '🌿',
            color: '#4ade80',
            bgGradient: 'linear-gradient(180deg, #86efac 0%, #4ade80 50%, #22c55e 100%)',
            monsters: ['スライム', 'ゴースト', 'コウモリ'],
            boss: 'キングスライム'
        },
        {
            id: 'darkforest',
            name: '暗黒の森',
            description: '不気味な木々が生い茂る危険な森',
            stageRange: [51, 100],
            unlockStage: 51,
            icon: '🌲',
            color: '#166534',
            bgGradient: 'linear-gradient(180deg, #14532d 0%, #166534 50%, #15803d 100%)',
            monsters: ['マッシュルーム', 'オバケツリー', 'ウルフ'],
            boss: 'ゴーストロード'
        },
        {
            id: 'dungeon',
            name: '古代遺跡',
            description: '忘れられた古代文明の遺跡',
            stageRange: [101, 200],
            unlockStage: 101,
            icon: '🏛️',
            color: '#78716c',
            bgGradient: 'linear-gradient(180deg, #57534e 0%, #78716c 50%, #a8a29e 100%)',
            monsters: ['ミミック', 'ゴーレム'],
            boss: 'ヴァンパイア'
        },
        {
            id: 'volcano',
            name: '灼熱の火山',
            description: '溶岩が流れる危険な活火山',
            stageRange: [201, 350],
            unlockStage: 201,
            icon: '🌋',
            color: '#dc2626',
            bgGradient: 'linear-gradient(180deg, #7f1d1d 0%, #dc2626 50%, #f97316 100%)',
            monsters: ['ワイバーン', 'デーモン'],
            boss: 'リッチ'
        },
        {
            id: 'skycastle',
            name: '天空城',
            description: '雲の上に浮かぶ神秘の城',
            stageRange: [351, 500],
            unlockStage: 351,
            icon: '🏰',
            color: '#8b5cf6',
            bgGradient: 'linear-gradient(180deg, #4c1d95 0%, #8b5cf6 50%, #a78bfa 100%)',
            monsters: ['デーモン', 'ワイバーン', 'ゴーレム'],
            boss: 'エンシェントドラゴン'
        }
    ],

    // ストーリーチャプター
    STORY_CHAPTERS: [
        {
            id: 'chapter1',
            title: '第1章：冒険の始まり',
            unlockStage: 1,
            scenes: [
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: 'ようこそ、勇者様！私はあなたの冒険をサポートする妖精です。'
                },
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: 'この世界は魔王によって支配されています。あなたの力で世界を救ってください！'
                },
                {
                    character: 'hero',
                    name: '勇者',
                    emoji: '⚔️',
                    text: '分かった。まずは目の前のモンスターを倒していこう！'
                }
            ],
            reward: { type: 'gold', amount: 100, label: '100ゴールド' }
        },
        {
            id: 'chapter2',
            title: '第2章：最初の試練',
            unlockStage: 10,
            scenes: [
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: 'すごい！もうステージ10まで来ましたね。'
                },
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: 'この先にはボスモンスターが待ち構えています。気をつけて！'
                },
                {
                    character: 'boss',
                    name: 'キングスライム',
                    emoji: '👑',
                    text: 'ブヨブヨ...俺様を倒せると思っているのか？'
                },
                {
                    character: 'hero',
                    name: '勇者',
                    emoji: '⚔️',
                    text: '来い！最初のボスを倒してやる！'
                }
            ],
            reward: { type: 'gems', amount: 5, label: '5ジェム' }
        },
        {
            id: 'chapter3',
            title: '第3章：暗黒の森へ',
            unlockStage: 51,
            scenes: [
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: '草原を抜けて、暗黒の森に到着しました。'
                },
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: 'ここはとても危険な場所です。モンスターも強くなっています。'
                },
                {
                    character: 'mysterious',
                    name: '謎の声',
                    emoji: '👻',
                    text: '...戻れ...この森に近づくな...'
                },
                {
                    character: 'hero',
                    name: '勇者',
                    emoji: '⚔️',
                    text: '誰だ！？姿を見せろ！'
                }
            ],
            reward: { type: 'gold', amount: 500, label: '500ゴールド' }
        },
        {
            id: 'chapter4',
            title: '第4章：転生の秘密',
            unlockStage: 100,
            scenes: [
                {
                    character: 'sage',
                    name: '賢者',
                    emoji: '🧙‍♂️',
                    text: 'よくここまで来たな、勇者よ。'
                },
                {
                    character: 'sage',
                    name: '賢者',
                    emoji: '🧙‍♂️',
                    text: 'お前に転生の力を授けよう。何度でも生まれ変わり、さらに強くなれる。'
                },
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: '転生すると、ソウルを獲得できます！これで遺物を強化できますよ！'
                },
                {
                    character: 'hero',
                    name: '勇者',
                    emoji: '⚔️',
                    text: 'なるほど...これが真の力を得る方法か。'
                }
            ],
            reward: { type: 'gems', amount: 10, label: '10ジェム' }
        },
        {
            id: 'chapter5',
            title: '第5章：古代遺跡の謎',
            unlockStage: 101,
            scenes: [
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: 'ここは古代文明の遺跡です。かつて栄えた王国の跡地と言われています。'
                },
                {
                    character: 'ghost',
                    name: '古代の亡霊',
                    emoji: '👻',
                    text: 'この地を荒らす者は許さん...'
                },
                {
                    character: 'hero',
                    name: '勇者',
                    emoji: '⚔️',
                    text: '荒らしに来たわけじゃない。魔王を倒すための力を求めているんだ。'
                },
                {
                    character: 'ghost',
                    name: '古代の亡霊',
                    emoji: '👻',
                    text: '...ならば試練を乗り越えてみせよ。'
                }
            ],
            reward: { type: 'gold', amount: 1000, label: '1000ゴールド' }
        },
        {
            id: 'chapter6',
            title: '第6章：灼熱の試練',
            unlockStage: 201,
            scenes: [
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: 'うわぁ...とても暑いです！ここは火山地帯ですね。'
                },
                {
                    character: 'dragon',
                    name: 'ワイバーン',
                    emoji: '🐉',
                    text: 'グオオオ！この地に踏み入る愚か者め！'
                },
                {
                    character: 'hero',
                    name: '勇者',
                    emoji: '⚔️',
                    text: 'ここまで来たんだ。引き返すわけにはいかない！'
                }
            ],
            reward: { type: 'gems', amount: 20, label: '20ジェム' }
        },
        {
            id: 'chapter7',
            title: '第7章：天空への道',
            unlockStage: 351,
            scenes: [
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: 'ついに天空城が見えてきました！魔王はあの城にいるはずです！'
                },
                {
                    character: 'sage',
                    name: '賢者',
                    emoji: '🧙‍♂️',
                    text: 'ここまで来たか、勇者よ。お前なら魔王を倒せるかもしれん。'
                },
                {
                    character: 'hero',
                    name: '勇者',
                    emoji: '⚔️',
                    text: '必ず魔王を倒して、世界に平和を取り戻す！'
                }
            ],
            reward: { type: 'gold', amount: 5000, label: '5000ゴールド' }
        },
        {
            id: 'chapter8',
            title: '最終章：魔王との決戦',
            unlockStage: 500,
            scenes: [
                {
                    character: 'demon',
                    name: '魔王',
                    emoji: '👿',
                    text: 'ふはははは！よくここまで来たな、勇者よ！'
                },
                {
                    character: 'demon',
                    name: '魔王',
                    emoji: '👿',
                    text: 'だが、お前の旅もここで終わりだ！'
                },
                {
                    character: 'hero',
                    name: '勇者',
                    emoji: '⚔️',
                    text: '魔王！今こそ決着をつける時だ！'
                },
                {
                    character: 'guide',
                    name: 'ガイド妖精',
                    emoji: '🧚',
                    text: '勇者様、私はずっと信じていました。頑張ってください！'
                }
            ],
            reward: { type: 'gems', amount: 50, label: '50ジェム' }
        }
    ],

    // デイリーログインボーナス
    DAILY_REWARDS: [
        { day: 1, type: 'gold', amount: 100, emoji: '💰', label: '100G' },
        { day: 2, type: 'gold', amount: 300, emoji: '💰', label: '300G' },
        { day: 3, type: 'gems', amount: 5, emoji: '💎', label: '5ジェム' },
        { day: 4, type: 'gold', amount: 500, emoji: '💰', label: '500G' },
        { day: 5, type: 'gold', amount: 1000, emoji: '💰', label: '1000G' },
        { day: 6, type: 'gems', amount: 10, emoji: '💎', label: '10ジェム' },
        { day: 7, type: 'equipment', rarity: 'RARE', emoji: '🎁', label: 'レア装備' }
    ],

    // スキルツリー（パッシブスキル）
    SKILL_TREE: {
        // スキルポイント: 転生1回につき1ポイント
        CATEGORIES: [
            {
                id: 'attack',
                name: '攻撃',
                emoji: '⚔️',
                color: '#e74c3c'
            },
            {
                id: 'defense',
                name: '防御',
                emoji: '🛡️',
                color: '#3498db'
            },
            {
                id: 'wealth',
                name: '財宝',
                emoji: '💰',
                color: '#f1c40f'
            }
        ],
        SKILLS: [
            // 攻撃系
            {
                id: 'sharpBlade',
                category: 'attack',
                name: '鋭利な刃',
                emoji: '🗡️',
                description: 'タップダメージ +{value}%',
                maxLevel: 10,
                costPerLevel: 1,
                effect: { type: 'tapDamagePercent', valuePerLevel: 5 }
            },
            {
                id: 'criticalEye',
                category: 'attack',
                name: '心眼',
                emoji: '👁️',
                description: 'クリティカル率 +{value}%',
                maxLevel: 10,
                costPerLevel: 1,
                effect: { type: 'critChance', valuePerLevel: 2 },
                requires: 'sharpBlade',
                requiresLevel: 3
            },
            {
                id: 'deadlyBlow',
                category: 'attack',
                name: '必殺の一撃',
                emoji: '💀',
                description: 'クリティカルダメージ +{value}%',
                maxLevel: 10,
                costPerLevel: 2,
                effect: { type: 'critDamage', valuePerLevel: 15 },
                requires: 'criticalEye',
                requiresLevel: 5
            },
            {
                id: 'berserk',
                category: 'attack',
                name: 'バーサーク',
                emoji: '😤',
                description: '全攻撃力 +{value}%',
                maxLevel: 5,
                costPerLevel: 3,
                effect: { type: 'allDamagePercent', valuePerLevel: 10 },
                requires: 'deadlyBlow',
                requiresLevel: 5
            },
            // 防御系
            {
                id: 'toughness',
                category: 'defense',
                name: '頑強',
                emoji: '💪',
                description: 'ボス戦時間 +{value}秒',
                maxLevel: 10,
                costPerLevel: 1,
                effect: { type: 'bossTime', valuePerLevel: 1 }
            },
            {
                id: 'secondWind',
                category: 'defense',
                name: '起死回生',
                emoji: '🌬️',
                description: 'ボス失敗時ステージ維持率 +{value}%',
                maxLevel: 5,
                costPerLevel: 2,
                effect: { type: 'bossFailProtect', valuePerLevel: 20 },
                requires: 'toughness',
                requiresLevel: 3
            },
            {
                id: 'autoProgress',
                category: 'defense',
                name: '自動進行',
                emoji: '🏃',
                description: 'オート戦闘効率 +{value}%',
                maxLevel: 10,
                costPerLevel: 1,
                effect: { type: 'dpsPercent', valuePerLevel: 5 },
                requires: 'toughness',
                requiresLevel: 5
            },
            {
                id: 'immortal',
                category: 'defense',
                name: '不死身',
                emoji: '💫',
                description: 'ボス戦開始時追加時間 +{value}秒',
                maxLevel: 5,
                costPerLevel: 3,
                effect: { type: 'bossTimeFlat', valuePerLevel: 3 },
                requires: 'secondWind',
                requiresLevel: 3
            },
            // 財宝系
            {
                id: 'greed',
                category: 'wealth',
                name: '強欲',
                emoji: '🤑',
                description: 'ゴールド獲得 +{value}%',
                maxLevel: 10,
                costPerLevel: 1,
                effect: { type: 'goldPercent', valuePerLevel: 5 }
            },
            {
                id: 'treasureHunter',
                category: 'wealth',
                name: 'トレジャーハンター',
                emoji: '🔍',
                description: '装備ドロップ率 +{value}%',
                maxLevel: 10,
                costPerLevel: 1,
                effect: { type: 'dropRate', valuePerLevel: 3 },
                requires: 'greed',
                requiresLevel: 3
            },
            {
                id: 'luckyFind',
                category: 'wealth',
                name: '幸運の発見',
                emoji: '🍀',
                description: 'レア装備出現率 +{value}%',
                maxLevel: 5,
                costPerLevel: 2,
                effect: { type: 'rareDropRate', valuePerLevel: 5 },
                requires: 'treasureHunter',
                requiresLevel: 5
            },
            {
                id: 'soulMaster',
                category: 'wealth',
                name: 'ソウルマスター',
                emoji: '👻',
                description: '転生時ソウル +{value}%',
                maxLevel: 5,
                costPerLevel: 3,
                effect: { type: 'soulBonus', valuePerLevel: 10 },
                requires: 'luckyFind',
                requiresLevel: 3
            }
        ]
    },

    // 実績システム
    ACHIEVEMENTS: [
        // タップ系
        {
            id: 'tapper1',
            name: 'タップ初心者',
            description: '100回タップする',
            emoji: '👆',
            requirement: { type: 'totalTaps', value: 100 },
            reward: { type: 'gems', amount: 1 }
        },
        {
            id: 'tapper2',
            name: 'タップ見習い',
            description: '1,000回タップする',
            emoji: '👆',
            requirement: { type: 'totalTaps', value: 1000 },
            reward: { type: 'gems', amount: 5 }
        },
        {
            id: 'tapper3',
            name: 'タップマスター',
            description: '10,000回タップする',
            emoji: '🏆',
            requirement: { type: 'totalTaps', value: 10000 },
            reward: { type: 'gems', amount: 10 }
        },
        {
            id: 'tapper4',
            name: 'タップレジェンド',
            description: '100,000回タップする',
            emoji: '👑',
            requirement: { type: 'totalTaps', value: 100000 },
            reward: { type: 'gems', amount: 50 }
        },
        // モンスター討伐系
        {
            id: 'hunter1',
            name: 'モンスターハンター',
            description: '100体のモンスターを倒す',
            emoji: '🐾',
            requirement: { type: 'totalMonstersKilled', value: 100 },
            reward: { type: 'gold', amount: 500 }
        },
        {
            id: 'hunter2',
            name: '熟練ハンター',
            description: '1,000体のモンスターを倒す',
            emoji: '🗡️',
            requirement: { type: 'totalMonstersKilled', value: 1000 },
            reward: { type: 'gems', amount: 5 }
        },
        {
            id: 'hunter3',
            name: '伝説のハンター',
            description: '10,000体のモンスターを倒す',
            emoji: '⚔️',
            requirement: { type: 'totalMonstersKilled', value: 10000 },
            reward: { type: 'gems', amount: 20 }
        },
        // ステージ系
        {
            id: 'stage1',
            name: '冒険者',
            description: 'ステージ10に到達',
            emoji: '🚶',
            requirement: { type: 'maxStageReached', value: 10 },
            reward: { type: 'gold', amount: 100 }
        },
        {
            id: 'stage2',
            name: '探検家',
            description: 'ステージ50に到達',
            emoji: '🧭',
            requirement: { type: 'maxStageReached', value: 50 },
            reward: { type: 'gems', amount: 5 }
        },
        {
            id: 'stage3',
            name: '勇者',
            description: 'ステージ100に到達',
            emoji: '⚔️',
            requirement: { type: 'maxStageReached', value: 100 },
            reward: { type: 'gems', amount: 10 }
        },
        {
            id: 'stage4',
            name: '英雄',
            description: 'ステージ200に到達',
            emoji: '🦸',
            requirement: { type: 'maxStageReached', value: 200 },
            reward: { type: 'gems', amount: 20 }
        },
        {
            id: 'stage5',
            name: '伝説',
            description: 'ステージ500に到達',
            emoji: '👑',
            requirement: { type: 'maxStageReached', value: 500 },
            reward: { type: 'gems', amount: 50 }
        },
        // 転生系
        {
            id: 'rebirth1',
            name: '転生者',
            description: '初めての転生',
            emoji: '🔄',
            requirement: { type: 'rebirthCount', value: 1 },
            reward: { type: 'gems', amount: 10 }
        },
        {
            id: 'rebirth2',
            name: '輪廻',
            description: '5回転生する',
            emoji: '♻️',
            requirement: { type: 'rebirthCount', value: 5 },
            reward: { type: 'gems', amount: 25 }
        },
        {
            id: 'rebirth3',
            name: '永劫回帰',
            description: '10回転生する',
            emoji: '🌀',
            requirement: { type: 'rebirthCount', value: 10 },
            reward: { type: 'gems', amount: 50 }
        },
        // ゴールド系
        {
            id: 'gold1',
            name: '小金持ち',
            description: '10,000ゴールド累計獲得',
            emoji: '💰',
            requirement: { type: 'totalGoldEarned', value: 10000 },
            reward: { type: 'gold', amount: 1000 }
        },
        {
            id: 'gold2',
            name: '富豪',
            description: '100,000ゴールド累計獲得',
            emoji: '💎',
            requirement: { type: 'totalGoldEarned', value: 100000 },
            reward: { type: 'gems', amount: 10 }
        },
        {
            id: 'gold3',
            name: '大富豪',
            description: '1,000,000ゴールド累計獲得',
            emoji: '👑',
            requirement: { type: 'totalGoldEarned', value: 1000000 },
            reward: { type: 'gems', amount: 30 }
        },
        // 図鑑系
        {
            id: 'collector1',
            name: 'コレクター',
            description: '5種類のモンスターを発見',
            emoji: '📚',
            requirement: { type: 'discoveredMonsters', value: 5 },
            reward: { type: 'gems', amount: 3 }
        },
        {
            id: 'collector2',
            name: 'モンスター博士',
            description: '全てのモンスターを発見',
            emoji: '🎓',
            requirement: { type: 'discoveredMonsters', value: 15 },
            reward: { type: 'gems', amount: 20 }
        },
        // 装備系
        {
            id: 'equip1',
            name: '装備コレクター',
            description: 'レア装備を入手',
            emoji: '🔵',
            requirement: { type: 'hasRarity', value: 'RARE' },
            reward: { type: 'gold', amount: 500 }
        },
        {
            id: 'equip2',
            name: 'エピックハンター',
            description: 'エピック装備を入手',
            emoji: '🟣',
            requirement: { type: 'hasRarity', value: 'EPIC' },
            reward: { type: 'gems', amount: 10 }
        },
        {
            id: 'equip3',
            name: 'レジェンドハンター',
            description: 'レジェンダリー装備を入手',
            emoji: '🟡',
            requirement: { type: 'hasRarity', value: 'LEGENDARY' },
            reward: { type: 'gems', amount: 25 }
        }
    ]
};

// グローバルにエクスポート
window.GameData = GameData;
