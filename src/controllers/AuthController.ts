import { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = AuthService.getInstance();
    }

    async login(req: Request, res: Response): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.authService.login(email, password);
            res.json(result);
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }

    async refresh(req: Request, res: Response): Promise<void> {
        try {
            const { refreshToken } = req.body;
            const newToken = await this.authService.refreshToken(refreshToken);
            if (!newToken) {
                res.status(401).json({ error: 'Token inválido' });
                return;
            }
            res.json({ token: newToken });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}
