import { BingoCard } from '../types';

export class CardGenerator {
    private static readonly COLUMNS = ['B', 'I', 'N', 'G', 'O'];
    private static readonly NUMBERS_PER_COLUMN = 15;

    generateCard(): BingoCard {
        const card = CardGenerator.COLUMNS.map((_, index) => 
            this.generateColumn(index * CardGenerator.NUMBERS_PER_COLUMN + 1)
        );
        
        // Asegurar espacio libre en el centro
        card[2][2] = null; // Set the center space to null
        
        if (!this.validateCard(card)) {
            return this.generateCard(); // Regenerar si no es válido
        }
        
        return card;
    }

    private generateColumn(startNumber: number): number[] {
        const numbers = new Set<number>();
        const maxNumber = startNumber + CardGenerator.NUMBERS_PER_COLUMN - 1;
        
        while (numbers.size < 5) {
            const num = this.getRandomNumber(startNumber, maxNumber);
            if (this.isValidNumberForColumn(num, startNumber)) {
                numbers.add(num);
            }
        }
        
        return Array.from(numbers).sort((a, b) => a - b);
    }

    private isValidNumberForColumn(number: number, startNumber: number): boolean {
        const columnEnd = startNumber + CardGenerator.NUMBERS_PER_COLUMN - 1;
        return number >= startNumber && number <= columnEnd;
    }

    private getRandomNumber(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    private validateCard(card: BingoCard): boolean {
        // Verificar dimensiones
        if (card.length !== 5) return false;
        if (!card.every(row => row.length === 5)) return false;

        // Verificar números únicos por columna
        for (let col = 0; col < 5; col++) {
            const columnNumbers = new Set(
                card.map(row => row[col]).filter(n => n !== null)
            );
            if (columnNumbers.size !== 4 || !this.validateColumnRange(columnNumbers, col)) {
                return false;
            }
        }

        return true;
    }

    private validateColumnRange(numbers: Set<number>, columnIndex: number): boolean {
        const min = columnIndex * CardGenerator.NUMBERS_PER_COLUMN + 1;
        const max = min + CardGenerator.NUMBERS_PER_COLUMN - 1;
        return Array.from(numbers).every(n => n >= min && n <= max);
    }
}
