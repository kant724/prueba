export class NumberDrawer {
    private numbers: number[];
    private drawnNumbers: Set<number>;

    constructor() {
        this.reset();
    }

    drawNumber(): number | null {
        if (this.numbers.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * this.numbers.length);
        const number = this.numbers.splice(randomIndex, 1)[0];
        this.drawnNumbers.add(number);
        return number;
    }

    reset(): void {
        this.numbers = Array.from({ length: 75 }, (_, i) => i + 1);
        this.drawnNumbers = new Set();
    }

    getDrawnNumbers(): number[] {
        return Array.from(this.drawnNumbers);
    }
}
