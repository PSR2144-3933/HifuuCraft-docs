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
      link: "/start/survival_v1/",
      prefix: "/start/survival_v1/",
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
      link: "/start/survival_v2/",
      prefix: "/start/survival_v2/",
      collapsible: true,
      children: [
        "dominion.md",
        "aurelium.md",
        {
          text: '粘液科技',
          link: "slimefun/",
        },
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

  '/start/survival_v2/slimefun': [
    {
      text: "← 回到1.21生存主目录",
      link: "/start/survival_v2/",
      collapsible: false,
      prefix: "/start/survival_v2/slimefun/",
    },

    '',
    {
      text: "总览",
      children: [
        'Getting-Started.md',
        'Commands.md',
        'Common-Issues.md',
      ]
    },
    'catalog.md'

  ],
});
