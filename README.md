# 范瑶 · 品牌市场负责人 HTML 简历

一个面向「品牌市场负责人」竞聘的网页版简历。混合版（上半 Landing 风看亮点 + 下半完整简历看细节），多文件工程结构，HTML + Tailwind CDN + 独立 CSS/JS。

---

## 文件结构

```
fy-resume/
├── index.html              主页面（所有内容都在这里）
├── assets/
│   └── portrait.jpg        ← 把你想用作 Hero 个人照片的图放这里（命名固定）
├── styles/
│   ├── tokens.css          设计 token：颜色、字体、间距、圆角、阴影变量
│   ├── base.css            重置、排版、滚动条、@media print 打印样式
│   ├── components.css      Hero / 数据看板 / 三力 / 案例卡 / 时间轴 / 项目卡 / 教育 / 页脚 / 导航 + 响应式
│   └── animations.css      入场、hover、装饰动画
├── scripts/
│   └── main.js             滚动入场、数字 count-up、锚点高亮、移动端菜单
└── README.md
```

---

## 放个人照片（拼贴杂志风）

Hero 区右侧已经搭好「拼贴杂志风」版位，包含：

- **主图（左上、稍微逆旋转）** —— 更稳重、表情更正面的那张
- **副图（右下、顺旋转、更小）** —— 更松、更场景化的那张
- 错位的品红/暖橙**渐变色块**衬底
- **黄色 / 粉色胶带**贴角（杂志感）
- 顶部 `VOL.11 / ISSUE 001 · 2026` 编辑刊头
- 右上角倾斜的 `11 YEARS IN BRAND` 黑色徽章
- 电光蓝**圆环**、墨黑**圆点**、品红**手写星号**、虚线**箭头**装饰
- 背景透出的 `FY` 描边大字
- 底部 `No.001 — Portrait / 范瑶 · Fan Yao / Brand Marketing Lead · Beijing` 编辑型小标签

### 你需要做的

把你的两张照片重命名为以下文件名放到 `assets/` 下：

| 文件名 | 用途 | 推荐比例 |
| --- | --- | --- |
| `assets/portrait.jpg` | 主图（左上、大） | 4:5 |
| `assets/portrait-2.jpg` | 副图（右下、小） | 3:4 |

> 比如你提到的两张：登山戴头巾的可以放 `portrait.jpg` 当主图，白裙粉墙的放 `portrait-2.jpg` 当副图（粉墙正好与品红主色呼应）；当然反过来也很有效果。

**推荐参数：**

