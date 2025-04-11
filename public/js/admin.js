class AdminPanel {
    constructor() {
        this.content = document.getElementById('adminContent');
        this.setupEventListeners();
        this.loadSection('users');
    }

    setupEventListeners() {
        document.querySelectorAll('.list-group-item').forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                document.querySelector('.list-group-item.active').classList.remove('active');
                e.target.classList.add('active');
                const section = e.target.getAttribute('href').substring(1);
                this.loadSection(section);
            });
        });
    }

    async loadSection(section) {
        const methods = {
            users: this.loadUsers,
            rooms: this.loadRooms,
            tournaments: this.loadTournaments,
            stats: this.loadStats
        };

        if (methods[section]) {
            await methods[section].call(this);
        }
    }

    async loadUsers() {
        const template = `
            <div class="card">
                <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Gestión de Usuarios</h5>
                    <button class="btn btn-light btn-sm" id="addUser">
                        <i class="bi bi-person-plus"></i> Nuevo Usuario
                    </button>
                </div>
                <div class="card-body">
                    <div class="table-responsive">
                        <table class="table table-hover">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Usuario</th>
                                    <th>Email</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody id="usersTable"></tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        this.content.innerHTML = template;
        await this.fetchAndDisplayUsers();
    }

    async fetchAndDisplayUsers() {
        try {
            const response = await fetch('/api/users');
            const users = await response.json();
            const tbody = document.getElementById('usersTable');
            tbody.innerHTML = users.map(user => `
                <tr>
                    <td>${user.id}</td>
                    <td>${user.username}</td>
                    <td>${user.email}</td>
                    <td><span class="badge bg-${user.active ? 'success' : 'danger'}">
                        ${user.active ? 'Activo' : 'Inactivo'}
                    </span></td>
                    <td>
                        <button class="btn btn-sm btn-info" onclick="editUser('${user.id}')">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="deleteUser('${user.id}')">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>
            `).join('');
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new AdminPanel();
});
