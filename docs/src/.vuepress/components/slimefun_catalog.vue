<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { routes } from "../.temp/internal/routes.js";

type RouteMeta = {
  meta?: {
    title?: string;
  };
};

type Group = "全部" | "机器" | "物流" | "资源" | "装备" | "科技" | "食物" | "魔法" | "其他";

type SlimefunEntry = {
  path: string;
  title: string;
  slug: string;
  group: Group;
  searchIndex: string;
};

type PageSizeOption = number | "all";

const props = withDefaults(
  defineProps<{
    includePaths?: string[];
    excludePaths?: string[];
    featuredSlugs?: string[];
  }>(),
  {
    includePaths: () => ["/survival_v2/slimefun/items/"],
    excludePaths: () => [],
    featuredSlugs: () => ["Juices", "Food", "Basic-Machines", "Resources", "Tools"],
  }
);

const groupOrder: Group[] = ["全部", "机器", "物流", "资源", "装备", "科技", "食物", "魔法", "其他"];
const pageSizeOptions = [25, 50, 75, "all"] as const;
const searchText = ref("");
const activeGroup = ref<Group>("全部");
const pageSize = ref<PageSizeOption>(50);
const currentPage = ref(1);
const featuredSlugSet = computed(() => new Set(props.featuredSlugs));

const titleKeywords = {
  机器: ["机", "电", "反应", "工作台", "压", "炉", "电池", "充电", "装置", "组装", "矿筛", "洗矿", "泵", "收集机", "淘金", "扫描器", "冰柜"],
  物流: ["货运", "末影箱"],
  资源: ["锭", "粉", "矿", "合金", "资源", "结晶", "线", "板", "布料", "燃料", "原油", "塑料", "水晶", "盐", "硅", "铀", "钚", "镁", "铜", "铁", "金", "银", "铅", "锡", "镍", "锌", "钢", "黄铜", "青铜", "碳", "钻石", "蓝宝石", "祖母绿", "冷却剂"],
  装备: ["镐", "斧", "剑", "弓", "防具", "工具", "背包", "护符", "靴", "喷气背包", "喷气靴", "武器", "多功能", "磁铁", "图腾", "法杖", "抓钩"],
  科技: ["GPS", "泵", "开采", "扫描", "电梯"],
  食物: ["食物", "饮料", "汁", "饼干"],
  魔法: ["魔法", "灵魂", "古代", "彩虹", "远古", "符文", "图腾", "卷轴"],
} as const;

const routeMap = routes as Record<string, RouteMeta>;

const shouldIncludePath = (path: string): boolean =>
  props.includePaths.some((prefix) => path.startsWith(prefix)) &&
  !props.excludePaths.some((prefix) => path === prefix || path.startsWith(prefix));

const classifyEntry = (slug: string, title: string): Group => {
  const haystack = `${slug} ${title}`.toLowerCase();

  for (const group of groupOrder) {
    if (group === "全部" || group === "其他") continue;

    if (titleKeywords[group].some((keyword) => haystack.includes(keyword.toLowerCase()))) {
      return group;
    }
  }

  if (haystack.includes("android") || haystack.includes("机器人")) return "机器";
  return "其他";
};

const entries = computed<SlimefunEntry[]>(() =>
  Object.entries(routeMap)
    .filter(([path]) => shouldIncludePath(path))
    .map(([path, route]) => {
      const slug = path.split("/").filter(Boolean).pop() ?? "";
      const title = route.meta?.title?.trim() || slug.replace(/-/g, " ");
      const searchIndex = `${title} ${slug} ${path.replace(/[/-]+/g, " ")}`.toLowerCase();

      return {
        path,
        slug,
        title,
        group: classifyEntry(slug, title),
        searchIndex,
      };
    })
    .sort((left, right) => left.title.localeCompare(right.title, "zh-CN"))
);

const counts = computed(() => {
  const result = Object.fromEntries(groupOrder.map((group) => [group, 0])) as Record<Group, number>;

  for (const entry of entries.value) {
    result[entry.group] += 1;
    result["全部"] += 1;
  }

  return result;
});

const filteredEntries = computed(() => {
  const normalizedQuery = searchText.value.trim().toLowerCase();

  return entries.value.filter((entry) => {
    if (featuredSlugSet.value.has(entry.slug)) {
      return false;
    }

    const matchesGroup = activeGroup.value === "全部" || entry.group === activeGroup.value;
    const matchesQuery =
      normalizedQuery.length === 0 ||
      entry.searchIndex.includes(normalizedQuery);

    return matchesGroup && matchesQuery;
  });
});

