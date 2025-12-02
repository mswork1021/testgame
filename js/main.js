/* ========================================
   Tap Quest - メインエントリーポイント
   ======================================== */

(function() {
    'use strict';

    // グローバル変数
    let game;
    let ui;
    let saveManager;

    // ========================================
    // 初期化
    // ========================================
    function init() {
        console.log('Tap Quest 起動中...');

        // ゲームインスタンス作成
        game = new Game();
        ui = new UI(game);
        saveManager = new SaveManager(game);

        // ゲーム初期化
        game.init();

        // セーブデータロード
        const saveData = saveManager.load();

        // UI初期化
        ui.init();

        // オフライン報酬チェック
        if (saveData) {
            const offline = saveManager.calculateOfflineTime();
            if (offline.gold > 0) {
                ui.showOfflineReward(offline.gold);
            }
        }

        // セーブマネージャー初期化
        saveManager.init();

        // デイリーボーナスチェック（少し遅延して表示）
        setTimeout(() => {
            if (game.canClaimDailyBonus()) {
                ui.showDailyBonus();
            }
        }, 500);

        // モンスター再生成（ロード後）
        if (saveData) {
            game.spawnMonster();
            ui.updateDisplay();
        }

        // 最終オンライン時間更新
        game.state.lastOnlineTime = Date.now();

        console.log('Tap Quest 起動完了！');

        // デバッグ用にグローバルに公開
        window.TapQuest = {
            game,
            ui,
            saveManager,
            // デバッグコマンド
            debug: {
                addGold: (amount) => {
                    game.state.gold += amount;
                    ui.updateDisplay();
                },
                addSouls: (amount) => {
                    game.state.souls += amount;
                    ui.updateDisplay();
                },
                setStage: (stage) => {
                    game.state.currentStage = stage;
                    game.state.monstersKilled = 0;
                    game.spawnMonster();
                    ui.updateDisplay();
                },
                dropEquipment: (rarity = 'LEGENDARY') => {
                    const types = ['WEAPONS', 'ARMORS', 'ACCESSORIES'];
                    const typeKey = types[Math.floor(Math.random() * types.length)];
                    const templates = GameData.EQUIPMENT[typeKey];
                    const template = templates[Math.floor(Math.random() * templates.length)];
                    const equipment = game.generateEquipment(template, rarity);
                    game.state.inventory.push(equipment);
                    ui.renderInventory();
                    console.log('ドロップ:', equipment);
                },
                resetSave: () => {
                    if (confirm('本当にセーブデータを削除しますか？')) {
                        saveManager.deleteSave();
                        location.reload();
                    }
                },
                exportSave: () => {
                    const data = saveManager.exportSave();
                    console.log('セーブデータ:', data);
                    return data;
                }
            }
        };
    }

    // ========================================
    // Service Worker登録（PWA）
    // ========================================
    function registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    }

    // ========================================
    // イベントリスナー
    // ========================================

    // DOMContentLoaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 画面のスリープ防止（可能であれば）
    async function requestWakeLock() {
        if ('wakeLock' in navigator) {
            try {
                await navigator.wakeLock.request('screen');
                console.log('Wake Lock activated');
            } catch (e) {
                console.log('Wake Lock failed:', e);
            }
        }
    }

    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            requestWakeLock();
        }
    });

    // タッチイベントの最適化
    document.addEventListener('touchstart', function() {}, { passive: true });
    document.addEventListener('touchmove', function() {}, { passive: true });

    // ダブルタップズーム防止
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, false);

    // コンテキストメニュー無効化
    document.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });

})();
