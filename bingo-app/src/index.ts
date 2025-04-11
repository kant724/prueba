// Este archivo es el punto de entrada de la aplicación. Inicializa el juego de bingo, configura el sorteador y el generador de cartones.

import { Sorter } from './bingo/sorter';
import { CardGenerator } from './bingo/card-generator';
import { BingoCard } from './types';

const sorter = new Sorter();
const cardGenerator = new CardGenerator();

function initializeBingoGame() {
    const card: BingoCard = cardGenerator.generateCard();
    console.log('Cartón de Bingo generado:', card);

    sorter.drawNumber();
    console.log('Número sorteado:', sorter.getLastDrawnNumber());
}

initializeBingoGame();