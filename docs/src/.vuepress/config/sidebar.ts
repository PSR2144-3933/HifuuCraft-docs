import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  '/start': [
    {
      text: '服务器介绍',
      icon: 'signs-post',
      link: '/start/',
      children: [
        '/start/help.md',
        '/start/plugin/skinsrestorer.md'
      ]
    },
    {
      text: '1.12生存',
      icon: 'lightbulb',
      link: "/start/survival_old/",
      prefix: "/start/survival_old/",
      collapsible: true,
      children: [
        'mcmmo.md',
        'slimefun.md',
      ]
    },
    {
      text: '1.21空岛',
      icon: 'cubes',
      link: "/start/skyblock/",
      prefix: "/start/skyblock/",
      collapsible: true,
      children: [
        "enchantment/index.md",
      ]
    },
    {
      text: "1.21生存",
      icon: "flask-vial",
      link: "/start/survival_new/",
      prefix: "/start/survival_new/",
      collapsible: true,
      children: [
        "dominion.md",
        "aurelium.md",
        "slimefun/readme.md"
      ]
    },
    // {
    //   text: '更新日志',
    //   icon: 'clock',
    //   link: '/changelog/next'
    // },
    {
      text: '更多',
      icon: 'splotch',
      link: '/about/',
    },
  ],
  '/about': [
    {
      text: '贡献指南',
      collapsible: false,
      children: [
        '/about/contribute/zh_style.md',
        '/about/contribute/md_style.md',
        '/about/contribute/md_grammar.md',
      ]
    },
    {
      text: '赞助',
      collapsible: false,
      link: '/about/sponsor.html',
    },
  ],
});
