class ProfileManager {
    constructor() {
        this.userData = JSON.parse(localStorage.getItem('user'));
        this.setupEventListeners();
        this.loadUserData();
    }

    setupEventListeners() {
        document.getElementById('editProfileBtn').addEventListener('click', () => this.showEditModal());
        document.getElementById('saveProfileBtn')?.addEventListener('click', () => this.saveProfile());
    }

    async loadUserData() {
        try {
            const response = await fetch(`/api/users/${this.userData.id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            this.updateProfileView(data);
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    }

    async saveProfile() {
        const formData = new FormData(document.getElementById('editProfileForm'));
        try {
            const response = await fetch(`/api/users/${this.userData.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify(Object.fromEntries(formData))
            });
            if (response.ok) {
                this.loadUserData();
                this.hideEditModal();
            }
        } catch (error) {
            console.error('Error guardando perfil:', error);
        }
    }

    updateProfileView(data) {
        document.getElementById('username').textContent = data.username;
        document.getElementById('userEmail').textContent = data.email;
        document.getElementById('gamesPlayed').textContent = data.statistics.gamesPlayed;
        document.getElementById('gamesWon').textContent = data.statistics.gamesWon;
        document.getElementById('totalScore').textContent = data.statistics.totalScore;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new ProfileManager();
});
