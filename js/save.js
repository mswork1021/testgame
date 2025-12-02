/* ========================================
   Tap Quest - セーブ/ロード管理
   ======================================== */

class SaveManager {
    constructor(game) {
        this.game = game;
        this.SAVE_KEY = 'tapquest_save';
        this.AUTO_SAVE_INTERVAL = 30000; // 30秒
        this.autoSaveId = null;
    }

    // ========================================
    // 初期化
    // ========================================
    init() {
        // 自動セーブ開始
        this.startAutoSave();

        // ページ離脱時にセーブ
        window.addEventListener('beforeunload', () => {
            this.save();
        });

        // ページ非表示時にセーブ
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.save();
            }
        });
    }

    // ========================================
    // セーブ
    // ========================================
    save() {
        try {
            const saveData = {
                version: 1,
                timestamp: Date.now(),
                state: this.game.state
            };

            localStorage.setItem(this.SAVE_KEY, JSON.stringify(saveData));
            console.log('ゲームをセーブしました');
            return true;
        } catch (e) {
            console.error('セーブに失敗しました:', e);
            return false;
        }
    }

    // ========================================
    // ロード
    // ========================================
    load() {
        try {
            const saveJson = localStorage.getItem(this.SAVE_KEY);
            if (!saveJson) {
                console.log('セーブデータがありません');
                return null;
            }

            const saveData = JSON.parse(saveJson);

            // バージョンチェック（将来の移行用）
            if (saveData.version !== 1) {
                console.log('古いセーブデータを移行中...');
                // 移行ロジックをここに追加
            }

            // ゲーム状態を復元
            this.game.state = this.mergeState(this.game.state, saveData.state);
            this.game.state.lastOnlineTime = saveData.timestamp;

            console.log('ゲームをロードしました');
            return saveData;
        } catch (e) {
            console.error('ロードに失敗しました:', e);
            return null;
        }
    }

    // デフォルト値とマージ（新しいフィールドが追加された場合用）
    mergeState(defaultState, savedState) {
        const merged = { ...defaultState };

        for (const key in savedState) {
            if (typeof savedState[key] === 'object' && savedState[key] !== null && !Array.isArray(savedState[key])) {
                merged[key] = this.mergeState(defaultState[key] || {}, savedState[key]);
            } else {
                merged[key] = savedState[key];
            }
        }

        return merged;
    }

    // ========================================
    // オフライン報酬計算
    // ========================================
    calculateOfflineTime() {
        const now = Date.now();
        const lastOnline = this.game.state.lastOnlineTime || now;
        const offlineSeconds = (now - lastOnline) / 1000;

        // 最小1分以上オフラインの場合のみ報酬
        if (offlineSeconds < 60) {
            return { seconds: 0, gold: 0 };
        }

        const gold = this.game.calculateOfflineReward(offlineSeconds);

        return {
            seconds: offlineSeconds,
            gold: gold
        };
    }

    // ========================================
    // 自動セーブ
    // ========================================
    startAutoSave() {
        this.autoSaveId = setInterval(() => {
            this.save();
        }, this.AUTO_SAVE_INTERVAL);
    }

    stopAutoSave() {
        if (this.autoSaveId) {
            clearInterval(this.autoSaveId);
        }
    }

    // ========================================
    // データ管理
    // ========================================
    deleteSave() {
        try {
            localStorage.removeItem(this.SAVE_KEY);
            console.log('セーブデータを削除しました');
            return true;
        } catch (e) {
            console.error('削除に失敗しました:', e);
            return false;
        }
    }

    exportSave() {
        try {
            const saveJson = localStorage.getItem(this.SAVE_KEY);
            if (!saveJson) return null;

            // Base64エンコード
            const encoded = btoa(encodeURIComponent(saveJson));
            return encoded;
        } catch (e) {
            console.error('エクスポートに失敗しました:', e);
            return null;
        }
    }

    importSave(encoded) {
        try {
            const saveJson = decodeURIComponent(atob(encoded));
            const saveData = JSON.parse(saveJson);

            // 基本的な検証
            if (!saveData.version || !saveData.state) {
                throw new Error('Invalid save data');
            }

            localStorage.setItem(this.SAVE_KEY, saveJson);
            return true;
        } catch (e) {
            console.error('インポートに失敗しました:', e);
            return false;
        }
    }
}

// グローバルにエクスポート
window.SaveManager = SaveManager;
