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
 * Render the project cards in a format that resembles your admin preview
 */
function renderProjectCards(projects) {
  projectCardsContainer.innerHTML = '';

  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.setAttribute('data-index', index);

    // Thumbnail with fallback
    const imgSrc = project.thumbnail || 'assets/images/default.png';
    const img = document.createElement('img');
    img.src = imgSrc;
    img.alt = project.title + " thumbnail";
    img.loading = "lazy";
    card.appendChild(img);

    // Card content container
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    // Build a more detailed HTML snippet, matching "admin_preview" style
    cardContent.innerHTML = `
      <h3 
        style="
          text-align:center;
          font-weight:bold;
          text-decoration: underline;
          font-size:1.2rem;
          margin-bottom:1rem;
        "
      >
        ${project.title}
      </h3>
      
      <p><strong>Date:</strong> ${project.date}</p>
      
      <p><strong>Description:</strong><br>${project.description}</p>
      
      <p><strong>Methodology:</strong><br>${project.methodology || 'N/A'}</p>
      
      <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
      
      <h4 style="margin-top:1rem;">Story / Background:</h4>
      <div>${project.overview?.story || 'No story provided.'}</div>
      
      <h4 style="margin-top:1rem;">Collected Data:</h4>
      <div>${project.overview?.collectedData || 'No data info provided.'}</div>
      
      <h4 style="margin-top:1rem;">Conclusions:</h4>
      <div>${project.overview?.conclusions || 'No conclusions provided.'}</div>
      
      ${
        project.reportPdf 
        ? `<p><strong>Report:</strong> 
             <a href="${project.reportPdf}" target="_blank">View PDF</a>
           </p>`
        : ''
      }
      <p><strong>GitHub Repo:</strong> 
         <a href="${project.repoUrl}" target="_blank">${project.repoUrl}</a></p>
    `;

    card.appendChild(cardContent);

    // Click card to open the modal
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
 * Opens the project modal and populates the Overview & Code tabs
 */
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

  // Fill Overview tab
  const overviewTab = document.getElementById('overviewTab');
  overviewTab.innerHTML = `
    <h2 id="modalTitle">${project.title}</h2>
    <p><strong>Date:</strong> ${project.date}</p>
    <p><strong>Description:</strong> ${project.description}</p>
    <p><strong>Methodology:</strong> ${project.methodology || 'N/A'}</p>
    <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
    <h3>Story / Background</h3>
    <p>${project.overview?.story || 'No story provided.'}</p>
    <h3>Collected Data</h3>
    <p>${project.overview?.collectedData || 'No data info provided.'}</p>
    <h3>Conclusions</h3>
    <p>${project.overview?.conclusions || 'No conclusions provided.'}</p>
    ${project.reportPdf ? `<p><strong>Report:</strong> <a href="${project.reportPdf}" target="_blank">View PDF</a></p>` : ''}
    <p><strong>GitHub Repo:</strong> <a href="${project.repoUrl}" target="_blank">Link</a></p>
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

// Optional Sorting function (if sort UI is uncommented)
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
