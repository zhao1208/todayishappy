import type { CommunityTheme, CommunityPost } from '../types/community';

export const communityThemes: CommunityTheme[] = [
  // ==================== 学生区 ====================
  {
    id: 'student-dorm-lazy-board',
    mode: 'student',
    name: '宿舍摆烂排行榜',
    icon: '🏠',
    description: '展示你的摆烂日常，在排行榜上看看谁是摆烂之王。比一比谁今天更废。',
  },
  {
    id: 'student-grad-exam-group',
    mode: 'student',
    name: '考研低电量小组',
    icon: '🔋',
    description: '考研人的互助充电站。分享备考中的崩溃与坚持，互相给对方续命。',
  },
  {
    id: 'student-paper-support',
    mode: 'student',
    name: '论文难产互助会',
    icon: '📝',
    description: '论文写不出来没关系，来这里的都是同病相怜的论文难产选手。互相鼓励，一起拖延到最后一刻。',
  },
  {
    id: 'student-exam-emergency',
    mode: 'student',
    name: '考前临时做人广场',
    icon: '⚡',
    description: '考试前一晚才开始临时抱佛脚？这里集合了所有考前突击选手，互相打气，奇迹般地活过每一场考试。',
  },

  // ==================== 上班族区 ====================
  {
    id: 'worker-desk-slacking-art',
    mode: 'worker',
    name: '工位摸鱼艺术展',
    icon: '🎨',
    description: '上班摸鱼也是一种艺术。分享你的摸鱼日常，展示你在工位上偷偷摸鱼的高超技巧。',
  },
  {
    id: 'worker-after-work-recovery',
    mode: 'worker',
    name: '下班回血指南',
    icon: '🛋️',
    description: '下班后如何恢复元气？分享你的回血秘诀，找到最适合自己的下班恢复方式。',
  },
  {
    id: 'worker-workplace-treehole',
    mode: 'worker',
    name: '职场树洞',
    icon: '🌳',
    description: '职场无处诉说的委屈和吐槽，统统倒进这个树洞里。匿名安全，尽情发泄。',
  },
  {
    id: 'worker-monday-support',
    mode: 'worker',
    name: '周一不适互助会',
    icon: '🌚',
    description: '每周一的痛苦不需要独自承受。来这里和所有周一不适患者抱团取暖，一起熬过最漫长的一天。',
  },
];

export const samplePosts: CommunityPost[] = [
  {
    id: 'sp-001',
    authorId: 'sample-author-001',
    authorNickname: '论文写不完的小王',
    type: 'license',
    textContent: '今天论文又只写了50个字，但至少打开了Word文档，也算是进步吧。',
    themeId: 'student-paper-support',
    interactions: { hug: 42, sameHere: 67, letItGo: 15, tomorrow: 23 },
    createdAt: '2026-06-30T10:30:00.000Z',
  },
  {
    id: 'sp-002',
    authorId: 'sample-author-002',
    authorNickname: '摸鱼大师老李',
    type: 'resonance',
    textContent: '工位摸鱼被发现，老板走过来说"你也辛苦了"。我不知道这是关心还是警告，但我选择相信是关心。',
    themeId: 'worker-desk-slacking-art',
    interactions: { hug: 89, sameHere: 134, letItGo: 56, tomorrow: 31 },
    createdAt: '2026-06-29T14:20:00.000Z',
  },
  {
    id: 'sp-003',
    authorId: 'sample-author-003',
    authorNickname: '低电量社畜小张',
    type: 'license',
    textContent: '今天在地铁上给老人让了座，虽然我站了40分钟脚都麻了，但至少今天做了一件有意义的事。没废！',
    themeId: 'worker-after-work-recovery',
    interactions: { hug: 156, sameHere: 45, letItGo: 12, tomorrow: 78 },
    createdAt: '2026-06-28T08:15:00.000Z',
  },
  {
    id: 'sp-004',
    authorId: 'sample-author-004',
    authorNickname: '考前突击达人',
    type: 'resonance',
    textContent: '距离考试还有12小时，我刚刚开始复习第一章。人生就是这样，不到最后一刻永远不知道自己能多极限。',
    themeId: 'student-exam-emergency',
    interactions: { hug: 201, sameHere: 289, letItGo: 67, tomorrow: 45 },
    createdAt: '2026-06-30T02:00:00.000Z',
  },
  {
    id: 'sp-005',
    authorId: 'sample-author-005',
    authorNickname: '周一恐惧症患者',
    type: 'resonance',
    textContent: '周一早上闹钟响了三次才起来，迟到了5分钟。但至少我起来了，这本身就是一种胜利。',
    themeId: 'worker-monday-support',
    interactions: { hug: 178, sameHere: 223, letItGo: 89, tomorrow: 56 },
    createdAt: '2026-06-30T07:45:00.000Z',
  },
];
