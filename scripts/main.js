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
  // 4c. 项目明细 —— 横向自动滚动 marquee
  //     克隆一份卡片实现无缝循环，CSS 已用 translateX(-50%) → 0
  // ---------------------------------------------------------------
  const marquees = document.querySelectorAll("[data-marquee]");
  marquees.forEach((mq) => {
    const track = mq.querySelector(".projects-marquee-track");
    if (!track) return;
    const cards = Array.from(track.children);
    if (cards.length === 0) return;
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      track.appendChild(clone);
    });
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
