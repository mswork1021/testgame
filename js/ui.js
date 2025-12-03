/* ========================================
   Tap Quest - UI管理
   ======================================== */

class UI {
    constructor(game) {
        this.game = game;
        this.elements = {};
        this.currentTab = 'heroes';
        this.selectedItem = null;
    }

    // ========================================
    // 初期化
    // ========================================
    init() {
        this.cacheElements();
        this.bindEvents();
        this.setupGameCallbacks();
        this.renderAll();
    }

    cacheElements() {
        // ヘッダー
        this.elements.goldDisplay = document.getElementById('gold-display');
        this.elements.soulsDisplay = document.getElementById('souls-display');
        this.elements.gemsDisplay = document.getElementById('gems-display');
        this.elements.stageDisplay = document.getElementById('stage-display');
        this.elements.stageProgress = document.getElementById('stage-progress');

        // バトルエリア
        this.elements.bossTimer = document.getElementById('boss-timer');
        this.elements.bossTimeLeft = document.getElementById('boss-time-left');
        this.elements.battleArea = document.getElementById('battle-area');
        this.elements.monster = document.getElementById('monster');
        this.elements.monsterEmoji = document.getElementById('monster-emoji');
        this.elements.monsterName = document.getElementById('monster-name');
        this.elements.monsterHpFill = document.getElementById('monster-hp-fill');
        this.elements.monsterHpText = document.getElementById('monster-hp-text');
        this.elements.damageNumbers = document.getElementById('damage-numbers');
        this.elements.lootPopup = document.getElementById('loot-popup');

        // パネルトグル
        this.elements.panelToggle = document.getElementById('panel-toggle');
        this.elements.gameContainer = document.getElementById('game-container');

        // パネル
        this.elements.heroesList = document.getElementById('heroes-list');
        this.elements.totalDps = document.getElementById('total-dps');
        this.elements.inventoryList = document.getElementById('inventory-list');
        this.elements.inventoryCount = document.getElementById('inventory-count');
        this.elements.sortInventoryBtn = document.getElementById('sort-inventory-btn');
        this.elements.sellCommonBtn = document.getElementById('sell-common-btn');
        this.elements.skillsList = document.getElementById('skills-list');
        this.elements.artifactsList = document.getElementById('artifacts-list');
        this.elements.artifactSouls = document.getElementById('artifact-souls');

        // 転生パネル
        this.elements.currentStageRebirth = document.getElementById('current-stage-rebirth');
        this.elements.rebirthCount = document.getElementById('rebirth-count');
        this.elements.pendingSouls = document.getElementById('pending-souls');
        this.elements.pendingSP = document.getElementById('pending-sp');
        this.elements.rebirthBtn = document.getElementById('rebirth-btn');

        // セーブ・リセット・更新ボタン
        this.elements.saveBtn = document.getElementById('save-btn');
        this.elements.resetBtn = document.getElementById('reset-btn');
        this.elements.refreshBtn = document.getElementById('refresh-btn');

        // 装備スロット
        this.elements.weaponSlot = document.getElementById('weapon-slot');
        this.elements.armorSlot = document.getElementById('armor-slot');
        this.elements.accessorySlot = document.getElementById('accessory-slot');

        // モーダル
        this.elements.offlineModal = document.getElementById('offline-modal');
        this.elements.offlineGold = document.getElementById('offline-gold');
        this.elements.claimOffline = document.getElementById('claim-offline');
        this.elements.claimOfflineDouble = document.getElementById('claim-offline-double');

        this.elements.equipmentModal = document.getElementById('equipment-modal');
        this.elements.equipModalTitle = document.getElementById('equip-modal-title');
        this.elements.equipModalStats = document.getElementById('equip-modal-stats');
        this.elements.equipBtn = document.getElementById('equip-btn');
        this.elements.closeEquipModal = document.getElementById('close-equip-modal');

        // デイリーボーナス
        this.elements.dailyModal = document.getElementById('daily-modal');
        this.elements.loginStreak = document.getElementById('login-streak');
        this.elements.dailyRewardsGrid = document.getElementById('daily-rewards-grid');
        this.elements.claimDaily = document.getElementById('claim-daily');

        // ストーリーモード
        this.elements.storyModal = document.getElementById('story-modal');
        this.elements.storyChapterTitle = document.getElementById('story-chapter-title');
        this.elements.storyCharacterEmoji = document.getElementById('story-character-emoji');
        this.elements.storyCharacterName = document.getElementById('story-character-name');
        this.elements.storyText = document.getElementById('story-text');
        this.elements.storyNextBtn = document.getElementById('story-next-btn');
        this.elements.storyProgress = document.getElementById('story-progress');
        this.elements.storyTotal = document.getElementById('story-total');
        this.elements.storyChapterListPanel = document.getElementById('story-chapter-list-panel');

        // ストーリーモード状態
        this.currentChapter = null;
        this.currentSceneIndex = 0;

        // スキルツリー
        this.elements.skillPoints = document.getElementById('skill-points');
        this.elements.skillTreeContainer = document.getElementById('skill-tree-container');

        // 図鑑
        this.elements.collectionProgress = document.getElementById('collection-progress');
        this.elements.collectionTotal = document.getElementById('collection-total');
        this.elements.collectionContent = document.getElementById('collection-content');
        this.currentCollectionTab = 'monsters';

        // 実績
        this.elements.unlockedAchievements = document.getElementById('unlocked-achievements');
        this.elements.totalAchievements = document.getElementById('total-achievements');
        this.elements.achievementsList = document.getElementById('achievements-list');
    }

