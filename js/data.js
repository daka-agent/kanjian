/**
 * data.js — 剧情数据
 * 包含信号、选择、内心独白、结局等全部叙事内容
 */

const GameData = {

  // ========== 角色信息 ==========
  characters: {
    player: {
      name: "你",
      role: "班主任",
      avatar: "👩‍🏫"
    },
    xiaoqing: {
      name: "林小晴",
      role: "学生",
      avatar: "👧",
      desc: "大二女生，成绩中上，性格温和安静"
    },
    xiaozhang: {
      name: "小张",
      role: "小晴室友",
      avatar: "👩",
      desc: "活泼开朗，和小晴关系不错"
    },
    counselor: {
      name: "王老师",
      role: "辅导员",
      avatar: "🧑‍💼",
      desc: "负责学生工作的辅导员"
    }
  },

  // ========== 每日配置 ==========
  days: [
    {
      id: 1,
      name: "周一",
      theme: "好像哪里不对",
      color: "#378ADD",
      energy: 100,
      todoItems: [
        { text: `批改全班作业`, done: false, energyCost: 20 },
        { text: `下午2:00 教研会`, done: false, energyCost: 15 },
        { text: `回复家长群消息`, done: false, energyCost: 10 },
        { text: `准备下周课件`, done: false, energyCost: 20 }
      ],
      signals: ["signal_1_1", "signal_1_2", "signal_1_3"]
    },
    {
      id: 2,
      name: "周二",
      theme: "她在躲什么",
      color: "#378ADD",
      energy: 100,
      todoItems: [
        { text: `上午第1-2节课`, done: false, energyCost: 25 },
        { text: `批改实验报告`, done: false, energyCost: 20 },
        { text: `学生评优材料审核`, done: false, energyCost: 15 },
        { text: `学院例会`, done: false, energyCost: 15 }
      ],
      signals: ["signal_2_1", "signal_2_2", "signal_2_3"]
    },
    {
      id: 3,
      name: "周三",
      theme: "那些没说出口的",
      color: "#7F77DD",
      energy: 100,
      todoItems: [
        { text: `上午答疑课`, done: false, energyCost: 20 },
        { text: `审阅毕业论文初稿`, done: false, energyCost: 25 },
        { text: `联系实习基地`, done: false, energyCost: 15 },
        { text: `整理教学材料`, done: false, energyCost: 10 }
      ],
      signals: ["signal_3_1", "signal_3_2", "signal_3_3"]
    },
    {
      id: 4,
      name: "周四",
      theme: "我能做什么",
      color: "#7F77DD",
      energy: 100,
      todoItems: [
        { text: `上午课程`, done: false, energyCost: 25 },
        { text: `课题组讨论`, done: false, energyCost: 20 },
        { text: `处理学生请假`, done: false, energyCost: 10 },
        { text: `备课`, done: false, energyCost: 15 }
      ],
      signals: ["signal_4_0", "signal_4_1", "signal_4_2", "signal_4_3"]
    },
    {
      id: 5,
      name: "周五",
      theme: "在你身边",
      color: "#534AB7",
      energy: 100,
      todoItems: [
        { text: `最后一节课`, done: false, energyCost: 25 },
        { text: `整理本周事务`, done: false, energyCost: 15 },
        { text: `周末前的收尾工作`, done: false, energyCost: 10 }
      ],
      signals: ["signal_5_0", "signal_5_1"]
    }
  ],

  // ========== 全部信号 ==========
  signals: {
    // ---- 周一信号 ----
    "signal_1_1": {
      id: "signal_1_1",
      day: 1,
      type: "homework",
      source: "system",
      sourceName: "作业系统",
      sourceAvatar: "📋",
      title: "未提交的作业",
      isObvious: true,
      energyCost: 10,
      description: `周一作业提交截止已过。全班38人已交37份，有一份未提交——林小晴。`,
      choices: [
        {
          id: "c1_1_a",
          text: `发消息问问她怎么回事`,
          trustImpact: 8,
          energyCost: 10,
          response: {
            source: "xiaoqing",
            text: `老师对不起！我昨天太累了忘记交了，我现在马上补上。\n\n（回复很快，语气看起来一切正常。但你觉得……好像有什么地方不对。）`,
            unlockThought: "thought_1_1"
          }
        },
        {
          id: "c1_1_b",
          text: `标记一下，下次课提醒她`,
          trustImpact: -3,
          energyCost: 5,
          response: {
            source: "system",
            text: `你把这个任务记在了待办里。\n\n——但这周事情太多了，到了下次课的时候，你好像又忘了这件事。`,
            unlockThought: null
          }
        },
        {
          id: "c1_1_c",
          text: `算了吧，偶尔一次很正常`,
          trustImpact: -5,
          energyCost: 0,
          response: {
            source: "system",
            text: `确实，偶尔忘交一次作业不算什么大事。\n\n你继续处理其他事务。`,
            unlockThought: null
          }
        }
      ]
    },

    "signal_1_2": {
      id: "signal_1_2",
      day: 1,
      type: "classroom",
      source: "self",
      sourceName: "课堂观察",
      sourceAvatar: "👀",
      title: "一个走神的瞬间",
      isObvious: false,
      energyCost: 5,
      description: `下午的课上，你讲到一个知识点时扫了一眼教室。大部分同学都在记笔记，但林小晴——她盯着窗外，手里的笔停了很久。\n\n你注意到她的眼睛有点红。`,
      choices: [
        {
          id: "c1_2_a",
          text: `课后找她聊聊`,
          trustImpact: 10,
          energyCost: 15,
          response: {
            source: "xiaoqing",
            text: `（课后）\n\n"老师好！"\n\n她笑了一下，很正常的那种笑。但笑得太快了——像是已经练习过无数次。\n\n"那个……老师有什么事吗？"`,
            unlockThought: null
          }
        },
        {
          id: "c1_2_b",
          text: `记在心里，继续观察`,
          trustImpact: 3,
          energyCost: 5,
          response: {
            source: "self",
            text: `你没有立刻做什么。但这个画面留在了你心里——\n\n一个女孩盯着窗外，眼睛有点红。\n\n也许只是没睡好吧。`,
            unlockThought: null
          }
        },
        {
          id: "c1_2_c",
          text: `没有多想，继续讲课`,
          trustImpact: -2,
          energyCost: 0,
          response: {
            source: "system",
            text: `你的目光从她身上移开了。\n\n课继续上。日子继续过。`,
            unlockThought: null
          }
        }
      ]
    },

    "signal_1_3": {
      id: "signal_1_3",
      day: 1,
      type: "social",
      source: "xiaozhang",
      sourceName: "小张",
      sourceAvatar: "👩",
      title: "群里的日常",
      isObvious: false,
      energyCost: 5,
      description: `班群里，小张发了一张周末聚餐的照片。你注意到——林小晴不在照片里。\n\n你翻了翻，她最近几周都没怎么在群里说话了。`,
      choices: [
        {
          id: "c1_3_a",
          text: `在小张的朋友圈下随口问一句`,
          trustImpact: 5,
          energyCost: 5,
          response: {
            source: "xiaozhang",
            text: `"老师好！哈哈小晴说有点累就没来～"\n\n小张的语气很轻松。你不知道该不该继续追问。`,
            unlockThought: null
          }
        },
        {
          id: "c1_3_b",
          text: `不问，每个人都有不想参加的时候`,
          trustImpact: -2,
          energyCost: 0,
          response: {
            source: "system",
            text: `你划过了这条朋友圈。\n\n年轻人有自己的社交节奏，不一定每次都参加。`,
            unlockThought: null
          }
        },
        {
          id: "c1_3_c",
          text: `给林小晴发条消息：周末过得怎么样？`,
          trustImpact: 6,
          energyCost: 8,
          response: {
            source: "xiaoqing",
            text: `（过了一会儿）\n\n"挺好的老师 😊"\n\n——就三个字。但你注意到她用了那个表情包。和上次一样。\n\n你忽然想——她用表情包，也许不是因为想表达什么情绪。而是因为不用表情包的话，她不知道该怎么回答。`,
            unlockThought: null
          }
        }
      ]
    },

    // ---- 周二信号 ----
    "signal_2_1": {
      id: "signal_2_1",
      day: 2,
      type: "direct",
      source: "xiaozhang",
      sourceName: "小张",
      sourceAvatar: "👩",
      title: "一条私聊消息",
      isObvious: true,
      energyCost: 10,
      description: `晚上9点多，你收到小张的私聊：\n\n"老师，不好意思打扰您了。就是……小晴最近真的怪怪的，她已经好几天没出宿舍了，每天就躺着，饭也是我们帮她带的。我们劝她她就说没事……我怕她……"\n\n小张的消息停在"我怕她"后面，没有说完。`,
      choices: [
        {
          id: "c2_1_a",
          text: `谢谢小张，我会关注。你做得很好。`,
          trustImpact: 10,
          energyCost: 10,
          response: {
            source: "xiaozhang",
            text: `"嗯！谢谢老师！"\n\n你能感觉到小张松了一口气。\n\n——有个朋友在旁边看着她，这很重要。但接下来，该你做了。`,
            unlockThought: "thought_2_1"
          }
        },
        {
          id: "c2_1_b",
          text: `她可能是最近压力大，你们多关心一下`,
          trustImpact: 0,
          energyCost: 5,
          response: {
            source: "xiaozhang",
            text: `"好的老师……"\n\n小张没有再说什么。但你觉得她的回复比之前慢了很多。\n\n她本来是想让你做点什么的吧。`,
            unlockThought: null
          }
        },
        {
          id: "c2_1_c",
          text: `谢谢你告诉我。这几天别刻意问她，就正常陪着她，有情况随时跟我说`,
          trustImpact: 5,
          energyCost: 5,
          response: {
            source: "xiaozhang",
            text: `"嗯好！老师我知道了。"\n\n小张回得很快。你感觉到她其实一直在等你的回复。\n\n——你给了她一个方向：不刻意，但也不走开。\n\n有时候，陪伴者自己也需要被引导。`,
            unlockThought: null
          }
        }
      ]
    },

    "signal_2_2": {
      id: "signal_2_2",
      day: 2,
      type: "direct",
      source: "xiaoqing",
      sourceName: "林小晴",
      sourceAvatar: "👧",
      title: "一条撤回的消息",
      isObvious: false,
      energyCost: 5,
      description: `你正准备关掉手机，看到林小晴给你发了一条消息。\n\n但你还没来得及点开，消息就消失了——她撤回了。\n\n消息预览只剩几个字："老师，我……"`,
      choices: [
        {
          id: "c2_2_a",
          text: `主动问她：小晴，怎么了？`,
          trustImpact: 12,
          energyCost: 10,
          overApproach: true,
          response: {
            source: "xiaoqing",
            text: `（过了很久才回复）\n\n"没什么老师，发错了 😅"\n\n——她用了一个表情包。你觉得那个表情比文字说的少了很多。`,
            unlockThought: null
          }
        },
        {
          id: "c2_2_b",
          text: `等她自己再发吧`,
          trustImpact: -5,
          energyCost: 0,
          response: {
            source: "system",
            text: `你等了一会儿。手机再没有新消息。\n\n那个撤回的"老师，我……"一直停在你的消息列表里。\n\n你不知道她本来想说什么。`,
            unlockThought: null
          }
        },
        {
          id: "c2_2_c",
          text: `回一个表情包，不要太正式`,
          trustImpact: 3,
          energyCost: 2,
          response: {
            source: "xiaoqing",
            text: `你发了一个随意的小猫表情包。\n\n她回了一个"嗯嗯"。\n\n——至少对话没有断。但你们都知道，有些话还没说出来。`,
            unlockThought: null
          }
        }
      ]
    },

    "signal_2_3": {
      id: "signal_2_3",
      day: 2,
      type: "social",
      source: "counselor",
      sourceName: "王老师",
      sourceAvatar: "🧑‍💼",
      title: "辅导员的一句闲聊",
      isObvious: false,
      energyCost: 5,
      description: `下午在走廊碰到王老师，他随口说了一句：\n\n"对了，你们班那个林小晴最近请了好几次假了吧？我没太注意，你要是方便的话了解一下。"`,
      choices: [
        {
          id: "c2_3_a",
          text: `谢谢提醒，我正想找她聊聊`,
          trustImpact: 5,
          energyCost: 5,
          response: {
            source: "counselor",
            text: `"行。说实话，我一个辅导员要管三百多个学生，有时候真顾不过来。但你跟我提了，我就重点留意。"\n\n王老师拍了拍你的肩膀走了。\n\n你现在手上又多了一个理由——该找小晴聊聊了。而且，多了一个人跟你一起看。`,
            unlockThought: null
          }
        },
        {
          id: "c2_3_b",
          text: `可能最近身体不太好，我关注下`,
          trustImpact: 2,
          energyCost: 2,
          response: {
            source: "system",
            text: `"嗯，可能吧。"你应了一声。\n\n王老师点了点头就走了。你也继续忙你的。\n\n但那句话留在了你脑子里。`,
            unlockThought: null
          }
        },
        {
          id: "c2_3_c",
          text: `我这边多留意，你那边也帮我关注一下，有情况我们互相通个气`,
          trustImpact: 4,
          energyCost: 3,
          response: {
            source: "counselor",
            text: `"行，你这么说我就放心了。两个人看总比一个人看好。"\n\n他走了。但你忽然觉得——这个本来只是路过的一句闲聊，变成了一份约定。\n\n以后每次碰面，你们都知道对方在看着。`,
            unlockThought: null
          }
        }
      ]
    },

    // ---- 周三信号 ----
    "signal_3_1": {
      id: "signal_3_1",
      day: 3,
      type: "homework",
      source: "xiaoqing",
      sourceName: "林小晴",
      sourceAvatar: "👧",
      title: "周记里的一段话",
      isObvious: true,
      energyCost: 10,
      description: `批改周记时，你翻到了林小晴的。大部分同学写的是课程感受或学习计划，但小晴写了一段——\n\n"最近感觉每天都在重复同样的事情，起床、上课、回宿舍、睡觉。我不知道这样有什么意义。也许只是我太矫情了吧。"`,
      choices: [
        {
          id: "c3_1_a",
          text: `在周记上写一句鼓励的话还给她`,
          trustImpact: 10,
          energyCost: 10,
          response: {
            source: "xiaoqing",
            text: `你在她的周记最后写了一行字：\n\n"小晴，你愿意写下来就已经很勇敢了。如果什么时候想聊聊，老师一直在。——XX老师"`,
            unlockThought: "thought_3_1"
          }
        },
        {
          id: "c3_1_b",
          text: `找她当面谈谈这段话`,
          trustImpact: 8,
          energyCost: 15,
          response: {
            source: "xiaoqing",
            text: `（约了下午在办公室聊）\n\n"老师，那个……我就是随便写的，别当真啦。"\n\n她又笑了。但这次你注意到——她的手在桌子底下一直在捏自己的衣角。`,
            unlockThought: "thought_3_1"
          }
        },
        {
          id: "c3_1_c",
          text: `在成绩系统里标注一下，持续关注`,
          trustImpact: 0,
          energyCost: 5,
          response: {
            source: "system",
            text: `你把这段话截图保存了，在心里标注了"关注"。\n\n但你知道，有些信号如果只停留在"关注"里……可能就什么都不会发生。`,
            unlockThought: null
          }
        }
      ]
    },

    "signal_3_2": {
      id: "signal_3_2",
      day: 3,
      type: "classroom",
      source: "self",
      sourceName: "走廊偶遇",
      sourceAvatar: "👀",
      title: "办公室门口的犹豫",
      isObvious: false,
      energyCost: 5,
      description: `下午，你从外面回到办公室。远远地，你看到林小晴站在你办公室门口。\n\n她低着头，像是在犹豫要不要敲门。但你走近的时候，她已经转身走了。\n\n她没有看到你。`,
      choices: [
        {
          id: "c3_2_a",
          text: `追上去叫住她`,
          trustImpact: 12,
          energyCost: 15,
          overApproach: true,
          response: {
            source: "xiaoqing",
            text: `"小晴？"\n\n她回过头，愣了一下。然后又挤出了一个笑。\n\n"老师！我来交请假条……算了，下次再说吧。"\n\n她快步走了。你看着她的背影，发现她比上学期瘦了不少。`,
            unlockThought: "thought_3_2"
          }
        },
        {
          id: "c3_2_b",
          text: `给她发条消息：刚才好像看到你了`,
          trustImpact: 8,
          energyCost: 5,
          response: {
            source: "xiaoqing",
            text: `（晚上收到回复）\n\n"嗯！路过那边～老师今天辛苦啦😊"\n\n又一个表情包。\n\n你想起她站在门口的样子——她明明是想来找你的。`,
            unlockThought: "thought_3_2"
          }
        },
        {
          id: "c3_2_c",
          text: `也许只是路过，不要多想`,
          trustImpact: -3,
          energyCost: 0,
          response: {
            source: "system",
            text: `你进了办公室。\n\n下午的阳光照在桌子上。你开始处理文件。\n\n但脑海里一直有一个画面——一个女孩站在门口，低着头，犹豫着。`,
            unlockThought: null
          }
        }
      ]
    },

    "signal_3_3": {
      id: "signal_3_3",
      day: 3,
      type: "homework",
      source: "system",
      sourceName: "教务系统",
      sourceAvatar: "📋",
      title: "本周出勤记录",
      isObvious: true,
      energyCost: 5,
      description: `教务系统的周报提醒：林小晴本周已请假2次。本学期累计请假7次。\n\n上学期她一整个学期才请了1次假。`,
      choices: [
        {
          id: "c3_3_a",
          text: `查看她的请假原因`,
          trustImpact: 5,
          energyCost: 5,
          response: {
            source: "system",
            text: `请假原因写的是："身体不适"\n\n——很常见的理由。但如果身体不适持续了这么久……也许不完全是身体的原因。`,
            unlockThought: null
          }
        },
        {
          id: "c3_3_b",
          text: `这个数据记在心里就行`,
          trustImpact: -2,
          energyCost: 0,
          response: {
            source: "system",
            text: `你关闭了教务系统。\n\n数字归数字。但数字背后是一个人。`,
            unlockThought: null
          }
        },
        {
          id: "c3_3_c",
          text: `翻看一下她之前的请假记录，看看有没有规律`,
          trustImpact: 3,
          energyCost: 6,
          response: {
            source: "system",
            text: `你翻了翻前几个学期的记录。\n\n上学期1次，上上学期2次，都是正常的感冒请假。这学期突然跳到了7次，而且频率还在增加。\n\n你合上电脑。\n\n数据不会说谎。一个人在求救之前，身体会先发出信号。\n\n——现在你知道了，这不是偶然。`,
            unlockThought: null
          }
        }
      ]
    },

    // ---- 周四信号 ----
    "signal_4_0": {
      id: "signal_4_0",
      day: 4,
      type: "social",
      source: "counselor",
      sourceName: "王老师",
      sourceAvatar: "🧑‍💼",
      title: "辅导员的电话",
      isObvious: false,
      energyCost: 5,
      description: `上午你刚坐下，王老师的电话来了。他的语气比上次在走廊认真了很多。\n\n"上次你提了林小晴之后，我也留意了一下。我翻了她这学期的请假记录——七次。上学期才两次。"\n\n他顿了一下。"前两天我在图书馆看到她，一个人坐在角落，面前摊着本书，但一直没翻页。"\n\n"这种事一个人可能看不太清楚，但我们两个人拼一拼，应该能看出点什么。"`,
      choices: [
        {
          id: "c4_0_a",
          text: "谢谢王老师。我下午找她聊聊，我们一起关注",
          trustImpact: 5,
          energyCost: 5,
          response: {
            source: "counselor",
            text: `"好。你跟她聊的时候别太正式，就当是普通关心。"\n\n"——另外，如果需要心理咨询中心的资源，我这边可以直接帮她约。"\n\n你挂了电话。窗外的阳光很好。\n\n你忽然觉得——在这场需要耐心的等待里，你不是一个人。`
          }
        },
        {
          id: "c4_0_b",
          text: "先观察两天，别吓到她",
          trustImpact: 2,
          energyCost: 2,
          response: {
            source: "counselor",
            text: `"也有道理。那你注意着，有什么需要我这边配合的随时说。"\n\n你挂了电话。\n\n其实你知道——"再观察两天"这句话，容易变成"再等等"，然后变成"算了"。\n\n但今天，你决定不等。`
          }
        },
        {
          id: "c4_0_c",
          text: "她可能需要专业帮助，我先了解一下学校的心理咨询流程",
          trustImpact: 3,
          energyCost: 8,
          response: {
            source: "counselor",
            text: `"对，学校心理咨询中心可以直接约，我这边有他们的联系方式。"\n\n他很快把号码和预约流程发过来了。\n\n"不过——"他顿了一下，"约咨询不难，难的是让她愿意去。我们先别急着提，你先跟她聊聊，让她感觉被支持到了再提。"\n\n你记下了号码，也记下了这句话。\n\n好的支持不是一把推过去，而是先在旁边站一会儿。`
          }
        }
      ]
    },

    "signal_4_1": {
      id: "signal_4_1",
      day: 4,
      type: "direct",
      source: "xiaoqing",
      sourceName: "林小晴",
      sourceAvatar: "👧",
      title: "一条犹豫了很久的消息",
      isObvious: true,
      energyCost: 10,
      description: `晚上10点半，你收到林小晴的消息。时间戳显示她打了很久——输入状态出现了又消失，出现了又消失。\n\n最后发出来的是：\n\n"老师，您现在方便吗？我有点事想问您……算了不用了，打扰了。"`,
      choices: [
        {
          id: "c4_1_a",
          text: `方便的，小晴，你说`,
          trustImpact: 15,
          energyCost: 15,
          response: {
            source: "xiaoqing",
            text: `（等了很久）\n\n"老师……我最近感觉好累。不是身体那种累，是……心里那种。我不知道怎么了。什么都提不起劲。我觉得自己很没用……"\n\n——她终于说出来了。\n\n这一刻，你知道你等待的不是一句话，而是一个人鼓起了所有的勇气。`,
            unlockThought: "thought_4_1"
          }
        },
        {
          id: "c4_1_b",
          text: `明天来办公室聊？晚上早点休息`,
          trustImpact: 8,
          energyCost: 10,
          response: {
            source: "xiaoqing",
            text: `"好的老师。晚安。"\n\n她回得很快，像是松了一口气。\n\n——至少她知道，明天有一个可以去的地方。`,
            unlockThought: null
          }
        },
        {
          id: "c4_1_c",
          text: `太晚了，明天再说吧`,
          trustImpact: -8,
          energyCost: 2,
          response: {
            source: "system",
            text: `你没有回复。\n\n第二天早上，你看到那条消息还静静地躺在对话框里。\n\n"算了不用了，打扰了。"——这几个字现在看起来比昨晚更沉重了。`,
            unlockThought: null
          }
        }
      ]
    },

    "signal_4_2": {
      id: "signal_4_2",
      day: 4,
      type: "classroom",
      source: "self",
      sourceName: "教室角落",
      sourceAvatar: "👀",
      title: "一个人坐在角落",
      isObvious: false,
      energyCost: 5,
      description: `下午你去教室拿东西。教室里没什么人，但你看到林小晴一个人坐在最后一排靠窗的位置。\n\n她没有在看书，也没有在玩手机。就那么坐着，看着窗外。\n\n阳光照在她身上，但她的表情像是被什么东西罩住了。`,
      choices: [
        {
          id: "c4_2_a",
          text: `走过去，坐在她旁边，不说话`,
          trustImpact: 12,
          energyCost: 10,
          response: {
            source: "xiaoqing",
            text: `你走过去，坐在了她旁边。\n\n她愣了一下，但没有躲开。\n\n你们就这么安静地坐了几分钟。窗外的风吹进来，带着一点五月的温度。\n\n最后，她轻声说了一句："谢谢老师。"`,
            unlockThought: "thought_4_2"
          }
        },
        {
          id: "c4_2_b",
          text: `远远地看了一眼，然后离开`,
          trustImpact: -3,
          energyCost: 2,
          response: {
            source: "system",
            text: `你拿完东西走了。\n\n走出门的时候，你回头看了一眼——\n\n她还坐在那里。一个人，很安静。\n\n你忽然觉得有点对不起她。但你又说不上来为什么。`,
            unlockThought: null
          }
        },
        {
          id: "c4_2_c",
          text: `给她发条消息：刚才路过教室，窗户旁边阳光挺好的`,
          trustImpact: 5,
          energyCost: 3,
          response: {
            source: "xiaoqing",
            text: `（过了一会儿）\n\n"嗯……那个位置很安静。"\n\n她没有否认自己在教室。也没有解释为什么一个人坐着。\n\n但这不是重点。重点是——她回你了。而且不是表情包。\n\n你回了一句："确实是个好地方。"\n\n对话看起来毫无意义。但你和她都知道——这不是在聊教室。\n\n这是在说：我看见你了。`,
            unlockThought: null
          }
        }
      ]
    },

    "signal_4_3": {
      id: "signal_4_3",
      day: 4,
      type: "social",
      source: "xiaozhang",
      sourceName: "小张",
      sourceAvatar: "👩",
      title: "小张的求助",
      isObvious: true,
      energyCost: 10,
      description: `小张又发来了消息：\n\n"老师，小晴今天一天都没出宿舍，也没吃饭。我们真的很担心。我不知道该怎么帮她……我觉得她需要专业的帮助。"\n\n"但我们不敢直接跟她说'你应该去看心理医生'，怕她觉得我们嫌弃她。"`,
      choices: [
        {
          id: "c4_3_a",
          text: `谢谢小张。我会找她谈，不会让她觉得被特殊对待`,
          trustImpact: 8,
          energyCost: 10,
          response: {
            source: "xiaozhang",
            text: `"好的老师……谢谢您。"\n\n手机那头沉默了几秒。\n\n然后她又发了一条："其实我犹豫了好久才给您发这条消息。我怕是我多想了……也怕小晴知道我告状会生气。但看到她那个样子，我真的……"\n\n消息又断了。\n\n你知道她想说什么。\n\n——她只是一个室友，但她在做一件很难的事：既要在乎，又不能太用力。`,
            unlockThought: null
          }
        },
        {
          id: "c4_3_b",
          text: `学校有心理咨询中心，你们可以建议她去`,
          trustImpact: 3,
          energyCost: 5,
          overApproach: true,
          response: {
            source: "xiaozhang",
            text: `"嗯……我们不敢提，怕她受不了……"\n\n她说得对。有些话，需要合适的人、在合适的时机说。\n\n也许这个人是你。`,
            unlockThought: null
          }
        },
        {
          id: "c4_3_c",
          text: `你们做得非常好。不用急着建议她做什么，正常陪着她就够了。我这边也在想办法`,
          trustImpact: 5,
          energyCost: 5,
          response: {
            source: "xiaozhang",
            text: `"好。老师，说实话我自己也有点不知道怎么办。但听您这么说，我觉得没那么慌了。"\n\n小张停了一会儿。\n\n"其实……我们就是怕做错什么，反而害了她。"\n\n你回了一句："你们已经在做最对的事了——没有走开。"\n\n——陪伴者也需要支持。有时候不是方法的问题，是安全感的问题。`,
            unlockThought: null
          }
        }
      ]
    },

    // ---- 周五信号 ----
    "signal_5_0": {
      id: "signal_5_0",
      day: 5,
      type: "message",
      source: "xiaoqing",
      sourceName: "林小晴",
      sourceAvatar: "👧",
      title: "她发来了消息",
      isObvious: true,
      energyCost: 0,
      description: `周五下午，你正在整理本周事务。\n\n手机亮了。\n\n是林小晴。\n\n这一周以来，这是她第一次主动给你发消息。`,
      choices: [
        {
          id: "c5_0_a",
          text: "放下手里的事，认真回复：「我在，你说」",
          energyCost: 15,
          trustImpact: 10,
          response: {
            source: "xiaoqing",
            text: `「老师……其实我也不知道该怎么说。」\n\n「但是这一周，谢谢您。」\n\n「每次您回我消息的时候，我都觉得——好像没那么糟。」`
          }
        },
        {
          id: "c5_0_b",
          text: "约她来办公室：「方便的话来我办公室坐坐？」",
          energyCost: 20,
          trustImpact: 5,
          response: {
            source: "xiaoqing",
            text: `「嗯……好的老师。我下节课过来。」\n\n（她犹豫了一下，但还是答应了。）\n\n（你感觉到，她愿意来——这本身就是一个信号。）`
          }
        },
        {
          id: "c5_0_c",
          text: "简单回复：「收到，有什么需要随时找我」",
          energyCost: 5,
          trustImpact: 3,
          response: {
            source: "xiaoqing",
            text: `「好的老师。」\n\n（她没有多说。但你看到消息状态从「已读」变成了「对方正在输入…」——然后停了。）\n\n（也许她还在犹豫。也许下一次。）`
          }
        }
      ]
    },
    "signal_5_1": {
      id: "signal_5_1",
      day: 5,
      type: "direct",
      source: "xiaoqing",
      sourceName: "林小晴",
      sourceAvatar: "👧",
      title: "周五的对话",
      isObvious: true,
      energyCost: 0,
      description: `这一周快结束了。\n\n你坐在办公室里，看着窗外的夕阳。\n\n这一周里你收到的每一条消息、看到的每一个画面，此刻像是电影一样在脑海里闪过——\n\n撤回的"老师，我……"、周记里那段话、教室角落那个安静的身影。\n\n还有那句——"谢谢你看见我。"\n\n这一周你做了什么？又错过了什么？\n\n而接下来，你想做什么？`,
      choices: [
        {
          id: "c5_1_a",
          text: `约她来办公室坐坐，随便聊聊`,
          trustImpact: 12,
          energyCost: 15,
          response: {
            source: "xiaoqing",
            text: `（敲门声）\n\n"老师……您找我？"\n\n她站在门口，有点紧张，但没有像之前那样躲。\n\n"没事，就是快周末了，想跟你聊聊。"\n\n你给她倒了杯水。她接过去，轻轻说了声谢谢。\n\n你们聊了很多——从今天的课到窗外的晚霞，从上周的电影到下周的计划。没有什么"严肃的话题"。\n\n但你注意到——她说话的时候没有再用表情包。\n\n临走的时候，她站在门口回头看了一眼："老师，下周见。"\n\n——不是"再见"，是"下周见"。\n\n你知道她还会来。`,
            unlockThought: null
          }
        },
        {
          id: "c5_1_b",
          text: `给她写几句话：这一周辛苦了，下周见`,
          trustImpact: 8,
          energyCost: 8,
          response: {
            source: "xiaoqing",
            text: `你拿出一张便签纸，写了几个字。\n\n"小晴，这周辛苦了。下周也是新的一周。——老师在。"\n\n你把它夹在她的周记本里。\n\n（后来你才知道，那张便签纸她一直留着。她说那是她第一次觉得——被关心不等于被特殊对待。）`,
            unlockThought: null
          }
        },
        {
          id: "c5_1_c",
          text: `整理这一周的观察记录，为下周做一个关注计划`,
          trustImpact: 5,
          energyCost: 6,
          response: {
            source: "system",
            text: `你打开了一个新的笔记本。\n\n周一：作业未交，回复消息时用了道歉但没解释。\n周二：撤回消息，室友转达了担心。\n周三：周记有不对劲的表述，办公室门口看到她犹豫。\n周四：她终于说出了"我觉得自己很没用"。\n\n你合上笔记本。窗外天已经快黑了。\n\n这一周你看见了很多。有些你抓住了，有些你错过了。\n\n但你知道——下周还在。她还在。\n\n而你会继续看。`,
            unlockThought: null
          }
        }
      ]
    }
  },

  // ========== 内心独白 ==========
  innerThoughts: {
    "thought_1_1": {
      id: "thought_1_1",
      day: 1,
      unlockTrust: 0,
      text: `早上醒来的时候，手机震了一下。\n\n是老师。\n\n「小晴，昨天的作业还没交，记得补一下哦，有什么事可以跟我说。」\n\n我看了三遍。\n\n不是因为作业——作业的事我当然知道。我是故意没交的。不是懒，是打开作业本的时候忽然觉得……写这些有什么用呢。\n\n但老师说的不是「你为什么不交作业」。\n\n他说的是「有什么事可以跟我说」。\n\n没有人问过我这句话。很久没有了。\n\n我打了「好的老师，我马上补」，然后删掉。又打了一遍。又删掉。\n\n最后只发了「好的老师」。\n\n其实我想发的是别的。\n\n但说不出口。\n\n不是不想说。是不知道说出来之后会怎样。`
    },
    "thought_1_2": {
      id: "thought_1_2",
      day: 1,
      unlockTrust: 55,
      text: `那次上课的时候，老师看了我一眼。\n\n我假装在看窗外，其实我能感觉到他的目光。\n\n我赶紧转回来，低头看课本。其实课本上的字我一个都没看进去。我只是怕他发现——发现我眼睛红了，发现我不对劲了，然后用那种「你怎么了」的眼神看我。\n\n但他没有。\n\n他看了一会儿，然后继续讲课了。\n\n我不知道他有没有记住那个画面。\n\n但我记住了。\n\n那是我这周第一次觉得：也许有人正在看见我。不是看见我的成绩、我的作业、我的出勤。\n\n是看见我。`
    },
    "thought_2_1": {
      id: "thought_2_1",
      day: 2,
      unlockTrust: 0,
      text: `小张跟我说她给老师发了消息。\n\n我当时愣住了。\n\n不是生气——是害怕。\n\n害怕老师知道了。害怕大家都知道了。害怕从此以后，每个人看我的眼神都不一样——「那个学生，听说她最近有问题。」\n\n但小张说老师回的是：「谢谢小张，我会关注。你做得很好。」\n\n她说这句话的时候眼睛亮亮的。\n\n我忽然觉得鼻子有点酸。\n\n不是难过。\n\n是……有人发现我不对了。但那个人没有大惊小怪，没有觉得小张多管闲事。\n\n他只是说了句「我会关注」。\n\n像在说：我知道了。我会在。`
    },
    "thought_2_2": {
      id: "thought_2_2",
      day: 2,
      unlockTrust: 60,
      text: `星期二我请了假。\n\n没有去医院。没有出门。\n\n就在床上躺着。窗帘拉得很紧。\n\n小张帮我带了饭上来，放在桌上。\n\n「小晴，吃点东西吧。」\n\n我说「好」。\n\n然后没动。\n\n不是不饿。是觉得……吃东西是一件需要力气的事情。而我已经没有多余的力气了。\n\n我把脸埋进枕头里。黑暗很安静。安静得只剩下自己的呼吸。\n\n那时候我想：如果就这样躺着，一直躺着，是不是就不用面对任何东西了。\n\n然后手机亮了一下。\n\n是老师发的消息。\n\n我撤回了。\n\n不是因为不想说。\n\n是因为——如果我发了，就真的开始了。`
    },
    "thought_3_1": {
      id: "thought_3_1",
      day: 3,
      unlockTrust: 40,
      text: `周记发下来那天，我翻到最后一页。\n\n老师在后面写了一句话。\n\n我看了很多遍。一遍，两遍，三遍。\n\n「你愿意写下来，就已经很勇敢了。」\n\n……\n\n我没想到他会这么写。\n\n我本来以为他会说「要积极一点」，或者「大家都差不多，别想太多」。那些话我听过太多次了，听多了就觉得……嗯，果然没有人真的在意。\n\n但他说我勇敢。\n\n我只是写了一些乱七八糟的话——甚至自己都不确定那算不算「求助」。可能只是一些很碎的、很傻的话。\n\n但他看到了。\n\n那句话我折了个角。现在那页纸还在我书包里。\n\n……谢谢你。`
    },
    "thought_3_2": {
      id: "thought_3_2",
      day: 3,
      unlockTrust: 45,
      text: `午休的时候，我走到办公室门口。\n\n门是半关的。\n\n我在外面站了大概两分钟。手里攥着一张纸——上面写了我想说的话，但写完又觉得好傻。\n\n我怕他看完说「你想多了，我们那时候比你们累多了」。\n我怕他说「你就是压力太大了，去跑跑步就好了」。\n\n我更怕他露出那种「你怎么了」的表情。\n\n那种表情等于在说：你和别人不一样。你是「有问题」的那个人。\n\n我把那张纸撕了。\n\n走的时候，办公室里有人笑了一声。我以为是笑我。\n\n……对不起，老师。我不是不想说。我只是不知道怎么说，也不知道说了之后，你会不会用那种眼神看我。`
    },
    "thought_4_1": {
      id: "thought_4_1",
      day: 4,
      unlockTrust: 65,
      text: `消息发出去之后，我把手机扣在桌上。\n\n然后每隔几秒翻过来看一眼。\n\n没有回复。\n\n我开始后悔了。是不是不该发？他会不会觉得我是个负能量的人？是不是打扰他了？\n\n我打字想撤回——\n\n然后消息提示音响了。\n\n「方便的，你说。」\n\n就五个字。\n\n我盯着那五个字，忽然鼻子一酸。\n\n不是因为难过。是因为……他没说「你别想太多」，也没说「你要坚强」。他只是说「方便的」。\n\n意思是：我有时间，我有空间，我在听。\n\n然后我就全说了。那些堵在胸口很久的东西，一个字一个字地，打在了屏幕上。\n\n打完最后一个字的时候，我发现自己在笑。\n\n不是开心。是……终于说出来了。`
    },
    "thought_4_2": {
      id: "thought_4_2",
      day: 4,
      unlockTrust: 60,
      text: `下午第三节课，我趴在教室角落的位子上。

不是想睡觉。是觉得……如果闭上眼睛，世界会安静一点。

然后我听见脚步声。

是老师。

他走进来，没说话，在我旁边坐下了。

我们之间没有话。窗外有鸟叫，很近。阳光从窗户斜进来，落在他袖子上。

我很想说点什么。比如「老师我最近不太好」，或者「老师我可能生病了」。

但我说不出来。

不是不想说，是……一说出来就真的了。就好像，一旦说出口，就再也回不去了。

但那十几分钟的安静，让我觉得：就算说不出来，也没关系。

他没催我。他只是坐在那里。

放学的时候，我跟他说了一句：

「谢谢老师。」

——这是我这周，说出的最真的一句话。`
    },
    "thought_5_1": {
      id: "thought_5_1",
      day: 5,
      unlockTrust: 55,
      text: `星期五了。\n\n这一周好像过了一年。\n\n星期一的作业、星期二的撤回、星期三的周记、星期四的教室……\n\n我记得每一件事。\n\n最奇怪的是——我记得的不是那些「症状」。不是失眠了多少天、不是第几次不想吃饭、不是那些莫名其妙想哭的瞬间。\n\n我记得的是：老师在周记上写的那句话。他搬椅子坐在我旁边的那个下午。还有那句「方便的，你说。」\n\n原来人记住的，不是自己有多糟糕。\n\n而是谁在你最糟糕的时候，没有走开。`
    },
    "thought_5_2": {
      id: "thought_5_2",
      day: 5,
      unlockTrust: 70,
      text: `如果一周前，老师没有发那条消息。\n\n如果小张没有告诉他。\n\n如果那天下午，他路过我身边没有停下来。\n\n那我今天会是什么样子。\n\n我不知道。\n\n也许还是躺在床上。也许还是盯着天花板。也许还是觉得这个世界跟我之间隔了一层什么东西。\n\n但他停下来了。\n\n他看见了。\n\n他做了那些看起来很小的事——问了一句，坐了一会儿，说了五个字。\n\n但这些很小的事，对我来说，是这一个星期里，唯一的光。\n\n谢谢你，老师。\n\n谢谢你没有等我「好起来」。\n\n谢谢你在我还没好起来的时候，就已经在了。`
    }
  },

  // ========== 结局 ==========
  endings: {
    trust: {
      id: "ending_trust",
      theme: "trust",
      name: "信任结局",
      subtitle: `\"我在，不着急。\"`,
      condition: { trust: 70 },
      description: `周五下午，林小晴主动来找你了。\n\n她站在你面前，眼睛还有点红，但这次不是哭过的红——是终于睡了个好觉之后的那种红。\n\n"老师，我……我想了很久，决定跟您说实话。我最近确实不太好。"\n\n你搬了把椅子给她坐下。\n\n"不着急，慢慢说。我在这。"`,
      epilogue: `你和她聊了很久。你没有试图「治好」她，你只是听她说。\n\n你告诉她会帮她联系学校的心理咨询中心，但不会强制她去——「你觉得准备好了，随时可以找我陪你」。\n\n她点了点头。\n\n走出办公室的时候，她回头看了你一眼，说了一句：\n\n「老师，谢谢你看见我。」`,
      lesson: `你不需要成为心理专家。看见她、接纳她、给她时间和空间——这就是最好的支持。\n\n有时候，一句「我在这」比任何专业建议都有力量。`,
      shareText: `我在《看见》游戏里，用五天的时间，让一个沉默的学生终于说了「谢谢你看见我」。\n\n——每个人都可以成为支持者。你注意到身边的人了吗？`
    },
    late: {
      id: "ending_late",
      theme: "late",
      name: "迟到的发现",
      subtitle: `\"总比没有好。\"`,
      condition: { trust: 40, maxTrust: 69 },
      description: `周五，你没有等到林小晴来找你。\n\n但你在走廊上碰到了她。她低着头，像这几天一样。\n\n这次你叫住了她。\n\n"小晴，最近还好吗？"`,
      epilogue: `她愣了一下，然后说了一句让你鼻子一酸的话：\n\n「老师，你是在问我吗？我以为没有人注意到。」\n\n你们在走廊上聊了几分钟。她没有完全敞开心扉，但你说了一句：\n\n「以后有什么想说的，随时来找我。」\n\n她点了点头。\n\n然后——她真的笑了笑。不是那种练习过的笑，是真的那种。`,
      lesson: `你做得不够完美，也许错过了一些信号，也许回应得不够及时。\n\n但做了一点，就比什么都没做要好得多。\n\n她记住了。`,
      shareText: `我在《看见》游戏里，错过了一些信号，但最后还是说出了那句「最近还好吗」。\n\n——迟到，总比没有好。你最近注意到身边的人了吗？`
    },
    missed: {
      id: "ending_missed",
      theme: "missed",
      name: "错过",
      subtitle: `\"注意到，就还来得及。\"`,
      condition: { trust: 0, maxTrust: 39 },
      description: `周五像往常一样过去了。\n\n林小晴没有来找你。你也没有找她。\n\n周末批作业的时候，你又翻到她的那份——和周一一样潦草，和周三一样敷衍。\n\n你忽然想，如果这几天你做了不一样的选择……`,
      epilogue: `游戏到这里结束了。\n\n但故事没有结束。\n\n林小晴还在那里。也许下周一她会再发出一条撤回的消息。也许下周三她会再站在你办公室门口。\n\n如果你在现实生活中也经历过类似的事情——\n\n现在开始注意，也不晚。`,
      lesson: `如果你觉得身边有人不太对劲，但不确定该怎么做——\n\n不用成为专家，不用想好完美的措辞。\n\n一句「最近怎么样」、一个「我注意到你了」、一次安静的陪伴。\n\n这些就够了。\n\n注意到，就还来得及。`,
      shareText: `我在《看见》游戏里，错过了那个需要帮助的学生。\n\n——但游戏告诉我：「注意到，就还来得及。」\n\n现实里，你注意到身边的人了吗？`
    },
    over: {
      id: "ending_over",
      theme: "over",
      name: "过度",
      subtitle: `\"关心也需要分寸。\"`,
      condition: { trust: 55, overApproach: true },
      description: `你做了很多——找她谈话、问她怎么了、催她去心理咨询中心、告诉辅导员要重点关注她。\n\n你觉得你在帮她。\n\n但周五那天，你在走廊碰到她时，她躲开了你的目光。\n\n小张后来告诉你：\"老师，小晴说您最近对她太关注了，她觉得压力很大……她觉得大家都在盯着她的'病'看。\"`,
      epilogue: `你的出发点是好的。但方式不对。\n\n有时候「给空间」比「逼着开口」更有效。\n\n有时候「我注意到你了，但我不催你」比「你为什么不告诉我」更有力量。\n\n关心是一种能力。恰到好处的关心，是更大的能力。`,
      lesson: `过度关注也会成为一种压力。\n\n最好的支持不是「我要治好你」，而是「我在这里，你需要的时候我随时在」。\n\n分寸感，也是爱的一种表达。`,
      shareText: `我在《看见》游戏里，因为太想帮她，反而让她觉得压力更大了。\n\n——关心也需要分寸。\n\n你有过「过度关心」的时刻吗？`
    }
  },

  // ========== 周五对话树（根据信任值分支） ==========
  fridayDialogues: {
    high: [
      {
        speaker: "xiaoqing",
        text: `老师……我想了很久，决定跟您说实话。`
      },
      {
        speaker: "xiaoqing",
        text: `我最近真的不太好。已经很久了。`
      },
      {
        speaker: "system",
        text: `（你搬了把椅子给她坐下，没有急着说话。）`
      },
      {
        speaker: "player",
        text: `不着急，慢慢说。我在这。`
      },
      {
        speaker: "xiaoqing",
        text: `……谢谢老师。`
      },
      {
        speaker: "system",
        text: `她说着说着，眼眶红了。但这次，她没有擦掉眼泪。\n\n——因为她知道，在这里哭是安全的。`
      }
    ],
    medium: [
      {
        speaker: "system",
        text: `你在走廊上碰到了林小晴。`
      },
      {
        speaker: "player",
        text: `小晴，最近还好吗？`
      },
      {
        speaker: "system",
        text: `她愣了一下。`
      },
      {
        speaker: "xiaoqing",
        text: `老师……你是在问我吗？我以为没有人注意到。`
      },
      {
        speaker: "player",
        text: `以后有什么想说的，随时来找我。`
      },
      {
        speaker: "system",
        text: `她点了点头。\n\n然后——她真的笑了笑。不是那种练习过的笑。`
      }
    ],
    low: [
      {
        speaker: "system",
        text: `周五过去了。一切如常。`
      },
      {
        speaker: "system",
        text: `林小晴没有来找你。你也没有找她。`
      },
      {
        speaker: "system",
        text: `周末批作业的时候，你又翻到了她的那份——\n潦草、敷衍，和前几天一样。`
      },
      {
        speaker: "system",
        text: `你忽然想，如果这几天你做了不一样的选择……`
      }
    ]
  },

  // ========== 公益资源 ==========
  resources: {
    // 紧急热线
    hotlines: [
      { name: "全国24小时心理援助热线", phone: "400-161-9995", available: "24小时" },
      { name: "北京心理危机研究与干预中心", phone: "010-82951332", available: "24小时" },
      { name: "希望24热线（自杀与危机干预）", phone: "400-161-9995", available: "24小时" },
      { name: "生命教育与危机干预中心", phone: "400-830-9925", available: "9:00-21:00" }
    ],

    // 如何提供支持（给所有支持者）
    howToSupport: {
      title: "如果你注意到身边有人状态不对",
      tips: [
        `先不要急着给建议。『你要坚强』『想开点』这些话，往往让人更封闭。\n\n一句『最近还好吗』就够了。不用想好完美的措辞。`,
        "沉默也是一种陪伴。有时候，坐在他旁边，什么都不说，比说一百句『加油』都有效。",
        "如果他开口了，不要急着给建议。听，就好。",
        "不要说『我也抑郁过』然后开始讲自己的故事。那一刻，他在讲他的故事，不是你的。",
        "如果他说『我不想活了』，不要说『别这么想』。你可以说：『你愿意跟我说说吗？我在。"
      ]
    },

    // 给班主任的建议
    forTeachers: {
      title: "给班主任的话",
      tips: [
        "周记/作文里，学生有时候会写一些『不太对劲』的话。不要只打一个『加油』。写一句『我注意到你了』。",
        "如果学生状态明显下滑（缺课、作业敷衍、社交退缩），私下问一句『最近还好吗』，比在班上点名批评有效一百倍。",
        "不要当着全班的面说某个学生『最近状态不好』。这对他来说，等于被贴标签。",
        "如果学生来找你，不要急着『解决问题』。他说的时候，你在听，这本身就是解决问题的一部分。"
      ]
    },

    // 给家长的建议
    forParents: {
      title: "给家长的话",
      tips: [
        "孩子的『我不想上学』『我好累』，有时候不是偷懒，是在求救。",
        "不要说『我们那时候比你们苦多了』。痛苦没有比较级，他的痛苦对他来说就是真的。",
        "如果孩子说『我觉得自己不行』，不要急着否认。你可以说：『你愿意跟我说说吗？』",
        "带孩子去看心理咨询，不是『孩子有病』，是『孩子在寻求帮助』。这和感冒了去看医生没有区别。"
      ]
    },

    // 自助资源（给处于困境中的人）
    selfHelp: {
      title: "如果你正在经历困难",
      tips: [
        "寻求帮助不是软弱，是勇气。打电话给热线，不代表你『真的有病』，只代表你需要被听见。",
        "如果今天很糟糕，没关系。今天撑过去就好。不用想明天，不用想以后。就今天。",
        "找一个人——任何一个你觉得安全的人——告诉他：『我最近不太好。』就这一句话，够了。",
        "如果实在找不到人说话，打热线。电话那头的人，就是专门为了听你说话而存在的。"
      ]
    }
  }
};
