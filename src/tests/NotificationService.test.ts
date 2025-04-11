import { NotificationService } from '../services/NotificationService';
import { WebSocketService } from '../services/WebSocketService';
import { EventManager } from '../services/EventManager';

describe('NotificationService', () => {
    let notificationService: NotificationService;
    let wsService: WebSocketService;
    let eventManager: EventManager;

    beforeEach(() => {
        notificationService = NotificationService.getInstance();
        wsService = WebSocketService.getInstance();
        eventManager = EventManager.getInstance();
    });

    test('debería enviar notificación correctamente', async () => {
        const userId = 'test-user';
        const message = 'Test notification';
        
        const mockSend = jest.spyOn(wsService, 'sendToUser');
        
        await notificationService.sendNotification(
            userId,
            'system_alert',
            message
        );

        expect(mockSend).toHaveBeenCalledWith(
            userId,
            'notification',
            expect.objectContaining({
                message,
                type: 'system_alert'
            })
        );
    });
});
