import GroupLink from "./components/group_link.js"
import SlimefunCatalog from "./components/slimefun_catalog.vue";
import { defineClientConfig } from "vuepress/client";
import { setupTransparentNavbar } from "vuepress-theme-hope/presets/transparentNavbar.js";

export default defineClientConfig({
  enhance: ({ app }) => {
    app.component("GroupLink", GroupLink);
    app.component("SlimefunCatalog", SlimefunCatalog);
  },
  // setup: () => {
  //   setupTransparentNavbar({ type: "all", light: "#333", dark: "#bbb" });
  // },
});