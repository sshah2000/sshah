/************************************************
 * DYNAMIC DARK MODE TOGGLE WITH AUTO MODE
 ************************************************/
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const autoModeToggle = document.getElementById('autoModeToggle');
  const body = document.body;

  // Function to determine if it's nighttime (6 PM - 6 AM)
  function isNightTime() {
    const now = new Date();
    const hour = now.getHours();
    return hour >= 18 || hour < 6;
  }

  // Function to apply theme based on time or user preference
  function applyTheme() {
    let preferredTheme = localStorage.getItem('theme');
    const isNight = isNightTime();

    if (!preferredTheme || preferredTheme === 'auto') {
      preferredTheme = isNight ? 'dark' : 'light';
      localStorage.setItem('theme', 'auto');
      autoModeToggle?.classList.add('active');
    } else {
      autoModeToggle?.classList.remove('active');
    }

    if (preferredTheme === 'dark') {
      body.classList.add('dark');
      darkModeToggle.checked = true;
    } else {
      body.classList.remove('dark');
      darkModeToggle.checked = false;
    }
  }

  // Initial theme application
  applyTheme();

  // Manual dark mode toggle
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      const isDark = darkModeToggle.checked;
      body.classList.toggle('dark', isDark);
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      autoModeToggle?.classList.remove('active');
    });
  }

  // Auto Mode toggle logic
  if (autoModeToggle) {
    autoModeToggle.addEventListener('click', () => {
      localStorage.setItem('theme', 'auto');
      applyTheme();
    });
  }

  // Periodic check for auto mode updates
  setInterval(() => {
    if (localStorage.getItem('theme') === 'auto') {
      applyTheme();
    }
  }, 3600000); // Check every hour

  /************************************************
   * NAVBAR AND FOOTER TEMPLATES
   ************************************************/
  const navbarHTML = `
    <header class="navbar" role="banner">
      <div class="nav-content">
        <div class="logo">MyPortfolio</div>
        <nav class="menu" role="navigation">
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="projects.html">Projects</a>
          <a href="contact.html">Contact</a>
        </nav>
        <div class="theme-controls">
          <label class="switch">
            <input type="checkbox" id="darkModeToggle" aria-label="Toggle dark mode">
            <span class="slider round"></span>
          </label>
          <button id="autoModeToggle" class="auto-switch">Auto</button>
        </div>
      </div>
    </header>
  `;

  const footerHTML = `
    <footer class="footer">
      <p>© 2025 Shubh Shah | <a href="https://github.com/sshah2000" target="_blank">GitHub</a> | 
      <a href="https://www.linkedin.com/in/shubh-shah-054463211" target="_blank">LinkedIn</a> | 
      <a href="/cdn-cgi/l/email-protection#c3b0abb6a1abb0aba2abf1f3f3f383baa2abacaceda0acae">Email</a></p>
    </footer>
  `;

  // Inject Navbar and Footer
  document.body.insertAdjacentHTML('afterbegin', navbarHTML);
  document.body.insertAdjacentHTML('beforeend', footerHTML);

  // Update active link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  /************************************************
   * PROJECTS LOADING FOR INDEX.HTML
   ************************************************/
  let projectData = [];

  // Load recent projects for index.html
  const recentProjectsContainer = document.getElementById('recentProjects');
  if (recentProjectsContainer) {
    (async function loadRecentProjects() {
      try {
        const response = await fetch('assets/projects.json');
        const projects = await response.json();
        projectData = projects.filter((p, i, self) => i === self.findIndex(t => t.id === p.id));
        projectData.sort((a, b) => new Date(b.date) - new Date(a.date));
        const recent = projectData.slice(0, 3);
        renderRecentProjectCards(recent);
      } catch (error) {
        console.error('Error loading recent projects:', error);
        recentProjectsContainer.innerHTML = '<p>Unable to load recent projects.</p>';
      }
    })();
  }

  // Render recent project cards for index.html
  function renderRecentProjectCards(projects) {
    recentProjectsContainer.innerHTML = '';
    projects.forEach(project => {
      const card = document.createElement('div');
      card.classList.add('project-card');
      card.innerHTML = `
        <img src="${project.thumbnail || 'assets/images/default.png'}" alt="${project.title} Thumbnail">
        <h3>${project.title}</h3>
        <p><strong>Date:</strong> ${project.date}</p>
        <p>${(project.description || 'No description available.').substring(0, 100)}...</p>
      `;
      card.addEventListener('click', () => {
        window.location.href = `projects.html#${project.id}`;
      });
      recentProjectsContainer.appendChild(card);
    });
  }
});