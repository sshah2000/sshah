/************************************************
 * DYNAMIC DARK MODE TOGGLE WITH AUTO MODE
 ************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const darkModeToggle = document.getElementById("darkModeToggle");
  const autoModeToggle = document.getElementById("autoModeToggle");
  const body = document.body;

  // Function to determine if it's nighttime (6 PM - 6 AM)
  function isNightTime() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 18 || hour < 6;
  }

  // Function to apply theme based on time or user preference
  function applyTheme() {
    let preferredTheme = localStorage.getItem("theme");
    const isNight = isNightTime();

    if (!preferredTheme || preferredTheme === "auto") {
      preferredTheme = isNight ? "dark" : "light";
      localStorage.setItem("theme", "auto");
      autoModeToggle?.classList.add("active");
    } else {
      autoModeToggle?.classList.remove("active");
    }

    if (preferredTheme === "dark") {
      body.classList.add("dark");
      darkModeToggle.checked = true;
    } else {
      body.classList.remove("dark");
      darkModeToggle.checked = false;
    }
  }

  // Initial theme application
  applyTheme();

  // Manual dark mode toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener("change", () => {
      const isDark = darkModeToggle.checked;
      body.classList.toggle("dark", isDark);
      localStorage.setItem("theme", isDark ? "dark" : "light");
      autoModeToggle?.classList.remove("active");
    });
  }

  // Auto Mode toggle logic
  if (autoModeToggle) {
    autoModeToggle.addEventListener("click", () => {
      localStorage.setItem("theme", "auto");
      applyTheme();
    });
  }

  // Periodic check for auto mode updates
  setInterval(() => {
    if (localStorage.getItem("theme") === "auto") {
      applyTheme();
    }
  }, 3600000); // Check every hour
});
