import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  '/start': [
    {
      text: '开始',
      icon: 'signs-post',
      link: '/start/',
    },
    {
      text: '入门指南',
      icon: 'lightbulb',
      link: '/start/help.md',
    },
    {
      text: '常见问题',
      icon: 'circle-question',
      link: '/start/FAQ/',
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

  '/survival_v1': [
    {
      text: '1.12生存',
      icon: 'lightbulb',
      link: '/survival_v1/',
      prefix: '/survival_v1/',
      collapsible: true,
      children: [
        'mcmmo.md',
        'slimefun.md',
      ]
    },
  ],

  '/skyblock': [
    {
      text: '1.21空岛',
      icon: 'cubes',
      link: "/skyblock/",
      prefix: "/skyblock/",
      collapsible: true,
      children: [
        "enchantment/index.md",
      ]
    },
  ],

  '/survival_v2': [
    {
      text: "1.21生存",
      icon: "flask-vial",
      link: "/survival_v2/",
      prefix: "/survival_v2/",
      collapsible: true,
      children: [
        "dominion.md",
        "auraskills.md",
        {
          text: '粘液科技',
          link: "slimefun/",
        },
      ],
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

  '/survival_v2/slimefun': [
    {
      text: "← 回到1.21生存主目录",
      link: "/survival_v2/",
      collapsible: false,
      prefix: "/survival_v2/slimefun/",
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
