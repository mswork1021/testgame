/* ========================================
   Tap Quest - サウンドマネージャー
   Web Audio APIを使用してプログラムで音を生成
   ======================================== */

class SoundManager {
    constructor() {
        this.audioContext = null;
        this.masterVolume = 0.5;
        this.sfxVolume = 0.7;
        this.bgmVolume = 0.3;
        this.isMuted = false;
        this.bgmOscillator = null;
        this.bgmGain = null;
        this.isInitialized = false;
    }

    // ユーザー操作後に呼び出す（ブラウザのautoplay制限対策）
    init() {
        if (this.isInitialized) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.isInitialized = true;
            console.log('SoundManager initialized');
        } catch (e) {
            console.log('Web Audio API not supported:', e);
        }
    }

    // マスター音量設定
    setMasterVolume(value) {
        this.masterVolume = Math.max(0, Math.min(1, value));
        this.updateBgmVolume();
    }

    // SE音量設定
    setSfxVolume(value) {
        this.sfxVolume = Math.max(0, Math.min(1, value));
    }

    // BGM音量設定
    setBgmVolume(value) {
        this.bgmVolume = Math.max(0, Math.min(1, value));
        this.updateBgmVolume();
    }

    // ミュート切り替え
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.updateBgmVolume();
        return this.isMuted;
    }

    // 実効音量を取得
    getEffectiveVolume(type = 'sfx') {
        if (this.isMuted) return 0;
        const baseVolume = type === 'bgm' ? this.bgmVolume : this.sfxVolume;
        return baseVolume * this.masterVolume;
    }

    // BGM音量をリアルタイム更新
    updateBgmVolume() {
        if (this.bgmGain) {
            this.bgmGain.gain.setValueAtTime(
                this.getEffectiveVolume('bgm'),
                this.audioContext.currentTime
            );
        }
    }

    // ========================================
    // 効果音生成
    // ========================================

    // タップ音（軽快なクリック音）
    playTap() {
        if (!this.audioContext || this.isMuted) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(800, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.05);
        osc.type = 'sine';

        const vol = this.getEffectiveVolume('sfx') * 0.3;
        gain.gain.setValueAtTime(vol, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.05);
    }

    // クリティカルヒット音（派手な音）
    playCritical() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');

        // 高い音
        const osc1 = this.audioContext.createOscillator();
        const gain1 = this.audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(this.audioContext.destination);

        osc1.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(600, this.audioContext.currentTime + 0.15);
        osc1.type = 'sawtooth';

        gain1.gain.setValueAtTime(vol * 0.4, this.audioContext.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

        osc1.start(this.audioContext.currentTime);
        osc1.stop(this.audioContext.currentTime + 0.15);

        // 低い音（重み）
        const osc2 = this.audioContext.createOscillator();
        const gain2 = this.audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(this.audioContext.destination);

        osc2.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc2.type = 'square';

        gain2.gain.setValueAtTime(vol * 0.3, this.audioContext.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);

        osc2.start(this.audioContext.currentTime);
        osc2.stop(this.audioContext.currentTime + 0.1);
    }

    // モンスター撃破音
    playKill() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');

        // スイープダウン音
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.audioContext.currentTime + 0.2);
        osc.type = 'triangle';

        gain.gain.setValueAtTime(vol * 0.5, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.2);
    }

    // ボス撃破音（豪華なファンファーレ）
    playBossKill() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.1);
            osc.type = 'triangle';

            gain.gain.setValueAtTime(0, this.audioContext.currentTime + i * 0.1);
            gain.gain.linearRampToValueAtTime(vol * 0.4, this.audioContext.currentTime + i * 0.1 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + i * 0.1 + 0.4);

            osc.start(this.audioContext.currentTime + i * 0.1);
            osc.stop(this.audioContext.currentTime + i * 0.1 + 0.4);
        });
    }

    // レジェンダリードロップ音
    playLegendaryDrop() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');

        // キラキラ音
        const frequencies = [1318.51, 1567.98, 2093.00, 2637.02]; // E6, G6, C7, E7

        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.setValueAtTime(freq, this.audioContext.currentTime + i * 0.08);
            osc.type = 'sine';

            gain.gain.setValueAtTime(vol * 0.3, this.audioContext.currentTime + i * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + i * 0.08 + 0.3);

            osc.start(this.audioContext.currentTime + i * 0.08);
            osc.stop(this.audioContext.currentTime + i * 0.08 + 0.3);
        });
    }

    // 通常ドロップ音
    playDrop() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(880, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1760, this.audioContext.currentTime + 0.1);
        osc.type = 'sine';

        gain.gain.setValueAtTime(vol * 0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.15);
    }

    // スキル発動音
    playSkill() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');

        // シュイン音
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(300, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1500, this.audioContext.currentTime + 0.15);
        osc.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.3);
        osc.type = 'sine';

        gain.gain.setValueAtTime(vol * 0.4, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.3);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.3);
    }

    // アップグレード音
    playUpgrade() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.1);
        osc.type = 'sine';

        gain.gain.setValueAtTime(vol * 0.3, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.15);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.15);
    }

    // 転生音（神秘的な音）
    playRebirth() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');

        // 複数の周波数を重ねて神秘的な雰囲気
        const baseFreq = 220;
        [1, 1.5, 2, 3].forEach((mult, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.connect(gain);
            gain.connect(this.audioContext.destination);

            osc.frequency.setValueAtTime(baseFreq * mult, this.audioContext.currentTime);
            osc.type = 'sine';

            gain.gain.setValueAtTime(0, this.audioContext.currentTime);
            gain.gain.linearRampToValueAtTime(vol * 0.2, this.audioContext.currentTime + 0.3);
            gain.gain.linearRampToValueAtTime(vol * 0.2, this.audioContext.currentTime + 0.7);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 1.2);

            osc.start(this.audioContext.currentTime);
            osc.stop(this.audioContext.currentTime + 1.2);
        });
    }

    // ボタンクリック音
    playButton() {
        if (!this.audioContext || this.isMuted) return;

        const vol = this.getEffectiveVolume('sfx');

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
        osc.type = 'sine';

        gain.gain.setValueAtTime(vol * 0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.05);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.05);
    }

    // コンボ音（高いコンボで音程上昇）
    playCombo(comboCount) {
        if (!this.audioContext || this.isMuted) return;
        if (comboCount < 5) return; // 5コンボ以上で音を出す

        const vol = this.getEffectiveVolume('sfx');

        // コンボ数に応じて音程を上げる
        const baseFreq = 400 + Math.min(comboCount * 20, 800);

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.connect(gain);
        gain.connect(this.audioContext.destination);

        osc.frequency.setValueAtTime(baseFreq, this.audioContext.currentTime);
        osc.type = 'triangle';

        gain.gain.setValueAtTime(vol * 0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.08);

        osc.start(this.audioContext.currentTime);
        osc.stop(this.audioContext.currentTime + 0.08);
    }

    // ========================================
    // BGM
    // ========================================

    // 通常BGM開始
    startBgm(type = 'normal') {
        if (!this.audioContext) return;

        // 既に同じタイプが再生中なら何もしない
        if (this.bgmPlaying && this.currentBgmType === type) return;

        // 違うタイプなら停止してから開始
        if (this.bgmPlaying) {
            this.stopBgm();
        }

        this.bgmPlaying = true;
        this.currentBgmType = type;
        this.bgmGain = this.audioContext.createGain();
        this.bgmGain.connect(this.audioContext.destination);
        this.bgmGain.gain.setValueAtTime(this.getEffectiveVolume('bgm'), this.audioContext.currentTime);

        if (type === 'boss') {
            this.playBossBgm();
        } else {
            this.playNormalBgm();
        }
    }

    // 通常フィールドBGM
    playNormalBgm() {
        // ファンタジーRPG風メロディ（Aマイナー系）
        const melody = [
            { note: 440, duration: 0.5 },    // A4
            { note: 523.25, duration: 0.5 }, // C5
            { note: 659.25, duration: 1 },   // E5
            { note: 587.33, duration: 0.5 }, // D5
            { note: 523.25, duration: 0.5 }, // C5
            { note: 493.88, duration: 1 },   // B4
            { note: 440, duration: 0.5 },    // A4
            { note: 392, duration: 0.5 },    // G4
            { note: 440, duration: 1 },      // A4
            { note: 523.25, duration: 0.5 }, // C5
            { note: 493.88, duration: 0.5 }, // B4
            { note: 440, duration: 1 },      // A4
        ];

        const tempo = 100;
        this.playMelodyLoop(melody, tempo, 'triangle');
    }

    // ボス戦BGM - 緊張感のある速いテンポ
    playBossBgm() {
        // ボス戦メロディ（Eマイナー系、緊迫感）
        const melody = [
            // イントロ的フレーズ「ついにきたか！」
            { note: 329.63, duration: 0.25 }, // E4
            { note: 329.63, duration: 0.25 }, // E4
            { note: 493.88, duration: 0.25 }, // B4
            { note: 493.88, duration: 0.25 }, // B4
            { note: 659.25, duration: 0.5 },  // E5
            { note: 622.25, duration: 0.25 }, // D#5
            { note: 659.25, duration: 0.25 }, // E5
            // 上昇フレーズ
            { note: 392, duration: 0.25 },    // G4
            { note: 440, duration: 0.25 },    // A4
            { note: 493.88, duration: 0.25 }, // B4
            { note: 523.25, duration: 0.25 }, // C5
            { note: 587.33, duration: 0.5 },  // D5
            { note: 659.25, duration: 0.5 },  // E5
            // 緊迫フレーズ
            { note: 493.88, duration: 0.25 }, // B4
            { note: 523.25, duration: 0.25 }, // C5
            { note: 493.88, duration: 0.25 }, // B4
            { note: 440, duration: 0.25 },    // A4
            { note: 392, duration: 0.25 },    // G4
            { note: 329.63, duration: 0.75 }, // E4
        ];

        const tempo = 160; // 速いテンポ！
        this.playMelodyLoop(melody, tempo, 'sawtooth');
    }

    // メロディループ再生（共通処理）
    playMelodyLoop(melody, tempo, waveType) {
        const beatDuration = 60 / tempo;
        const loopDuration = melody.reduce((sum, n) => sum + n.duration, 0) * beatDuration;

        const playMelody = () => {
            if (!this.bgmPlaying) return;

            let time = this.audioContext.currentTime;
            const vol = this.getEffectiveVolume('bgm');

            melody.forEach(({ note, duration }) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.connect(gain);
                gain.connect(this.bgmGain);

                osc.frequency.setValueAtTime(note, time);
                osc.type = waveType;

                const noteDuration = duration * beatDuration;
                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(vol * 0.4, time + 0.02);
                gain.gain.setValueAtTime(vol * 0.4, time + noteDuration * 0.7);
                gain.gain.exponentialRampToValueAtTime(0.001, time + noteDuration * 0.95);

                osc.start(time);
                osc.stop(time + noteDuration);

                time += noteDuration;
            });

            // ループ
            this.bgmTimeout = setTimeout(playMelody, loopDuration * 1000);
        };

        playMelody();
        console.log(`BGM started: ${this.currentBgmType}`);
    }

    // BGM停止
    stopBgm() {
        this.bgmPlaying = false;
        this.currentBgmType = null;
        if (this.bgmTimeout) {
            clearTimeout(this.bgmTimeout);
            this.bgmTimeout = null;
        }
        this.bgmGain = null;
        console.log('BGM stopped');
    }

    // BGMトグル
    toggleBgm() {
        if (this.bgmPlaying) {
            this.stopBgm();
            return false;
        } else {
            this.startBgm('normal');
            return true;
        }
    }

    // ボス戦BGMに切り替え
    switchToBossBgm() {
        if (!this.bgmPlaying) return; // BGMがOFFなら何もしない
        this.startBgm('boss');
    }

    // 通常BGMに切り替え
    switchToNormalBgm() {
        if (!this.bgmPlaying) return; // BGMがOFFなら何もしない
        this.startBgm('normal');
    }

    // 設定を保存
    saveSettings() {
        const settings = {
            masterVolume: this.masterVolume,
            sfxVolume: this.sfxVolume,
            bgmVolume: this.bgmVolume,
            isMuted: this.isMuted,
            bgmEnabled: !!this.bgmPlaying
        };
        localStorage.setItem('tapquest_sound_settings', JSON.stringify(settings));
    }

    // 設定を読み込み
    loadSettings() {
        try {
            const saved = localStorage.getItem('tapquest_sound_settings');
            if (saved) {
                const settings = JSON.parse(saved);
                this.masterVolume = settings.masterVolume ?? 0.5;
                this.sfxVolume = settings.sfxVolume ?? 0.7;
                this.bgmVolume = settings.bgmVolume ?? 0.3;
                this.isMuted = settings.isMuted ?? false;
                return settings.bgmEnabled ?? false;
            }
        } catch (e) {
            console.log('Failed to load sound settings:', e);
        }
        return false;
    }
}

// グローバルインスタンス
window.SoundManager = SoundManager;
window.soundManager = new SoundManager();
