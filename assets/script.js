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
    },
    "stockPrediction": {
        title: "Stock Price Prediction",
        description: "Forecasting stock prices using deep learning models.",
        image: "assets/images/stock.jpg",
        methods: "Python, TensorFlow, LSTM",
        codeFile: "assets/code/stock_prediction.py",
        pdfFile: "assets/pdf/stock_prediction.pdf"
    },
    "salesForecasting": {
        title: "Sales Forecasting",
        description: "Predicting future sales using time series analysis.",
        image: "assets/images/sales.jpg",
        methods: "Python, ARIMA, Statsmodels",
        codeFile: "assets/code/sales_forecasting.py",
        pdfFile: "assets/pdf/sales_forecasting.pdf"
    }
};

// Open Project Modal and Fetch Code File
function openProject(projectId) {
    const project = projects[projectId];

    document.getElementById("projectTitle").innerText = project.title;
    document.getElementById("projectDescription").innerText = project.description;
    document.getElementById("projectImage").src = project.image;
    document.getElementById("projectMethods").innerText = project.methods;

    // Fetch the Python code dynamically
    fetch(project.codeFile)
        .then(response => response.text())
        .then(code => {
            document.getElementById("projectCode").innerText = code;
        })
        .catch(error => console.error("Error loading code:", error));

    // Update the download button for PDF
    document.querySelector(".download-btn").setAttribute("onclick", `downloadPDF('${projectId}')`);

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

// Download PDF for selected project
function downloadPDF(projectId) {
    const pdfFile = projects[projectId].pdfFile;
    window.open(pdfFile, "_blank");
}

// Dark Mode Toggle
function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
