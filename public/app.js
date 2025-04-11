class BingoApp {
    constructor() {
        this.gameSection = document.getElementById('game-section');
        this.bingoCard = document.getElementById('bingo-card');
        this.numbersDrawn = document.getElementById('numbers-drawn');
        this.setupEventListeners();
    }

    setupEventListeners() {
        document.getElementById('login-form')?.addEventListener('submit', this.handleLogin.bind(this));
    }

    createBingoCard() {
        const table = document.createElement('table');
        table.className = 'bingo-card';
        // Implementar generación del cartón
    }

    markNumber(number) {
        const cells = document.querySelectorAll('.bingo-cell');
        cells.forEach(cell => {
            if (cell.textContent === number.toString()) {
                cell.classList.add('marked');
            }
        });
    }
}

const app = new BingoApp();