const totalPages = computed(() => {
  if (pageSize.value === "all") return 1;

  return Math.max(1, Math.ceil(filteredEntries.value.length / pageSize.value));
});

const pagedEntries = computed(() => {
  if (pageSize.value === "all") return filteredEntries.value;

  const startIndex = (currentPage.value - 1) * pageSize.value;
  return filteredEntries.value.slice(startIndex, startIndex + pageSize.value);
});

const pageStart = computed(() => {
  if (filteredEntries.value.length === 0) return 0;
  if (pageSize.value === "all") return 1;

  return (currentPage.value - 1) * pageSize.value + 1;
});

const pageEnd = computed(() => {
  if (pageSize.value === "all") return filteredEntries.value.length;

  return Math.min(currentPage.value * pageSize.value, filteredEntries.value.length);
});

const pageButtonItems = computed<(number | string)[]>(() => {
  if (totalPages.value <= 7) {
    return Array.from({ length: totalPages.value }, (_, index) => index + 1);
  }

  const items: (number | string)[] = [1];
  let start = Math.max(2, currentPage.value - 1);
  let end = Math.min(totalPages.value - 1, currentPage.value + 1);

  if (currentPage.value <= 3) {
    end = 4;
  }

  if (currentPage.value >= totalPages.value - 2) {
    start = totalPages.value - 3;
  }

  if (start > 2) {
    items.push("ellipsis-left");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages.value - 1) {
    items.push("ellipsis-right");
  }

  items.push(totalPages.value);

  return items;
});

const featuredEntries = computed(() =>
  entries.value.filter((entry) => featuredSlugSet.value.has(entry.slug))
);

watch([searchText, activeGroup, pageSize, () => props.includePaths.join("|"), () => props.excludePaths.join("|")], () => {
  currentPage.value = 1;
});

watch(totalPages, (value) => {
  if (currentPage.value > value) {
    currentPage.value = value;
  }
});
</script>

<template>
  <section class="slimefun-catalog">
    <header class="slimefun-catalog__hero">
      <div>
        <p class="slimefun-catalog__eyebrow">Slimefun 1.21</p>
        <h2>目录索引</h2>
        <p class="slimefun-catalog__lead">
          在这里按分类浏览全部条目，或直接搜索名称快速跳转。
        </p>
      </div>
      <label class="slimefun-catalog__search">
        <span>搜索</span>
        <input v-model="searchText" type="search" placeholder="输入中文名、英文名或关键词" />
      </label>
    </header>

    <div v-if="featuredEntries.length" class="slimefun-catalog__featured">
      <a v-for="entry in featuredEntries" :key="entry.path" :href="entry.path" class="slimefun-catalog__featured-card">
        <strong>{{ entry.title }}</strong>
        <span>{{ entry.group }}</span>
      </a>
    </div>

    <nav class="slimefun-catalog__tabs" aria-label="Slimefun 分类">
      <button
        v-for="group in groupOrder"
        :key="group"
        class="slimefun-catalog__tab"
        :class="{ 'is-active': activeGroup === group }"
        type="button"
        @click="activeGroup = group"
      >
        <span>{{ group }}</span>
        <small>{{ counts[group] }}</small>
      </button>
    </nav>

    <p class="slimefun-catalog__summary">
      当前显示第 <strong>{{ pageStart }}</strong> - <strong>{{ pageEnd }}</strong> 条，共 {{ filteredEntries.length }} 条筛选结果，全部目录合计 {{ counts["全部"] }} 条文档。
    </p>

    <div class="slimefun-catalog__limit">
      <span>单次显示</span>
      <button
        v-for="size in pageSizeOptions"
        :key="size"
        class="slimefun-catalog__limit-button"
        :class="{ 'is-active': pageSize === size }"
        type="button"
        @click="pageSize = size"
      >
        {{ size === "all" ? "全部" : size }}
      </button>
    </div>

    <div v-if="pagedEntries.length" class="slimefun-catalog__grid">
      <a v-for="entry in pagedEntries" :key="entry.path" :href="entry.path" class="slimefun-catalog__card">
        <strong>{{ entry.title }}</strong>
        <span>{{ entry.group }}</span>
        <code>{{ entry.slug }}</code>
      </a>
    </div>

    <div v-if="totalPages > 1" class="slimefun-catalog__pager">
      <button
        class="slimefun-catalog__pager-button"
        type="button"
        :disabled="currentPage === 1"
        @click="currentPage -= 1"
      >
        上一页
      </button>
      <div class="slimefun-catalog__pager-pages" aria-label="分页">
        <template v-for="item in pageButtonItems" :key="item">
          <span v-if="typeof item === 'string'" class="slimefun-catalog__pager-ellipsis">...</span>
          <button
            v-else
            class="slimefun-catalog__pager-number"
            :class="{ 'is-active': currentPage === item }"
            type="button"
            @click="currentPage = item"
          >
            {{ item }}
          </button>
        </template>
      </div>
      <p class="slimefun-catalog__pager-info">第 {{ currentPage }} / {{ totalPages }} 页</p>
      <button
        class="slimefun-catalog__pager-button"
        type="button"
        :disabled="currentPage >= totalPages"
        @click="currentPage += 1"
      >
        下一页
      </button>
    </div>

    <p v-else class="slimefun-catalog__empty">没有匹配的条目，试试更短的关键字或者切换分类。</p>
  </section>
