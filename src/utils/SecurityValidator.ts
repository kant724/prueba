export class SecurityValidator {
    static validateEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    static validatePassword(password: string): boolean {
        // Mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        return passwordRegex.test(password);
    }

    static sanitizeInput(input: string): string {
        return input.replace(/[<>]/g, '');
    }

    static validateToken(token: string): boolean {
        return /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(token);
    }
}
