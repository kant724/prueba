import { Room, RoomConfig, User, APIResponse } from '../types';

export class RoomManager {
    private rooms: Map<string, Room>;

    constructor() {
        this.rooms = new Map();
    }

    async createRoom(host: User, config: RoomConfig): Promise<APIResponse<Room>> {
        const roomId = this.generateRoomId();
        const room: Room = {
            id: roomId,
            name: `Sala de ${host.username}`,
            host: host.id,
            players: new Map(),
            config,
            state: {
                status: 'waiting'
            }
        };

        this.rooms.set(roomId, room);
        return {
            success: true,
            data: room,
            timestamp: new Date()
        };
    }

    private generateRoomId(): string {
        return Math.random().toString(36).substring(2, 9).toUpperCase();
    }

    async joinRoom(roomId: string, user: User): Promise<APIResponse<Room>> {
        const room = this.rooms.get(roomId);
        
        if (!room) {
            return {
                success: false,
                error: 'Sala no encontrada',
                timestamp: new Date()
            };
        }

        if (room.players.size >= room.config.maxPlayers) {
            return {
                success: false,
                error: 'Sala llena',
                timestamp: new Date()
            };
        }

        // Más lógica aquí...
        return {
            success: true,
            data: room,
            timestamp: new Date()
        };
    }
}
