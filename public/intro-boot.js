try {
  if (
    sessionStorage.getItem("ta-intro-seen") === "1" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    document.documentElement.dataset.intro = "seen";
  }
} catch (e) {}
