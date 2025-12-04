// global-hub.js
// Shared settings: tab cloaking + accent color across all pages.

(function () {
  const ACCENT_KEY = "s0laceAccent";
  const CLOAK_KEY = "s0laceTabCloak";

  const ACCENTS = {
    green: {
      accent: "#00ff7f",
      soft: "rgba(0, 255, 127, 0.12)",
    },
    violet: {
      accent: "#a855f7",
      soft: "rgba(168, 85, 247, 0.12)",
    },
    amber: {
      accent: "#fbbf24",
      soft: "rgba(251, 191, 36, 0.12)",
    },
  };

  function setCssVar(name, value) {
    document.documentElement.style.setProperty(name, value);
  }

  // ---------- ACCENT THEME ----------

  function applyAccent(accentKey, save = true) {
    const preset = ACCENTS[accentKey] || ACCENTS.green;
    setCssVar("--accent", preset.accent);
    setCssVar("--accent-soft", preset.soft);
    if (save) {
      try {
        localStorage.setItem(ACCENT_KEY, accentKey);
      } catch (_) {}
    }
  }

  function loadAccent() {
    let stored;
    try {
      stored = localStorage.getItem(ACCENT_KEY);
    } catch (_) {
      stored = null;
    }
    if (!stored || !ACCENTS[stored]) stored = "green";
    applyAccent(stored, false);
    return stored;
  }

  // ---------- TAB CLOAKING ----------

  function getOrCreateFaviconLink() {
    let link =
      document.querySelector('link[rel="shortcut icon"]') ||
      document.querySelector('link[rel="icon"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "shortcut icon";
      document.head.appendChild(link);
    }
    return link;
  }

  function applyTabCloak(cfg, save = true) {
    if (!cfg || !cfg.enabled) return;

    const title = cfg.title || document.title;
    const iconHref = cfg.iconHref || "";

    document.title = title;

    if (iconHref) {
      const link = getOrCreateFaviconLink();
      link.href = iconHref;
    }

    if (save) {
      try {
        localStorage.setItem(
          CLOAK_KEY,
          JSON.stringify({
            enabled: true,
            title,
            iconHref,
          })
        );
      } catch (_) {}
    }
  }

  function clearTabCloak(save = true) {
    // Reload original title from data attribute if present, else leave as-is
    const originalTitle = document.documentElement.getAttribute(
      "data-original-title"
    );
    if (originalTitle) document.title = originalTitle;

    // Reset favicon to whatever is in HTML already
    // (we don't store the original, so we just don't touch it.)

    if (save) {
      try {
        localStorage.removeItem(CLOAK_KEY);
      } catch (_) {}
    }
  }

  function loadTabCloak() {
    let raw;
    try {
      raw = localStorage.getItem(CLOAK_KEY);
    } catch (_) {
      raw = null;
    }
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw);
      if (!parsed || !parsed.enabled) return null;
      applyTabCloak(parsed, false);
      return parsed;
    } catch (_) {
      return null;
    }
  }

  // ---------- LOAD ON EVERY PAGE ----------

  function bootstrap() {
    // store original title for reset
    if (!document.documentElement.getAttribute("data-original-title")) {
      document.documentElement.setAttribute("data-original-title", document.title);
    }

    const activeAccent = loadAccent();
    loadTabCloak();

    // Fire a simple event so pages can react if they want
    const evt = new CustomEvent("s0lace:settingsLoaded", {
      detail: { accent: activeAccent },
    });
    window.dispatchEvent(evt);
  }

  document.addEventListener("DOMContentLoaded", bootstrap);

  // expose helpers for settings.html
  window.S0LACE = {
    applyAccent,
    applyTabCloak,
    clearTabCloak,
    loadAccent,
  };
})();
