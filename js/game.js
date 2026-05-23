/**
 * game.js — 游戏核心逻辑
 * 状态管理、信号处理、信任值计算、流程控制
 */

class GameEngine {
  constructor() {
    this.state = this.createInitialState();
    this.listeners = [];
  }

  // 创建初始状态
  createInitialState() {
    return {
      screen: "title",       // title | dashboard | signal | response | thought | daySummary | ending | resources
      day: 1,
      trust: 50,
      energy: 100,
      signalsSeen: [],
      choicesMade: [],
      innerThoughtsUnlocked: [],
      currentSignalId: null,
      currentResponse: null,
      currentThoughtId: null,
      currentEnding: null,
      daySignals: [],        // 当天已处理的信号索引
      overApproachCount: 0,  // 过度介入计数
      weekChoices: []        // 所有选择记录
    };
  }

  // 重置游戏
  reset() {
    this.state = this.createInitialState();
    this.notify("reset");
  }

  // 事件通知
  notify(event, data) {
    this.listeners.forEach(fn => fn(event, data));
  }

  // 监听事件
  on(fn) {
    this.listeners.push(fn);
  }

  // 开始新一天
  startDay(dayIndex) {
    const day = GameData.days[dayIndex];
    if (!day) return;

    this.state.day = day.id;
    this.state.energy = day.energy;
    this.state.daySignals = [];
    this.state.screen = "dashboard";

    // 检查是否需要解锁内心独白
    this.checkThoughtUnlocks();

    this.notify("dayStart", { day });
    return day;
  }

  // 获取当前天数配置
  getCurrentDay() {
    return GameData.days[this.state.day - 1];
  }

  // 获取当天未处理的信号
  getPendingSignals() {
    const day = this.getCurrentDay();
    if (!day) return [];
    return day.signals
      .filter(id => !this.state.daySignals.includes(id))
      .map(id => GameData.signals[id]);
  }

  // 处理信号（显示信号详情）
  showSignal(signalId) {
    const signal = GameData.signals[signalId];
    if (!signal) return null;

    // 特殊信号：无选项 → 直接触发结局（周五对话）
    if (!signal.choices || signal.choices.length === 0) {
      // 标记信号已处理
      if (!this.state.daySignals.includes(signalId)) {
        this.state.daySignals.push(signalId);
      }
      this.triggerEnding();
      return signal;
    }

    this.state.currentSignalId = signalId;
    this.state.screen = "signal";

    this.notify("signalShow", { signal });
    return signal;
  }

  // 做出选择
  makeChoice(signalId, choiceId) {
    const signal = GameData.signals[signalId];
    if (!signal) return null;

    const choice = signal.choices.find(c => c.id === choiceId);
    if (!choice) return null;

    // 消耗精力
    this.state.energy = Math.max(0, this.state.energy - choice.energyCost);

    // 更新信任值
    this.state.trust = Math.max(0, Math.min(100, this.state.trust + choice.trustImpact));

    // 过度介入计数
    if (choice.overApproach) {
      this.state.overApproachCount++;
    }

    // 记录选择
    this.state.choicesMade.push({
      signalId,
      choiceId,
      trustImpact: choice.trustImpact,
      day: this.state.day
    });
    this.state.weekChoices.push({
      signalId,
      choiceId,
      day: this.state.day
    });

    // 标记信号已处理
    if (!this.state.daySignals.includes(signalId)) {
      this.state.daySignals.push(signalId);
    }

    // 记录响应
    this.state.currentResponse = choice.response;
    this.state.screen = "response";

    // 检查是否解锁内心独白
    if (choice.response && choice.response.unlockThought) {
      this.state.innerThoughtsUnlocked.push(choice.response.unlockThought);
    }

    this.notify("choiceMade", { signal, choice });
    return { signal, choice };
  }

  // 检查内心独白解锁（按信任值阈值自动解锁）
  checkThoughtUnlocks() {
    const thoughts = GameData.innerThoughts;
    for (const key in thoughts) {
      const thought = thoughts[key];
      if (thought.day <= this.state.day &&
          this.state.trust >= thought.unlockTrust &&
          !this.state.innerThoughtsUnlocked.includes(key)) {
        this.state.innerThoughtsUnlocked.push(key);
      }
    }
  }

