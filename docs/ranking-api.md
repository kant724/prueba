# API de Rankings

## Endpoints

### GET /api/rankings/global
Obtiene el ranking global de jugadores.

**Parámetros Query:**
- limit: number (opcional, default: 10)

**Respuesta:**
```json
[
  {
    "id": "string",
    "username": "string",
    "score": number,
    "gamesPlayed": number,
    "gamesWon": number
  }
]
```

### GET /api/rankings/weekly
Obtiene el ranking semanal.

**Respuesta:** Similar al ranking global pero filtrado por la última semana.
