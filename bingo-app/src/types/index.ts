export interface BingoCard {
    numbers: number[][];
    marked: boolean[][];
}

export interface SorterEvent {
    numberDrawn: number;
    timestamp: Date;
}