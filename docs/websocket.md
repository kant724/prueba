# WebSocket API Documentation

## Conexión
```javascript
const ws = new WebSocket('ws://localhost:8080');
```

## Eventos Disponibles

### numberDrawn
Emitido cuando se sortea un nuevo número.
```javascript
{
    type: 'numberDrawn',
    payload: { number: number },
    timestamp: Date
}
```

### playerWon
Emitido cuando un jugador gana.
```javascript
{
    type: 'playerWon',
    payload: { 
        playerId: string,
        pattern: string 
    },
    timestamp: Date
}
```

## Ejemplo de Uso
```javascript
ws.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch(data.type) {
        case 'numberDrawn':
            updateNumber(data.payload.number);
            break;
        case 'playerWon':
            showWinner(data.payload);
            break;
    }
};
```
