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

  });


  function openModal(project) {
    const modal = document.getElementById('projectModal');
    const report = document.getElementById('projectReport');
    const thumbnail = document.getElementById('modalThumbnail');
    if (!modal || !report || !thumbnail) return;
    thumbnail.src = project.thumbnail || 'assets/images/default.png';
    report.innerHTML = `
      <h2>${project.title}</h2>
      <p><strong>Date:</strong> ${project.date}</p>
      <h3>Description</h3>
      <p>${project.description || 'No description available.'}</p>
      <h3>Methodology</h3>
      <p>${project.methodology || 'N/A'}</p>
      <h3>Technologies</h3>
      ${project.technologies && project.technologies.length
        ? `<ul><li>${project.technologies.join('</li><li>')}</li></ul>`
        : '<p>No technologies listed</p>'}
      <h3>Story / Background</h3>
      <p>${project.overview?.story || ''}</p>
      <h3>Collected Data</h3>
      <p>${project.overview?.collectedData || ''}</p>
      <h3>Conclusions</h3>
      <p>${project.overview?.conclusions || ''}</p>
      ${project.resources && project.resources.length
        ? `
          <h3>Additional Resources</h3>
          <ul>
            ${project.resources.map(resource => `
              <li><strong>${resource.name}</strong> (${resource.category}) – 
                <span class="resource-links">
                  ${isImageFile(resource.file_path)
                    ? `<a href="#" onclick="openImageViewer('${resource.file_path}'); return false;">View</a>`
                    : `<a href="${resource.file_path}" target="_blank">View</a>`}
                  <a href="${resource.file_path}" download>Download</a>
                </span>
              </li>
            `).join('')}
          </ul>
        `
        : '<p>No additional resources available.</p>'}
      ${project.reportPdf
        ? `
          <h3>Project Report</h3>
          <p>
            <span class="resource-links">
              <a href="${project.reportPdf}" target="_blank">View</a>
              <a href="${project.reportPdf}" download>Download</a>
            </span>
          </p>
        `
        : '<p>No project report available.</p>'}
    `;
    modal.style.display = 'flex';
  }