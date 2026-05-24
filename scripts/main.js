/* =========================================================================
   FY Resume · 交互脚本
   - 顶部导航滚动状态
   - 滚动入场动画（IntersectionObserver）
   - 数据看板 count-up
   - 锚点导航高亮（ScrollSpy）
   - 移动端菜单
   - prefers-reduced-motion 兼容
   ========================================================================= */

(function () {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------------------------------------------------------------
  // 1. 顶部导航：滚动后加边线 / 移动端菜单展开
  // ---------------------------------------------------------------
  const nav = document.getElementById("siteNav");
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  function updateNavScrolled() {
    if (!nav) return;
    if (window.scrollY > 8) {
      nav.classList.add("is-scrolled");
    } else {
      nav.classList.remove("is-scrolled");
    }
  }
  updateNavScrolled();
  window.addEventListener("scroll", updateNavScrolled, { passive: true });

  if (navToggle && nav) {
    navToggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
  }

  // 点击移动端菜单项后自动关闭
  if (navLinks && nav) {
    navLinks.addEventListener("click", (e) => {
      const target = e.target;
      if (target instanceof HTMLAnchorElement && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        if (navToggle) navToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  // ---------------------------------------------------------------
  // 2. 滚动入场动画
  // ---------------------------------------------------------------
  const revealEls = document.querySelectorAll(".reveal, .reveal-stagger");

  if (revealEls.length) {
    if (!("IntersectionObserver" in window) || prefersReduced) {
      revealEls.forEach((el) => el.classList.add("is-in"));
    } else {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-in");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.16,
          rootMargin: "0px 0px -8% 0px",
        }
      );
      revealEls.forEach((el) => observer.observe(el));
    }
  }

  // ---------------------------------------------------------------
  // 3. 数据看板 count-up
  // ---------------------------------------------------------------
  const counterEls = document.querySelectorAll("[data-count]");

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCount(el) {
    const target = Number(el.getAttribute("data-count")) || 0;
    if (prefersReduced) {
      el.textContent = formatNumber(target);
      const numEl = el.closest(".stat-number");
      if (numEl) numEl.classList.add("is-counted");
      return;
    }

    const duration = 1400;
    const startTime = performance.now();
    const start = 0;

    function tick(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const value = Math.round(start + (target - start) * eased);

      // 处理小数（如 1.44 / 2.5）：data-count 一律按整数；小数另行处理
      el.textContent = formatNumber(value);

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent = formatNumber(target);
        const numEl = el.closest(".stat-number");
        if (numEl) numEl.classList.add("is-counted");
      }
    }

    requestAnimationFrame(tick);
  }

  function formatNumber(n) {
    return String(n);
  }

  if (counterEls.length) {
    if (!("IntersectionObserver" in window)) {
      counterEls.forEach(animateCount);
    } else {
      const counterObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              animateCount(entry.target);
              counterObs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );
      counterEls.forEach((el) => counterObs.observe(el));
    }
  }

  // ---------------------------------------------------------------
  // 4. 锚点导航高亮（ScrollSpy）
  // ---------------------------------------------------------------
  const navAnchors = document.querySelectorAll(".nav-links a[href^='#']");
  const sections = [];

  navAnchors.forEach((a) => {
    const id = a.getAttribute("href").slice(1);
    const sec = document.getElementById(id);
    if (sec) sections.push({ id, el: sec, link: a });
  });

  if (sections.length && "IntersectionObserver" in window) {
    const spyObs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const target = sections.find((s) => s.el === entry.target);
          if (!target) return;
          if (entry.isIntersecting) {
            navAnchors.forEach((a) => a.classList.remove("is-active"));
            target.link.classList.add("is-active");
          }
        });
      },
      {
        rootMargin: "-40% 0px -55% 0px",
        threshold: 0,
      }
    );
    sections.forEach((s) => spyObs.observe(s.el));
  }

  // ---------------------------------------------------------------
  // 4b. 横向职业时间轴 —— 节点点击切换面板
  // ---------------------------------------------------------------
  const careerNodes = document.querySelectorAll(".career-node");
  const careerPanels = document.querySelectorAll(".career-panel");

  if (careerNodes.length && careerPanels.length) {
    const activateNode = (node) => {
      const target = node.getAttribute("data-target");
      if (!target) return;
      if (node.classList.contains("is-active")) return;

      careerNodes.forEach((n) => {
        const active = n === node;
        n.classList.toggle("is-active", active);
        n.setAttribute("aria-pressed", String(active));
      });

      careerPanels.forEach((p) => {
        const active = p.id === target;
        p.classList.toggle("is-active", active);
        if (active) {
          p.removeAttribute("hidden");
        } else {
          p.setAttribute("hidden", "");
        }
      });
    };

    careerNodes.forEach((node) => {
      node.addEventListener("click", () => activateNode(node));
      // 悬停触发：用细微延迟避免快速滑过误触
      let hoverTimer = null;
      node.addEventListener("mouseenter", () => {
        if (hoverTimer) clearTimeout(hoverTimer);
        hoverTimer = setTimeout(() => activateNode(node), 80);
      });
      node.addEventListener("mouseleave", () => {
        if (hoverTimer) clearTimeout(hoverTimer);
      });
      // 键盘聚焦也切换
      node.addEventListener("focus", () => activateNode(node));
    });
  }

  // ---------------------------------------------------------------
  // 4c. 项目明细 —— 横向自动滚动 marquee + 左右按钮
  //     - 自动模式：CSS animation 由左→右无缝循环
  //     - 用户点击 prev/next：停止 CSS 动画，切换到 JS 控制 transform
  //     - 用户从首次点击起永久切换为手动模式（鼠标悬停依然支持暂停）
  // ---------------------------------------------------------------
  const marquees = document.querySelectorAll("[data-marquee]");
  marquees.forEach((mq) => {
    const track = mq.querySelector(".projects-marquee-track");
    if (!track) return;
    const originalCards = Array.from(track.children);
    if (originalCards.length === 0) return;

    // 克隆一份卡片实现无缝循环
    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });

    // 创建左右切换按钮
    const prevBtn = document.createElement("button");
    prevBtn.className = "marquee-nav marquee-nav--prev";
    prevBtn.type = "button";
    prevBtn.setAttribute("aria-label", "上一组项目");
    prevBtn.innerHTML = '<i class="marquee-nav-icon">‹</i>';

    const nextBtn = document.createElement("button");
    nextBtn.className = "marquee-nav marquee-nav--next";
    nextBtn.type = "button";
    nextBtn.setAttribute("aria-label", "下一组项目");
    nextBtn.innerHTML = '<i class="marquee-nav-icon">›</i>';

    mq.appendChild(prevBtn);
    mq.appendChild(nextBtn);

    // 手动模式状态
    let isManual = false;
    let currentX = 0;

    function getCardStep() {
      const card = track.querySelector(".project-card--imaged");
      if (!card) return 380;
      const gap = parseFloat(getComputedStyle(track).gap) || 24;
      return card.getBoundingClientRect().width + gap;
    }

    function getHalfTrackWidth() {
      // 由于克隆了一份，总宽度的一半即为单组卡片宽度
      return track.scrollWidth / 2;
    }

    // 第一次点击：固化当前 CSS 动画的位置 → 转 JS 控制
    function switchToManual() {
      if (isManual) return;
      isManual = true;
      const computed = getComputedStyle(track);
      // 解析当前 transform 的 X 位移
      const matrix = new DOMMatrixReadOnly(computed.transform);
      currentX = matrix.m41;
      track.style.animation = "none";
      track.style.transform = `translateX(${currentX}px)`;
      track.style.transition = "transform 0.45s cubic-bezier(.4,0,.2,1)";
    }

    function navigate(direction) {
      switchToManual();
      const step = getCardStep();
      const halfWidth = getHalfTrackWidth();
      // direction = 1 表示向右滚动看历史卡片，-1 反之
      currentX += direction * step;
      // 循环边界：保持 currentX 在 [-halfWidth, 0] 范围内
      if (currentX > 0) currentX -= halfWidth;
      if (currentX < -halfWidth) currentX += halfWidth;
      track.style.transform = `translateX(${currentX}px)`;
    }

    prevBtn.addEventListener("click", () => navigate(1));   // 上一组 = 内容右移
    nextBtn.addEventListener("click", () => navigate(-1));  // 下一组 = 内容左移

    // 键盘左右键也支持（聚焦在按钮时浏览器自带）
  });

  // ---------------------------------------------------------------
  // 5. 平滑锚点滚动（fallback，浏览器若不支持 scroll-behavior:smooth）
  // ---------------------------------------------------------------
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      const href = link.getAttribute("href");
      if (!href || href === "#") return;
      const targetEl = document.querySelector(href);
      if (!targetEl) return;
      e.preventDefault();
      const navHeight = nav ? nav.offsetHeight : 64;
      const top = targetEl.getBoundingClientRect().top + window.scrollY - navHeight + 1;
      window.scrollTo({
        top,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    });
  });
})();
