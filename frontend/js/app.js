const API_URL = '/api';

// Utility: Show Alert
function showAlert(message, type = 'danger') {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        alertBox.classList.remove('d-none');
        setTimeout(() => alertBox.classList.add('d-none'), 5000);
    }
}

// Global Auth & Initialization
document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');
    
    // Pages that require auth
    const securePages = ['dashboard.html', 'assessment.html', 'resources.html', 'profile.html', 'resume-builder.html', 'admin.html'];
    const isSecure = securePages.some(page => window.location.pathname.includes(page));
    
    if (isSecure && !token) {
        window.location.href = 'index.html';
        return;
    }

    if (isSecure) {
        try {
            const res = await fetch(`${API_URL}/auth/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const user = await res.json();
                
                // Set Name Displays
                const nameDisplays = document.querySelectorAll('#userNameDisplay, #nav-user-name');
                nameDisplays.forEach(el => el.textContent = `Welcome, ${user.name}`);
                
                // Show Admin Panel link conditionally
                if (user.role === 'admin') {
                    const adminLinks = document.querySelectorAll('.admin-only-link');
                    adminLinks.forEach(el => el.classList.remove('d-none'));
                }

                // Dashboard specific logic: Status Overview
                if (window.location.pathname.includes('dashboard.html')) {
                    // Profile Completion
                    const fields = ['education', 'skills', 'interests', 'careerGoal', 'familyIncome'];
                    let filledCount = 0;
                    fields.forEach(f => {
                        if (user[f] && user[f].trim() !== '') filledCount++;
                    });
                    const completionPct = (filledCount / fields.length) * 100;
                    
                    const progressText = document.getElementById('profile-completion-text');
                    const progressBar = document.getElementById('profile-progress-bar');
                    if (progressText && progressBar) {
                        progressText.textContent = `${completionPct}%`;
                        progressBar.style.width = `${completionPct}%`;
                    }

                    // Assessment Status
                    const badge = document.getElementById('assessment-status-badge');
                    if (badge) {
                        if (user.assessmentCompleted) {
                            badge.textContent = 'Completed';
                            badge.classList.replace('bg-secondary', 'bg-success');
                            
                            if (user.lastRecommendations && user.lastRecommendations.length > 0) {
                                const recContainer = document.getElementById('latest-recommendations-container');
                                const matchTitle = document.getElementById('latest-match-title');
                                if (recContainer && matchTitle) {
                                    matchTitle.textContent = `${user.lastRecommendations[0].title} (${user.lastRecommendations[0].matchPercentage}% Match)`;
                                    recContainer.classList.remove('d-none');
                                }
                            }
                        } else {
                            badge.textContent = 'Pending';
                            badge.classList.replace('bg-success', 'bg-secondary');
                        }
                    }
                }
            } else {
                logout();
            }
        } catch (e) {
            console.error('Auth verification failed', e);
            showAlert('Server connection failed. Please try again later.');
        }
    }
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// Auth: Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                showAlert(data.error || 'Login failed');
            }
        } catch (error) {
            showAlert('Network error');
        }
    });
}

// Auth: Register
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password })
            });
            const data = await res.json();
            
            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                window.location.href = 'dashboard.html';
            } else {
                showAlert(data.error || 'Registration failed');
            }
        } catch (error) {
            showAlert('Network error');
        }
    });
}



// Chat functionality
const chatForm = document.getElementById('chatForm');
if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const input = document.getElementById('chatInput');
        const btn = document.getElementById('chatBtn');
        const chatBox = document.getElementById('chatBox');
        
        const prompt = input.value.trim();
        if(!prompt) return;
        
        // Add user message
        const userMsg = document.createElement('div');
        userMsg.className = 'mb-2 text-end';
        userMsg.innerHTML = `<span class="bg-primary text-white p-2 rounded d-inline-block">${prompt}</span>`;
        chatBox.appendChild(userMsg);
        
        input.value = '';
        btn.disabled = true;
        btn.textContent = '...';
        chatBox.scrollTop = chatBox.scrollHeight;
        
        try {
            const res = await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ prompt })
            });
            const data = await res.json();
            
            const aiMsg = document.createElement('div');
            aiMsg.className = 'mb-2 text-start';
            if (res.ok) {
                aiMsg.innerHTML = `<span class="bg-white border p-2 rounded d-inline-block">${data.reply.replace(/\n/g, '<br>')}</span>`;
            } else {
                aiMsg.innerHTML = `<span class="bg-danger text-white p-2 rounded d-inline-block">Error: ${data.error}</span>`;
                if(res.status === 401) logout();
            }
            chatBox.appendChild(aiMsg);
        } catch (error) {
            const errorMsg = document.createElement('div');
            errorMsg.className = 'mb-2 text-start';
            errorMsg.innerHTML = `<span class="bg-danger text-white p-2 rounded d-inline-block">Network error</span>`;
            chatBox.appendChild(errorMsg);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Send';
            chatBox.scrollTop = chatBox.scrollHeight;
        }
    });
}

// Resume Upload functionality
const resumeForm = document.getElementById('resumeForm');
if (resumeForm) {
    resumeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fileInput = document.getElementById('resumeFile');
        const btn = document.getElementById('resumeBtn');
        const resultsDiv = document.getElementById('resumeResults');
        const suggestionsBox = document.getElementById('resumeSuggestions');
        
        if(fileInput.files.length === 0) return;
        
        btn.disabled = true;
        btn.textContent = 'Uploading...';
        resultsDiv.classList.add('d-none');
        
        const formData = new FormData();
        formData.append('resume', fileInput.files[0]);
        
        try {
            const res = await fetch(`${API_URL}/resume/upload`, {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            const data = await res.json();
            
            if (res.ok) {
                suggestionsBox.textContent = data.suggestions;
                resultsDiv.classList.remove('d-none');
                showAlert('Resume uploaded and analyzed!', 'success');
            } else {
                showAlert(data.error || 'Upload failed');
                if(res.status === 401) logout();
            }
        } catch (error) {
            showAlert('Network error');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Upload & Analyze';
        }
    });
}

// Assessment MCQ Logic
const quizQuestions = [
    {
        question: "Which of the following activities do you enjoy the most?",
        options: [
            "Solving logical puzzles and math problems",
            "Helping others and teaching",
            "Drawing, writing, or creating art",
            "Building or fixing physical objects"
        ]
    },
    {
        question: "How do you prefer to work?",
        options: [
            "Independently, focusing deeply on a task",
            "In a team, collaborating with others",
            "Leading a group and making decisions"
        ]
    },
    {
        question: "What kind of problems do you like solving?",
        options: [
            "Technical or computer-related problems",
            "Social or community issues",
            "Business or financial challenges"
        ]
    },
    {
        question: "What is your favorite subject in school?",
        options: [
            "Mathematics / Science",
            "Languages / Literature",
            "History / Social Studies",
            "Computers / IT"
        ]
    },
    {
        question: "Where do you see yourself in 5 years?",
        options: [
            "Working in a high-tech corporate office",
            "Running my own business",
            "Working in a hospital or clinic",
            "Designing products or media"
        ]
    }
];

let currentQuestionIndex = 0;
const userAnswers = [];

function initQuiz() {
    const qBox = document.getElementById('question-box');
    if (!qBox) return; // not on assessment page

    document.getElementById('quiz-next-btn').addEventListener('click', handleNext);
    document.getElementById('quiz-prev-btn').addEventListener('click', handlePrev);
    
    renderQuestion();
}

function renderQuestion() {
    const q = quizQuestions[currentQuestionIndex];
    document.getElementById('question-text').textContent = q.question;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    q.options.forEach((opt, idx) => {
        const div = document.createElement('div');
        div.className = `quiz-option ${userAnswers[currentQuestionIndex] === opt ? 'selected' : ''}`;
        div.textContent = opt;
        div.onclick = () => selectOption(opt, div);
        optionsContainer.appendChild(div);
    });

    updateProgress();
    
    const prevBtn = document.getElementById('quiz-prev-btn');
    prevBtn.style.visibility = currentQuestionIndex === 0 ? 'hidden' : 'visible';
    
    const nextBtn = document.getElementById('quiz-next-btn');
    if (currentQuestionIndex === quizQuestions.length - 1) {
        nextBtn.textContent = 'Submit Assessment';
        nextBtn.classList.remove('btn-primary');
        nextBtn.classList.add('btn-success');
    } else {
        nextBtn.textContent = 'Next';
        nextBtn.classList.add('btn-primary');
        nextBtn.classList.remove('btn-success');
    }
    
    nextBtn.disabled = !userAnswers[currentQuestionIndex];
}

function selectOption(opt, divElement) {
    userAnswers[currentQuestionIndex] = opt;
    const allOptions = document.querySelectorAll('.quiz-option');
    allOptions.forEach(el => el.classList.remove('selected'));
    divElement.classList.add('selected');
    document.getElementById('quiz-next-btn').disabled = false;
}

function updateProgress() {
    const pct = ((currentQuestionIndex) / quizQuestions.length) * 100;
    document.getElementById('quiz-progress-bar').style.width = `${pct}%`;
    document.getElementById('quiz-progress-text').textContent = `Question ${currentQuestionIndex + 1} of ${quizQuestions.length}`;
}

function handlePrev() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

async function handleNext() {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    } else {
        // Submit
        submitAssessment();
    }
}

async function submitAssessment() {
    document.getElementById('quiz-container').classList.add('d-none');
    document.getElementById('assessment-loading').classList.remove('d-none');

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/assessment/submit', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ answers: userAnswers })
        });
        
        const data = await response.json();
        
        document.getElementById('assessment-loading').classList.add('d-none');
        
        if (response.ok && data.recommendations) {
            const resultContainer = document.getElementById('assessment-result-container');
            const content = document.getElementById('assessment-result-content');
            resultContainer.classList.remove('d-none');
            
            content.innerHTML = data.recommendations.map(rec => `
                <div class="card shadow-sm mb-4 border-primary">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h4 class="card-title text-primary fw-bold mb-0">${rec.title}</h4>
                            <span class="badge bg-success fs-6">${rec.matchPercentage}% Match</span>
                        </div>
                        <p class="card-text">${rec.description}</p>
                        <h6 class="fw-bold">Key Skills:</h6>
                        <div class="mb-3">
                            ${rec.skills.map(s => `<span class="badge bg-secondary me-1">${s}</span>`).join('')}
                        </div>
                        <h6 class="fw-bold">Roadmap:</h6>
                        <p class="text-muted small">${rec.roadmap}</p>
                    </div>
                </div>
            `).join('');
            
        } else {
            alert(data.error || 'Failed to generate recommendations');
            document.getElementById('quiz-container').classList.remove('d-none');
        }
    } catch (error) {
        console.error('Assessment Error:', error);
        alert('Network error while submitting assessment.');
        document.getElementById('assessment-loading').classList.add('d-none');
        document.getElementById('quiz-container').classList.remove('d-none');
    }
}

// Resource Library Logic
async function fetchResources() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/resources', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        const container = document.getElementById('resources-container');
        const loading = document.getElementById('resources-loading');
        
        if (!container || !loading) return; // Not on resources page
        
        if(response.ok) {
            loading.classList.add('d-none');
            
            if(!data.resources || data.resources.length === 0) {
                container.innerHTML = `<div class="col-12 text-center"><p>No resources found.</p></div>`;
                return;
            }
            
            data.resources.forEach(resource => {
                const tagsHtml = resource.tags.map(tag => `<span class="badge bg-secondary me-1">${tag}</span>`).join('');
                
                const cardHtml = `
                    <div class="col-md-4 mb-4">
                        <div class="card shadow-sm h-100">
                            <div class="card-body d-flex flex-column">
                                <span class="text-uppercase small text-success fw-bold mb-2">${resource.category}</span>
                                <h5 class="card-title fw-bold">${resource.title}</h5>
                                <p class="card-text text-muted">${resource.description}</p>
                                <div class="mt-2 mb-3">
                                    ${tagsHtml}
                                </div>
                                <a href="${resource.url}" target="_blank" class="btn btn-outline-primary mt-auto">Visit Resource</a>
                            </div>
                        </div>
                    </div>
                `;
                container.innerHTML += cardHtml;
            });
        } else {
            loading.innerHTML = `<p class="text-danger">Failed to load resources: ${data.error}</p>`;
        }
    } catch (error) {
        console.error(error);
        const loading = document.getElementById('resources-loading');
        if (loading) loading.innerHTML = `<p class="text-danger">Network error while fetching resources.</p>`;
    }
    }
}

// Profile Logic
async function loadProfile() {
    const profileForm = document.getElementById('profile-form');
    if (!profileForm) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/profile', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        const data = await response.json();
        
        if (response.ok && data.profile) {
            document.getElementById('profile-education').value = data.profile.education || '';
            document.getElementById('profile-skills').value = data.profile.skills || '';
            document.getElementById('profile-interests').value = data.profile.interests || '';
            document.getElementById('profile-career-goal').value = data.profile.careerGoal || '';
            document.getElementById('profile-income').value = data.profile.familyIncome || '';
        } else {
            showAlert('Failed to load profile data.', 'danger');
        }
    } catch (error) {
        console.error(error);
        showAlert('Network error while loading profile.', 'danger');
    }
}

const profileForm = document.getElementById('profile-form');
if (profileForm) {
    profileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = document.getElementById('profile-submit-btn');
        btn.disabled = true;
        btn.textContent = 'Saving...';
        
        const payload = {
            education: document.getElementById('profile-education').value,
            skills: document.getElementById('profile-skills').value,
            interests: document.getElementById('profile-interests').value,
            careerGoal: document.getElementById('profile-career-goal').value,
            familyIncome: document.getElementById('profile-income').value
        };
        
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });
            
            const data = await response.json();
            
            if (response.ok) {
                showAlert('Profile updated successfully!', 'success');
            } else {
                showAlert(data.error || 'Failed to update profile.', 'danger');
            }
        } catch (error) {
            console.error(error);
            showAlert('Network error while saving profile.', 'danger');
        } finally {
            btn.disabled = false;
            btn.textContent = 'Save Profile';
        }
    });
}

// Resume Builder Logic
function initResumeBuilder() {
    const form = document.getElementById('resume-builder-form');
    if (!form) return; // Only run on resume-builder.html

    // Map inputs to preview elements
    const fieldMapping = {
        'rb-name': 'preview-name',
        'rb-email': 'preview-email',
        'rb-phone': 'preview-phone',
        'rb-summary': 'preview-summary',
        'rb-edu-school': 'preview-edu-school',
        'rb-edu-degree': 'preview-edu-degree',
        'rb-edu-year': 'preview-edu-year',
        'rb-exp-title': 'preview-exp-title',
        'rb-exp-org': 'preview-exp-org',
        'rb-exp-desc': 'preview-exp-desc',
        'rb-skills': 'preview-skills'
    };

    // Add input listeners for real-time preview
    for (const [inputId, previewId] of Object.entries(fieldMapping)) {
        const inputEl = document.getElementById(inputId);
        const previewEl = document.getElementById(previewId);
        
        if (inputEl && previewEl) {
            inputEl.addEventListener('input', (e) => {
                previewEl.textContent = e.target.value || inputEl.placeholder;
            });
        }
    }

    // Handle PDF Download
    const downloadBtn = document.getElementById('download-pdf-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            const element = document.getElementById('resume-document');
            const name = document.getElementById('rb-name').value || 'Resume';
            
            const opt = {
                margin:       0,
                filename:     `${name.replace(/\s+/g, '_')}_Resume.pdf`,
                image:        { type: 'jpeg', quality: 0.98 },
                html2canvas:  { scale: 2 },
                jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' }
            };

            // Temporarily hide borders or shadows if necessary before printing
            element.style.boxShadow = 'none';
            
            // html2pdf is included via CDN on the resume-builder.html page
            html2pdf().set(opt).from(element).save().then(() => {
                // Restore styles
                element.style.boxShadow = '0 0 10px rgba(0,0,0,0.1)';
            });
        });
    }
}

// Admin Panel Logic
async function initAdminPanel() {
    const usersList = document.getElementById('admin-users-list');
    const resourcesList = document.getElementById('admin-resources-list');
    if (!usersList || !resourcesList) return; // not on admin page

    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'index.html';
        return;
    }

    // Check role from API or local storage (we'll rely on the API for security)
    try {
        const response = await fetch('/api/admin/users', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.status === 403 || response.status === 401) {
            alert('Access Denied. Admins only.');
            window.location.href = 'dashboard.html';
            return;
        }

        const data = await response.json();
        
        // Render Users
        if (data.users) {
            usersList.innerHTML = data.users.map(u => `
                <tr>
                    <td><small class="text-muted">${u.id}</small></td>
                    <td class="fw-bold">${u.name}</td>
                    <td>${u.email}</td>
                    <td><span class="badge ${u.role === 'admin' ? 'bg-danger' : 'bg-secondary'}">${u.role}</span></td>
                    <td>${new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
            `).join('');
        }
    } catch (error) {
        console.error('Admin Users Fetch Error:', error);
        usersList.innerHTML = '<tr><td colspan="5" class="text-danger">Failed to load users</td></tr>';
    }

    // Load Resources
    loadAdminResources();

    // Add Resource Form
    const addForm = document.getElementById('admin-add-resource-form');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('res-submit-btn');
            btn.disabled = true;
            btn.textContent = 'Adding...';

            const payload = {
                title: document.getElementById('res-title').value,
                description: document.getElementById('res-desc').value,
                url: document.getElementById('res-url').value,
                category: document.getElementById('res-category').value,
                tags: document.getElementById('res-tags').value
            };

            try {
                const res = await fetch('/api/admin/resources', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                    addForm.reset();
                    showAlert('Resource added successfully!', 'success');
                    loadAdminResources(); // Refresh
                } else {
                    const data = await res.json();
                    showAlert(data.error || 'Failed to add resource', 'danger');
                }
            } catch (error) {
                showAlert('Network error', 'danger');
            } finally {
                btn.disabled = false;
                btn.textContent = 'Add Resource';
            }
        });
    }
}

async function loadAdminResources() {
    const list = document.getElementById('admin-resources-list');
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('/api/resources', {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.resources) {
            list.innerHTML = data.resources.map(r => `
                <tr>
                    <td>
                        <a href="${r.url}" target="_blank" class="fw-bold text-decoration-none">${r.title}</a>
                        <div class="small text-muted">${r.description}</div>
                    </td>
                    <td><span class="badge bg-info text-dark">${r.category}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteResource(${r.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        }
    } catch (error) {
        list.innerHTML = '<tr><td colspan="3" class="text-danger">Failed to load resources</td></tr>';
    }
}

window.deleteResource = async function(id) {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`/api/admin/resources/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (res.ok) {
            showAlert('Resource deleted successfully', 'success');
            loadAdminResources();
        } else {
            showAlert('Failed to delete resource', 'danger');
        }
    } catch (error) {
        showAlert('Network error while deleting', 'danger');
    }
};