</template>

<style scoped>
.slimefun-catalog {
  margin: 1.5rem 0 2.5rem;
  --slimefun-surface-border: rgba(15, 23, 42, 0.08);
  --slimefun-surface-border-strong: rgba(180, 83, 9, 0.35);
  --slimefun-surface-shadow: 0 12px 28px rgba(15, 23, 42, 0.08);
  --slimefun-surface-shadow-rest: 0 1px 2px rgba(15, 23, 42, 0.04);
  --slimefun-card-outline: inset 0 1px 0 rgba(255, 255, 255, 0.28);
  --slimefun-card-bg: var(--vp-c-bg-soft);
}

:global(html[data-theme="dark"]) .slimefun-catalog {
  --slimefun-surface-border: rgba(248, 250, 252, 0.28);
  --slimefun-surface-border-strong: rgba(251, 191, 36, 0.62);
  --slimefun-surface-shadow: 0 18px 38px rgba(0, 0, 0, 0.42);
  --slimefun-surface-shadow-rest: 0 10px 24px rgba(0, 0, 0, 0.3);
  --slimefun-card-outline: inset 0 1px 0 rgba(255, 255, 255, 0.08), inset 0 0 0 1px rgba(248, 250, 252, 0.05);
  --slimefun-card-bg: linear-gradient(180deg, rgba(30, 41, 59, 0.92), rgba(15, 23, 42, 0.9));
}

.slimefun-catalog__hero {
  display: grid;
  gap: 1.25rem;
  grid-template-columns: minmax(0, 2fr) minmax(260px, 1fr);
  padding: 1.5rem;
  border: 1px solid var(--slimefun-surface-border);
  border-radius: 20px;
  background:
    radial-gradient(circle at top right, rgba(250, 204, 21, 0.18), transparent 28%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.03), rgba(15, 23, 42, 0.01));
}

.slimefun-catalog__eyebrow {
  margin: 0 0 0.35rem;
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b45309;
}

.slimefun-catalog__hero h2 {
  margin: 0;
  font-size: clamp(1.8rem, 3vw, 2.4rem);
}

.slimefun-catalog__lead {
  margin: 0.75rem 0 0;
  color: var(--vp-c-text-mute);
}

.slimefun-catalog__search {
  display: grid;
  gap: 0.55rem;
  align-self: end;
  font-weight: 600;
}

.slimefun-catalog__search span {
  font-size: 0.9rem;
}

.slimefun-catalog__search input {
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid var(--slimefun-surface-border);
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.85);
  background-color: rgba(255, 255, 255, 0.85);
  color: var(--vp-c-text);
  caret-color: #b45309;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.slimefun-catalog__search input::placeholder {
  color: var(--vp-c-text-mute);
  opacity: 1;
}

.slimefun-catalog__search input:focus {
  outline: none;
  border-color: var(--slimefun-surface-border-strong);
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.12);
}

.slimefun-catalog__featured {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  margin: 1rem 0 1.25rem;
}

.slimefun-catalog__featured-card,
.slimefun-catalog__card {
  display: grid;
  gap: 0.4rem;
  padding: 1rem 1.1rem;
  border: 1px solid var(--slimefun-surface-border);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  background: var(--slimefun-card-bg);
  box-shadow: var(--slimefun-card-outline), var(--slimefun-surface-shadow-rest);
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
}

