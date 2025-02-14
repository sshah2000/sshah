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

// Open Project Modal and Fetch Code
function openProject(projectId) {
    const project = projects[projectId];

    document.getElementById("projectTitle").innerText = project.title;
    document.getElementById("projectDescription").innerText = project.description;
    document.getElementById("projectImage").src = project.image;
    document.getElementById("projectMethods").innerText = project.methods;

    // Dynamically load PDF inside the Report tab
    document.getElementById("reportTab").innerHTML = `
        <h2>Report</h2>
        <iframe src="${project.pdfFile}" width="100%" height="500px"></iframe>
        <a href="${project.pdfFile}" class="download-btn" target="_blank">📥 Download Full Report</a>
    `;

    // Fetch and highlight Python code
    fetch(project.codeFile)
        .then(response => response.text())
        .then(code => {
            document.getElementById("projectCode").innerHTML = `<pre><code class="language-python">${code}</code></pre>`;
            Prism.highlightAll();
        })
        .catch(error => console.error("Error loading code:", error));

    document.getElementById("projectModal").style.display = "block";
}

// Switch Tabs & Highlight Active
function showTab(tab) {
    document.querySelectorAll(".tab-content").forEach(content => content.classList.remove("active"));
    document.getElementById(tab + "Tab").classList.add("active");

    document.querySelectorAll(".tab-btn").forEach(button => button.classList.remove("active"));
    document.querySelector(`button[onclick="showTab('${tab}')"]`).classList.add("active");
}

// Close Modal
function closeProject() {
    document.getElementById("projectModal").style.display = "none";
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", document.body.classList.contains("dark-mode") ? "enabled" : "disabled");
}

// Apply Dark Mode if it was enabled before
window.onload = function() {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
    }
};

