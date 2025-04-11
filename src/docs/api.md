# API Documentation

## Autenticación

### POST /api/auth/login
Login de usuario.
- Body: `{ email: string, password: string }`
- Response: `{ user: User, token: string, refreshToken: string }`

### POST /api/auth/refresh
Renovar token.
- Body: `{ refreshToken: string }`
- Response: `{ token: string }`

## Juego

### POST /api/rooms
Crear nueva sala.
- Headers: `Authorization: Bearer <token>`
- Body: `{ config: RoomConfig }`
- Response: `Room`

### POST /api/rooms/:roomId/join
Unirse a una sala.
- Headers: `Authorization: Bearer <token>`
- Params: `roomId: string`
- Response: `Room`

### POST /api/rooms/:roomId/draw
Sortear número.
- Headers: `Authorization: Bearer <token>`
- Params: `roomId: string`
- Response: `{ number: number }`
