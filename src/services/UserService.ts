import { User } from '../types/user';
import { StorageService } from './StorageService';

export class UserService {
    private storage: StorageService;

    constructor() {
        this.storage = new StorageService();
    }

    async createUser(userData: Partial<User>): Promise<User> {
        // Validar si el email ya existe
        const existingUser = await this.storage.findUserByEmail(userData.email);
        if (existingUser) {
            throw new Error('El email ya está registrado');
        }

        const user: User = {
            id: Date.now().toString(),
            username: userData.username,
            email: userData.email,
            password: userData.password,
            createdAt: new Date(),
            status: 'active'
        };

        await this.storage.saveUser(user);
        return user;
    }
}
