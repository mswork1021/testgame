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

        // ワールドマップ
        this.elements.worldMapBtn = document.getElementById('world-map-btn');
        this.elements.worldMapModal = document.getElementById('world-map-modal');
        this.elements.closeWorldMap = document.getElementById('close-world-map');
        this.elements.currentWorldName = document.getElementById('current-world-name');
        this.elements.currentWorldStage = document.getElementById('current-world-stage');
        this.elements.worldList = document.getElementById('world-list');

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

        // ワールドマップ
        addTouchAndClick(this.elements.worldMapBtn, () => this.openWorldMap());
        addTouchAndClick(this.elements.closeWorldMap, () => this.closeWorldMap());

        // ストーリーモード
        addTouchAndClick(this.elements.storyNextBtn, () => this.advanceStory());

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

        // ドロップ
        this.game.onLoot = (item) => {
            this.showLootPopup(item);
        };
    }

    // ========================================
    // タップ処理
    // ========================================
    onTap(e) {
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
        this.elements.monster.classList.add('hit');
        setTimeout(() => {
            this.elements.monster.classList.remove('hit');
        }, 150);

        // タップ位置にエフェクト表示
        this.showTapEffect(e);

        // 画面シェイク（クリティカル時）
        if (this.lastWasCritical) {
            this.shakeScreen();
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
        this.renderHeroes();
        this.renderSkills();
        this.renderArtifacts();
        this.renderEquipment();
        this.renderInventory();
        this.updateDisplay();
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
        if (confirm(`転生しますか？\n\n獲得ソウル: ${this.formatNumber(souls)}\n\n※ゴールド、ヒーロー、仲間がリセットされます`)) {
            const gained = this.game.rebirth();
            this.showToast(`転生完了！👻${this.formatNumber(gained)}ソウル獲得！`);
            this.renderAll();
        }
    }

    // ========================================
    // モンスター撃破
    // ========================================
    onMonsterKill(monster, gold) {
        // ゴールド獲得表示は不要（damageNumbersと被るため）
        this.updateDisplay();
    }

    showLootPopup(item) {
        const rarity = GameData.RARITY[item.rarity];
        this.elements.lootPopup.innerHTML = `
            <span style="color: ${rarity.color}">${item.emoji} ${item.rarityName} ${item.name} ドロップ！</span>
        `;
        this.elements.lootPopup.classList.remove('hidden');

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

    onRefresh() {
        // セーブしてからリロード
        const sm = window.TapQuest && window.TapQuest.saveManager;
        if (sm) {
            sm.save();
        }
        // キャッシュをクリアしてリロード
        location.reload(true);
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
        const currentWorld = this.getCurrentWorld();

        // 現在のワールド情報を更新
        this.elements.currentWorldName.textContent = `${currentWorld.icon} ${currentWorld.name}`;
        this.elements.currentWorldStage.textContent = `ステージ ${currentWorld.stageRange[0]}-${currentWorld.stageRange[1]}`;

        // ワールドリストをレンダリング
        this.renderWorldList();

        // モーダルを表示
        this.elements.worldMapModal.classList.remove('hidden');
    }

    closeWorldMap() {
        this.elements.worldMapModal.classList.add('hidden');
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

        // スキルポイント表示
        const availableSP = this.game.getAvailableSkillPoints();
        if (this.elements.skillPoints) {
            this.elements.skillPoints.textContent = availableSP;
        }

        let html = '';

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

                html += `
                    <div class="skill-tree-item ${statusClass}" data-skill="${skill.id}">
                        <span class="skill-tree-icon">${skill.emoji}</span>
                        <div class="skill-tree-info">
                            <div class="skill-tree-name">${skill.name}${lockInfo}</div>
                            <div class="skill-tree-level">Lv ${level}/${skill.maxLevel}</div>
                            <div class="skill-tree-effect">${effectText}</div>
                        </div>
                    </div>
                `;
            });

            html += '</div></div>';
        });

        this.elements.skillTreeContainer.innerHTML = html;

        // クリックイベント
        this.elements.skillTreeContainer.querySelectorAll('.skill-tree-item:not(.locked):not(.maxed)').forEach(item => {
            item.addEventListener('click', () => {
                const skillId = item.dataset.skill;
                if (this.game.upgradeSkillTree(skillId)) {
                    this.renderSkillTree();
                    this.showToast('スキル強化！');
                }
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
        const discovered = [...this.game.state.discoveredMonsters, ...this.game.state.discoveredBosses];

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

        const obtained = this.game.state.obtainedEquipment;
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
