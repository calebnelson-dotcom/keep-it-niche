// ================================
// SCRAMJET PROXY HANDLER
// ================================

// Grab elements — they may NOT exist on other pages.
const form = document.getElementById("sj-form");
const addressInput = document.getElementById("sj-address");
const errorEl = document.getElementById("sj-error");
const errorCodeEl = document.getElementById("sj-error-code");

// Only initialize Scramjet logic if the Home page has proxy elements
if (form && addressInput) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const raw = addressInput.value.trim();
    if (!raw) return;

    try {
      // Scramjet navigate call
      if (window.$scramjetLoadController) {
        window.$scramjetLoadController.navigate(raw);
      } else {
        console.error("Scramjet controller missing");
      }
    } catch (err) {
      console.error(err);
      if (errorEl) errorEl.textContent = "Failed to load page.";
      if (errorCodeEl) errorCodeEl.textContent = err.stack || err;
    }
  });

  // Optional: Enter to trigger proxy safely
  addressInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") form.dispatchEvent(new Event("submit"));
  });
}

// ================================
// GLOBAL DARK / LIGHT MODE
// ================================

(function () {
  const saved = localStorage.getItem("theme");
  if (saved === "light") document.documentElement.classList.add("light");
})();

// ================================
// TAB CLOAKING (GLOBAL)
// ================================

(function () {
  const data = JSON.parse(localStorage.getItem("tabcloak") || "{}");

  if (data.title) document.title = data.title;
  if (data.icon) {
    const link = document.querySelector("link[rel='shortcut icon']");
    if (link) link.href = data.icon;
  }
})();