- 都用竖版照片
- 分辨率：主图 ≥ 1200 × 1500，副图 ≥ 900 × 1200
- 文件 ≤ 800 KB；偏大可用 [tinyjpg.com](https://tinyjpg.com) 压缩
- **挑选建议**：主图选「正面、表情更稳定」的；副图选「场景化、状态更松」的，主副对比能让拼贴更有杂志感

### 只想放一张照片

只放 `portrait.jpg` 即可。`portrait-2.jpg` 缺失时副图位会自动显示虚线占位框（带"02"标记），不影响其它内容。

如果想**彻底隐藏副图位**（让画面更干净），打开 `styles/components.css` 找 `.collage-photo--sub`，把整个块的 `display` 改成 `none` 即可。

### 想换文件名 / 用 PNG

打开 `index.html`，找到 `<img class="collage-img" src="assets/portrait.jpg"` 与 `src="assets/portrait-2.jpg"` 两行，把 src 改成你的文件名即可。

---

## 怎么用

### 一、本地打开

最简单的方式：**双击 `index.html`** —— 直接在 Chrome / Edge / Safari 中打开即可。
首次打开需要联网，因为页面会从 CDN 加载：

- Tailwind CSS（`https://cdn.tailwindcss.com`）
- Google Fonts（思源宋体、思源黑体、Playfair Display、Inter）

> 如果想要更顺滑的本地体验（部分浏览器对 `file://` 协议下的字体加载有限制），可以在该目录起一个本地静态服务器：
>
> ```bash
> # 任选其一：
> cd fy-resume
> python3 -m http.server 8000
> # 或
> npx serve .
> ```
>
> 然后访问 `http://localhost:8000`。

### 二、导出 PDF（用于发邮件 / 上传招聘平台）

1. 在 Chrome 或 Edge 中打开 `index.html`
2. `Cmd + P`（Mac）/ `Ctrl + P`（Win）
3. 「目标」选择「另存为 PDF」
4. **背景图形** 勾选 ✅（保留主色与渐变效果）
5. 「页面尺寸」选 A4，「布局」选纵向
6. 保存

页面已配置 `@media print`，会自动隐藏导航/滚动提示/装饰阴影，深色页脚自动转白底，链接自动转黑色。

### 三、分享给面试官

- **直接发文件**：把整个 `fy-resume/` 文件夹打成 zip 发送，对方解压后双击 `index.html` 即可。
- **托管在线版**（推荐）：
  - GitHub Pages：把 `fy-resume/` 推到一个 repo，开启 Pages，得到 `https://yourname.github.io/fy-resume/`
  - Vercel / Netlify：拖入文件夹一键部署
  - Cloudflare Pages：连接 Git 后自动部署

---

## 替换文案 / 数据

所有内容都集中在 `index.html` 中，每个 section 都有清晰注释（`<!-- ... -->`），按需修改即可。

### 常见修改位置

| 想改什么 | 在 `index.html` 中找 | 说明 |
| --- | --- | --- |
| 顶部姓名 / 标题 | `<title>...</title>` 与 `<h1 class="hero-title">` | 浏览器标签页与 Hero 主标题 |
| Hero 副标题 | `<p class="hero-sub">` | 个人概述 |
| 联系方式 | `class="hero-contact-value"` 三处 + 页脚 `footer-contact-value` 三处 | 改两处保持同步 |
| 6 个数据看板 | `<section id="stats">` 内 6 张 `<article class="stat-card">` | `data-count="数字"` 控制 count-up 终值 |
| 三力支柱 | `<section id="pillars">` 内 3 张 `<article class="pillar-card">` | 每张 1 段描述 + 3-4 个标签 |
| 4 个代表案例卡 | `<section id="cases">` | 标签色调 `data-tone="magenta\|electric\|orange"` |
| 工作经历时间轴 | `<section id="timeline">` 内 5 个 `<li class="timeline-item">` | 在职公司加 `is-current` |
| 项目明细 | `<section id="projects">` | 6 张项目卡 |
| 页脚标语 | `<h2 class="footer-tagline">` | |

### 高亮关键数据

在正文中包裹 `<em>...</em>` 标签可让数字呈现品红高亮：

```html
项目完成率 <em>164%</em>，话题阅读量 <em>2 亿</em>。
```

---

## 调整视觉

### 改主色

打开 `styles/tokens.css`，修改顶部 CSS 变量：

```css
--color-magenta: #FF2E63;     /* 主点缀色：品红 */
--color-electric: #2D6CDF;    /* 次点缀色：电光蓝 */
--color-orange: #FF8A3D;      /* 暖橙：用于渐变 */
```

如果只想换主色，把 `--color-magenta` 改成你喜欢的颜色即可（页面里大部分高亮、按钮、标签会自动跟随）。

### 改字体

仍然在 `tokens.css` 中：

```css
--font-serif:   'Noto Serif SC', ...;       /* 中文标题 */
--font-sans:    'Noto Sans SC', ...;        /* 中文正文 */
--font-display: 'Playfair Display', ...;    /* 英文衬线 */
--font-mono-num:'Inter', ...;               /* 数字 */
```

并且在 `index.html` 头部 `<link>` Google Fonts 处同步替换字体名。

---

## 离线化 Tailwind（可选）

如果你需要在内网或断网环境演示，把 Tailwind CDN 替换成本地版本：

1. 安装 Tailwind CLI：

   ```bash
   npm install -D tailwindcss
   npx tailwindcss init
   ```

2. 创建 `src/input.css`：

   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

3. 编辑 `tailwind.config.js`：

   ```js
   module.exports = {
     content: ['./index.html'],
     theme: {
       extend: {
         colors: {
           cream: '#FAF7F2',
           'cream-deep': '#F2EDE3',
           ink: '#0F0F12',
           magenta: '#FF2E63',
           electric: '#2D6CDF',
           orange: '#FF8A3D',
         },
       },
     },
   };
   ```

4. 构建：

   ```bash
   npx tailwindcss -i ./src/input.css -o ./styles/tailwind.css --minify
   ```

5. 把 `index.html` 的 CDN 引用改为：

   ```html
   <!-- 删掉 <script src="https://cdn.tailwindcss.com"></script> 与 tailwind.config 那段 -->
   <link rel="stylesheet" href="styles/tailwind.css" />
   ```

6. Google Fonts 也想离线化的话，下载 `.woff2` 放到 `assets/fonts/` 并用 `@font-face` 自托管即可。

---

## 兼容性

- 支持 Chrome / Edge / Safari / Firefox 最近 2 个大版本
- 桌面优先（≥1280 视觉效果最佳），1024 / 768 / 375 三档响应式降级
- 已为 `prefers-reduced-motion` 用户关闭动画
- 已配置语义化标签与无障碍 ARIA 属性

---

## 内容来源

页面所有数据均出自原版 `FY.pdf` 简历，未做杜撰。如需校对，可对照同级目录的 `../FY.pdf`。
