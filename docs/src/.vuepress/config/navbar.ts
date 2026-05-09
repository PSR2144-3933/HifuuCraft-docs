import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: '主页',
    icon: 'signs-post',
    link: '/start/',
  },
  // {
  //   text: '更新日志',
  //   icon: 'clock',
  //   link: '/changelog/next'
  // },
  {
    text: '1.12生存',
    icon: 'cubes',
    link: "/survival_v1/",
  },
  { 
    text: '1.21空岛',
    icon: 'cloud-sun',
    link: "/skyblock/",
  },
  {
    text: "1.21生存",
    icon: "flask-vial",
    link: "/survival_v2/",
  },
  {
    text: '更多',
    icon: 'splotch',
    link: '/about/sponsor.html',
  },
  {
    text: '群组',
    icon: 'comments',
    children: [
      { 'text': 'QQ群', 'link': 'https://qm.qq.com/q/kukOXwfbvG' },
      { 'text': 'Kook', 'link': 'https://kook.top/4wZDH7' },
      { 'text': 'QQ 频道', 'link': 'https://pd.qq.com/s/5iyaamyir' },
      { 'text': 'Bilibili', 'link': 'https://space.bilibili.com/330143408/dynamic' },
      { 'text': 'QQ 小程序', 'link': 'https://m.q.qq.com/a/s/d58a856a4d9d268aa5bc43caf1839723' },
      { 'text': 'Discord', 'link': 'https://discord.gg/7McgbTS5jJ' },
    ]
  },
]);
