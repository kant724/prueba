import WebSocket from 'ws';
import { WebSocketService } from '../services/WebSocketService';
import { EventManager } from '../services/EventManager';

describe('WebSocketService', () => {
    let wss: WebSocketService;
    let clientSocket: WebSocket;

    beforeEach(async () => {
        wss = WebSocketService.getInstance();
        clientSocket = new WebSocket('ws://localhost:8080');
        await new Promise(resolve => clientSocket.on('open', resolve));
    });

    afterEach(() => {
        clientSocket.close();
    });

    test('debería conectarse correctamente', done => {
        expect(clientSocket.readyState).toBe(WebSocket.OPEN);
        done();
    });

    test('debería recibir eventos del juego', done => {
        clientSocket.on('message', data => {
            const event = JSON.parse(data.toString());
            expect(event.type).toBe('numberDrawn');
            expect(event.payload).toBeDefined();
            done();
        });

        EventManager.getInstance().emit('numberDrawn', { number: 42 });
    });
});
