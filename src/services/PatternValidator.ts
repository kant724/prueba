import { BingoCard, WinPattern } from '../types';

export class PatternValidator {
    private static readonly DEFAULT_PATTERNS: WinPattern[] = [
        {
            name: 'Línea Horizontal',
            pattern: Array(5).fill(Array(5).fill(false)).map((row, i) => 
                i === 2 ? Array(5).fill(true) : Array(5).fill(false)
            )
        },
        {
            name: 'Línea Vertical',
            pattern: Array(5).fill(Array(5).fill(false)).map(row => 
                row.map((_, i) => i === 2)
            )
        },
        {
            name: 'Cartón Lleno',
            pattern: Array(5).fill(Array(5).fill(true))
        }
    ];

    validatePattern(card: BingoCard, marks: Set<number>, pattern: WinPattern): boolean {
        return pattern.pattern.every((row, i) =>
            row.every((shouldBeMarked, j) =>
                !shouldBeMarked || 
                card[i][j] === null || 
                marks.has(card[i][j] as number)
            )
        );
    }

    checkWinner(card: BingoCard, marks: Set<number>, patterns: WinPattern[] = PatternValidator.DEFAULT_PATTERNS): WinPattern | null {
        return patterns.find(pattern => this.validatePattern(card, marks, pattern)) || null;
    }
}
