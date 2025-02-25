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


  const overviewTab = document.getElementById('overviewTab');
  overviewTab.innerHTML = `
    <h2 id="modalTitle" style="text-align:center; text-decoration:underline; margin-bottom:1rem;">${project.title}</h2>
    <p style="text-align:center; margin-bottom:1rem;"><strong>Date:</strong> ${project.date}</p>
    <h3 style="text-decoration:underline; margin-top:1rem;">Description</h3>
    <div style="margin-left:1rem;">${project.description}</div>
    <h3 style="text-decoration:underline; margin-top:1rem;">Methodology</h3>
    <div style="margin-left:1rem;">${project.methodology || 'N/A'}</div>
    <h3 style="text-decoration:underline; margin-top:1rem;">Technologies</h3>
    ${ project.technologies && project.technologies.length
        ? `<ul style="margin-left:2rem;">${project.technologies.map(t => `<li>${t}</li>`).join('')}</ul>`
        : `<p style="margin-left:1rem;"><em>No technologies listed</em></p>` }
    <h3 style="text-decoration:underline; margin-top:1rem;">Story / Background</h3>
    <div style="margin-left:1rem;">${project.overview?.story || ''}</div>
    <h3 style="text-decoration:underline; margin-top:1rem;">Collected Data</h3>
    <div style="margin-left:1rem;">${project.overview?.collectedData || ''}</div>
    <h3 style="text-decoration:underline; margin-top:1rem;">Conclusions</h3>
    <div style="margin-left:1rem;">${project.overview?.conclusions || ''}</div>
    ${ project.reportPdf ? `
      <p style="margin-top:1rem;"><strong>Report:</strong>
        <a href="${project.reportPdf}" target="_blank">View PDF</a>
      </p>
    ` : '' }
    ${ project.repoUrl ? `
      <p><strong>GitHub Repo:</strong>
        <a href="${project.repoUrl}" target="_blank">${project.repoUrl}</a>
      </p>
    ` : '' }
    ${ project.resources && project.resources.length ? `
      <div style="margin-top:1rem;">
        <h3 style="text-decoration:underline;">Additional Resources</h3>
        <ul style="margin-left:1rem;">
          ${ project.resources.map(resource => `
            <li>
              <strong>${resource.name}</strong> (${resource.category}) – 
              <a href="${resource.file_path}" target="_blank">View / Download</a>
            </li>
          `).join('') }
        </ul>
      </div>
    ` : `<p style="margin-top:1rem;"><strong>Additional Resources:</strong> None</p>` }
  `;

  // Fill Code tab
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