.slimefun-catalog__featured-card:hover,
.slimefun-catalog__card:hover {
  transform: translateY(-2px);
  border-color: var(--slimefun-surface-border-strong);
  box-shadow: var(--slimefun-card-outline), var(--slimefun-surface-shadow);
}

.slimefun-catalog__featured-card span,
.slimefun-catalog__card span {
  color: #b45309;
  font-size: 0.86rem;
  font-weight: 700;
}

.slimefun-catalog__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin: 1.25rem 0 0.9rem;
}

.slimefun-catalog__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding: 0.65rem 0.95rem;
  border: 1px solid var(--slimefun-surface-border);
  border-radius: 999px;
  background: var(--vp-c-bg);
  cursor: pointer;
}

.slimefun-catalog__tab small {
  padding: 0.12rem 0.45rem;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.06);
}

.slimefun-catalog__tab.is-active {
  border-color: #b45309;
  background: rgba(245, 158, 11, 0.1);
  color: #92400e;
}

.slimefun-catalog__summary,
.slimefun-catalog__empty {
  color: var(--vp-c-text-mute);
}

.slimefun-catalog__limit {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.6rem;
  margin: 0 0 1rem;
}

.slimefun-catalog__limit span {
  color: var(--vp-c-text-mute);
  font-size: 0.92rem;
}

