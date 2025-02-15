/************************************************
 * DARK MODE TOGGLE
 ************************************************/
const darkModeToggle = document.getElementById('darkModeToggle');
if (darkModeToggle) {
  document.addEventListener('DOMContentLoaded', () => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      document.body.classList.add('dark');
      darkModeToggle.checked = true;
    }
  });

  darkModeToggle.addEventListener('change', () => {
    document.body.classList.toggle('dark');
    if (document.body.classList.contains('dark')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });
}

/************************************************
 * PROJECTS LOADING
 ************************************************/
const projectCardsContainer = document.getElementById('projectCardsContainer');
let projectData = [];

if (projectCardsContainer) {
  // Fetch projects.json
  fetch('assets/projects.json')
    .then(response => response.json())
    .then(data => {
      projectData = data;
      renderProjectCards(projectData);
    })
    .catch(err => console.error('Error loading projects:', err));
}

function renderProjectCards(projects) {
  projectCardsContainer.innerHTML = '';

  projects.forEach((project, index) => {
    // Create a card
    const card = document.createElement('div');
    card.classList.add('project-card');
    card.setAttribute('data-index', index);

    // Thumbnail (fallback to default if not provided)
    let imgSrc = project.thumbnail ? project.thumbnail : 'assets/images/default.png';
    const img = document.createElement('img');
    img.src = imgSrc;
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

    // On click -> open modal
    card.addEventListener('click', () => openModal(index));
    projectCardsContainer.appendChild(card);
  });
}

/************************************************
 * MODAL LOGIC
 ************************************************/
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

// Open modal with 2 tabs: Overview & Code
function openModal(index) {
  if (!modal) return;
  const project = projectData[index];
  modal.style.display = 'flex';

  // Reset tabs
  tabLinks.forEach(btn => btn.classList.remove('active'));
  tabContents.forEach(tc => tc.classList.remove('active'));
  tabLinks[0].classList.add('active');
  tabContents[0].classList.add('active');

  // Fill Overview
  const overviewTab = document.getElementById('overviewTab');
  overviewTab.innerHTML = `
    <h2>${project.title}</h2>
    <p><strong>Date:</strong> ${project.date}</p>
    <p><strong>Description:</strong> ${project.description}</p>
    <p><strong>Methodology:</strong> ${project.methodology || 'N/A'}</p>
    <p><strong>Technologies:</strong> ${project.technologies.join(', ')}</p>

    <!-- Multi-subsection approach -->
    <h3>Story / Background</h3>
    <p>${project.overview?.story || 'No story provided.'}</p>

    <h3>Collected Data</h3>
    <p>${project.overview?.collectedData || 'No data info provided.'}</p>

    <h3>Conclusions</h3>
    <p>${project.overview?.conclusions || 'No conclusions provided.'}</p>

    <!-- If there's a PDF or link you want to show: -->
    ${
      project.reportPdf 
        ? `<p><strong>Report:</strong> <a href="${project.reportPdf}" target="_blank">View PDF</a></p>`
        : ''
    }

    <p><strong>GitHub Repo:</strong> <a href="${project.repoUrl}" target="_blank">Link</a></p>
  `;

  // Fill Code Tab
  const codeTab = document.getElementById('codeTab');
  codeTab.innerHTML = '';

  if (project.codeFiles && project.codeFiles.length) {
    project.codeFiles.forEach(fileUrl => {
      fetch(fileUrl)
        .then(res => res.text())
        .then(codeContent => {
          const codeBlock = document.createElement('pre');
          codeBlock.textContent = codeContent;
          codeTab.appendChild(codeBlock);
          // If using Prism.js or highlight.js, you can highlight here
          // Prism.highlightAll();
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

function closeModal() {
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

/************************************************
 * OPTIONAL SORTING
 ************************************************/
function sortProjects() {
  const sortSelect = document.getElementById('sortSelect');
  const sortValue = sortSelect.value;

  let sorted = [...projectData];

  if (sortValue === 'date') {
    // newest to oldest
    sorted.sort((a, b) => new Date(b.date) - new Date(a.date));
  } else if (sortValue === 'title') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }
  renderProjectCards(sorted);
}
window.sortProjects = sortProjects; // so it can be called from the HTML