# Sistema de Respaldo

## Descripción
El sistema realiza respaldos automáticos cada hora de:
- Puntuaciones de jugadores
- Historial de juegos
- Estado de las salas

## Uso del Servicio

```typescript
const backupService = BackupService.getInstance();

// Crear backup manual
const filename = await backupService.createBackup();

// Restaurar desde backup
await backupService.restoreFromBackup(filename);
```

## Estructura de Archivos
Los backups se almacenan en el directorio `/backups` con el formato:
```
backup-YYYY-MM-DD-HH-mm-ss.json
```

## Recuperación Automática
El sistema intenta recuperar el último backup válido al iniciar si detecta una corrupción de datos.