.slimefun-catalog__limit-button {
  min-width: 3.5rem;
  padding: 0.45rem 0.75rem;
  border: 1px solid var(--slimefun-surface-border);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.slimefun-catalog__limit-button.is-active {
  border-color: var(--slimefun-surface-border-strong);
  background: rgba(245, 158, 11, 0.12);
  box-shadow: var(--slimefun-card-outline), var(--slimefun-surface-shadow-rest);
}

.slimefun-catalog__pager {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  margin-top: 1rem;
}

.slimefun-catalog__pager-pages {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.45rem;
  flex: 1 1 14rem;
}

.slimefun-catalog__pager-info {
  margin: 0;
  color: var(--vp-c-text-mute);
}

.slimefun-catalog__pager-button {
  min-width: 5.5rem;
  padding: 0.6rem 0.9rem;
  border: 1px solid var(--slimefun-surface-border);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, opacity 0.18s ease, background-color 0.18s ease;
}

.slimefun-catalog__pager-button:hover:not(:disabled) {
  border-color: var(--slimefun-surface-border-strong);
  box-shadow: var(--slimefun-card-outline), var(--slimefun-surface-shadow-rest);
}

.slimefun-catalog__pager-number {
  min-width: 2.6rem;
  padding: 0.55rem 0.7rem;
  border: 1px solid var(--slimefun-surface-border);
  border-radius: 999px;
  background: var(--vp-c-bg);
  color: inherit;
  cursor: pointer;
  transition: border-color 0.18s ease, box-shadow 0.18s ease, background-color 0.18s ease;
}

.slimefun-catalog__pager-number:hover {
  border-color: var(--slimefun-surface-border-strong);
  box-shadow: var(--slimefun-card-outline), var(--slimefun-surface-shadow-rest);
}

.slimefun-catalog__pager-number.is-active {
  border-color: var(--slimefun-surface-border-strong);
  background: rgba(245, 158, 11, 0.12);
  box-shadow: var(--slimefun-card-outline), var(--slimefun-surface-shadow-rest);
}

.slimefun-catalog__pager-ellipsis {
  padding: 0 0.1rem;
  color: var(--vp-c-text-mute);
}

.slimefun-catalog__pager-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.slimefun-catalog__grid {
  display: grid;
  gap: 0.9rem;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.slimefun-catalog__card code {
  font-size: 0.78rem;
  color: var(--vp-c-text-mute);
  word-break: break-all;
}

@media (max-width: 719px) {
  .slimefun-catalog {
    margin: 1rem 0 2rem;
  }

  .slimefun-catalog__hero {
    grid-template-columns: 1fr;
    gap: 0.9rem;
    padding: 1rem;
    border-radius: 16px;
  }

  .slimefun-catalog__hero h2 {
    font-size: 1.55rem;
  }

  .slimefun-catalog__lead {
    margin-top: 0.45rem;
    font-size: 0.92rem;
    line-height: 1.45;
  }

  .slimefun-catalog__search {
    gap: 0.4rem;
  }

  .slimefun-catalog__search input {
    padding: 0.72rem 0.85rem;
    border-radius: 12px;
  }

  .slimefun-catalog__featured {
    gap: 0.65rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    margin: 0.85rem 0 1rem;
  }

  .slimefun-catalog__featured-card,
  .slimefun-catalog__card {
    gap: 0.28rem;
    padding: 0.8rem 0.82rem;
    border-radius: 14px;
    min-width: 0;
  }

  .slimefun-catalog__featured-card strong,
  .slimefun-catalog__card strong {
    font-size: clamp(0.76rem, 2.85vw, 0.9rem);
    line-height: 1.2;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .slimefun-catalog__featured-card span,
  .slimefun-catalog__card span {
    font-size: clamp(0.68rem, 2.45vw, 0.76rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .slimefun-catalog__tabs {
    gap: 0.45rem;
    margin: 0.95rem 0 0.7rem;
    justify-content: center;
  }

  .slimefun-catalog__tab {
    gap: 0.4rem;
    padding: 0.48rem 0.72rem;
    font-size: 0.88rem;
    border-color: rgba(15, 23, 42, 0.18);
    box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.03);
  }

  .slimefun-catalog__tab small {
    padding: 0.1rem 0.35rem;
    font-size: 0.74rem;
  }

  .slimefun-catalog__summary {
    margin: 0 0 0.75rem;
    font-size: 0.9rem;
    line-height: 1.45;
  }

  .slimefun-catalog__limit {
    gap: 0.45rem;
    margin-bottom: 0.85rem;
    justify-content: center;
  }

  .slimefun-catalog__limit span {
    font-size: 0.86rem;
  }

  .slimefun-catalog__limit-button {
    min-width: 3.1rem;
    padding: 0.4rem 0.62rem;
    font-size: 0.85rem;
  }

  .slimefun-catalog__grid {
    gap: 0.65rem;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .slimefun-catalog__pager {
    justify-content: center;
    gap: 0.55rem;
    margin-top: 0.85rem;
  }

  .slimefun-catalog__pager-pages {
    order: 1;
    flex: 0 0 100%;
    width: 100%;
    justify-content: center;
  }

  .slimefun-catalog__pager-info {
    order: 2;
    flex: 0 0 100%;
    text-align: center;
    font-size: 0.86rem;
  }

  .slimefun-catalog__pager-button {
    min-width: 4.7rem;
    padding: 0.5rem 0.75rem;
    font-size: 0.86rem;
  }

  .slimefun-catalog__pager-number {
    min-width: 2.25rem;
    padding: 0.42rem 0.55rem;
    font-size: 0.84rem;
  }

  .slimefun-catalog__pager-ellipsis {
    font-size: 0.85rem;
  }

  .slimefun-catalog__card code {
    font-size: clamp(0.62rem, 2.2vw, 0.68rem);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  :global(html[data-theme="dark"]) .slimefun-catalog__tab,
  :global(html[data-theme="dark"]) .slimefun-catalog__limit-button,
  :global(html[data-theme="dark"]) .slimefun-catalog__pager-button,
  :global(html[data-theme="dark"]) .slimefun-catalog__pager-number {
    background: rgba(15, 23, 42, 0.9);
    border-color: rgba(248, 250, 252, 0.4);
    box-shadow:
      inset 0 0 0 1px rgba(248, 250, 252, 0.08),
      0 0 0 1px rgba(15, 23, 42, 0.55),
      0 6px 16px rgba(0, 0, 0, 0.24);
  }

  :global(html[data-theme="dark"]) .slimefun-catalog__tab small {
    background: rgba(248, 250, 252, 0.08);
  }

  :global(html[data-theme="dark"]) .slimefun-catalog__tab.is-active,
  :global(html[data-theme="dark"]) .slimefun-catalog__limit-button.is-active,
  :global(html[data-theme="dark"]) .slimefun-catalog__pager-number.is-active {
    border-color: rgba(251, 191, 36, 0.72);
    box-shadow:
      inset 0 0 0 1px rgba(251, 191, 36, 0.16),
      0 0 0 1px rgba(15, 23, 42, 0.58),
      0 8px 18px rgba(0, 0, 0, 0.28);
  }

  :global(html[data-theme="dark"]) .slimefun-catalog__featured-card,
  :global(html[data-theme="dark"]) .slimefun-catalog__card {
    border-color: rgba(248, 250, 252, 0.34);
    box-shadow:
      inset 0 0 0 1px rgba(248, 250, 252, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.06),
      0 12px 26px rgba(0, 0, 0, 0.34);
  }
}
</style>