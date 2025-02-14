/*******************************************************
 * DARK MODE TOGGLE
 *******************************************************/
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
  // On load, read local storage and set theme
  document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      darkModeToggle.checked = true;
    }
  });
  // Listen for toggle
  darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

/*******************************************************
 * LOAD PROJECTS (only on projects.html)
 *******************************************************/
let projectData = [];
const projectCardsContainer = document.getElementById('projectCardsContainer');

if (projectCardsContainer) {
  // Fetch the JSON data
  fetch('assets/projects.json')
    .then(response => response.json())
    .then(data => {
      projectData = data;
      renderProjectCards(projectData);
    })
    .catch(err => console.error('Error loading projects:', err));
}

/*******************************************************
 * RENDER PROJECT CARDS
 *******************************************************/
function renderProjectCards(projects) {
  projectCardsContainer.innerHTML = '';

  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.setAttribute('data-index', index);

    // Thumbnail
    const img = document.createElement('img');
    img.src = project.thumbnail || 'assets/images/default.png';
    card.appendChild(img);

    // Card content
    const cardContent = document.createElement('div');
    cardContent.classList.add('card-content');

    const h3 = document.createElement('h3');
    h3.textContent = project.title;
    cardContent.appendChild(h3);

    const desc = document.createElement('p');
    desc.textContent = project.description;
    cardContent.appendChild(desc);

    card.appendChild(cardContent);
    card.addEventListener('click', () => openModal(index));
    projectCardsContainer.appendChild(card);
  });
}

/*******************************************************
 * MODAL LOGIC
 *******************************************************/
const modal = document.getElementById('projectModal');
const modalCloseBtn = document.getElementById('modalCloseBtn');
const tabLinks = document.querySelectorAll('.tablinks');
const tabContents = document.querySelectorAll('.tabcontent');

if (modalCloseBtn) {
  modalCloseBtn.addEventListener('click', closeModal);
}
window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Open modal
function openModal(index) {
  if (!modal) return;

  const project = projectData[index];
  modal.style.display = 'flex';

  // Reset tabs
  tabLinks.forEach(link => link.classList.remove('active'));
  tabContents.forEach(tc => tc.classList.remove('active'));

  // Default tab => Overview
  tabLinks[0].classList.add('active');
  tabContents[0].classList.add('active');

  // Fill Overview
  const overviewTab = document.getElementById('overviewTab');
  overviewTab.innerHTML = `
    <h2>${project.title}</h2>
    <p>${project.description}</p>
    <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>
    <p><a href="${project.repoUrl}" target="_blank">GitHub Repo</a></p>
  `;

  // Fill Live Demo
  const liveDemoTab = document.getElementById('liveDemoTab');
  if (project.liveDemo) {
    liveDemoTab.innerHTML = `
      <iframe src="${project.liveDemo}" width="100%" height="400"></iframe>
    `;
  } else {
    liveDemoTab.innerHTML = `<p>No live demo available.</p>`;
  }

  // Fill Report
  const reportTab = document.getElementById('reportTab');
  if (project.reportPdf) {
    reportTab.innerHTML = `
      <embed src="${project.reportPdf}" type="application/pdf" width="100%" height="400" />
    `;
  } else {
    reportTab.innerHTML = `<p>No report available.</p>`;
  }

  // Fill Code
  const codeTab = document.getElementById('codeTab');
  codeTab.innerHTML = '';
  if (project.codeFiles && project.codeFiles.length) {
    project.codeFiles.forEach(fileUrl => {
      fetch(fileUrl)
        .then(res => res.text())
        .then(codeContent => {
          const codeBlock = document.createElement('pre');
          // If using Prism.js or highlight.js, wrap code in <code> and highlight
          codeBlock.textContent = codeContent;
          codeTab.appendChild(codeBlock);
        })
        .catch(error => {
          const errorMsg = document.createElement('p');
          errorMsg.textContent = `Error fetching code: ${error}`;
          codeTab.appendChild(errorMsg);
        });
    });
  } else {
    codeTab.innerHTML = `<p>No code files available.</p>`;
  }
}

// Close modal
function closeModal() {
  if (!modal) return;
  modal.style.display = 'none';
}

// Tab switching
tabLinks.forEach(btn => {
  btn.addEventListener('click', () => {
    tabLinks.forEach(link => link.classList.remove('active'));
    tabContents.forEach(tc => tc.classList.remove('active'));

    btn.classList.add('active');
    const tabId = btn.getAttribute('data-tab');
    document.getElementById(tabId).classList.add('active');
  });
});

/*******************************************************
 * SORTING (OPTIONAL)
 *******************************************************/
function sortProjects() {
  const sortSelect = document.getElementById('sortSelect');
  const sortValue = sortSelect.value;

  let sorted = [...projectData];

  if (sortValue === 'date') {
    // Most recent first
    sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortValue === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  renderProjectCards(sorted);
}
window.sortProjects = sortProjects; // Expose globally if needed
