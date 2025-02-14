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
    "projectA": {
        title: "Project A - IMDB Movie Dataset",
        description: "Exploratory Data Analysis of IMDB movies.",
        image: "assets/images/projectA.jpg",
        methods: "Python, Pandas, Matplotlib",
        code: `import pandas as pd
df = pd.read_csv('imdb.csv')
df.head()`
    },
    "projectB": {
        title: "Project B - NBA Shot Analysis",
        description: "Analyzing NBA shot logs using machine learning.",
        image: "assets/images/projectB.jpg",
        methods: "Python, SQL, Seaborn",
        code: `import seaborn as sns
sns.scatterplot(x='distance', y='shot_made', data=df)`
    }
};

// Open Project Modal
function openProject(projectId) {
    const project = projects[projectId];

    document.getElementById("projectTitle").innerText = project.title;
    document.getElementById("projectDescription").innerText = project.description;
    document.getElementById("projectImage").src = project.image;
    document.getElementById("projectMethods").innerText = project.methods;
    document.getElementById("projectCode").innerText = project.code;

    document.getElementById("projectModal").style.display = "block";
}

// Close Project Modal
function closeProject() {
    document.getElementById("projectModal").style.display = "none";
}

// Tab Switching
function showTab(tab) {
    document.getElementById("reportTab").classList.add("hidden");
    document.getElementById("codeTab").classList.add("hidden");

    document.getElementById(tab + "Tab").classList.remove("hidden");
}

// Download PDF
function downloadPDF(project) {
    let pdfPath = "";
    if (project === "customerChurn") {
        pdfPath = "assets/pdf/customer_churn.pdf";
    } else if (project === "nbaAnalysis") {
        pdfPath = "assets/pdf/nba_analysis.pdf";
    }
    window.open(pdfPath, "_blank");
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