    bindEvents() {
        // タップイベント（高速連打対応）
        // touchstartを使用してスマホでの遅延を解消
        this.elements.battleArea.addEventListener('touchstart', (e) => {
            e.preventDefault();
            // マルチタッチ対応：全てのタッチポイントを処理
            for (let i = 0; i < e.touches.length; i++) {
                this.onTap(e.touches[i]);
            }
        }, { passive: false });

        // PC用クリックイベント
        this.elements.battleArea.addEventListener('click', (e) => {
            // タッチデバイスでなければクリックで処理
            if (!('ontouchstart' in window)) {
                this.onTap(e);
            }
        });

        // タブ切り替え（タッチとクリック両方対応）
        document.querySelectorAll('.nav-btn').forEach(btn => {
            // タッチイベント（モバイル向け）
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.switchTab(btn.dataset.tab);
            });
            // クリックイベント（PC向け）
            btn.addEventListener('click', (e) => {
                if (!e.defaultPrevented) {
                    this.switchTab(btn.dataset.tab);
                }
            });
        });

        // 転生ボタン（タッチとクリック両方対応）
        const handleRebirth = () => this.onRebirth();
        this.elements.rebirthBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleRebirth();
        });
        this.elements.rebirthBtn.addEventListener('click', (e) => {
            if (!e.defaultPrevented) handleRebirth();
        });

        // 装備スロットクリック（タッチとクリック両方対応）
        ['weapon', 'armor', 'accessory'].forEach(slot => {
            const element = this.elements[`${slot}Slot`];
            const handleSlot = () => this.onEquipSlotClick(slot);
            element.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleSlot();
            });
            element.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handleSlot();
            });
        });

        // モーダルボタン（タッチとクリック両方対応）
        const addTouchAndClick = (el, handler) => {
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                handler();
            });
            el.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handler();
            });
        };

        addTouchAndClick(this.elements.claimOffline, () => this.claimOfflineReward(1));
        addTouchAndClick(this.elements.claimOfflineDouble, () => this.claimOfflineReward(2));
        addTouchAndClick(this.elements.equipBtn, () => this.onEquipItem());
        addTouchAndClick(this.elements.closeEquipModal, () => this.closeEquipmentModal());
        addTouchAndClick(this.elements.claimDaily, () => this.claimDailyBonus());

        // ストーリーモード
        if (this.elements.storyNextBtn) {
            addTouchAndClick(this.elements.storyNextBtn, () => this.advanceStory());
        }

        // セーブ・リセット・更新ボタン
        if (this.elements.saveBtn) {
            addTouchAndClick(this.elements.saveBtn, () => this.onManualSave());
        }
        if (this.elements.resetBtn) {
            addTouchAndClick(this.elements.resetBtn, () => this.onDataReset());
        }
        if (this.elements.refreshBtn) {
            addTouchAndClick(this.elements.refreshBtn, () => this.onRefresh());
        }

        // インベントリ管理ボタン
        if (this.elements.sortInventoryBtn) {
            addTouchAndClick(this.elements.sortInventoryBtn, () => this.sortInventory());
        }
        if (this.elements.sellCommonBtn) {
            addTouchAndClick(this.elements.sellCommonBtn, () => this.sellCommonItems());
        }

        // パネルトグル
        if (this.elements.panelToggle) {
            addTouchAndClick(this.elements.panelToggle, () => this.togglePanelExpand());
        }

        // 保存済みの拡張状態を復元
        this.restorePanelState();

        // 図鑑タブ
        document.querySelectorAll('.collection-tab').forEach(tab => {
            addTouchAndClick(tab, () => {
                document.querySelectorAll('.collection-tab').forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                this.currentCollectionTab = tab.dataset.collection;
                this.renderCollection();
            });
        });
    }

    setupGameCallbacks() {
        // 更新コールバック
        this.game.onUpdate = () => {
            this.updateDisplay();
        };

        // ダメージ表示
        this.game.onDamageDealt = (amount, isCritical) => {
            this.showDamageNumber(amount, isCritical);
        };

        // モンスター撃破
        this.game.onMonsterKill = (monster, gold) => {
            this.onMonsterKill(monster, gold);
        };

        // ボス戦失敗
        this.game.onBossFailed = () => {
            this.showToast('ボス戦に失敗...1ステージ戻ります');
        };

        // ボス出現
        this.game.onBossSpawn = () => {
            this.showBossWarning();
        };

        // ドロップ
        this.game.onLoot = (item) => {
            this.showLootPopup(item);
        };

        // 宝箱自動収集
        this.game.onTreasureChestCollect = (count) => {
            this.showTreasureChestNotification(count);
            this.updateTreasureChestIndicator();
        };

        // 宝箱一括開封
        this.game.onTreasureChestBatchOpen = (results) => {
            this.showBatchOpenResults(results);
            this.updateTreasureChestIndicator();
        };

        // ラッキータイム開始
        this.game.onLuckyTimeStart = (duration) => {
            this.showLuckyTimeStart(duration);
            this.showRainbowBorder();
        };

        // ラッキータイム終了
        this.game.onLuckyTimeEnd = () => {
            this.showToast('ラッキータイム終了！');
            this.hideLuckyTimeIndicator();
            this.hideRainbowBorder();
        };

        // ラッキータイムストック更新
        this.game.onLuckyTimeStockUpdate = (stock) => {
            this.updateLuckyTimeStockIndicator();
        };
    }

    // ========================================
    // タップ処理
    // ========================================
    onTap(e) {
        try {
            // サウンドマネージャー初期化（最初のタップ時）
            if (window.soundManager && !window.soundManager.isInitialized) {
                window.soundManager.init();
                this.initSoundSettings();
            }

            this.game.tap();

            // コンボカウント更新
            this.comboCount = (this.comboCount || 0) + 1;
            this.updateComboDisplay();

            // コンボリセットタイマー
            clearTimeout(this.comboTimer);
            this.comboTimer = setTimeout(() => {
                this.comboCount = 0;
                this.updateComboDisplay();
            }, 1000);

            // モンスターヒットアニメーション（アニメーション時間に合わせる）
            if (this.elements.monster) {
                this.elements.monster.classList.add('hit');
                setTimeout(() => {
                    this.elements.monster.classList.remove('hit');
                }, 150);
            }

            // タップ位置にエフェクト表示
            this.showTapEffect(e);

            // 画面シェイク＆フラッシュ（クリティカル時）
            if (this.lastWasCritical) {
                this.shakeScreen();
                this.showCriticalFlash();
                // クリティカル音
                if (window.soundManager) window.soundManager.playCritical();
            } else {
                // 通常タップ音
                if (window.soundManager) window.soundManager.playTap();
            }

            // コンボ音
            if (window.soundManager && this.comboCount >= 5) {
                window.soundManager.playCombo(this.comboCount);
            }
        } catch(err) {
            console.error('onTap error:', err);
        }
    }

    showTapEffect(e) {
        const effect = document.createElement('div');
        effect.className = 'tap-effect';

        // タップ位置を取得
        const rect = this.elements.battleArea.getBoundingClientRect();
        const x = (e.clientX || e.pageX) - rect.left;
        const y = (e.clientY || e.pageY) - rect.top;

        effect.style.left = x + 'px';
        effect.style.top = y + 'px';

        this.elements.battleArea.appendChild(effect);
        setTimeout(() => effect.remove(), 400);
    }

    updateComboDisplay() {
        let comboEl = document.getElementById('combo-display');

        if (this.comboCount > 1) {
            if (!comboEl) {
                comboEl = document.createElement('div');
                comboEl.id = 'combo-display';
                this.elements.battleArea.appendChild(comboEl);
            }
            comboEl.textContent = `${this.comboCount} COMBO!`;
            comboEl.className = 'combo-display';
            if (this.comboCount >= 10) comboEl.classList.add('hot');
            if (this.comboCount >= 30) comboEl.classList.add('fire');
        } else if (comboEl) {
            comboEl.remove();
        }
    }

    shakeScreen() {
        this.elements.battleArea.classList.add('shake');
        setTimeout(() => {
            this.elements.battleArea.classList.remove('shake');
        }, 100);
    }

    // クリティカルフラッシュ
    showCriticalFlash() {
        const flash = document.createElement('div');
        flash.className = 'critical-flash';
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 300);
    }

    // ボス出現警告
    showBossWarning() {
        const warning = document.createElement('div');
        warning.className = 'boss-warning';
        warning.innerHTML = '<div class="boss-warning-text">WARNING</div>';
        document.body.appendChild(warning);
        setTimeout(() => warning.remove(), 500);
    }

    // ボス撃破エフェクト
    showBossDefeatEffect() {
        const effect = document.createElement('div');
        effect.className = 'boss-defeat-effect';
        effect.innerHTML = '<div class="boss-defeat-text">VICTORY!</div>';
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 800);
    }

    // レジェンダリードロップエフェクト
    showLegendaryDropEffect() {
        const effect = document.createElement('div');
        effect.className = 'legendary-drop-effect';
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 1000);
    }

    // 宝箱獲得通知（小さいコーナー表示）
    showTreasureChestNotification(count) {
        // 既存の通知を削除
        const existing = document.querySelector('.chest-collect-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'chest-collect-notification';
        notification.innerHTML = `
            <div class="chest-mini-icon">📦</div>
            <div class="chest-collect-text">宝箱+1</div>
        `;

        // バトルエリアの右下に配置
        this.elements.battleArea.appendChild(notification);

        setTimeout(() => notification.remove(), 1500);
    }

    // 宝箱ストックインジケーター更新
    updateTreasureChestIndicator() {
        let indicator = document.getElementById('chest-stock-indicator');
        const count = this.game.state.treasureChestCount;

        if (count > 0) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'chest-stock-indicator';
                indicator.className = 'stock-indicator chest-stock';
                this.elements.battleArea.appendChild(indicator);

                // タップで開封モーダルを表示
                const handleOpen = (e) => {
                    e.stopPropagation();
                    this.showChestOpenModal();
                };
                indicator.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    handleOpen(e);
                });
                indicator.addEventListener('click', (e) => {
                    if (!e.defaultPrevented) handleOpen(e);
                });
            }
            indicator.innerHTML = `<span class="stock-icon">📦</span><span class="stock-count">${count}</span>`;
        } else if (indicator) {
            indicator.remove();
        }
    }

    // ラッキータイムストックインジケーター更新
    updateLuckyTimeStockIndicator() {
        let indicator = document.getElementById('lucky-stock-indicator');
        const stock = this.game.state.luckyTimeStock;

        if (stock > 0) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'lucky-stock-indicator';
                indicator.className = 'stock-indicator lucky-stock';
                this.elements.battleArea.appendChild(indicator);

                // タップでラッキータイム発動
                const handleUse = (e) => {
                    e.stopPropagation();
                    if (this.game.useLuckyTime()) {
                        this.updateLuckyTimeStockIndicator();
                    }
                };
                indicator.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    handleUse(e);
                });
                indicator.addEventListener('click', (e) => {
                    if (!e.defaultPrevented) handleUse(e);
                });
            }
            indicator.innerHTML = `<span class="stock-icon">🌟</span><span class="stock-count">${stock}</span>`;
        } else if (indicator) {
            indicator.remove();
        }
    }

    // 宝箱開封モーダル
    showChestOpenModal() {
        const count = this.game.state.treasureChestCount;
        if (count <= 0) return;

        const modal = document.createElement('div');
        modal.className = 'chest-open-modal';
        modal.innerHTML = `
            <div class="chest-open-content">
                <div class="chest-open-title">📦 宝箱を開ける</div>
                <div class="chest-open-count">${count}個の宝箱があります</div>
                <button class="chest-open-btn">一括で開ける！</button>
                <button class="chest-close-btn">閉じる</button>
            </div>
        `;

        document.body.appendChild(modal);

        const openBtn = modal.querySelector('.chest-open-btn');
        const closeBtn = modal.querySelector('.chest-close-btn');

        const handleOpen = () => {
            modal.remove();
            this.game.openAllTreasureChests();
        };

        const handleClose = () => modal.remove();

        openBtn.addEventListener('touchend', (e) => { e.preventDefault(); handleOpen(); });
        openBtn.addEventListener('click', (e) => { if (!e.defaultPrevented) handleOpen(); });
        closeBtn.addEventListener('touchend', (e) => { e.preventDefault(); handleClose(); });
        closeBtn.addEventListener('click', (e) => { if (!e.defaultPrevented) handleClose(); });
    }

    // 一括開封結果表示
    showBatchOpenResults(results) {
        // 報酬を集計
        let totalGold = 0;
        let totalGems = 0;
        let totalSouls = 0;
        let luckyTimeCount = 0;
        let skillResetCount = 0;
        let equipmentCount = 0;

        results.forEach(r => {
            switch (r.data.type) {
                case 'gold': totalGold += r.data.amount; break;
                case 'gems': totalGems += r.data.amount; break;
                case 'souls': totalSouls += r.data.amount; break;
                case 'luckyTime': luckyTimeCount++; break;
                case 'skillReset': skillResetCount++; break;
                case 'equipment': equipmentCount++; break;
            }
        });

        // 結果モーダル
        const modal = document.createElement('div');
        modal.className = 'batch-result-modal';

        let resultHtml = '<div class="batch-result-content">';
        resultHtml += `<div class="batch-result-title">🎉 宝箱結果</div>`;
        resultHtml += `<div class="batch-result-count">${results.length}個の宝箱を開封！</div>`;
        resultHtml += '<div class="batch-result-list">';

        if (totalGold > 0) resultHtml += `<div class="batch-item">💰 ${this.formatNumber(totalGold)}G</div>`;
        if (totalGems > 0) resultHtml += `<div class="batch-item rare">💎 ${totalGems}ジェム</div>`;
        if (totalSouls > 0) resultHtml += `<div class="batch-item rare">👻 ${totalSouls}ソウル</div>`;
        if (luckyTimeCount > 0) resultHtml += `<div class="batch-item epic">🌟 ラッキータイム x${luckyTimeCount}</div>`;
        if (skillResetCount > 0) resultHtml += `<div class="batch-item epic">⚡ スキルリセット x${skillResetCount}</div>`;
        if (equipmentCount > 0) resultHtml += `<div class="batch-item legendary">🎁 レア装備 x${equipmentCount}</div>`;

        resultHtml += '</div>';
        resultHtml += '<button class="batch-close-btn">閉じる</button>';
        resultHtml += '</div>';

        modal.innerHTML = resultHtml;
        document.body.appendChild(modal);

        const closeBtn = modal.querySelector('.batch-close-btn');
        const handleClose = () => modal.remove();
        closeBtn.addEventListener('touchend', (e) => { e.preventDefault(); handleClose(); });
        closeBtn.addEventListener('click', (e) => { if (!e.defaultPrevented) handleClose(); });

        // ラッキータイムストック更新
        this.updateLuckyTimeStockIndicator();
    }

    // ラッキータイム開始表示
    showLuckyTimeStart(duration) {
        // ラッキータイムインジケーター表示
        this.showLuckyTimeIndicator(duration);

        // 開始エフェクト
        const effect = document.createElement('div');
        effect.className = 'lucky-time-start-effect';
        effect.innerHTML = `
            <div class="lucky-time-text">🌟 LUCKY TIME! 🌟</div>
            <div class="lucky-time-bonus">ゴールド2倍 ＆ ドロップ率UP！</div>
        `;
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 2000);
    }

    // ラッキータイムインジケーター表示（左下コーナー）
    showLuckyTimeIndicator(duration) {
        // 既存のインジケーターを更新
        let indicator = document.getElementById('lucky-time-indicator');

        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'lucky-time-indicator';
            indicator.className = 'lucky-time-active-indicator';
            this.elements.battleArea.appendChild(indicator);
        }

        indicator.innerHTML = `
            <span class="lucky-active-icon">🌟</span>
            <span class="lucky-active-timer" id="lucky-time-timer">${this.game.getLuckyTimeRemaining()}s</span>
        `;

        // タイマー更新
        if (this.luckyTimeInterval) clearInterval(this.luckyTimeInterval);
        this.luckyTimeInterval = setInterval(() => {
            const remaining = this.game.getLuckyTimeRemaining();
            const timerEl = document.getElementById('lucky-time-timer');
            if (timerEl) {
                timerEl.textContent = `${remaining}s`;
            }
            if (remaining <= 0) {
                this.hideLuckyTimeIndicator();
                this.hideRainbowBorder();
            }
        }, 1000);
    }

    // ラッキータイムインジケーター非表示
    hideLuckyTimeIndicator() {
        const indicator = document.getElementById('lucky-time-indicator');
        if (indicator) indicator.remove();

        if (this.luckyTimeInterval) {
            clearInterval(this.luckyTimeInterval);
            this.luckyTimeInterval = null;
        }
    }

    // レインボーボーダー表示
    showRainbowBorder() {
        this.elements.battleArea.classList.add('rainbow-border');
    }

    // レインボーボーダー非表示
    hideRainbowBorder() {
        this.elements.battleArea.classList.remove('rainbow-border');
    }

    // ========================================
    // パネル拡張/縮小
    // ========================================
    togglePanelExpand() {
        if (!this.elements.gameContainer) return;

        const isExpanded = this.elements.gameContainer.classList.toggle('expanded');

        // 状態を保存
        localStorage.setItem('tapquest_panel_expanded', isExpanded ? '1' : '0');

        // 効果音
        if (window.soundManager) window.soundManager.playTap();
    }

    restorePanelState() {
        if (!this.elements.gameContainer) return;

        const savedState = localStorage.getItem('tapquest_panel_expanded');
        if (savedState === '1') {
            this.elements.gameContainer.classList.add('expanded');
        }
    }

    showDamageNumber(amount, isCritical) {
        this.lastWasCritical = isCritical;

        const damageEl = document.createElement('div');
        damageEl.className = 'damage-number' + (isCritical ? ' critical' : '');
        damageEl.textContent = this.formatNumber(amount);

        // ランダムな位置
        const x = 25 + Math.random() * 50; // 25-75%
        const y = 15 + Math.random() * 35; // 15-50%

        damageEl.style.left = x + '%';
        damageEl.style.top = y + '%';

        this.elements.damageNumbers.appendChild(damageEl);

        // アニメーション後に削除
        setTimeout(() => {
            damageEl.remove();
        }, 800);
    }

    // ========================================
    // 表示更新
    // ========================================
    updateDisplay() {
        // リソース
        this.elements.goldDisplay.textContent = this.formatNumber(this.game.state.gold);
        this.elements.soulsDisplay.textContent = this.formatNumber(this.game.state.souls);
        this.elements.gemsDisplay.textContent = this.formatNumber(this.game.state.gems);

        // ステージ
        const isBoss = this.game.isBossFight;
        const stageText = isBoss
            ? `⚔️ BOSS - ステージ ${this.game.state.currentStage}`
            : `ステージ ${this.game.state.currentStage}`;
        this.elements.stageDisplay.textContent = stageText;

        // 進捗バー
        const progress = (this.game.state.monstersKilled / GameData.BALANCE.MONSTERS_PER_STAGE) * 100;
        this.elements.stageProgress.style.width = progress + '%';

        // モンスター情報
        if (this.game.currentMonster) {
            const monster = this.game.currentMonster;
            // SVGモンスターを表示
            this.elements.monsterEmoji.innerHTML = monster.svg;

            // モンスター名と特性表示
            let nameText = monster.name;
            if (monster.traits && monster.traits.desc && !monster.isBoss) {
                nameText += ` <span class="monster-trait">${monster.traits.desc}</span>`;
            }
            this.elements.monsterName.innerHTML = nameText;

            // クラス設定（ボス、レア）
            let monsterClass = 'monster';
            if (monster.isBoss) monsterClass += ' boss';
            if (monster.isRare) monsterClass += ' rare';
            this.elements.monster.className = monsterClass;
            this.elements.monsterName.className = monster.isBoss ? 'boss-name' : (monster.isRare ? 'rare-name' : '');

            // モンスターの色でグロウエフェクト
            this.elements.monster.style.setProperty('--monster-color', monster.color);

            const hpPercent = Math.max(0, (monster.currentHp / monster.maxHp) * 100);
            this.elements.monsterHpFill.style.width = hpPercent + '%';
            this.elements.monsterHpText.textContent =
                this.formatNumber(Math.max(0, Math.ceil(monster.currentHp))) + '/' +
                this.formatNumber(monster.maxHp);
        }

        // ボスタイマー
        if (this.game.isBossFight && this.game.bossTimeLeft > 0) {
            this.elements.bossTimer.classList.remove('hidden');
            this.elements.bossTimeLeft.textContent = Math.ceil(this.game.bossTimeLeft);
        } else {
            this.elements.bossTimer.classList.add('hidden');
        }

        // DPS
        this.elements.totalDps.textContent = this.formatNumber(this.game.getTotalDPS());

        // 転生パネル
        this.elements.currentStageRebirth.textContent = this.game.state.currentStage;
        this.elements.rebirthCount.textContent = this.game.state.rebirthCount;
        this.elements.pendingSouls.textContent = this.formatNumber(this.game.getPendingSouls());
        if (this.elements.pendingSP) {
            this.elements.pendingSP.textContent = this.game.getPendingSkillPoints();
        }
        this.elements.rebirthBtn.disabled = !this.game.canRebirth();

        // アーティファクトソウル（存在する場合のみ更新）
        if (this.elements.artifactSouls) {
            this.elements.artifactSouls.textContent = this.formatNumber(this.game.state.souls);
        }

        // スキルクールダウン更新
        this.updateSkillCooldowns();

        // ヒーロータブがアクティブなら再描画（常に実行）
        if (this.currentTab === 'heroes') {
            this.renderHeroes();
        }
    }

    // ========================================
    // レンダリング
    // ========================================
    renderAll() {
        try { this.renderHeroes(); } catch(e) { console.error('renderHeroes error:', e); }
        try { this.renderSkills(); } catch(e) { console.error('renderSkills error:', e); }
        try { this.renderSkillTree(); } catch(e) { console.error('renderSkillTree error:', e); }
        try { this.renderArtifacts(); } catch(e) { console.error('renderArtifacts error:', e); }
        try { this.renderEquipment(); } catch(e) { console.error('renderEquipment error:', e); }
        try { this.renderInventory(); } catch(e) { console.error('renderInventory error:', e); }
        try { this.renderCollection(); } catch(e) { console.error('renderCollection error:', e); }
        try { this.renderAchievements(); } catch(e) { console.error('renderAchievements error:', e); }
        try { this.updateDisplay(); } catch(e) { console.error('updateDisplay error:', e); }
        // 宝箱・ラッキータイムストック表示
        try { this.updateTreasureChestIndicator(); } catch(e) { console.error('updateTreasureChestIndicator error:', e); }
        try { this.updateLuckyTimeStockIndicator(); } catch(e) { console.error('updateLuckyTimeStockIndicator error:', e); }
    }

    // ヒーローボタンの状態だけを更新（軽量）
    updateHeroButtons() {
        if (!this.elements.heroesList) return;

        const buttons = this.elements.heroesList.querySelectorAll('.upgrade-btn');
        buttons.forEach(btn => {
            const type = btn.dataset.type;
            const id = btn.dataset.id;
            if (!type || !id) return;

            let cost;
            if (type === 'hero') {
                cost = this.game.getHeroCost(id);
            } else {
                cost = this.game.getCompanionCost(id);
            }

            const canAfford = this.game.state.gold >= cost;

            // disabled属性を直接操作
            if (canAfford) {
                btn.removeAttribute('disabled');
                btn.style.background = 'linear-gradient(180deg, #ff0040 0%, #cc0033 100%)';
                btn.style.opacity = '1';
                btn.style.cursor = 'pointer';
            } else {
                btn.setAttribute('disabled', 'disabled');
                btn.style.background = 'linear-gradient(180deg, #444 0%, #333 100%)';
                btn.style.opacity = '0.7';
                btn.style.cursor = 'not-allowed';
            }
        });
    }

    renderHeroes() {
        if (!this.elements.heroesList) return;

        let html = '<h3 style="margin-bottom: 8px; color: #b8b8b8;">タップダメージ強化</h3>';

        // ヒーロー
        GameData.HEROES.forEach(hero => {
            const level = this.game.state.heroLevels[hero.id] || 0;
            const cost = this.game.getHeroCost(hero.id);
            const damage = hero.baseDamage * level;
            const canAfford = this.game.state.gold >= cost;

            html += `
                <div class="upgrade-item">
                    <div class="upgrade-icon">${hero.emoji}</div>
                    <div class="upgrade-info">
                        <div class="upgrade-name">${hero.name} Lv.${level}</div>
                        <div class="upgrade-stats">ダメージ +${this.formatNumber(damage)}</div>
                    </div>
                    <button class="upgrade-btn" data-type="hero" data-id="${hero.id}" ${!canAfford ? 'disabled' : ''}>
                        💰${this.formatNumber(cost)}
                    </button>
                </div>
            `;
        });

        html += '<h3 style="margin: 16px 0 8px; color: #b8b8b8;">自動攻撃仲間</h3>';

        // 仲間
        GameData.COMPANIONS.forEach(comp => {
            const level = this.game.state.companionLevels[comp.id] || 0;
            const cost = this.game.getCompanionCost(comp.id);
            const dps = comp.baseDps * level;
            const canAfford = this.game.state.gold >= cost;

            html += `
                <div class="upgrade-item">
                    <div class="upgrade-icon">${comp.emoji}</div>
                    <div class="upgrade-info">
                        <div class="upgrade-name">${comp.name} Lv.${level}</div>
                        <div class="upgrade-stats">DPS +${this.formatNumber(dps)}</div>
                    </div>
                    <button class="upgrade-btn" data-type="companion" data-id="${comp.id}" ${!canAfford ? 'disabled' : ''}>
                        💰${this.formatNumber(cost)}
                    </button>
                </div>
            `;
        });

        this.elements.heroesList.innerHTML = html;

        // ボタンイベント（タッチとクリック両方対応）
        this.elements.heroesList.querySelectorAll('.upgrade-btn').forEach(btn => {
            const handleUpgrade = () => {
                if (btn.disabled) return;
                const type = btn.dataset.type;
                const id = btn.dataset.id;

                if (type === 'hero') {
                    this.game.upgradeHero(id);
                } else {
                    this.game.upgradeCompanion(id);
                }

                // アップグレード音
                if (window.soundManager) window.soundManager.playUpgrade();

                this.renderHeroes();
            };
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleUpgrade();
            });
            btn.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handleUpgrade();
            });
        });
    }

    renderSkills() {
        if (!this.elements.skillsList) return;

        let html = '';

        GameData.SKILLS.forEach(skill => {
            const unlocked = this.game.isSkillUnlocked(skill.id);
            const cooldown = this.game.getSkillCooldownRemaining(skill.id);
            const onCooldown = cooldown > 0;

            html += `
                <div class="skill-item ${!unlocked ? 'locked' : ''} ${onCooldown ? 'on-cooldown' : ''}"
                     data-skill="${skill.id}">
                    <div class="skill-icon">${skill.emoji}</div>
                    <div class="skill-name">${unlocked ? skill.name : `Stage ${skill.unlockStage}`}</div>
                    ${onCooldown ? `<div class="skill-cooldown">${cooldown}s</div>` : ''}
                </div>
            `;
        });

        this.elements.skillsList.innerHTML = html;

        // イベント（タッチとクリック両方対応）
        this.elements.skillsList.querySelectorAll('.skill-item').forEach(el => {
            const handleSkill = () => {
                const skillId = el.dataset.skill;
                if (this.game.useSkill(skillId)) {
                    // オートタップスキルの特殊処理
                    const skill = GameData.SKILLS.find(s => s.id === skillId);
                    if (skill.effect.type === 'autoTap') {
                        this.game.startAutoTap(skill.effect.value);
                        setTimeout(() => {
                            this.game.stopAutoTap();
                        }, skill.duration * 1000);
                    }

                    // スキル発動音
                    if (window.soundManager) window.soundManager.playSkill();

                    this.showToast(`${skill.name}発動！`);
                    this.renderSkills();
                }
            };
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleSkill();
            });
            el.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handleSkill();
            });
        });
    }

    updateSkillCooldowns() {
        if (!this.elements.skillsList) return;
        this.elements.skillsList.querySelectorAll('.skill-item').forEach(el => {
            const skillId = el.dataset.skill;
            const cooldown = this.game.getSkillCooldownRemaining(skillId);
            const cooldownEl = el.querySelector('.skill-cooldown');

            if (cooldown > 0) {
                el.classList.add('on-cooldown');
                if (cooldownEl) {
                    cooldownEl.textContent = cooldown + 's';
                } else {
                    const newCooldownEl = document.createElement('div');
                    newCooldownEl.className = 'skill-cooldown';
                    newCooldownEl.textContent = cooldown + 's';
                    el.appendChild(newCooldownEl);
                }
            } else {
                el.classList.remove('on-cooldown');
                if (cooldownEl) {
                    cooldownEl.remove();
                }
            }
        });
    }

    renderArtifacts() {
        // 要素が存在しない場合はスキップ
        if (!this.elements.artifactsList) return;

        let html = '';

        GameData.ARTIFACTS.forEach(artifact => {
            const level = this.game.state.artifactLevels[artifact.id] || 0;
            const cost = this.game.getArtifactCost(artifact.id);
            const value = artifact.effect.baseValue * level;
            const canAfford = this.game.state.souls >= cost;

            html += `
                <div class="upgrade-item">
                    <div class="upgrade-icon">${artifact.emoji}</div>
                    <div class="upgrade-info">
                        <div class="upgrade-name">${artifact.name} Lv.${level}</div>
                        <div class="upgrade-stats">${artifact.description.replace('{value}', value)}</div>
                    </div>
                    <button class="upgrade-btn" data-id="${artifact.id}" ${!canAfford ? 'disabled' : ''}>
                        👻${this.formatNumber(cost)}
                    </button>
                </div>
            `;
        });

        this.elements.artifactsList.innerHTML = html;

        // イベント（タッチとクリック両方対応）
        this.elements.artifactsList.querySelectorAll('.upgrade-btn').forEach(btn => {
            const handleUpgrade = () => {
                if (btn.disabled) return;
                if (this.game.upgradeArtifact(btn.dataset.id)) {
                    this.renderArtifacts();
                }
            };
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleUpgrade();
            });
            btn.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handleUpgrade();
            });
        });
    }

    renderEquipment() {
        ['weapon', 'armor', 'accessory'].forEach(slot => {
            const item = this.game.state.equipment[slot];
            const element = this.elements[`${slot}Slot`];

            if (item) {
                element.innerHTML = `${item.emoji} ${item.name}`;
                element.className = `slot-item ${item.rarityClass}`;
            } else {
                element.innerHTML = 'なし';
                element.className = 'slot-item empty';
            }
        });
    }

    renderInventory() {
        // インベントリ数表示
        if (this.elements.inventoryCount) {
            this.elements.inventoryCount.textContent = `(${this.game.state.inventory.length})`;
        }

        let html = '';

        this.game.state.inventory.forEach((item, index) => {
            // 現在の装備との比較
            const currentEquip = this.game.state.equipment[item.type];
            let compareText = '';
            if (currentEquip) {
                const diff = item.value - currentEquip.value;
                if (diff > 0) {
                    compareText = `<span class="item-compare up">▲${diff}</span>`;
                } else if (diff < 0) {
                    compareText = `<span class="item-compare down">▼${Math.abs(diff)}</span>`;
                } else {
                    compareText = `<span class="item-compare same">=</span>`;
                }
            } else {
                compareText = `<span class="item-compare new">NEW</span>`;
            }

            html += `
                <div class="inventory-item-row ${item.rarityClass}" data-index="${index}">
                    <div class="item-icon">${item.emoji}</div>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-stat">${this.getStatLabel(item.stat)} +${item.value}</div>
                    </div>
                    ${compareText}
                </div>
            `;
        });

        if (this.game.state.inventory.length === 0) {
            html = '<div style="text-align: center; color: #666; padding: 20px;">アイテムなし</div>';
        }

        this.elements.inventoryList.innerHTML = html;

        // イベント（タッチとクリック両方対応）
        this.elements.inventoryList.querySelectorAll('.inventory-item-row').forEach(el => {
            const handleClick = () => {
                const index = parseInt(el.dataset.index);
                this.openEquipmentModal(this.game.state.inventory[index]);
            };
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleClick();
            });
            el.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handleClick();
            });
        });
    }

    // レアリティの優先度マップ
    getRarityPriority(rarity) {
        const priorities = {
            'LEGENDARY': 5,
            'EPIC': 4,
            'RARE': 3,
            'UNCOMMON': 2,
            'COMMON': 1
        };
        return priorities[rarity] || 0;
    }

    // インベントリソート（レアリティ高い順）
    sortInventory() {
        this.game.state.inventory.sort((a, b) => {
            // まずレアリティで比較
            const rarityDiff = this.getRarityPriority(b.rarity) - this.getRarityPriority(a.rarity);
            if (rarityDiff !== 0) return rarityDiff;
            // 同じレアリティなら値で比較
            return b.value - a.value;
        });
        this.renderInventory();
        this.showToast('📦 レアリティ順にソートしました');
    }

    // コモン・アンコモンアイテムを売却
    sellCommonItems() {
        const itemsToSell = this.game.state.inventory.filter(
            item => item.rarity === 'COMMON' || item.rarity === 'UNCOMMON'
        );

        if (itemsToSell.length === 0) {
            this.showToast('売却できるアイテムがありません');
            return;
        }

        // 売却価格計算（レアリティに応じて）
        let totalGold = 0;
        itemsToSell.forEach(item => {
            const basePrice = item.value * 10;
            totalGold += item.rarity === 'UNCOMMON' ? basePrice * 2 : basePrice;
        });

        if (confirm(`コモン・アンコモン ${itemsToSell.length}個 を\n💰${this.formatNumber(totalGold)}G で売却しますか？`)) {
            // アイテム削除
            this.game.state.inventory = this.game.state.inventory.filter(
                item => item.rarity !== 'COMMON' && item.rarity !== 'UNCOMMON'
            );
            // ゴールド追加
            this.game.state.gold += totalGold;
            this.renderInventory();
            this.updateDisplay();
            this.showToast(`💰 ${this.formatNumber(totalGold)}G 獲得！`);
        }
    }

    // ========================================
    // タブ切り替え
    // ========================================
    switchTab(tabId) {
        this.currentTab = tabId;

        // ナビボタン更新
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabId);
        });

        // パネル更新
        document.querySelectorAll('.tab-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === tabId + '-panel');
        });

        // 必要に応じて再レンダリング
        if (tabId === 'heroes') this.renderHeroes();
        if (tabId === 'equipment') this.renderInventory();
        if (tabId === 'skills') this.renderSkillTree();
        if (tabId === 'collection') this.renderCollection();
        if (tabId === 'rebirth') this.renderAchievements();
    }

    // ========================================
    // 装備モーダル
    // ========================================
    openEquipmentModal(item) {
        this.selectedItem = item;

        this.elements.equipModalTitle.textContent = `${item.emoji} ${item.name}`;
        this.elements.equipModalTitle.style.color = GameData.RARITY[item.rarity].color;

        const typeLabel = item.type === 'weapon' ? '武器' : item.type === 'armor' ? '防具' : 'アクセサリー';
        let statsHtml = `<p style="color: ${GameData.RARITY[item.rarity].color}">${item.rarityName}</p>`;
        statsHtml += `<p>タイプ: ${typeLabel}</p>`;
        statsHtml += `<p>効果: ${this.getStatLabel(item.stat)} +${item.value}</p>`;

        // 現在の装備との比較
        const currentEquip = this.game.state.equipment[item.type];
        if (currentEquip) {
            statsHtml += `<div class="equip-compare">`;
            statsHtml += `<p style="color:#888; margin-top:10px;">── 現在の装備 ──</p>`;
            statsHtml += `<p>${currentEquip.emoji} ${currentEquip.name}</p>`;
            statsHtml += `<p>${this.getStatLabel(currentEquip.stat)} +${currentEquip.value}</p>`;

            const diff = item.value - currentEquip.value;
            if (diff > 0) {
                statsHtml += `<p class="compare-result up">装備すると ▲+${diff} アップ！</p>`;
            } else if (diff < 0) {
                statsHtml += `<p class="compare-result down">装備すると ▼${diff} ダウン</p>`;
            } else {
                statsHtml += `<p class="compare-result same">性能は同じです</p>`;
            }
            statsHtml += `</div>`;
        } else {
            statsHtml += `<p class="compare-result new" style="margin-top:10px;">新しい${typeLabel}です！</p>`;
        }

        this.elements.equipModalStats.innerHTML = statsHtml;
        this.elements.equipmentModal.classList.remove('hidden');
    }

    closeEquipmentModal() {
        this.elements.equipmentModal.classList.add('hidden');
        this.selectedItem = null;
    }

    onEquipItem() {
        if (this.selectedItem) {
            this.game.equipItem(this.selectedItem);
            this.closeEquipmentModal();
            this.renderEquipment();
            this.renderInventory();
        }
    }

    onEquipSlotClick(slot) {
        const item = this.game.state.equipment[slot];
        if (item) {
            this.game.unequipItem(slot);
            this.renderEquipment();
            this.renderInventory();
        }
    }

    getStatLabel(stat) {
        const labels = {
            tapDamage: 'タップダメージ',
            bossTime: 'ボス戦時間(秒)',
            goldBonus: 'ゴールド獲得(%)',
            critChance: 'クリティカル率(%)',
            critDamage: 'クリティカルダメージ(%)',
            allStats: '全ステータス(%)'
        };
        return labels[stat] || stat;
    }

    // ========================================
    // 転生
    // ========================================
    onRebirth() {
        if (!this.game.canRebirth()) return;

        const souls = this.game.getPendingSouls();
        const skillPoints = this.game.getPendingSkillPoints();
        if (confirm(`転生しますか？\n\n獲得ソウル: ${this.formatNumber(souls)}\n獲得スキルポイント: ${skillPoints}\n\n※ゴールド、ヒーロー、仲間がリセットされます`)) {
            const gained = this.game.rebirth();

            // 転生音
            if (window.soundManager) window.soundManager.playRebirth();

            this.showToast(`転生完了！👻${this.formatNumber(gained)}ソウル ✨${skillPoints}SP獲得！`);
            this.renderAll();
        }
    }

    // ========================================
    // モンスター撃破
    // ========================================
    onMonsterKill(monster, gold) {
        // ゴールド獲得表示は不要（damageNumbersと被るため）
        this.updateDisplay();

        // サウンド再生＆エフェクト
        if (monster.isBoss) {
            if (window.soundManager) window.soundManager.playBossKill();
            this.showBossDefeatEffect();
        } else {
            if (window.soundManager) window.soundManager.playKill();
        }
    }

    showLootPopup(item) {
        const rarity = GameData.RARITY[item.rarity];
        this.elements.lootPopup.innerHTML = `
            <span style="color: ${rarity.color}">${item.emoji} ${item.rarityName} ${item.name} ドロップ！</span>
        `;
        this.elements.lootPopup.classList.remove('hidden');

        // ドロップ音＆エフェクト（レジェンダリーは特別）
        if (item.rarity === 'LEGENDARY') {
            if (window.soundManager) window.soundManager.playLegendaryDrop();
            this.showLegendaryDropEffect();
        } else if (item.rarity === 'EPIC') {
            if (window.soundManager) window.soundManager.playLegendaryDrop();
        } else {
            if (window.soundManager) window.soundManager.playDrop();
        }

        setTimeout(() => {
            this.elements.lootPopup.classList.add('hidden');
        }, 2000);

        this.renderInventory();
    }

    // ========================================
    // オフライン報酬
    // ========================================
    showOfflineReward(gold) {
        this.offlineGoldAmount = gold;
        this.elements.offlineGold.textContent = this.formatNumber(gold);
        this.elements.offlineModal.classList.remove('hidden');
    }

    claimOfflineReward(multiplier) {
        const gold = this.offlineGoldAmount * multiplier;
        this.game.state.gold += gold;

        if (multiplier > 1) {
            this.showToast(`広告視聴で${this.formatNumber(gold)}ゴールド獲得！`);
        }

        this.elements.offlineModal.classList.add('hidden');
        this.updateDisplay();
    }

    // ========================================
    // セーブ・リセット
    // ========================================
    onManualSave() {
        const sm = window.TapQuest && window.TapQuest.saveManager;
        if (sm && sm.save()) {
            this.showToast('💾 セーブしました！');
        } else {
            this.showToast('⚠️ セーブに失敗しました');
        }
    }

    onDataReset() {
        if (confirm('本当にデータをリセットしますか？\n\nすべての進行状況が失われます。\nこの操作は取り消せません。')) {
            if (confirm('最終確認：本当にリセットしますか？')) {
                const sm = window.TapQuest && window.TapQuest.saveManager;
                if (sm) {
                    sm.deleteSave();
                }
                location.reload();
            }
        }
    }

    async onRefresh() {
        // セーブしてからリロード
        const sm = window.TapQuest && window.TapQuest.saveManager;
        if (sm) {
            sm.save();
        }

        this.showToast('キャッシュをクリア中...');

        try {
            // Service Workerのキャッシュをクリア
            if ('caches' in window) {
                const names = await caches.keys();
                await Promise.all(names.map(name => caches.delete(name)));
                console.log('All caches cleared');
            }

            // Service Workerを更新
            if ('serviceWorker' in navigator) {
                const registration = await navigator.serviceWorker.getRegistration();
                if (registration) {
                    await registration.update();
                    if (registration.waiting) {
                        registration.waiting.postMessage('skipWaiting');
                    }
                }
            }
        } catch (e) {
            console.log('Cache clear error:', e);
        }

        // 少し待ってからリロード（キャッシュバスター付き）
        setTimeout(() => {
            window.location.href = window.location.href.split('?')[0] + '?v=' + Date.now();
        }, 500);
    }

    // ========================================
    // ユーティリティ
    // ========================================
    formatNumber(num) {
        if (num < 1000) return Math.floor(num).toString();
        if (num < 1000000) return (num / 1000).toFixed(1) + 'K';
        if (num < 1000000000) return (num / 1000000).toFixed(2) + 'M';
        if (num < 1000000000000) return (num / 1000000000).toFixed(2) + 'B';
        return (num / 1000000000000).toFixed(2) + 'T';
    }

    showToast(message) {
        // 簡易トースト通知
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 9999;
            animation: fadeInOut 2s ease;
        `;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.remove(), 2000);
    }

    // ========================================
    // デイリーボーナス
    // ========================================
    showDailyBonus() {
        if (!this.game.canClaimDailyBonus()) return;

        const streak = this.game.checkLoginStreak();
        this.elements.loginStreak.textContent = streak;

        // 報酬グリッド表示
        let html = '';
        GameData.DAILY_REWARDS.forEach((reward, index) => {
            const dayNum = index + 1;
            const isToday = ((streak - 1) % 7) === index;
            const isPast = ((streak - 1) % 7) > index;

            html += `
                <div class="daily-reward-item ${isToday ? 'today' : ''} ${isPast ? 'claimed' : ''}">
                    <div class="day-label">Day ${dayNum}</div>
                    <div class="reward-icon">${reward.emoji}</div>
                    <div class="reward-label">${reward.label}</div>
                    ${isPast ? '<div class="claimed-check">✓</div>' : ''}
                </div>
            `;
        });
        this.elements.dailyRewardsGrid.innerHTML = html;

        this.elements.dailyModal.classList.remove('hidden');
    }

    claimDailyBonus() {
        const result = this.game.claimDailyBonus();
        if (result) {
            this.elements.dailyModal.classList.add('hidden');
            this.showToast(`${result.reward.emoji} ${result.reward.label}を獲得！`);
            this.updateDisplay();
            this.renderInventory();
        }
    }

    // ========================================
    // ワールドマップ
    // ========================================
    getCurrentWorld() {
        const stage = this.game.state.currentStage;
        for (const world of GameData.WORLDS) {
            if (stage >= world.stageRange[0] && stage <= world.stageRange[1]) {
                return world;
            }
        }
        // デフォルトで最後のワールド
        return GameData.WORLDS[GameData.WORLDS.length - 1];
    }

    getWorldProgress(world) {
        const stage = this.game.state.currentStage;
        const [min, max] = world.stageRange;

        if (stage < min) return 0;
        if (stage > max) return 100;

        return Math.floor(((stage - min) / (max - min)) * 100);
    }

    isWorldUnlocked(world) {
        const maxStage = this.game.state.maxStageReached || this.game.state.currentStage;
        return maxStage >= world.unlockStage;
    }

    openWorldMap() {
        // ワールドマップ機能は削除済み
        return;

        // モーダルを表示
        this.elements.worldMapModal.classList.remove('hidden');
    }

    closeWorldMap() {
        // ワールドマップ機能は削除済み
        return;
    }

    renderWorldList() {
        const currentWorld = this.getCurrentWorld();

        let html = '';

        GameData.WORLDS.forEach(world => {
            const isUnlocked = this.isWorldUnlocked(world);
            const isCurrent = world.id === currentWorld.id;
            const progress = this.getWorldProgress(world);

            let statusClass = 'locked';
            if (isCurrent) {
                statusClass = 'current';
            } else if (isUnlocked) {
                statusClass = 'unlocked';
            }

            html += `
                <div class="world-item ${statusClass}" data-world-id="${world.id}" style="--world-color: ${world.color}">
                    <div class="world-icon-large">${world.icon}</div>
                    <div class="world-info">
                        <div class="world-name">${world.name}</div>
                        <div class="world-description">${world.description}</div>
                        <div class="world-stages">ステージ ${world.stageRange[0]} - ${world.stageRange[1]}</div>
                    </div>
                    ${isUnlocked ? `
                    <div class="world-progress">
                        <div class="world-progress-bar">
                            <div class="world-progress-fill" style="width: ${progress}%"></div>
                        </div>
                        <div class="world-progress-text">${progress}%</div>
                    </div>
                    ` : ''}
                </div>
            `;
        });

        this.elements.worldList.innerHTML = html;

        // イベントバインド
        const addTouchAndClick = (el, handler) => {
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                handler();
            });
            el.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handler();
            });
        };

        this.elements.worldList.querySelectorAll('.world-item:not(.locked)').forEach(el => {
            addTouchAndClick(el, () => {
                const worldId = el.dataset.worldId;
                const world = GameData.WORLDS.find(w => w.id === worldId);
                if (world) {
                    this.travelToWorld(world);
                }
            });
        });
    }

    travelToWorld(world) {
        const currentStage = this.game.state.currentStage;
        const [minStage, maxStage] = world.stageRange;

        // 既にそのワールド内にいる場合は何もしない
        if (currentStage >= minStage && currentStage <= maxStage) {
            this.showToast(`現在${world.name}にいます`);
            this.closeWorldMap();
            return;
        }

        // 別のワールドへの移動は確認を取る
        if (confirm(`${world.name}のステージ${minStage}に移動しますか？\n\n※現在のステージ: ${currentStage}`)) {
            // maxStageReachedを更新（より高いステージを記録）
            if (!this.game.state.maxStageReached || currentStage > this.game.state.maxStageReached) {
                this.game.state.maxStageReached = currentStage;
            }

            this.game.state.currentStage = minStage;
            this.game.state.monstersKilled = 0;
            this.game.spawnMonster();
            this.showToast(`${world.icon} ${world.name}へ移動しました！`);
        }
        this.closeWorldMap();
        this.updateDisplay();
    }

    // ========================================
    // ストーリーモード
    // ========================================
    initStoryState() {
        if (!this.game.state.completedChapters) {
            this.game.state.completedChapters = [];
        }
    }

    isChapterUnlocked(chapter) {
        const maxStage = this.game.state.maxStageReached || this.game.state.currentStage;
        return maxStage >= chapter.unlockStage;
    }

    isChapterCompleted(chapter) {
        this.initStoryState();
        return this.game.state.completedChapters.includes(chapter.id);
    }

    getCompletedChapterCount() {
        this.initStoryState();
        return this.game.state.completedChapters.length;
    }

    renderStoryPanel() {
        this.initStoryState();

        const maxStage = this.game.state.maxStageReached || this.game.state.currentStage;

        // 進捗表示更新
        this.elements.storyProgress.textContent = this.getCompletedChapterCount();
        this.elements.storyTotal.textContent = GameData.STORY_CHAPTERS.length;

        let html = '';

        GameData.STORY_CHAPTERS.forEach((chapter, index) => {
            const isUnlocked = this.isChapterUnlocked(chapter);
            const isCompleted = this.isChapterCompleted(chapter);
            const isAvailable = isUnlocked && !isCompleted;

            let statusClass = 'locked';
            if (isCompleted) {
                statusClass = 'completed';
            } else if (isAvailable) {
                statusClass = 'available';
            }

            html += `
                <div class="story-chapter-item ${statusClass}" data-chapter-id="${chapter.id}">
                    <div class="chapter-number">${index + 1}</div>
                    <div class="chapter-info">
                        <div class="chapter-title">${chapter.title}</div>
                        <div class="chapter-unlock">解放条件: ステージ${chapter.unlockStage}</div>
                        ${!isCompleted && isUnlocked ? `<div class="chapter-reward">報酬: ${chapter.reward.label}</div>` : ''}
                    </div>
                </div>
            `;
        });

        this.elements.storyChapterListPanel.innerHTML = html;

        // イベントバインド
        const addTouchAndClick = (el, handler) => {
            el.addEventListener('touchend', (e) => {
                e.preventDefault();
                handler();
            });
            el.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handler();
            });
        };

        this.elements.storyChapterListPanel.querySelectorAll('.story-chapter-item:not(.locked)').forEach(el => {
            addTouchAndClick(el, () => {
                const chapterId = el.dataset.chapterId;
                const chapter = GameData.STORY_CHAPTERS.find(c => c.id === chapterId);
                if (chapter) {
                    this.startChapter(chapter);
                }
            });
        });
    }

    startChapter(chapter) {
        this.currentChapter = chapter;
        this.currentSceneIndex = 0;

        // チャプタータイトル設定
        this.elements.storyChapterTitle.textContent = chapter.title;

        // 最初のシーンを表示
        this.showCurrentScene();

        // モーダル表示
        this.elements.storyModal.classList.remove('hidden');
    }

    showCurrentScene() {
        if (!this.currentChapter) return;

        const scene = this.currentChapter.scenes[this.currentSceneIndex];
        if (!scene) return;

        // キャラクター情報更新
        this.elements.storyCharacterEmoji.textContent = scene.emoji;
        this.elements.storyCharacterName.textContent = scene.name;

        // テキストをアニメーション付きで更新
        this.elements.storyText.style.animation = 'none';
        this.elements.storyText.offsetHeight; // Reflow
        this.elements.storyText.style.animation = 'textFade 0.3s ease';
        this.elements.storyText.textContent = scene.text;

        // ボタンテキスト更新
        if (this.currentSceneIndex >= this.currentChapter.scenes.length - 1) {
            this.elements.storyNextBtn.textContent = '完了';
        } else {
            this.elements.storyNextBtn.textContent = '次へ ▶';
        }
    }

    advanceStory() {
        if (!this.currentChapter) return;

        this.currentSceneIndex++;

        if (this.currentSceneIndex >= this.currentChapter.scenes.length) {
            // チャプター完了
            this.completeChapter();
        } else {
            this.showCurrentScene();
        }
    }

    completeChapter() {
        this.initStoryState();

        const chapter = this.currentChapter;
        const isAlreadyCompleted = this.isChapterCompleted(chapter);

        // 完了済みでなければ報酬付与
        if (!isAlreadyCompleted) {
            this.game.state.completedChapters.push(chapter.id);

            // 報酬付与
            switch (chapter.reward.type) {
                case 'gold':
                    this.game.state.gold += chapter.reward.amount;
                    break;
                case 'gems':
                    this.game.state.gems += chapter.reward.amount;
                    break;
            }

            // 報酬ポップアップ表示
            this.showStoryReward(chapter.reward);
        }

        // モーダルを閉じる
        this.elements.storyModal.classList.add('hidden');

        // ストーリーパネル更新
        this.renderStoryPanel();
        this.updateDisplay();

        // 状態リセット
        this.currentChapter = null;
        this.currentSceneIndex = 0;
    }

    showStoryReward(reward) {
        const popup = document.createElement('div');
        popup.className = 'story-reward-popup';
        popup.innerHTML = `
            <h3>チャプター完了！</h3>
            <div class="reward-content">${reward.label} 獲得！</div>
            <button class="btn-primary">OK</button>
        `;

        document.body.appendChild(popup);

        const closeBtn = popup.querySelector('.btn-primary');
        const closeReward = () => {
            popup.remove();
        };

        closeBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            closeReward();
        });
        closeBtn.addEventListener('click', (e) => {
            if (!e.defaultPrevented) closeReward();
        });

        // 3秒後に自動で閉じる
        setTimeout(closeReward, 3000);
    }

    // ========================================
    // スキルツリー
    // ========================================
    renderSkillTree() {
        if (!this.elements.skillTreeContainer) return;

        // セーフティチェック
        if (!this.game.state.skillTreeLevels) this.game.state.skillTreeLevels = {};

        // スキルポイント表示
        const availableSP = this.game.getAvailableSkillPoints();
        const totalSP = this.game.state.skillPoints || 0;
        if (this.elements.skillPoints) {
            this.elements.skillPoints.textContent = availableSP;
        }

        let html = '';

        // SP説明ヘッダー
        html += `<div class="skill-tree-header">`;
        if (totalSP === 0) {
            html += `<div class="skill-tree-info-box">
                <p>💡 スキルポイント(SP)は<strong>転生</strong>で獲得できます</p>
                <p style="font-size:11px;color:#888;">ステージ50ごとに+1SP (例: ステージ150で転生 → 3SP)</p>
            </div>`;
        } else {
            html += `<div class="skill-tree-info-box active">
                <p>✨ 利用可能SP: <strong>${availableSP}</strong> / 累計: ${totalSP}</p>
                <p style="font-size:11px;color:#888;">スキルをタップして強化しよう！</p>
            </div>`;
        }
        html += `</div>`;

        // カテゴリごとにスキルを表示
        GameData.SKILL_TREE.CATEGORIES.forEach(category => {
            const categorySkills = GameData.SKILL_TREE.SKILLS.filter(s => s.category === category.id);

            html += `
                <div class="skill-tree-category">
                    <div class="skill-tree-category-header">
                        <span>${category.emoji}</span>
                        <span class="skill-tree-category-name" style="color: ${category.color}">${category.name}</span>
                    </div>
                    <div class="skill-tree-skills">
            `;

            categorySkills.forEach(skill => {
                const level = this.game.getSkillTreeLevel(skill.id);
                const canUpgrade = this.game.canUpgradeSkillTree(skill.id);
                const isMaxed = level >= skill.maxLevel;
                const isLocked = skill.requires && this.game.getSkillTreeLevel(skill.requires) < skill.requiresLevel;

                let statusClass = '';
                if (isMaxed) statusClass = 'maxed';
                else if (canUpgrade) statusClass = 'can-upgrade';
                else if (isLocked) statusClass = 'locked';

                const currentValue = level * skill.effect.valuePerLevel;
                const effectText = skill.description.replace('{value}', currentValue);

                let lockInfo = '';
                if (isLocked) {
                    const reqSkill = GameData.SKILL_TREE.SKILLS.find(s => s.id === skill.requires);
                    lockInfo = ` (要: ${reqSkill.name} Lv${skill.requiresLevel})`;
                }

                // コスト表示（MAX以外）
                const costText = isMaxed ? 'MAX' : `${skill.costPerLevel}SP`;

                html += `
                    <div class="skill-tree-item ${statusClass}" data-skill="${skill.id}">
                        <span class="skill-tree-icon">${skill.emoji}</span>
                        <div class="skill-tree-info">
                            <div class="skill-tree-name">${skill.name}${lockInfo}</div>
                            <div class="skill-tree-level">Lv ${level}/${skill.maxLevel} <span class="skill-cost">[${costText}]</span></div>
                            <div class="skill-tree-effect">${effectText}</div>
                        </div>
                    </div>
                `;
            });

            html += '</div></div>';
        });

        this.elements.skillTreeContainer.innerHTML = html;

        // タッチとクリック両方対応
        this.elements.skillTreeContainer.querySelectorAll('.skill-tree-item:not(.locked):not(.maxed)').forEach(item => {
            const handleUpgrade = () => {
                const skillId = item.dataset.skill;
                if (this.game.upgradeSkillTree(skillId)) {
                    this.renderSkillTree();
                    this.showToast('スキル強化！');
                    if (window.soundManager) window.soundManager.playUpgrade();
                }
            };
            item.addEventListener('touchend', (e) => {
                e.preventDefault();
                handleUpgrade();
            });
            item.addEventListener('click', (e) => {
                if (!e.defaultPrevented) handleUpgrade();
            });
        });
    }

    // ========================================
    // 図鑑
    // ========================================
    renderCollection() {
        if (!this.elements.collectionContent) return;

        if (this.currentCollectionTab === 'monsters') {
            this.renderMonsterCollection();
        } else {
            this.renderEquipmentCollection();
        }
    }

    renderMonsterCollection() {
        const allMonsters = [...GameData.MONSTERS, ...GameData.BOSSES];
        const discoveredMonsters = this.game.state.discoveredMonsters || [];
        const discoveredBosses = this.game.state.discoveredBosses || [];
        const discovered = [...discoveredMonsters, ...discoveredBosses];

        // 進捗表示
        if (this.elements.collectionProgress) {
            this.elements.collectionProgress.textContent = discovered.length;
        }
        if (this.elements.collectionTotal) {
            this.elements.collectionTotal.textContent = allMonsters.length;
        }

        let html = '';
        allMonsters.forEach(monster => {
            const isDiscovered = discovered.includes(monster.name);
            const isBoss = GameData.BOSSES.some(b => b.name === monster.name);

            html += `
                <div class="collection-item ${isDiscovered ? 'discovered' : 'undiscovered'} ${isBoss ? 'boss' : ''}">
                    <div class="collection-icon svg-icon">${monster.svg}</div>
                    <div class="collection-name">${isDiscovered ? monster.name : '???'}</div>
                </div>
            `;
        });

        this.elements.collectionContent.innerHTML = html;
    }

    renderEquipmentCollection() {
        const allEquipment = [];

        // 全装備テンプレートを取得
        Object.keys(GameData.EQUIPMENT).forEach(type => {
            GameData.EQUIPMENT[type].forEach(equip => {
                Object.keys(GameData.RARITY).forEach(rarity => {
                    allEquipment.push({
                        ...equip,
                        rarity: rarity,
                        key: `${equip.name}_${rarity}`
                    });
                });
            });
        });

        const obtained = this.game.state.obtainedEquipment || {};
        const obtainedCount = Object.keys(obtained).length;

        // 進捗表示
        if (this.elements.collectionProgress) {
            this.elements.collectionProgress.textContent = obtainedCount;
        }
        if (this.elements.collectionTotal) {
            this.elements.collectionTotal.textContent = allEquipment.length;
        }

        let html = '';
        allEquipment.forEach(equip => {
            const isObtained = obtained[equip.key];
            const rarityClass = equip.rarity.toLowerCase();

            html += `
                <div class="collection-item ${isObtained ? 'discovered' : 'undiscovered'} rarity-${rarityClass}">
                    <div class="collection-icon">${equip.emoji}</div>
                    <div class="collection-name">${isObtained ? equip.name : '???'}</div>
                </div>
            `;
        });

        this.elements.collectionContent.innerHTML = html;
    }

    // ========================================
    // 実績
    // ========================================
    renderAchievements() {
        if (!this.elements.achievementsList) return;

        // セーフティチェック
        if (!this.game.state.unlockedAchievements) this.game.state.unlockedAchievements = [];
        if (!this.game.state.claimedAchievements) this.game.state.claimedAchievements = [];

        const unlockedCount = this.game.state.unlockedAchievements.length;
        const totalCount = GameData.ACHIEVEMENTS.length;

        if (this.elements.unlockedAchievements) {
            this.elements.unlockedAchievements.textContent = unlockedCount;
        }
        if (this.elements.totalAchievements) {
            this.elements.totalAchievements.textContent = totalCount;
        }

        let html = '';

        // 未受取 > 未達成 の順でソート
        const sortedAchievements = [...GameData.ACHIEVEMENTS].sort((a, b) => {
            const aUnlocked = this.game.state.unlockedAchievements.includes(a.id);
            const bUnlocked = this.game.state.unlockedAchievements.includes(b.id);
            const aClaimed = this.game.state.claimedAchievements.includes(a.id);
            const bClaimed = this.game.state.claimedAchievements.includes(b.id);

            // 未受取を最初に
            if (aUnlocked && !aClaimed && !(bUnlocked && !bClaimed)) return -1;
            if (bUnlocked && !bClaimed && !(aUnlocked && !aClaimed)) return 1;
            // 受取済みを最後に
            if (aClaimed && !bClaimed) return 1;
            if (bClaimed && !aClaimed) return -1;
            return 0;
        });

        sortedAchievements.forEach(achievement => {
            const isUnlocked = this.game.state.unlockedAchievements.includes(achievement.id);
            const isClaimed = this.game.state.claimedAchievements.includes(achievement.id);
            const progress = this.game.getAchievementProgress(achievement);

            let statusClass = '';
            if (isClaimed) statusClass = 'claimed';
            else if (isUnlocked) statusClass = 'unlocked';

            const rewardText = achievement.reward.type === 'gold'
                ? `💰${achievement.reward.amount}`
                : `💎${achievement.reward.amount}`;

            html += `
                <div class="achievement-item ${statusClass}" data-achievement="${achievement.id}">
                    <div class="achievement-icon">${achievement.emoji}</div>
                    <div class="achievement-info">
                        <div class="achievement-name">${achievement.name}</div>
                        <div class="achievement-desc">${achievement.description}</div>
                        ${!isUnlocked ? `
                            <div class="achievement-progress">
                                <div class="achievement-progress-fill" style="width: ${progress.percent}%"></div>
                            </div>
                        ` : ''}
                    </div>
                    <div class="achievement-reward">${rewardText}</div>
                </div>
            `;
        });

        this.elements.achievementsList.innerHTML = html;

        // 未受取の実績をクリックで報酬受け取り
        this.elements.achievementsList.querySelectorAll('.achievement-item.unlocked:not(.claimed)').forEach(item => {
            item.addEventListener('click', () => {
                const achievementId = item.dataset.achievement;
                const claimed = this.game.claimAchievement(achievementId);
                if (claimed) {
                    const rewardText = claimed.reward.type === 'gold'
                        ? `💰${claimed.reward.amount}G`
                        : `💎${claimed.reward.amount}ジェム`;
                    this.showToast(`🏆 ${claimed.name} - ${rewardText} 獲得！`);
                    this.renderAchievements();
                    this.updateResources();
                }
            });
        });
    }

    // ========================================
    // サウンド設定
    // ========================================
    initSoundSettings() {
        if (!window.soundManager) return;

        // 設定を読み込み
        const bgmEnabled = window.soundManager.loadSettings();

        // スライダー要素取得
        const masterSlider = document.getElementById('master-volume');
        const bgmSlider = document.getElementById('bgm-volume');
        const sfxSlider = document.getElementById('sfx-volume');
        const muteBtn = document.getElementById('mute-btn');
        const bgmToggleBtn = document.getElementById('bgm-toggle-btn');

        if (!masterSlider || !bgmSlider || !sfxSlider) return;

        // 初期値設定
        masterSlider.value = window.soundManager.masterVolume * 100;
        bgmSlider.value = window.soundManager.bgmVolume * 100;
        sfxSlider.value = window.soundManager.sfxVolume * 100;

        // ミュート状態更新
        this.updateMuteButton();

        // BGMボタン状態更新
        if (bgmToggleBtn) {
            bgmToggleBtn.textContent = bgmEnabled ? 'ON' : 'OFF';
            bgmToggleBtn.classList.toggle('active', bgmEnabled);
        }

        // BGMを開始（設定がONの場合）
        if (bgmEnabled) {
            window.soundManager.startBgm();
        }

        // イベントリスナー
        masterSlider.addEventListener('input', () => {
            window.soundManager.setMasterVolume(masterSlider.value / 100);
            window.soundManager.saveSettings();
        });

        bgmSlider.addEventListener('input', () => {
            window.soundManager.setBgmVolume(bgmSlider.value / 100);
            window.soundManager.saveSettings();
        });

        sfxSlider.addEventListener('input', () => {
            window.soundManager.setSfxVolume(sfxSlider.value / 100);
            window.soundManager.saveSettings();
        });

        if (muteBtn) {
            muteBtn.addEventListener('click', () => {
                window.soundManager.toggleMute();
                this.updateMuteButton();
                window.soundManager.saveSettings();
            });
        }

        if (bgmToggleBtn) {
            bgmToggleBtn.addEventListener('click', () => {
                const isPlaying = window.soundManager.toggleBgm();
                bgmToggleBtn.textContent = isPlaying ? 'ON' : 'OFF';
                bgmToggleBtn.classList.toggle('active', isPlaying);
                window.soundManager.saveSettings();
            });
        }
    }

    updateMuteButton() {
        const muteBtn = document.getElementById('mute-btn');
        if (!muteBtn || !window.soundManager) return;

        muteBtn.textContent = window.soundManager.isMuted ? '🔇' : '🔊';
        muteBtn.classList.toggle('muted', window.soundManager.isMuted);
    }
}

// CSSアニメーション追加
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
    }
`;
document.head.appendChild(style);

// グローバルにエクスポート
window.UI = UI;