  // 检查是否有待解锁的内心独白
  getUnlockedThoughts() {
    return this.state.innerThoughtsUnlocked
      .filter(id => !GameData.innerThoughts[id] ? false : true)
      .map(id => GameData.innerThoughts[id]);
  }

  // 检查是否有新的内心独白待展示
  hasNewThought() {
    const lastChoice = this.state.choicesMade[this.state.choicesMade.length - 1];
    if (!lastChoice) return false;

    const signal = GameData.signals[lastChoice.signalId];
    if (!signal) return false;

    const choice = signal.choices.find(c => c.id === lastChoice.choiceId);
    if (!choice || !choice.response) return false;

    return !!choice.response.unlockThought;
  }

  // 获取最新的内心独白
  getLatestThought() {
    const lastChoice = this.state.choicesMade[this.state.choicesMade.length - 1];
    if (!lastChoice) return null;

    const signal = GameData.signals[lastChoice.signalId];
    if (!signal) return null;

    const choice = signal.choices.find(c => c.id === lastChoice.choiceId);
    if (!choice || !choice.response || !choice.response.unlockThought) return null;

    return GameData.innerThoughts[choice.response.unlockThought];
  }

  // 结束信号响应，返回工作台或进入内心独白
  dismissResponse() {
    if (this.hasNewThought()) {
      this.state.currentThoughtId = this.state.choicesMade[this.state.choicesMade.length - 1];
      this.state.screen = "thought";
      this.notify("thoughtShow");
      return "thought";
    }

    // 检查是否还有未处理的信号
    if (this.getPendingSignals().length > 0) {
      this.state.screen = "dashboard";
      this.notify("backToDashboard");
      return "dashboard";
    }

    // 所有信号处理完毕，进入日终总结
    this.state.screen = "daySummary";
    this.notify("dayEnd");
    return "daySummary";
  }

  // 结束内心独白展示
  dismissThought() {
    if (this.getPendingSignals().length > 0) {
      this.state.screen = "dashboard";
      this.notify("backToDashboard");
      return "dashboard";
    }

    this.state.screen = "daySummary";
    this.notify("dayEnd");
    return "daySummary";
  }

  // 结束日终，进入下一天或结局
  nextDay() {
    const nextDayIndex = this.state.day; // day 从 1 开始，数组从 0 开始
    if (nextDayIndex >= GameData.days.length) {
      // 进入结局
      this.triggerEnding();
      return;
    }

    this.startDay(nextDayIndex);
  }

  // 触发结局
  triggerEnding() {
    const trust = this.state.trust;

    let ending;
    // 过度介入：做了很多但方式太急，小晴感到压力
    if (this.state.overApproachCount >= 3 && trust >= 55) {
      ending = GameData.endings.over;
    } else if (trust >= 70) {
      ending = GameData.endings.trust;
    } else if (trust >= 40) {
      ending = GameData.endings.late;
    } else {
      ending = GameData.endings.missed;
    }

    this.state.currentEnding = ending;
    this.state.screen = "ending";

    this.notify("endingTrigger", { ending });
  }

  // 获取周五对话
  getFridayDialogue() {
    if (this.state.trust >= 70) return GameData.fridayDialogues.high;
    if (this.state.trust >= 40) return GameData.fridayDialogues.medium;
    return GameData.fridayDialogues.low;
  }

  // 获取公益资源
  getResources() {
    return GameData.resources;
  }

  // 获取角色信息
  getCharacter(id) {
    return GameData.characters[id];
  }

  // 获取信任值描述
  getTrustDescription() {
    const t = this.state.trust;
    if (t >= 80) return { text: "她很信任你", level: "high" };
    if (t >= 60) return { text: "她在慢慢打开心扉", level: "medium-high" };
    if (t >= 40) return { text: "她对你是礼貌的距离", level: "medium" };
    if (t >= 20) return { text: "她有些防备", level: "medium-low" };
    return { text: "她把自己封闭起来了", level: "low" };
  }
}

// 全局游戏实例
const game = new GameEngine();
