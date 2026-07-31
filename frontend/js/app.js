const API_URL = '/api';

// Utility: Show Alert
function showAlert(message, type = 'danger') {
    const alertBox = document.getElementById('alertBox');
    if (alertBox) {
        alertBox.className = `alert alert-${type}`;
        alertBox.textContent = message;
        alertBox.classList.remove('d-none');
        setTimeout(() => alertBox.classList.add('d-none'), 5000);
    } else {
        alert(message);
    }
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

// Auth: Logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
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
