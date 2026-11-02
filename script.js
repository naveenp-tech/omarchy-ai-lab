/* ============================================================
   Punnam Naveen // Engineering Lab
   Small, dependency-free behaviour layer.
   ============================================================ */

// ---- Contact details live here only. Change them once. ----
// The personal address is deliberately NOT stored in this public file.
const siteConfig = {
  schoolEmail: "naveen.punnam@epita.fr",
};

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ============================================================
   1. Footer year
   ============================================================ */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ============================================================
   2. Apply contact config to any element with [data-config]
   ============================================================ */
document.querySelectorAll("[data-config]").forEach((el) => {
  const key = el.dataset.config;

  if (key === "school-email") {
    el.href = "mailto:" + siteConfig.schoolEmail;
    el.textContent = siteConfig.schoolEmail;
  }
});

/* ============================================================
   3. Mobile menu
   The button is hidden on desktop by CSS. On mobile, adding the
   .nav-open class to the header makes the CSS show the nav panel.
   ============================================================ */
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");

function setMenuOpen(open) {
  if (!header || !navToggle) return;
  header.classList.toggle("nav-open", open);
  navToggle.setAttribute("aria-expanded", String(open));
  navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    setMenuOpen(!header.classList.contains("nav-open"));
  });
}

// Close the panel after choosing a link, on Escape, or when resizing up.
if (primaryNav) {
  primaryNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenuOpen(false);
});

const desktopQuery = window.matchMedia("(min-width: 641px)");
if (desktopQuery.addEventListener) {
  desktopQuery.addEventListener("change", (event) => {
    if (event.matches) setMenuOpen(false);
  });
}

/* ============================================================
   4. Scroll spy — highlight the section currently in view
   IntersectionObserver watches a narrow band in the middle of the
   viewport. Whichever section crosses it becomes the active link.
   ============================================================ */
const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
const sectionToLink = new Map();

navLinks.forEach((link) => {
  const section = document.querySelector(link.getAttribute("href"));
  if (section) sectionToLink.set(section, link);
});

if ("IntersectionObserver" in window && sectionToLink.size > 0) {
  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => link.classList.remove("is-active"));
        const activeLink = sectionToLink.get(entry.target);
        if (activeLink) activeLink.classList.add("is-active");
      });
    },
    // Top 45% and bottom 50% are excluded: only the centre band counts.
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sectionToLink.forEach((_link, section) => spy.observe(section));
}

/* ============================================================
   5. Terminal typing effect
   ============================================================ */
const output = document.getElementById("terminal-output");

// Each entry is one line. "cmd" is a typed command, "out" is output,
// "ok" is a highlighted result.
const lines = [
  { text: "$ whoami", type: "cmd" },
  { text: "punnam naveen — MSc CS, Software Engineering @ EPITA Paris", type: "out" },
  { text: "$ cat focus.txt", type: "cmd" },
  { text: "AI Engineering · Python · Linux · Docker", type: "out" },
  { text: "$ ls projects/", type: "cmd" },
  { text: "loan-management  liver-cirrhosis-ml  docker-portfolio", type: "out" },
  { text: "$ docker ps", type: "cmd" },
  { text: "my-website   Up (serving this page)", type: "ok" },
  { text: "$ _", type: "cmd" },
];

function renderTerminal() {
  if (!output) return;

  if (reduceMotion) {
    output.innerHTML = lines
      .map((line) => `<span class="${line.type}">${escapeHtml(line.text)}</span>`)
      .join("\n");
    return;
  }

  let lineIndex = 0;
  let charIndex = 0;
  let buffer = "";

  function tick() {
    const line = lines[lineIndex];
    if (!line) return;

    charIndex += 1;
    const partial = line.text.slice(0, charIndex);
    output.innerHTML =
      buffer + `<span class="${line.type}">${escapeHtml(partial)}</span><span class="cursor"></span>`;

    if (charIndex < line.text.length) {
      setTimeout(tick, 18 + Math.random() * 28);
    } else {
      buffer += `<span class="${line.type}">${escapeHtml(line.text)}</span>\n`;
      lineIndex += 1;
      charIndex = 0;
      setTimeout(tick, lineIndex === lines.length ? 0 : 260);
    }
  }

  tick();
}

function escapeHtml(value) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Start typing when the terminal scrolls into view (or immediately if visible).
if (output) {
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          renderTerminal();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(output);
  } else {
    renderTerminal();
  }
}
