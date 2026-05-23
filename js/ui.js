/**
 * ui.js — 界面渲染
 * 负责所有屏幕的渲染和交互
 */

const UI = {
  // 当前显示的内心独白队列
  thoughtQueue: [],

  // 初始化
  init() {
    game.on((event, data) => {
      switch (event) {
        case "reset":
          this.showScreen("title");
          break;
        case "dayStart":
          this.renderDashboard();
          break;
        case "signalShow":
          this.renderSignal(data.signal);
          break;
        case "choiceMade":
          this.renderResponse(data.choice.response);
          break;
        case "thoughtShow":
          this.renderThought();
          break;
        case "backToDashboard":
          this.renderDashboard();
          break;
        case "dayEnd":
          this.renderDaySummary();
          break;
        case "endingTrigger":
          this.renderEnding(data.ending);
          break;
      }
    });

    // 渲染标题页
    this.showScreen("title");
    this.renderTitle();
  },

  // ========== 通用方法 ==========

  showScreen(screenId) {
    const current = document.querySelector(".screen.active:not(.fading-out)");
    const target = document.getElementById(screenId);

    if (!target) return;
    // 同一个屏幕，不切换
    if (current === target) return;

    // 切换函数
    const doSwitch = () => {
      document.querySelectorAll(".screen").forEach(s => {
        s.classList.remove("active", "fading-out");
        s.style.display = "none";
      });
      target.classList.add("active");
      target.style.display = "block";
      target.scrollTop = 0;
    };

    if (current) {
      // 先让当前屏幕 fade-out
      current.classList.add("fading-out");
      setTimeout(doSwitch, 200);
    } else {
      // 首次显示，直接切入
      doSwitch();
    }
  },

  // 格式化文本（换行等）
  formatText(text) {
    return text
      .replace(/\n/g, "<br>")
      .replace(/「([^」]+)」/g, "<em>「$1」</em>");
  },

  // 信号类型视觉配置
  getSignalTypeConfig(type) {
    const configs = {
      homework:  { label: "作业",  icon: "📝", cssKey: "homework",  desc: "作业·周记" },
      classroom: { label: "课堂",  icon: "🏫", cssKey: "classroom", desc: "课堂观察" },
      social:    { label: "转达",  icon: "💬", cssKey: "social",    desc: "转达·群聊" },
      direct:    { label: "来访",  icon: "✉️",  cssKey: "direct",    desc: "直接消息" },
      message:   { label: "消息",  icon: "📱", cssKey: "message",   desc: "主动联系" },
    };
    return configs[type] || { label: "信号", icon: "👁", cssKey: "default", desc: "信号" };
  },

  // 创建角色头像
  createAvatar(charId, size) {
    const char = game.getCharacter(charId);
    if (!char) return `<div class="avatar avatar-system" style="width:${size}px;height:${size}px;">📋</div>`;
    return `<div class="avatar avatar-${charId}" style="width:${size}px;height:${size}px;">${char.avatar}</div>`;
  },

  // ========== 标题页 ==========

  renderTitle() {
    const container = document.getElementById("title-content");
    // 生成浮动粒子
    let particlesHTML = '<div class="title-particles">';
    for (let i = 0; i < 9; i++) {
      const left = 5 + Math.random() * 90;
      const size = 2 + Math.random() * 3;
      const duration = 10 + Math.random() * 14;
      const delay = Math.random() * 10;
      const opacity = (6 + Math.random() * 10) / 100;
      particlesHTML += `<div class="title-particle" style="
        left:${left}%; bottom:-12px;
        width:${size}px; height:${size}px;
        animation: floatUp ${duration}s ${delay}s linear infinite;
        background:rgba(127,119,221,${opacity});
      "></div>`;
    }
    particlesHTML += '</div>';

    container.innerHTML = `
      ${particlesHTML}
      <div class="title-main">
        <svg class="title-eye" width="52" height="36" viewBox="0 0 52 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <clipPath id="eyeClip">
              <path d="M2 18C2 18 10 2 26 2C42 2 50 18 50 18C50 18 42 34 26 34C10 34 2 18 2 18Z"/>
            </clipPath>
          </defs>
          <path d="M2 18C2 18 10 2 26 2C42 2 50 18 50 18C50 18 42 34 26 34C10 34 2 18 2 18Z" stroke="currentColor" stroke-width="1.2" fill="none" opacity="0.85"/>
          <circle cx="26" cy="18" r="5.5" fill="currentColor" class="eye-pupil"/>
          <circle cx="23.5" cy="15.5" r="1.6" fill="#fff" opacity="0.7"/>
        </svg>
        <div class="title-decoration"></div>
        <h1 class="game-title">看见</h1>
        <p class="game-subtitle">一款关于「注意到」的互动叙事游戏</p>
        <p class="game-tagline">每个人都可以成为支持者</p>
        <div class="title-info">
          <p class="title-role">你将扮演一名大学班主任</p>
          <p class="title-desc">在一周的日常工作中，通过作业、课堂、消息等碎片化信号，<br>发现一位正在经历焦虑抑郁的学生。</p>
        </div>
        <button class="btn btn-primary btn-start" onclick="UI.startGame()">开始体验</button>
        <div class="title-links">
          <button class="btn-link" onclick="UI.showGallery()">结局画廊</button>
          <button class="btn-link" onclick="UI.renderTutorial()">新手引导</button>
        </div>
        <p class="title-notice">
          <span class="notice-icon">i</span>
          本游戏涉及心理健康主题，可能引起部分玩家情绪波动。<br>
          如果您正在经历类似的困扰，请寻求专业帮助。
        </p>
      </div>
    `;
  },

  startGame(fromGuide) {
    // 如果是新手引导页面触发，标记完成
    if (fromGuide) {
      this.markTutorialDone();
    }
    // 首次游玩 → 先看新手引导
    if (!this.isTutorialDone()) {
      this.renderTutorial();
      return;
    }
    Audio.fadeOutBGM(1);
    game.reset();
    game.startDay(0);
  },

  // ========== 新手引导 ==========

  tutorialSteps: [
    {
      icon: "🏫",
      title: "你是班主任",
      desc: "你将扮演一名大学班主任。<br>每天面对作业、课堂、消息……<br>在日复一日的日常中，留意那些「不太对劲」的信号。",
      demo: null
    },
    {
      icon: "🔍",
      title: "碎片化的信号",
      desc: "信号来自不同渠道——作业周记、课堂观察、同学转达、私聊消息。<br>你需要从碎片中，拼凑出学生的真实状态。",
      demo: "signals"
    },
    {
      icon: "⚡",
      title: "精力是有限的",
      desc: "每天你只有有限的精力。<br>每个选择都会消耗精力，<br>精力耗尽时，你只能结束今天。",
      demo: "energy"
    },
    {
      icon: "🌉",
      title: "信任是隐形的",
      desc: "你和小晴之间的距离不会直接显示数字，<br>但每一次选择都在悄悄改变它。<br>它最终会决定故事的走向。",
      demo: "trust"
    },
    {
      icon: "💭",
      title: "听见无声",
      desc: "当信任逐渐积累，<br>你会解锁小晴的「内心独白」——<br>那些她说不出口、但渴望被听见的话。",
      demo: "thought"
    },
    {
      icon: "🌟",
      title: "没有标准答案",
      desc: "这不是考试，没有「正确」的选择。<br>跟随你的直觉，<br>每个人都会走出属于自己的故事。",
      demo: null
    }
  ],

  // 当前引导步骤
  tutorialStep: 0,

  isTutorialDone() {
    try {
      return localStorage.getItem("kanjian_tutorial_done") === "1";
    } catch (e) { return false; }
  },

  markTutorialDone() {
    try {
      localStorage.setItem("kanjian_tutorial_done", "1");
    } catch (e) { /* 静默 */ }
  },

  renderTutorial() {
    this.tutorialStep = 0;
    this.showScreen("tutorial");
    this._renderTutorialStep();
  },

  _renderTutorialStep() {
    const container = document.getElementById("tutorial-content");
    const step = this.tutorialSteps[this.tutorialStep];
    const total = this.tutorialSteps.length;

    // 进度圆点
    let dots = "";
    for (let i = 0; i < total; i++) {
      let cls = "";
      if (i < this.tutorialStep) cls = "done";
      else if (i === this.tutorialStep) cls = "active";
      dots += `<div class="tutorial-dot ${cls}"></div>`;
    }

    // 演示内容
    let demoHTML = "";
    if (step.demo === "signals") {
      demoHTML = `
        <div class="tutorial-demo">
          <div class="tutorial-signal-demo">
            <div class="tutorial-mini-signal s1">
              <span class="ms-icon">📝</span>
              <span class="ms-label">小晴的周记比平时短了很多</span>
            </div>
            <div class="tutorial-mini-signal s2">
              <span class="ms-icon">💬</span>
              <span class="ms-label">室友说她最近总是一个人去食堂</span>
            </div>
            <div class="tutorial-mini-signal s3">
              <span class="ms-icon">🏫</span>
              <span class="ms-label">上课时她一直低着头</span>
            </div>
          </div>
        </div>`;
    } else if (step.demo === "energy") {
      demoHTML = `
        <div class="tutorial-demo">
          <div class="tutorial-energy-bar">
            <span class="bar-label">精力</span>
            <div class="bar-track">
              <div class="bar-fill" style="width:65%"></div>
            </div>
            <span class="bar-value">65</span>
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text-hint);text-align:center;">每个选择消耗 5~20 精力</div>
        </div>`;
    } else if (step.demo === "trust") {
      demoHTML = `
        <div class="tutorial-demo">
          <div class="tutorial-trust-demo">
            <div class="tt-person tt-you">你</div>
            <div class="tt-line"></div>
            <div class="tt-person tt-student">晴</div>
          </div>
          <div style="margin-top:8px;font-size:11px;color:var(--text-hint);text-align:center;">信任在每一次互动中悄悄变化</div>
        </div>`;
    } else if (step.demo === "thought") {
      demoHTML = `
        <div class="tutorial-demo">
          <div class="tutorial-thought-demo">
            <div class="tt-icon">💭</div>
            <div class="tt-label">小晴的内心</div>
            <div class="tt-text">"我只是希望……有人能注意到我。"</div>
          </div>
        </div>`;
    }

    // 操作按钮
    const isFirst = this.tutorialStep === 0;
    const isLast = this.tutorialStep === total - 1;

    let actionsHTML = "";
    if (isLast) {
      actionsHTML = `
        <button class="btn btn-primary" onclick="UI.completeTutorial()">开始体验</button>
        <button class="btn-ghost" onclick="UI.prevTutorialStep()">上一步</button>`;
    } else if (isFirst) {
      actionsHTML = `
        <button class="btn btn-primary" onclick="UI.nextTutorialStep()">继续</button>
        <button class="btn-ghost" onclick="UI.skipTutorial()">跳过引导，直接开始</button>`;
    } else {
      actionsHTML = `
        <div class="tutorial-actions-row">
          <button class="btn btn-secondary" onclick="UI.prevTutorialStep()">上一步</button>
          <button class="btn btn-primary" onclick="UI.nextTutorialStep()">继续</button>
        </div>
        <button class="btn-ghost" onclick="UI.skipTutorial()">跳过引导</button>`;
    }

    container.innerHTML = `
      <div class="tutorial-container">
        <div class="tutorial-progress">${dots}</div>
        <div class="tutorial-step">
          <span class="tutorial-icon">${step.icon}</span>
          <div class="tutorial-step-title">${step.title}</div>
          <div class="tutorial-step-desc">${step.desc}</div>
          ${demoHTML}
          <div class="tutorial-actions">${actionsHTML}</div>
        </div>
      </div>
    `;
  },

  nextTutorialStep() {
    if (this.tutorialStep < this.tutorialSteps.length - 1) {
      this.tutorialStep++;
      this._renderTutorialStep();
    }
  },

  prevTutorialStep() {
    if (this.tutorialStep > 0) {
      this.tutorialStep--;
      this._renderTutorialStep();
    }
  },

  skipTutorial() {
    this.markTutorialDone();
    Audio.fadeOutBGM(1);
    game.reset();
    game.startDay(0);
  },

  completeTutorial() {
    this.markTutorialDone();
    Audio.fadeOutBGM(1);
    game.reset();
    game.startDay(0);
  },

  // ========== 工作台 ==========

  renderDashboard() {
    this.showScreen("dashboard");
    const day = game.getCurrentDay();
    if (!day) return;

    const pendingSignals = game.getPendingSignals();
    const trustDesc = game.getTrustDescription();
    const container = document.getElementById("dashboard-content");
    if (!container) return;
    container.innerHTML = `
      <div class="dashboard-header">
        <div class="day-badge" style="background:${day.color}">${day.name}</div>
        <div class="day-theme">${day.theme}</div>
        <div class="energy-bar-container">
          <span class="energy-label">精力</span>
          <div class="energy-bar">
            <div class="energy-fill" style="width:${game.state.energy}%"></div>
          </div>
          <span class="energy-value">${game.state.energy}</span>
        </div>
        <div class="trust-mini" title="你和小晴之间的距离">
          <span class="trust-char left">你</span>
          <div class="trust-gap" style="flex:${100 - game.state.trust}"></div>
          <span class="trust-char right">晴</span>
        </div>
      </div>

      <div class="dashboard-body">
        <div class="todo-section">
          <h3 class="section-title">今日待办</h3>
          <div class="todo-list">
            ${day.todoItems.map(item => `
              <div class="todo-item">
                <span class="todo-text">${item.text}</span>
                <span class="todo-cost">-${item.energyCost}精力</span>
              </div>
            `).join("")}
          </div>
        </div>

        <div class="signals-section">
          <h3 class="section-title">
            信号
            ${pendingSignals.length > 0 ? `<span class="signal-badge">${pendingSignals.length}</span>` : '<span class="signal-badge done">已处理</span>'}
          </h3>
          <div class="signal-list">
            ${pendingSignals.length > 0 ? pendingSignals.map(signal => {
              const tc = this.getSignalTypeConfig(signal.type);
              return `
              <div class="signal-card signal-type-${tc.cssKey} ${signal.isObvious ? 'signal-obvious' : 'signal-subtle'}" onclick="UI.onSignalClick('${signal.id}')">
                <div class="signal-card-header">
                  <span class="signal-avatar">${signal.sourceAvatar}</span>
                  <span class="signal-source">${signal.sourceName}</span>
                  <span class="signal-type-tag signal-type-tag--${tc.cssKey}">${tc.icon} ${tc.label}</span>
                </div>
                <div class="signal-card-title">${signal.title}</div>
                <div class="signal-card-energy">消耗 ${signal.energyCost} 精力</div>
              </div>`;
            }).join("") : `
              <div class="signal-empty">
                <p>今天的信号都处理完了</p>
                ${day.id < 5 ? `<button class="btn btn-secondary" onclick="UI.endDay()">结束今天</button>` : ''}
              </div>
            `}
          </div>
        </div>
      </div>
    `;

    // 如果是最后一天且信号全部处理完毕，显示结束按钮
    if (day.id === 5 && pendingSignals.length === 0) {
      const signalsSection = container.querySelector(".signal-empty");
      if (signalsSection) {
        signalsSection.innerHTML = `
          <p>今天的信号都处理完了</p>
          <button class="btn btn-primary" onclick="UI.triggerFridayEnding()">回顾这一周</button>
        `;
      }
    }
  },

  endDay() {
    game.state.screen = "daySummary";
    this.renderDaySummary();
  },

  triggerFridayEnding() {
    game.triggerEnding();
  },

  // ========== 信号详情 ==========

  onSignalClick(signalId) {
    game.showSignal(signalId);
  },

  renderSignal(signal) {
    this.showScreen("signal");
    Audio.playSignal();
    const container = document.getElementById("signal-content");
    const tc = this.getSignalTypeConfig(signal.type);

    container.innerHTML = `
      <div class="signal-detail signal-detail--${tc.cssKey}">
        <div class="signal-detail-header">
          <span class="signal-detail-avatar">${signal.sourceAvatar}</span>
          <div class="signal-detail-meta">
            <span class="signal-detail-source">${signal.sourceName}</span>
            <span class="signal-type-tag signal-type-tag--${tc.cssKey}">${tc.icon} ${tc.label}</span>
          </div>
        </div>
        <h2 class="signal-detail-title">${signal.title}</h2>
        <div class="signal-detail-body">
          <p class="signal-description">${this.formatText(signal.description)}</p>
        </div>
        ${game.state.energy < Math.min(...signal.choices.map(c => c.energyCost)) ? `
          <div class="energy-warning">
            <span class="energy-warning-icon">!</span>
            <span>精力不足，无法做出任何选择。你太累了，需要先结束今天。</span>
          </div>
        ` : ''}
        <div class="signal-choices">
          ${signal.choices.map(choice => `
            <button class="btn btn-choice ${game.state.energy < choice.energyCost ? 'btn-disabled' : ''}"
                    onclick="UI.onChoice('${signal.id}', '${choice.id}')"
                    ${game.state.energy < choice.energyCost ? 'disabled' : ''}>
              <span class="choice-text">${choice.text}</span>
              <span class="choice-cost">-${choice.energyCost}精力 ${game.state.energy < choice.energyCost ? '(精力不足)' : ''}</span>
            </button>
          `).join("")}
        </div>
      </div>
    `;

    // 添加淡入动画
    container.querySelector(".signal-detail").classList.add("fade-in");
  },

  // ========== 响应展示 ==========

  onChoice(signalId, choiceId) {
    game.makeChoice(signalId, choiceId);
  },

  renderResponse(response) {
    this.showScreen("response");
    Audio.playChoice();
    const container = document.getElementById("response-content");

    let sourceHtml = "";
    if (response.source === "system") {
      sourceHtml = `
        <div class="response-message response-system">
          <div class="response-avatar">${"📋"}</div>
          <div class="response-bubble">
            <p>${this.formatText(response.text)}</p>
          </div>
        </div>
      `;
    } else if (response.source === "self") {
      sourceHtml = `
        <div class="response-message response-self">
          <div class="response-bubble">
            <p>${this.formatText(response.text)}</p>
          </div>
        </div>
      `;
    } else {
      const char = game.getCharacter(response.source);
      sourceHtml = `
        <div class="response-message response-other">
          <div class="response-avatar">${char ? char.avatar : "💬"}</div>
          <div class="response-bubble">
            <div class="response-name">${char ? char.name : "未知"}</div>
            <p>${this.formatText(response.text)}</p>
          </div>
        </div>
      `;
    }

    const hasThought = game.hasNewThought();

    container.innerHTML = `
      <div class="response-container">
        ${sourceHtml}
        <div class="response-status">
          <div class="trust-indicator">
            <span class="trust-label">信任值</span>
            <div class="trust-bar-mini">
              <div class="trust-fill-mini" style="width:${game.state.trust}%"></div>
            </div>
            <span class="trust-text">${game.getTrustDescription().text}</span>
          </div>
        </div>
        <button class="btn btn-primary" onclick="UI.dismissResponse()">
          ${hasThought ? "继续..." : (game.getPendingSignals().length > 0 ? "返回工作台" : "结束今天")}
        </button>
      </div>
    `;

    // 添加消息淡入动画
    setTimeout(() => {
      container.querySelector(".response-message")?.classList.add("fade-in");
    }, 100);
  },

  dismissResponse() {
    game.dismissResponse();
  },

  // ========== 内心独白 ==========

  renderThought() {
    this.showScreen("thought");
    Audio.playThought();
    const thought = game.getLatestThought();
    if (!thought) return;

    const container = document.getElementById("thought-content");
    container.innerHTML = `
      <div class="thought-container">
        <div class="thought-label">小晴的内心</div>
        <div class="thought-divider"></div>
        <div class="thought-text">
          <p>${this.formatText(thought.text)}</p>
        </div>
        <div class="thought-divider"></div>
        <p class="thought-hint">这是她想说出、但没有说出口的话。</p>
        <button class="btn btn-secondary" onclick="UI.dismissThought()">
          ${game.getPendingSignals().length > 0 ? "返回工作台" : "结束今天"}
        </button>
      </div>
    `;

    // 添加淡入动画
    setTimeout(() => {
      container.querySelector(".thought-container").classList.add("fade-in");
    }, 200);
  },

  dismissThought() {
    game.dismissThought();
  },

  // ========== 日终总结 ==========

  renderDaySummary() {
    this.showScreen("daySummary");
    Audio.playDayEnd();
    const day = game.getCurrentDay();
    const container = document.getElementById("summary-content");

    // 获取当天的选择记录
    const dayChoices = game.state.choicesMade.filter(c => c.day === game.state.day);
    const dayThoughts = game.state.innerThoughtsUnlocked
      .map(id => GameData.innerThoughts[id])
      .filter(t => t && t.day === game.state.day);

    // 构建当日选择回顾
    const choicesReviewHtml = dayChoices.length > 0 ? `
      <div class="summary-choices">
        <div class="summary-label">今天的行动回顾</div>
        <div class="choices-list">
          ${dayChoices.map(c => {
            const sig = GameData.signals[c.signalId];
            const ch = sig ? sig.choices.find(x => x.id === c.choiceId) : null;
            return `
              <div class="choice-review-item">
                <div class="choice-review-signal">${sig ? sig.title : c.signalId}</div>
                <div class="choice-review-action">${ch ? ch.text : c.choiceId}</div>
                ${ch && ch.overApproach ? '<div class="choice-review-tag">⚠ 可能过度</div>' : ''}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    ` : '';

    container.innerHTML = `
      <div class="summary-container">
        <div class="summary-header">
          <div class="summary-day" style="color:${day.color}">${day.name} · 结束</div>
          <p class="summary-theme">"${day.theme}"</p>
        </div>

        <div class="summary-body">

          ${choicesReviewHtml}

          <div class="summary-trust">
            <div class="summary-label">你和小晴之间的距离</div>
            <div class="trust-visual">
              <div class="trust-visual-char" style="left:${Math.max(5, 100 - game.state.trust) / 2}%">
                <span class="tv-avatar">你</span>
                <span class="tv-label">你</span>
              </div>
              <div class="trust-visual-char" style="left:${Math.min(95, 100 - (100 - game.state.trust) / 2)}%">
                <span class="tv-avatar student">晴</span>
                <span class="tv-label">小晴</span>
              </div>
              <div class="trust-visual-line">
                <div class="trust-visual-fill" style="width:${game.state.trust}%"></div>
              </div>
            </div>
            <p class="trust-status">${game.getTrustDescription().text}</p>
          </div>

          ${dayThoughts.length > 0 ? `
            <div class="summary-thoughts">
              <div class="summary-label">今天解锁了她的内心独白</div>
              <div class="thought-preview">${dayThoughts.length} 条</div>
            </div>
          ` : ''}

          <div class="summary-reflection">
            <p class="reflection-text">
              ${game.state.day < 5
                ? `第${game.state.day}天过去了。你做出了一些选择，也错过了一些东西。<br>明天又是新的一天。`
                : `这一周结束了。你做出的每一个选择，都悄悄改变了什么。`}
            </p>
          </div>
        </div>

        <div class="summary-footer">
          ${game.state.day < 5
            ? `<button class="btn btn-primary" onclick="UI.goNextDay()">进入${GameData.days[game.state.day]?.name || "下一天"}</button>`
            : `<button class="btn btn-primary" onclick="UI.triggerFridayEnding()">回顾这一周</button>`}
        </div>
      </div>
    `;

    // 信任值动画
    setTimeout(() => {
      const fill = container.querySelector(".trust-fill-large");
      if (fill) fill.classList.add("animate");
    }, 300);
  },

  goNextDay() {
    game.nextDay();
  },

  // ========== 结局 ==========

  // 结局主题配置
  _getEndingTheme(theme) {
    const themes = {
      trust:  { emblem: "✦", playerBubbleClass: "" },
      late:   { emblem: "◑", playerBubbleClass: "" },
      missed: { emblem: "○", playerBubbleClass: "" },
      over:   { emblem: "◈", playerBubbleClass: "" },
    };
    return themes[theme] || { emblem: "●", playerBubbleClass: "" };
  },

  renderEnding(ending) {
    this.showScreen("ending");
    Audio.startEndingBGM();
    this.saveEnding(ending.id);

    // 注入主题 class 到 #ending 屏幕容器，驱动背景渐变
    const endingScreen = document.getElementById("ending");
    endingScreen.className = endingScreen.className
      .replace(/ending-theme-\w+/g, "").trim();
    if (ending.theme) {
      endingScreen.classList.add("ending-theme-" + ending.theme);
    }

    const container = document.getElementById("ending-content");
    const themeConf = this._getEndingTheme(ending.theme);

    // 获取对话序列
    const dialogue = game.getFridayDialogue();
    let dialogueHtml = dialogue.map(d => {
      if (d.speaker === "system") {
        return `<div class="dialogue-system"><p>${this.formatText(d.text)}</p></div>`;
      } else if (d.speaker === "player") {
        return `<div class="dialogue-player"><p>${this.formatText(d.text)}</p></div>`;
      } else {
        const char = game.getCharacter(d.speaker);
        return `
          <div class="dialogue-other">
            <span class="dialogue-avatar">${char ? char.avatar : ""}</span>
            <span class="dialogue-name">${char ? char.name : ""}</span>
            <p>${this.formatText(d.text)}</p>
          </div>
        `;
      }
    }).join("");

    container.innerHTML = `
      <div class="ending-container ending-theme-${ending.theme || ''}">
        <div class="ending-header fade-in">
          <span class="ending-emblem">${themeConf.emblem}</span>
          <div class="ending-name">${ending.name}</div>
          <div class="ending-subtitle">${ending.subtitle}</div>
        </div>

        <button class="btn-skip-anim" onclick="UI.skipEndingAnim()">跳过动画 →</button>

        <div class="ending-dialogue">
          ${dialogueHtml}
        </div>

        <div class="ending-epilogue">
          <div class="epilogue-divider"></div>
          <p class="epilogue-text">${this.formatText(ending.epilogue)}</p>
        </div>

        <div class="ending-lesson">
          <div class="lesson-icon">i</div>
          <p class="lesson-text">${this.formatText(ending.lesson)}</p>
        </div>

        <div class="ending-footer">
          <button class="btn-share" onclick="UI.shareEnding()">分享感悟 💡</button>
          <button class="btn btn-secondary" onclick="Audio.fadeOutBGM(0.5);UI.showResources()">心理援助资源</button>
          <button class="btn btn-primary" onclick="Audio.stopBGM();UI.showScreen('title');UI.renderTitle();">重新开始</button>
        </div>
      </div>
    `;

    // 逐条淡入对话（可跳过）
    this._endingTimers = [];
    const endings = container.querySelectorAll(".ending-dialogue > div, .ending-epilogue, .ending-lesson, .ending-footer");
    const dialogueCount = container.querySelectorAll(".ending-dialogue > div").length;

    // 对话逐条 fade-in
    const dialogues = container.querySelectorAll(".ending-dialogue > div");
    dialogues.forEach((d, i) => {
      d.style.opacity = "0";
      const t = setTimeout(() => {
        d.style.transition = "opacity 0.5s ease";
        d.style.opacity = "1";
      }, 300 + i * 600);
      this._endingTimers.push(t);
    });

    // epilogue, lesson, footer 逐块出现
    const epilogue = container.querySelector(".ending-epilogue");
    const lesson = container.querySelector(".ending-lesson");
    const footer = container.querySelector(".ending-footer");
    const baseDelay = 300 + dialogueCount * 600;

    [epilogue, lesson, footer].forEach((el, i) => {
      if (!el) return;
      el.style.opacity = "0";
      const t = setTimeout(() => {
        el.style.transition = "opacity 0.6s ease";
        el.style.opacity = "1";
      }, baseDelay + (i + 1) * 400);
      this._endingTimers.push(t);
    });
  },

  skipEndingAnim() {
    // 清除所有待执行的定时器
    (this._endingTimers || []).forEach(t => clearTimeout(t));
    this._endingTimers = [];
    // 立即显示所有隐藏内容
    const container = document.getElementById("ending-content");
    if (!container) return;
    container.querySelectorAll(".ending-dialogue > div, .ending-epilogue, .ending-lesson, .ending-footer").forEach(el => {
      el.style.transition = "none";
      el.style.opacity = "1";
    });
    // 隐藏跳过按钮
    const skipBtn = container.querySelector(".btn-skip-anim");
    if (skipBtn) skipBtn.style.display = "none";
  },

  // ========== 分享结局感悟 ==========
  shareEnding() {
    const ending = game.state.currentEnding;
    if (!ending) return;

    const shareText = ending.shareText
      ? ending.shareText.replace(/\\n/g, "\n")
      : `我在《看见》游戏里，收获了一个关于「看见」的故事。\n\n——每个人都可以成为支持者。`;

    const pageUrl = window.location.href;

    // 尝试使用 Web Share API（移动端）
    if (navigator.share) {
      navigator.share({
        title: "看见 — 游戏感悟",
        text: shareText,
        url: pageUrl
      }).catch(() => {
        // 用户取消分享，静默处理
      });
      return;
    }

    // 桌面端：复制到剪贴板
    const fullText = shareText + "\n\n来玩《看见》：" + pageUrl;
    navigator.clipboard.writeText(fullText).then(() => {
      this.showShareToast("已复制到剪贴板，可以粘贴分享 📋");
    }).catch(() => {
      // fallback：用 textarea 选中复制
      const ta = document.createElement("textarea");
      ta.value = fullText;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      this.showShareToast("已复制到剪贴板，可以粘贴分享 📋");
    });
  },

  showShareToast(msg) {
    let toast = document.getElementById("share-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "share-toast";
      toast.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: #323232;
        color: #fff;
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 13px;
        font-family: "PingFang SC", "Microsoft YaHei", sans-serif;
        z-index: 9999;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: none;
      `;
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.style.opacity = "1";
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.style.opacity = "0";
    }, 2500);
  },

  // ========== 结局画廊 ==========

  saveEnding(endingId) {
    try {
      let endings = JSON.parse(localStorage.getItem("kanjian_endings") || "[]");
      if (!endings.includes(endingId)) {
        endings.push(endingId);
        localStorage.setItem("kanjian_endings", JSON.stringify(endings));
      }
    } catch (e) {
      // localStorage 不可用时静默失败
    }
  },

  getUnlockedEndings() {
    try {
      return JSON.parse(localStorage.getItem("kanjian_endings") || "[]");
    } catch (e) {
      return [];
    }
  },

  showGallery() {
    this.showScreen("gallery");
    this.renderGallery();
  },

  renderGallery() {
    const container = document.getElementById("gallery-content");
    const unlocked = this.getUnlockedEndings();
    const total = 4;

    // 结局列表（按展示顺序）
    const endingList = [
      { key: "trust", hint: "当你真正被信任时……" },
      { key: "late", hint: "迟到，总比没有好" },
      { key: "missed", hint: "那些擦肩而过的瞬间" },
      { key: "over", hint: "关心也需要恰到好处" }
    ];

    const cards = endingList.map(item => {
      const ending = GameData.endings[item.key];
      const isUnlocked = unlocked.includes(ending.id);

      if (isUnlocked) {
        return `
          <div class="gallery-card gallery-card--unlocked" style="--card-color: ${this._getEndingColor(item.key)}">
            <div class="gallery-card-badge">✓ 已解锁</div>
            <div class="gallery-card-name">${ending.name}</div>
            <div class="gallery-card-subtitle">${ending.subtitle}</div>
            <div class="gallery-card-desc">${this.formatText(ending.epilogue.substring(0, 60))}...</div>
          </div>
        `;
      } else {
        return `
          <div class="gallery-card gallery-card--locked">
            <div class="gallery-card-lock">🔒</div>
            <div class="gallery-card-name">????</div>
            <div class="gallery-card-hint">${item.hint}</div>
          </div>
        `;
      }
    }).join("");

    container.innerHTML = `
      <div class="gallery-container">
        <div class="gallery-header">
          <div class="gallery-title">结局画廊</div>
          <div class="gallery-progress">已解锁 ${unlocked.length} / ${total}</div>
        </div>
        <div class="gallery-grid">
          ${cards}
        </div>
        ${unlocked.length === total ? `
          <div class="gallery-complete">
            <span class="gallery-complete-icon">✨</span>
            <span>全部结局已解锁！感谢你用心陪伴小晴的每一段旅程。</span>
          </div>
        ` : ''}
        <button class="btn btn-secondary" onclick="UI.showScreen('title');UI.renderTitle();">返回首页</button>
      </div>
    `;
  },

  _getEndingColor(key) {
    const colors = {
      trust: "#534AB7",
      late: "#E8A838",
      missed: "#6B7B8D",
      over: "#C44D4D"
    };
    return colors[key] || "#888";
  },

  // ========== 公益资源页 ==========

  showResources() {
    this.showScreen("resources");
    const container = document.getElementById("resources-content");
    const r = game.getResources();

    const renderTips = (section) => `
      <div class="resource-section">
        <div class="resource-section-title">${section.title}</div>
        <div class="resource-tips">
          ${section.tips.map(t => `<div class="resource-tip">${this.formatText(t)}</div>`).join("")}
        </div>
      </div>
    `;

    container.innerHTML = `
      <div class="resources-container">
        <div class="resources-header">
          <h2>心理援助资源</h2>
          <p>如果你或你身边的人正在经历心理困扰，请记住——寻求帮助不是软弱，是勇气。</p>
        </div>

        <div class="resource-block">
          <div class="resource-block-title">紧急热线</div>
          <div class="resource-hotlines">
            ${r.hotlines.map(h => `
              <div class="resource-item">
                <div class="resource-name">${h.name}</div>
                <div class="resource-phone">${h.phone}</div>
                <div class="resource-available">${h.available}</div>
              </div>
            `).join("")}
          </div>
        </div>

        ${renderTips(r.howToSupport)}
        ${renderTips(r.forTeachers)}
        ${renderTips(r.forParents)}
        ${renderTips(r.selfHelp)}

        <div class="resource-footer">
          <p class="resource-footer-text">你不需要成为专家。一句「我注意到你了」，就可能是某个人这一周里最重要的一句话。</p>
        </div>

        <button class="btn btn-secondary" onclick="if(game.state.currentEnding){UI.showScreen('ending');UI.renderEnding(game.state.currentEnding)}else{UI.showScreen('title');UI.renderTitle()}">返回</button>
      </div>
    `;
  }
};

// 页面加载后初始化
document.addEventListener("DOMContentLoaded", () => {
  UI.init();
});
