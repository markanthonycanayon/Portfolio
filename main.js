(() => {
  "use strict";

  const SELECTORS = {
    projectGrid: "#projectsGrid",
    menuToggle: "#menu-toggle",
    menuLabel: ".menu-icon",
    mainNav: ".main-nav",
    navLinks: ".main-nav a",
    revealItems: [
      ".projects-heading",
      ".why-intro",
      ".service-card",
      ".feature-item",
      ".project-item",
      ".experience-card",
      ".contact-inner",
      ".footer-inner"
    ].join(", "),
    pressable: ".btn-primary, .btn-outline, .header-cta, .projects-button"
  };

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function createElement(tagName, className, text) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function createProjectCard(project, index) {
    const article = createElement("article", "project-item");
    const link = createElement("a", "laptop-link");
    link.href = project.url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.setAttribute("aria-label", `View ${project.name} website`);

    const laptop = createElement("div", "laptop");
    const screen = createElement("div", "laptop-screen");
    const viewport = createElement("div", "screen-content");
    const image = createElement("img");

    image.src = project.image;
    image.alt = project.alt || `${project.name} website preview`;
    image.loading = index < 2 ? "eager" : "lazy";
    image.decoding = "async";
    if (index === 0) image.fetchPriority = "high";

    viewport.append(image);
    screen.append(viewport);

    const laptopBase = createElement("div", "laptop-base");
    laptopBase.setAttribute("aria-hidden", "true");
    laptopBase.append(createElement("span"));

    laptop.append(screen, laptopBase);
    link.append(laptop);

    const info = createElement("div", "project-info");
    const details = createElement("div", "project-details");
    details.append(
      createElement("p", "project-category", project.category),
      createElement("h3", "", project.name)
    );

   info.append(details);

    article.append(link, info);
    return article;
  }

  function renderProjects() {
    const grid = document.querySelector(SELECTORS.projectGrid);
    const data = window.PortfolioData;
    if (!grid || !data) return;

    const projects = document.body.dataset.page === "projects"
      ? data.all
      : data.featured;

    const fragment = document.createDocumentFragment();
    projects.forEach((project, index) => {
      fragment.append(createProjectCard(project, index));
    });

    grid.replaceChildren(fragment);
    initializeWebsitePreviewScroll(grid);
  }

  // The mobile menu is checkbox-driven in the existing HTML/CSS.
  // This keeps its native toggle behavior and only adds close interactions.
  function initializeMobileNavigation() {
    const toggle = document.querySelector(SELECTORS.menuToggle);
    const label = document.querySelector(SELECTORS.menuLabel);
    const nav = document.querySelector(SELECTORS.mainNav);
    if (!toggle || !nav) return;

    nav.addEventListener("click", (event) => {
      if (event.target.closest("a")) toggle.checked = false;
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape" || !toggle.checked) return;
      toggle.checked = false;
      label?.focus();
    });
  }

  function initializeScrollReveal() {
    if (prefersReducedMotion || !("IntersectionObserver" in window)) return;

    const elements = document.querySelectorAll(SELECTORS.revealItems);
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        currentObserver.unobserve(entry.target);
      });
    }, {
      threshold: 0.12,
      rootMargin: "0px 0px -36px 0px"
    });

    elements.forEach((element, index) => {
      element.classList.add("reveal-on-scroll");
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 5, 4) * 55}ms`
      );
      observer.observe(element);
    });
  }

  function initializeActiveNavigation() {
    if (!("IntersectionObserver" in window)) return;

    const links = [...document.querySelectorAll(SELECTORS.navLinks)]
      .filter((link) => link.getAttribute("href")?.startsWith("#"));

    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

      if (!visible.length) return;

      const activeId = visible[0].target.id;
      links.forEach((link) => {
        const isActive = link.getAttribute("href") === `#${activeId}`;
        link.classList.toggle("active", isActive);
        if (isActive) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    }, {
      threshold: [0.1, 0.25, 0.4],
      rootMargin: "-78px 0px -45% 0px"
    });

    sections.forEach((section) => observer.observe(section));
  }

  function initializeWebsitePreviewScroll(root = document) {
    if (prefersReducedMotion) return;

    root.querySelectorAll(".laptop-link").forEach((link) => {
      const viewport = link.querySelector(".screen-content");
      const image = viewport?.querySelector("img");
      if (!viewport || !image) return;

      const updateScrollDistance = () => {
        if (!image.naturalWidth || !image.naturalHeight) return;

        const imageHeight =
          viewport.clientWidth * (image.naturalHeight / image.naturalWidth);
        const distance = Math.max(0, imageHeight - viewport.clientHeight);

        image.style.setProperty("--scroll-distance", `${-distance}px`);
        image.style.setProperty(
          "--scroll-duration",
          `${Math.max(3, distance / 100)}s`
        );
      };

      if (image.complete) requestAnimationFrame(updateScrollDistance);
      else image.addEventListener("load", updateScrollDistance, { once: true });

      if ("ResizeObserver" in window) {
        const observer = new ResizeObserver(updateScrollDistance);
        observer.observe(viewport);
      }

      link.addEventListener("mouseenter", updateScrollDistance);
      link.addEventListener("focusin", updateScrollDistance);
    });
  }

  function initializeButtonFeedback() {
    document.querySelectorAll(SELECTORS.pressable).forEach((button) => {
      button.addEventListener("pointerdown", () => {
        button.classList.add("is-pressed");
      });

      ["pointerup", "pointerleave", "pointercancel"].forEach((eventName) => {
        button.addEventListener(eventName, () => {
          button.classList.remove("is-pressed");
        });
      });
    });
  }

  function initialize() {
    renderProjects();
    initializeMobileNavigation();
    initializeScrollReveal();
    initializeActiveNavigation();
    initializeButtonFeedback();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
