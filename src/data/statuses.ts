import type { StatusOption } from '../types/status';

export const statuses: StatusOption[] = [
  // ==================== 学生模式 ====================
  {
    id: 'student-paper-avoidance',
    mode: 'student',
    name: '论文装死型',
    keywords: ['拖延', '逃避', '愧疚'],
    description: '适用于距离DDL还有时间但完全不想动笔，打开文档就犯困，转而去刷手机/收拾房间/做饭的论文拖延选手。',
    icon: '📝',
  },
  {
    id: 'student-homework-backlog',
    mode: 'student',
    name: '作业积压型',
    keywords: ['焦虑', '无力', '压力'],
    description: '适用于各种作业截止日期扎堆，越积越多，看着待办清单就感到窒息的作业大山选手。',
    icon: '📚',
  },
  {
    id: 'student-exam-avoidance',
    mode: 'student',
    name: '考前装死型',
    keywords: ['紧张', '逃避', '麻木'],
    description: '适用于考试将近却完全无法进入复习状态，明知该看书却选择躺平的考前鸵鸟选手。',
    icon: '💤',
  },
  {
    id: 'student-grad-exam-low-battery',
    mode: 'student',
    name: '考研低电量型',
    keywords: ['疲惫', '迷茫', '孤独'],
    description: '适用于长期备考导致身心俱疲，开始怀疑人生意义和考研选择的考研长跑选手。',
    icon: '🔋',
  },
  {
    id: 'student-class-soul-absent',
    mode: 'student',
    name: '上课灵魂出走型',
    keywords: ['无聊', '游离', '机械'],
    description: '适用于人坐在教室里但灵魂已经飘走，老师说什么完全听不进去的课堂摸鱼选手。',
    icon: '👻',
  },
  {
    id: 'student-anxious-frozen',
    mode: 'student',
    name: '明明很急但就是不动型',
    keywords: ['焦虑', '矛盾', '自我谴责'],
    description: '适用于明明知道事情很紧急，内心焦虑到爆炸，但身体就是无法执行任何动作的紧急瘫痪选手。',
    icon: '🫠',
  },

  // ==================== 上班族模式 ====================
  {
    id: 'worker-meeting-drained',
    mode: 'worker',
    name: '会议吸干型',
    keywords: ['疲惫', '麻木', '被消耗'],
    description: '适用于一天开了四五场会，感觉灵魂被抽干，回到工位一句话都不想说的会议受害者。',
    icon: '🧟',
  },
  {
    id: 'worker-boss-trauma',
    mode: 'worker',
    name: '老板创伤型',
    keywords: ['委屈', '愤怒', '无力'],
    description: '适用于刚被老板批评/甩锅/画大饼，内心翻涌却只能微笑点头说"好的收到"的职场受伤者。',
    icon: '😭',
  },
  {
    id: 'worker-kpi-crushed',
    mode: 'worker',
    name: 'KPI压迫型',
    keywords: ['焦虑', '压力', '窒息感'],
    description: '适用于季度末/月末KPI考核逼近，数据不够业绩来凑，压力大到喘不过气的KPI焦虑者。',
    icon: '📉',
  },
  {
    id: 'worker-commute-destroyed',
    mode: 'worker',
    name: '通勤废掉型',
    keywords: ['疲惫', '机械', '麻木'],
    description: '适用于挤地铁/堵车/长途通勤后到达公司，感觉一天的能量在通勤中就已耗尽的通勤废人。',
    icon: '🚇',
  },
  {
    id: 'worker-after-work-paralysis',
    mode: 'worker',
    name: '下班瘫痪型',
    keywords: ['瘫软', '放空', '不想动'],
    description: '适用于下班回到家后直接瘫倒在沙发上/床上，连饭都不想吃、澡都不想洗的下班瘫痪者。',
    icon: '🛋️',
  },
  {
    id: 'worker-want-quit-no-money',
    mode: 'worker',
    name: '想辞职但没钱型',
    keywords: ['矛盾', '被困住', '憋屈'],
    description: '适用于无数次想裸辞但看看余额又冷静下来，每天在辞职和不辞职之间反复横跳的纠结打工人。',
    icon: '💸',
  },
];

export function getStatusById(statusId: string): StatusOption | undefined {
  return statuses.find((s) => s.id === statusId);
}

export function getStatusesByMode(mode: 'student' | 'worker'): StatusOption[] {
  return statuses.filter((s) => s.mode === mode);
}
