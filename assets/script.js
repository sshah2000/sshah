document.addEventListener("DOMContentLoaded", function() {
    const sections = document.querySelectorAll("section");
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = "translateY(20px)";
    });

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = "translateY(0)";
                entry.target.style.transition = "all 0.6s ease-out";
            }
        });
    });

    sections.forEach(section => observer.observe(section));
});

// Project Data
const projects = {
    "customerChurn": {
        title: "Customer Churn Analysis",
        description: "Using machine learning to predict customer churn.",
        image: "assets/images/churn.jpg",
        methods: "Python, Scikit-Learn, Logistic Regression",
        codeFile: "assets/code/customer_churn.py",
        pdfFile: "assets/pdf/customer_churn.pdf"
    }
};

// Open Project Modal and Load Data
function openProject(projectId) {
    const project = projects[projectId];

    // Update modal content dynamically
    document.getElementById("projectTitle").innerText = project.title;
    document.getElementById("projectDescription").innerText = project.description;
    document.getElementById("projectImage").src = project.image;
    document.getElementById("projectMethods").innerText = project.methods;

    // Load Report inside the Report Tab
    document.getElementById("reportTab").innerHTML = `
        <h2>Report</h2>
        <iframe src="${project.pdfFile}" width="100%" height="500px" style="border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);"></iframe>
        <a href="${project.pdfFile}" class="download-btn" target="_blank">📥 Download Full Report</a>
    `;

    // Fetch Python Code and Apply Syntax Highlighting
    fetch(project.codeFile)
        .then(response => response.text())
        .then(code => {
            document.getElementById("projectCode").innerHTML = `<pre><code class="language-python">${code}</code></pre>`;
            Prism.highlightAll();  // Apply syntax highlighting
        })
        .catch(error => console.error("Error loading code:", error));

    // Show modal with animation
    const modal = document.getElementById("projectModal");
    modal.style.opacity = "0";  // Start hidden
    modal.style.transform = "translateY(-20px)";
    modal.style.display = "block";  // Show modal

    // Smooth fade-in effect
    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.transform = "translateY(0)";
    }, 50);

    // Default: Show Report Tab first
    showTab('report');
}

// Switch Tabs & Highlight Active
function showTab(tab) {
    // Hide all tabs
    document.getElementById("reportTab").classList.add("hidden");
    document.getElementById("codeTab").classList.add("hidden");

    // Remove active state from buttons
    document.querySelectorAll(".tab-btn").forEach(button => button.classList.remove("active"));

    // Show the selected tab
    document.getElementById(tab + "Tab").classList.remove("hidden");

    // Highlight the active tab button
    document.querySelector(`button[onclick="showTab('${tab}')"]`).classList.add("active");
}

// Close Modal with Smooth Animation
function closeProject() {
    const modal = document.getElementById("projectModal");

    // Fade out effect before hiding
    modal.style.opacity = "0";
    modal.style.transform = "translateY(-20px)";

    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
}

// Dark Mode Toggle with Persistent Storage
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");

    // Save preference in localStorage
    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("darkMode", "enabled");
    } else {
        localStorage.setItem("darkMode", "disabled");
    }
}

// Apply Dark Mode if enabled before
window.onload = function () {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
};
