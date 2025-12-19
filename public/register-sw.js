// register-sw.js
(async () => {
  if (!("serviceWorker" in navigator)) return;

  const SW_URL = "/sw.js";
  const SW_SCOPE = "/";

  try {
    // Check if the SW is already in control
    if (!navigator.serviceWorker.controller) {
      const registration = await navigator.serviceWorker.getRegistration(SW_SCOPE);
      
      if (registration) {
        // SW exists but isn't controlling this tab yet. 
        // Force it to activate and then reload.
        console.log("[SW] Found registration but no controller. Activating...");
        location.reload();
        return;
      } else {
        // FIRST EVER VISIT
        console.log("[SW] Registering for the first time...");
        await navigator.serviceWorker.register(SW_URL, { scope: SW_SCOPE });
        
        // Wait for the SW to be ready before reloading
        await navigator.serviceWorker.ready;
        location.reload();
        return;
      }
    }

    console.log("[SW] Controller active:", navigator.serviceWorker.controller.scriptURL);
  } catch (err) {
    console.error("[SW] Bootstrap error:", err);
  }
})();
