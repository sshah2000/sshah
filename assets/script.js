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
   * PROJECTS LOADING & MODAL LOGIC
   ************************************************/
  let projectData = [];

  // Load projects for projects.html
  const projectCardsContainer = document.getElementById('projectCardsContainer');
  if (projectCardsContainer) {
    (async function loadProjects() {
      try {
        const response = await fetch('assets/projects.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const projects = await response.json();
        projectData = projects.filter((p, i, self) => i === self.findIndex(t => t.id === p.id));
        projectData.sort((a, b) => new Date(b.date) - new Date(a.date));
        renderProjectCards(projectData);
        checkHashNavigation(); // Check URL hash after loading
      } catch (error) {
        console.error('Error loading projects:', error);
        projectCardsContainer.innerHTML = '<p>Unable to load projects.</p>';
      }
    })();
  }

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

  // Render project cards for projects.html
  function renderProjectCards(projects) {
    projectCardsContainer.innerHTML = '';
    projects.forEach(project => {
      const card = document.createElement('div');
      card.classList.add('project-card');
      card.id = `project-${project.id}`;
      card.innerHTML = `
        <img src="${project.thumbnail || 'assets/images/default.png'}" alt="${project.title} Thumbnail">
        <div class="card-content">
          <h3>${project.title}</h3>
          <p><strong>Date:</strong> ${project.date}</p>
          <p>${(project.description || 'No description available.').substring(0, 100)}...</p>
        </div>
      `;
      card.addEventListener('click', () => openModal(project));
      projectCardsContainer.appendChild(card);
    });
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

  // Modal setup and logic
  const modal = document.getElementById('projectModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modal) window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  function openModal(project) {
    if (!modal) return;
    modal.style.display = 'flex';

    const reportSection = document.getElementById('projectReport') || modal.querySelector('.report-section');
    if (reportSection) {
      reportSection.innerHTML = `
        <h2 style="text-align:center; text-decoration:underline; margin-bottom:1rem;">${project.title}</h2>
        <p style="text-align:center; margin-bottom:1rem;"><strong>Date:</strong> ${project.date}</p>
        <h3 style="text-decoration:underline; margin-top:1rem;">Description</h3>
        <div style="margin-left:1rem;">${project.description || 'No description available.'}</div>
        <h3 style="text-decoration:underline; margin-top:1rem;">Methodology</h3>
        <div style="margin-left:1rem;">${project.methodology || 'N/A'}</div>
        <h3 style="text-decoration:underline; margin-top:1rem;">Technologies</h3>
        ${project.technologies?.length ? `<ul style="margin-left:2rem;">${project.technologies.map(t => `<li>${t}</li>`).join('')}</ul>` : '<p style="margin-left:1rem;">No technologies listed.</p>'}
        <h3 style="text-decoration:underline; margin-top:1rem;">Story / Background</h3>
        <div style="margin-left:1rem;">${project.overview?.story || 'N/A'}</div>
        <h3 style="text-decoration:underline; margin-top:1rem;">Collected Data</h3>
        <div style="margin-left:1rem;">${project.overview?.collectedData || 'N/A'}</div>
        <h3 style="text-decoration:underline; margin-top:1rem;">Conclusions</h3>
        <div style="margin-left:1rem;">${project.overview?.conclusions || 'N/A'}</div>
        ${project.reportPdf ? `<p style="margin-top:1rem;"><strong>Project Report:</strong> <a href="${project.reportPdf}" target="_blank">View Report</a></p>` : '<p style="margin-top:1rem;"><strong>Project Report:</strong> None available.</p>'}
        ${project.resources?.length ? `
          <div style="margin-top:1rem;">
            <h3 style="text-decoration:underline;">Additional Resources</h3>
            <ul style="margin-left:1rem;">
              ${project.resources.map(r => `<li><strong>${r.name}</strong> (${r.category}) – <a href="${r.file_path}" target="_blank">View / Download</a></li>`).join('')}
            </ul>
          </div>` : '<p style="margin-top:1rem;"><strong>Additional Resources:</strong> None available.</p>'}
      `;
    }
  }

  function closeModal() {
    if (modal) modal.style.display = 'none';
  }

  // Check URL hash for modal opening (e.g., from index.html)
  function checkHashNavigation() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      const projectId = parseInt(hash, 10);
      const targetProject = projectData.find(p => p.id === projectId);
      if (targetProject) openModal(targetProject);
    }
  }

  // Sorting function for projects.html
  function sortProjects() {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect || !projectData.length) return;
    const sortValue = sortSelect.value;
    let sorted = [...projectData];
    if (sortValue === 'date') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortValue === 'title') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    renderProjectCards(sorted);
  }
  window.sortProjects = sortProjects;

  // Optional background update function
  function updateBackground(input) {
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        document.querySelector('.hero-section').style.backgroundImage = `url(${e.target.result})`;
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
  window.updateBackground = updateBackground;
});