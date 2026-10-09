(() => {
  const initAudioFix = () => {
    const button = document.getElementById("soundToggle");
    if (!button || button.dataset.audioFixBound === "1") return;
    button.dataset.audioFixBound = "1";

    const offIcon = document.getElementById("soundIconOff");
    const onIcon = document.getElementById("soundIconOn");
    const label = document.getElementById("soundBtnText");
    const eq = document.getElementById("soundEq");
    const toast = document.getElementById("audioToast");
    const toastText = document.getElementById("toastText");

    const startup = new Audio(new URL("./startup.wav", document.baseURI).href);
    const engine = new Audio(new URL("./engine.wav", document.baseURI).href);
    startup.preload = "auto";
    engine.preload = "auto";
    engine.loop = true;
    startup.volume = 0.9;
    engine.volume = 0.7;

    let active = false;
    let toastTimer;

    const notify = (message) => {
      if (!toast || !toastText) return;
      toastText.textContent = message;
      toast.classList.remove("hidden");
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => toast.classList.add("hidden"), 3200);
    };

    const showState = (on) => {
      if (offIcon) offIcon.classList.toggle("hidden", on);
      if (onIcon) onIcon.classList.toggle("hidden", !on);
      if (label) label.textContent = on ? "SOUND FX: ON" : "SOUND FX: OFF";
      if (eq) eq.classList.toggle("hidden", !on);
      button.classList.toggle("primary", on);
    };

    // Capture the click before the original handler so this works even if the
    // main animation script failed before binding its own audio handler.
    window.addEventListener("click", async (event) => {
      if (event.target !== button && !button.contains(event.target)) return;
      event.preventDefault();
      event.stopImmediatePropagation();

      if (active) {
        active = false;
        startup.pause();
        engine.pause();
        startup.currentTime = 0;
        engine.currentTime = 0;
        showState(false);
        notify("Engine sound muted");
        return;
      }

      button.disabled = true;
      try {
        startup.currentTime = 0;
        engine.currentTime = 0;
        await Promise.all([startup.play(), engine.play()]);
        active = true;
        showState(true);
        notify("Engine sound activated");
      } catch (error) {
        active = false;
        startup.pause();
        engine.pause();
        showState(false);
        console.error("[Audio Fix] Could not play WAV audio:", error);
        notify("Audio failed. Check Console and make sure WAV files are uploaded.");
      } finally {
        button.disabled = false;
      }
    }, true);

    // Adjust engine pitch while the user scrolls; audio stays user-initiated.
    window.addEventListener("scroll", () => {
      if (!active) return;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - innerHeight);
      const progress = Math.min(1, Math.abs(window.scrollY) / maxScroll);
      engine.playbackRate = 1 + progress * 0.8;
    }, { passive: true });

    showState(false);
    console.info("[Audio Fix] WAV audio handler ready.");
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAudioFix, { once: true });
  } else {
    initAudioFix();
  }
})();
