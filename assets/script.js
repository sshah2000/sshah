/************************************************
 * DYNAMIC DARK MODE TOGGLE WITH TIME-BASED AUTOMATION
 ************************************************/
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Function to determine if it's nighttime (6 PM - 6 AM)
  function isNightTime() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 18 || hour < 6; // 6 PM (18) to 6 AM (6)
  }

  // Function to apply theme based on time or user preference
  function applyTheme() {
    let preferredTheme = localStorage.getItem('theme');
    const isNight = isNightTime();

    // If no user preference, use time-based default
    if (!preferredTheme) {
      preferredTheme = isNight ? 'dark' : 'light';
      localStorage.setItem('theme', preferredTheme); // Save initial preference
    }

    // Apply the theme (prioritize user preference over time if set)
    if (preferredTheme === 'dark') {
      body.classList.add('dark');
      if (darkModeToggle) darkModeToggle.checked = true;
    } else {
      body.classList.remove('dark');
      if (darkModeToggle) darkModeToggle.checked = false;
    }
  }

  // Initial theme application
  applyTheme();

  // Manual toggle handler
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      const isDark = darkModeToggle.checked;
      body.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  }

  // Optional: Periodically check time and update theme (e.g., every hour)
  setInterval(() => {
    if (!localStorage.getItem('theme')) { // Only update if no user preference
      applyTheme();
    }
  }, 3600000); // Check every hour (3600000 ms)
});
