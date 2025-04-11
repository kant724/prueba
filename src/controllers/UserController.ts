import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async register(req: Request, res: Response) {
        try {
            const { username, email, password } = req.body;
            
            // Validar datos
            if (!username || !email || !password) {
                return res.status(400).json({ error: 'Todos los campos son requeridos' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userService.createUser({
                username,
                email,
                password: hashedPassword
            });

            const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret');
            
            res.status(201).json({
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email
                },
                token
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
