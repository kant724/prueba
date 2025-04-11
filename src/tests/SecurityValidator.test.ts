import { SecurityValidator } from '../utils/SecurityValidator';

describe('SecurityValidator', () => {
    test('debería validar email correctamente', () => {
        expect(SecurityValidator.validateEmail('test@example.com')).toBe(true);
        expect(SecurityValidator.validateEmail('invalid-email')).toBe(false);
    });

    test('debería validar contraseña correctamente', () => {
        expect(SecurityValidator.validatePassword('TestPass123')).toBe(true);
        expect(SecurityValidator.validatePassword('weak')).toBe(false);
    });

    test('debería sanitizar input correctamente', () => {
        expect(SecurityValidator.sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
    });

    test('debería validar token JWT correctamente', () => {
        const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U';
        expect(SecurityValidator.validateToken(validToken)).toBe(true);
    });
});
