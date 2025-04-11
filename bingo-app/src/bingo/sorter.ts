class Sorter {
    private numbers: number[];
    private drawnNumbers: Set<number>;

    constructor() {
        this.numbers = Array.from({ length: 75 }, (_, i) => i + 1);
        this.drawnNumbers = new Set<number>();
    }

    drawNumber(): number | null {
        if (this.numbers.length === 0) {
            return null; // No hay más números para sortear
        }

        const randomIndex = Math.floor(Math.random() * this.numbers.length);
        const drawnNumber = this.numbers[randomIndex];
        this.numbers.splice(randomIndex, 1);
        this.drawnNumbers.add(drawnNumber);
        return drawnNumber;
    }

    reset(): void {
        this.numbers = Array.from({ length: 75 }, (_, i) => i + 1);
        this.drawnNumbers.clear();
    }

    getDrawnNumbers(): number[] {
        return Array.from(this.drawnNumbers);
    }
}

export default Sorter;