export function shuffleArray<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export function generateUniqueNumbers(min: number, max: number, count: number): number[] {
    const uniqueNumbers = new Set<number>();
    while (uniqueNumbers.size < count) {
        const number = Math.floor(Math.random() * (max - min + 1)) + min;
        uniqueNumbers.add(number);
    }
    return Array.from(uniqueNumbers);
}