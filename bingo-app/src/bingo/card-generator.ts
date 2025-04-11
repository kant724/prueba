class CardGenerator {
    private numbers: number[];

    constructor() {
        this.numbers = this.generateUniqueNumbers(1, 75);
    }

    public generateCard(): number[][] {
        const card: number[][] = [];
        const columns = ['B', 'I', 'N', 'G', 'O'];

        for (let i = 0; i < columns.length; i++) {
            const columnNumbers = this.numbers.slice(i * 15, i * 15 + 15);
            card.push(this.shuffleArray(columnNumbers).slice(0, 5));
        }

        card[2][2] = null; // Free space in the center of the card
        return card;
    }

    public validateCard(card: number[][]): boolean {
        if (card.length !== 5) return false;

        for (let i = 0; i < card.length; i++) {
            if (card[i].length !== 5) return false;
            const uniqueNumbers = new Set(card[i].filter(num => num !== null));
            if (uniqueNumbers.size !== card[i].length - (card[i].includes(null) ? 1 : 0)) {
                return false;
            }
        }

        return true;
    }

    private generateUniqueNumbers(min: number, max: number): number[] {
        const uniqueNumbers = new Set<number>();
        while (uniqueNumbers.size < 75) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            uniqueNumbers.add(num);
        }
        return Array.from(uniqueNumbers);
    }

    private shuffleArray<T>(array: T[]): T[] {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
}