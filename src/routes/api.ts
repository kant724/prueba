import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { authMiddleware } from '../middleware/auth.middleware';
import { GameController } from '../controllers/GameController';

const router = Router();
const authController = new AuthController();
const gameController = new GameController();

// Rutas públicas
router.post('/auth/login', authController.login.bind(authController));
router.post('/auth/refresh', authController.refresh.bind(authController));

// Rutas protegidas
router.use(authMiddleware);
router.get('/profile', (req, res) => {
    res.json(req.user);
});

// Rutas de juego (protegidas)
router.post('/rooms', gameController.createRoom.bind(gameController));
router.post('/rooms/:roomId/join', gameController.joinRoom.bind(gameController));
router.post('/rooms/:roomId/draw', gameController.drawNumber.bind(gameController));

export default router;
