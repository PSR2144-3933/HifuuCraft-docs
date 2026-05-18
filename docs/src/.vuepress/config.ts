import { defineUserConfig } from "vuepress";
import theme from "./theme.js";
import { removeHtmlExtensionPlugin } from 'vuepress-plugin-remove-html-extension';
import { baiduAnalyticsPlugin } from '@vuepress/plugin-baidu-analytics';
import { getDirname, path } from 'vuepress/utils';

const __dirname = getDirname(import.meta.url);


export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  host: '0.0.0.0',
  title: '云梦都 MC',
  description: '帮助文档',
  head: [
    [
      'link', { rel: 'icon', href: '/images/logo.webp' }
    ],
  ],
  theme,
  plugins: [
    baiduAnalyticsPlugin({
      id: "7a0d3a4e8454cc167b63e7dc1de54488"
    }),
    removeHtmlExtensionPlugin(),

    /* 如果有人会的话可以在theme.ts里面用licenseGetter和copyrightGetter去实现修改,我觉得那样好一点 */
    {
      name: "set-slimefun-license",
      extendsPage: (page) => {
        if (page.path.includes("/slimefun/") && !page.path.endsWith("note")){
          page.frontmatter.license = "CC-BY-NC-SA-4.0";
          page.frontmatter.copyright =
            "CC-BY-NC-SA-4.0 Licensed | Copyright © 2019-present MelodyYuuka";
        }
      },
    },
  ],
  clientConfigFile: path.resolve(__dirname, "./client.ts"),
});
