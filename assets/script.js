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
        code: `import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

# Load sample dataset
df = pd.read_csv('customer_data.csv')
X = df[['tenure', 'monthly_charges']]
y = df['churn']

# Split into train/test
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train Logistic Regression Model
model = LogisticRegression()
model.fit(X_train, y_train)
y_pred = model.predict(X_test)

print("Model Training Complete")`
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
    }
    window.open(pdfPath, "_blank");
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
