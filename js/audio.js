/**
 * audio.js — 音效系统（Web Audio API 纯合成，无外部文件）
 * 用于「看见」游戏的轻量音效和氛围
 */

const Audio = {
  ctx: null,
  masterGain: null,
  bgmGain: null,
  bgmOscillators: [],
  initialized: false,
  muteBGM: false,

  // 初始化（需在用户首次交互后调用）
  init() {
    if (this.initialized) return;
    try {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.6;
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = 0.3;
      this.bgmGain.connect(this.masterGain);

      this.initialized = true;
    } catch (e) {
      // 浏览器不支持 Web Audio API，静默降级
    }
  },

  // 确保已初始化
  ensureInit() {
    if (!this.initialized) this.init();
  },

  // ========== 基础音色 ==========

  // 播放一个简单音调
  playTone(freq, duration, type, volume, delay = 0) {
    this.ensureInit();
    if (!this.ctx) return;

    const now = this.ctx.currentTime + delay;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type || "sine";
    osc.frequency.value = freq;

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume || 0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + duration);
  },

  // ========== 事件音效 ==========

  // 新信号 — 柔和的叮咚
  playSignal() {
    this.ensureInit();
    if (!this.ctx) return;
    this.playTone(520, 0.3, "sine", 0.25, 0);
    this.playTone(660, 0.25, "sine", 0.2, 0.1);
  },

  // 选择响应 — 轻柔确认音
  playChoice() {
    this.ensureInit();
    if (!this.ctx) return;
    this.playTone(440, 0.2, "sine", 0.2, 0);
    this.playTone(350, 0.3, "sine", 0.15, 0.08);
  },

  // 内心独白 — 温暖泛音
  playThought() {
    this.ensureInit();
    if (!this.ctx) return;
    this.playTone(330, 0.5, "triangle", 0.15, 0);
    this.playTone(494, 0.6, "sine", 0.1, 0.2);
    this.playTone(587, 0.4, "sine", 0.08, 0.4);
  },

  // 日终 — 收束感
  playDayEnd() {
    this.ensureInit();
    if (!this.ctx) return;
    this.playTone(520, 0.5, "sine", 0.2, 0);
    this.playTone(440, 0.6, "triangle", 0.15, 0.15);
    this.playTone(350, 0.8, "sine", 0.1, 0.3);
  },

  // ========== 结局 BGM（温和氛围） ==========

  // 开始结局 BGM — 温暖持续音
  startEndingBGM() {
    this.ensureInit();
    if (!this.ctx || this.muteBGM) return;

    this.stopBGM();

    const notes = [
      { freq: 261.6, type: "sine" },    // C4
      { freq: 329.6, type: "sine" },    // E4
      { freq: 392.0, type: "triangle" }, // G4
      { freq: 523.2, type: "sine" }     // C5
    ];

    notes.forEach((n) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = n.type;
      osc.frequency.value = n.freq;

      // 非常低的音量 + LFO 幅度调制营造呼吸感
      const lfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      lfo.frequency.value = 0.08 + Math.random() * 0.04;
      lfoGain.gain.value = 0.015;
      lfo.connect(lfoGain);
      lfoGain.connect(gain.gain);

      gain.gain.setValueAtTime(0, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.04, this.ctx.currentTime + 1.5);

      osc.connect(gain);
      gain.connect(this.bgmGain);
      osc.start();
      lfo.start();
      this.bgmOscillators.push(osc, lfo);
    });
  },

  // 停止 BGM
  stopBGM() {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    this.bgmOscillators.forEach(o => {
      o.stop(now + 0.5);
    });
    this.bgmOscillators = [];
  },

  // 淡出 BGM
  fadeOutBGM(duration = 2) {
    if (!this.ctx) return;
    this.bgmGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + duration);
    setTimeout(() => {
      this.stopBGM();
      this.bgmGain.gain.value = 0.3;
    }, duration * 1000);
  }
};
