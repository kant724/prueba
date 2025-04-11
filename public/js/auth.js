class AuthManager {
    constructor() {
        this.loginForm = document.getElementById('loginForm');
        this.registerForm = document.getElementById('registerForm');
        this.setupEventListeners();
    }

    setupEventListeners() {
        this.loginForm.addEventListener('submit', this.handleLogin.bind(this));
        this.registerForm.addEventListener('submit', this.handleRegister.bind(this));
    }

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(this.loginForm);
        await this.authenticate('/api/auth/login', {
            email: formData.get('email'),
            password: formData.get('password')
        });
    }

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(this.registerForm);
        await this.authenticate('/api/auth/register', {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password')
        });
    }

    async authenticate(url, data) {
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error(await response.text());
            }

            const result = await response.json();
            localStorage.setItem('token', result.token);
            localStorage.setItem('user', JSON.stringify(result.user));
            
            window.location.href = result.user.isAdmin ? '/admin.html' : '/index.html';
        } catch (error) {
            this.showError(error.message);
        }
    }

    showError(message) {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-danger alert-dismissible fade show';
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.loginForm.insertBefore(alertDiv, this.loginForm.firstChild);
    }
}

new AuthManager();
