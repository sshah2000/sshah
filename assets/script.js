/************************************************
 * DARK MODE TOGGLE
 ************************************************/
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('darkModeToggle');
  const currentTheme = localStorage.getItem('theme') || 'light';
  
  if (currentTheme === 'dark') {
    document.body.classList.add('dark');
    if (darkModeToggle) darkModeToggle.checked = true;
  }
  
  if (darkModeToggle) {
    darkModeToggle.addEventListener('change', () => {
      document.body.classList.toggle('dark');
      localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    });
  }
});

/************************************************
 * PROJECTS LOADING & MODAL LOGIC
 ************************************************/
let projectData = [];

// Load projects if container exists
const projectCardsContainer = document.getElementById('projectCardsContainer');
if (projectCardsContainer) {
  (async function loadProjects() {
    try {
      const response = await fetch('assets/projects.json');
      projectData = await response.json();
      renderProjectCards(projectData);
    } catch (error) {
      console.error('Error loading projects:', error);
      projectCardsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
    }
  })();
}

/**
 * Render minimal info in each project card:
 *  - Thumbnail
 *  - Title
 *  - Date
 *  - A short snippet for Description
 */
function renderProjectCards(projects) {
  projectCardsContainer.innerHTML = '';

  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.setAttribute('data-index', index);

    // Thumbnail image (fallback if none)
    const imgSrc = project.thumbnail || 'assets/images/default.png';
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = project.title + " thumbnail";
    img.loading = "lazy";
    card.appendChild(img);

    // Card content container
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    // Only Title, Date, short snippet of Description
    // If your "description" is long, you can either display the full text or just a substring
    cardContent.innerHTML = `
      <h3
        style="
          text-align:center;
          margin-bottom:0.5rem;
          text-decoration:underline;
        "
      >
        ${project.title}
      </h3>

      <p><strong>Date:</strong> ${project.date}</p>
      
      <p style="margin-top:0.5rem;">
        <strong>Description:</strong>
        <br>
        <span style="margin-left:1rem;">
          ${project.description}
        </span>
      </p>
    `;

    card.appendChild(cardContent);

    // Clicking the card -> open modal
    card.addEventListener('click', () => openModal(index));
    projectCardsContainer.appendChild(card);
  });
}

// Modal logic
const modal = document.getElementById('projectModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const tabLinks = document.querySelectorAll('.tablinks');
const tabContents = document.querySelectorAll('.tabcontent');

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}
window.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

/**
 * Open the modal with a "report-like" format, centered title, underlined headings, etc.
 * Also enable scrollbar (via CSS in .modal-content).
 */
async function openModal(index) {
  if (!modal) return;
  const project = projectData[index];
  
  // Show the modal
  modal.style.display = 'flex';

  // Reset tab states
  tabLinks.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  tabContents.forEach(tc => tc.classList.remove('active'));
  tabLinks[0].classList.add('active');
  tabLinks[0].setAttribute('aria-selected', 'true');
  tabContents[0].classList.add('active');

  // Fill Overview tab with "report-like" styling
// In script.js, inside openModal(index) {...}
async function openModal(index) {
  if (!modal) return;
  const project = projectData[index];
  modal.style.display = 'flex';

  // Reset tabs
  tabLinks.forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });
  tabContents.forEach(tc => tc.classList.remove('active'));
  tabLinks[0].classList.add('active');
  tabLinks[0].setAttribute('aria-selected', 'true');
  tabContents[0].classList.add('active');

  // === REPLICATED FROM admin_preview ===
  const overviewTab = document.getElementById('overviewTab');
  overviewTab.innerHTML = `
    <h2 id="modalTitle">${project.title}</h2>
    
    <div class="section">
      <span class="field-label">Date:</span>
      ${project.date}
    </div>
    <div class="section">
      <span class="field-label">Description:</span>
      <div>${project.description || ''}</div>
    </div>
    <div class="section">
      <span class="field-label">Methodology:</span>
      <div>${project.methodology || ''}</div>
    </div>
    <div class="section">
      <span class="field-label">Technologies:</span>
      ${
        project.technologies && project.technologies.length
        ? `<ul>${project.technologies.map(t => `<li>${t}</li>`).join('')}</ul>`
        : '<em>No technologies listed</em>'
      }
    </div>
    <div class="section">
      <span class="field-label">Story/Background:</span>
      <div>${project.overview?.story || ''}</div>
    </div>
    <div class="section">
      <span class="field-label">Collected Data:</span>
      <div>${project.overview?.collectedData || ''}</div>
    </div>
    <div class="section">
      <span class="field-label">Conclusions:</span>
      <div>${project.overview?.conclusions || ''}</div>
    </div>
    ${
      project.reportPdf
        ? `<div class="section"><span class="field-label">Report:</span>
             <a href="${project.reportPdf}" target="_blank">View PDF</a></div>`
        : ''
    }
    ${
      project.repoUrl
        ? `<div class="section"><span class="field-label">GitHub Repo:</span>
             <a href="${project.repoUrl}" target="_blank">${project.repoUrl}</a></div>`
        : ''
    }
  `;

  // === CODE TAB (unchanged) ===
  const codeTab = document.getElementById('codeTab');
  codeTab.innerHTML = '';
  if (project.codeFiles && project.codeFiles.length) {
    for (const fileUrl of project.codeFiles) {
      try {
        const res = await fetch(fileUrl);
        const codeContent = await res.text();
        const codeBlock = document.createElement('pre');
        codeBlock.textContent = codeContent;
        codeTab.appendChild(codeBlock);
      } catch (error) {
        const errorMsg = document.createElement('p');
        errorMsg.textContent = `Error fetching code: ${error}`;
        codeTab.appendChild(errorMsg);
      }
    }
  } else {
    codeTab.innerHTML = `<p>No code files available.</p>`;
  }
}


function closeModal() {
  if (modal) {
    modal.style.display = 'none';
  }
}

// Tab switching logic
tabLinks.forEach(btn => {
  btn.addEventListener('click', () => {
    tabLinks.forEach(link => {
      link.classList.remove('active');
      link.setAttribute('aria-selected', 'false');
    });
    tabContents.forEach(tc => tc.classList.remove('active'));

    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

// Optional Sorting
function sortProjects() {
  const sortSelect = document.getElementById('sortSelect');
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
