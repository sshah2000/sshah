import os
import json
import subprocess
import shutil
from datetime import datetime
from flask import Flask, request, render_template, redirect, url_for, flash
from werkzeug.utils import secure_filename
# app.py (Add this near the top with other imports)
from flask import Flask, request, render_template, redirect, url_for, flash, jsonify

app = Flask(__name__)
app.secret_key = "abc"  # Change this to a secure key

@app.route("/")
def home():
    return """
    <h1>Welcome to your Portfolio Admin Panel</h1>
    <p>Click <a href='/admin'>here</a> to redirect to the admin page.</p>
    """

@app.route('/admin/preview/<int:index>')
def admin_preview(index):
    projects = load_projects()
    if index < 0 or index >= len(projects):
        return "Invalid project index."
    
    project = projects[index]
    return render_template('admin_preview.html', project=project, index=index)


# Configuration paths – adjust if needed
PROJECTS_JSON_PATH = os.path.join("assets", "projects.json")
IMAGES_DIR = os.path.join("assets", "images")
FILES_DIR = os.path.join("assets", "files")

def load_projects():
    """Load the current projects list."""
    if not os.path.exists(PROJECTS_JSON_PATH):
        return []
    with open(PROJECTS_JSON_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_projects(project_list):
    """Save the updated projects list to JSON."""
    with open(PROJECTS_JSON_PATH, 'w', encoding='utf-8') as f:
        json.dump(project_list, f, indent=2)
        f.write('\n')

def save_uploaded_file(file_obj, dest_dir):
    """Save an uploaded file and return its relative path."""
    if file_obj and file_obj.filename:
        filename = secure_filename(file_obj.filename)
        os.makedirs(dest_dir, exist_ok=True)
        file_path = os.path.join(dest_dir, filename)
        file_obj.save(file_path)
        rel_path = os.path.relpath(file_path).replace("\\", "/")
        return rel_path
    return ""

def commit_and_push_changes(commit_msg):
    """Stage changes, commit, and push to GitHub using local Git."""
    subprocess.run(["git", "add", PROJECTS_JSON_PATH])
    subprocess.run(["git", "add", IMAGES_DIR, FILES_DIR])
    subprocess.run(["git", "commit", "-m", commit_msg])
    print("[INFO] Pushing changes to GitHub...")
    subprocess.run(["git", "push"])
    print("[SUCCESS] Changes are now live on your portfolio!")

# -----------------------------
# Admin Dashboard – List & Add Projects
# -----------------------------
@app.route('/admin')
def admin_dashboard():
    projects = load_projects()
    return render_template('admin_dashboard.html', projects=projects)

@app.route('/admin/add', methods=['POST'])
def admin_add():
    # Gather form data for the new project
    title = request.form.get('title', '').strip()
    if not title:
        flash("Project Title is required.")
        return redirect(url_for('admin_dashboard'))
    date_str = request.form.get('date', '').strip() or str(datetime.today().date())
    description = request.form.get('description', '').strip()
    methodology = request.form.get('methodology', '').strip()
    techs = request.form.get('technologies', '').strip()
    technologies = [t.strip() for t in techs.split(',') if t.strip()] if techs else []
    live_demo = request.form.get('live_demo', '').strip()
    repo_url = request.form.get('repo_url', '').strip()
    codefiles_str = request.form.get('code_files', '').strip()
    code_files = [cf.strip() for cf in codefiles_str.split(',') if cf.strip()] if codefiles_str else []
    
    # Process file uploads for thumbnail and PDF
    thumbnail_file = request.files.get('thumbnail')
    if thumbnail_file and thumbnail_file.filename != '':
        thumbnail_rel = save_uploaded_file(thumbnail_file, IMAGES_DIR)
    else:
        thumbnail_rel = "assets/images/default.png"
    report_pdf_file = request.files.get('report_pdf')
    report_pdf_path = ""
    if report_pdf_file and report_pdf_file.filename != '':
        report_pdf_path = save_uploaded_file(report_pdf_file, FILES_DIR)
    
    # Overview sections
    story = request.form.get('story', '').strip()
    collected_data = request.form.get('collected_data', '').strip()
    conclusions = request.form.get('conclusions', '').strip()
    
    new_project = {
        "title": title,
        "date": date_str,
        "description": description,
        "methodology": methodology,
        "technologies": technologies,
        "thumbnail": thumbnail_rel,
        "liveDemo": live_demo,
        "repoUrl": repo_url,
        "codeFiles": code_files,
        "reportPdf": report_pdf_path,
        "overview": {
            "story": story,
            "collectedData": collected_data,
            "conclusions": conclusions
        }
    }
    
    projects = load_projects()
    projects.append(new_project)
    save_projects(projects)
    flash("Project added successfully!")
    
    # Deploy if requested
    if request.form.get('deploy'):
        commit_and_push_changes(f"Add new project: {title}")
        flash("Deployed changes to GitHub!")
    return redirect(url_for('admin_dashboard'))

# -----------------------------
# Delete a Project
# -----------------------------
@app.route('/admin/delete/<int:index>', methods=['POST'])
def admin_delete(index):
    projects = load_projects()
    if 0 <= index < len(projects):
        project_title = projects[index].get('title', 'Untitled')
        del projects[index]
        save_projects(projects)
        flash(f'Project "{project_title}" deleted.')
        commit_and_push_changes(f"Delete project: {project_title}")
    else:
        flash("Invalid project index.")
    return redirect(url_for('admin_dashboard'))

# -----------------------------
# Edit a Project
# -----------------------------
@app.route('/admin/edit/<int:index>', methods=['GET', 'POST'])
def admin_edit(index):
    projects = load_projects()
    if index < 0 or index >= len(projects):
        flash("Invalid project index.")
        return redirect(url_for('admin_dashboard'))
    
    project = projects[index]
    
    if request.method == 'POST':
        # Update fields
        project['title'] = request.form.get('title', project['title']).strip()
        project['date'] = request.form.get('date', project['date']).strip() or str(datetime.today().date())
        project['description'] = request.form.get('description', project['description']).strip()
        project['methodology'] = request.form.get('methodology', project['methodology']).strip()
        techs = request.form.get('technologies', '')
        project['technologies'] = [t.strip() for t in techs.split(',') if t.strip()] if techs else project['technologies']
        project['liveDemo'] = request.form.get('live_demo', project.get('liveDemo', '')).strip()
        project['repoUrl'] = request.form.get('repo_url', project.get('repoUrl', '')).strip()
        codefiles_str = request.form.get('code_files', '')
        project['codeFiles'] = [cf.strip() for cf in codefiles_str.split(',') if cf.strip()] if codefiles_str else project['codeFiles']
        
        # Process file uploads if new ones provided
        thumbnail_file = request.files.get('thumbnail')
        if thumbnail_file and thumbnail_file.filename != '':
            project['thumbnail'] = save_uploaded_file(thumbnail_file, IMAGES_DIR)
        report_pdf_file = request.files.get('report_pdf')
        if report_pdf_file and report_pdf_file.filename != '':
            project['reportPdf'] = save_uploaded_file(report_pdf_file, FILES_DIR)
        
        # Update overview sections
        project['overview']['story'] = request.form.get('story', project['overview'].get('story','')).strip()
        project['overview']['collectedData'] = request.form.get('collected_data', project['overview'].get('collectedData','')).strip()
        project['overview']['conclusions'] = request.form.get('conclusions', project['overview'].get('conclusions','')).strip()
        
        projects[index] = project
        save_projects(projects)
        flash("Project updated successfully!")
        
        if request.form.get('deploy'):
            commit_and_push_changes(f"Edit project: {project['title']}")
            flash("Deployed changes to GitHub!")
        return redirect(url_for('admin_dashboard'))
    
    # GET: Render the edit form pre-filled with project data.
    return render_template('admin_edit.html', project=project, index=index)

if __name__ == "__main__":
    # Run on localhost only
    app.run(debug=True, host="127.0.0.1")
