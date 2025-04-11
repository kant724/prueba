import { BingoCard } from '../types';

export class CardGenerator {
    private static readonly COLUMNS = ['B', 'I', 'N', 'G', 'O'];
    private static readonly NUMBERS_PER_COLUMN = 15;

    generateCard(): BingoCard {
        return this.COLUMNS.map((_, index) => 
            this.generateColumn(index * this.NUMBERS_PER_COLUMN + 1)
        );
    }

    private generateColumn(startNumber: number): number[] {
        const numbers = new Set<number>();
        while (numbers.size < 5) {
            numbers.add(Math.floor(Math.random() * 15) + startNumber);
        }
        return Array.from(numbers);
    }
}
