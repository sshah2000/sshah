// assets/modal.js

// Wrap everything in a module to avoid polluting the global scope.
(function () {
  // Get modal elements (they must exist in the page's HTML)
  const modal = document.getElementById("projectModal");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  // Set up close event listeners
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });

  // Expose our modal functions as a global module
  window.modalModule = {
    openModal: function (project) {
      if (!modal) return;
      // Populate the detailed view elements
      document.getElementById("modalIntroduction").innerHTML = `<p>${
        project.description || "No detailed description available."
      }</p>`;
      document.getElementById("modalMethodology").innerHTML =
        project.methodology || "No methodology provided.";
      if (project.technologies && project.technologies.length) {
        document.getElementById("modalTechnologies").innerHTML =
          project.technologies.map((tech) => `<li>${tech}</li>`).join("");
      } else {
        document.getElementById("modalTechnologies").innerHTML =
          "<li>No technologies listed</li>";
      }
      document.getElementById("modalStory").innerHTML =
        project.overview?.story || "No background provided.";
      document.getElementById("modalCollectedData").innerHTML =
        project.overview?.collectedData || "No data collected.";
      document.getElementById("modalConclusions").innerHTML =
        project.overview?.conclusions || "No conclusions provided.";
      if (project.resources && project.resources.length) {
        document.getElementById("modalResources").innerHTML = project.resources
          .map(
            (resource) => `
    <li>
        <strong>${resource.name}</strong> (${resource.category}) – 
        <a href="https://https://github.com/sshah2000/sshah/assets/files${resource.file_path}" target="_blank">View</a> / 
        <a href="${resource.file_path}" download>Download</a>
    </li>
`
          )
          .join("");
      } else {
        document.getElementById("modalResources").innerHTML =
          "<li>No additional resources available.</li>";
      }
      // Display the modal
      modal.style.display = "flex";
    },
    closeModal: function () {
      if (modal) {
        modal.style.display = "none";
      }
    },
  };
})();
