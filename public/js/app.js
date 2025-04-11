class BingoGame {
    constructor() {
        this.bingoCard = document.querySelector('#bingoCard .card-body');
        this.drawnNumbers = document.getElementById('drawnNumbers');
        this.initialize();
    }

    initialize() {
        this.createBingoCard();
    }

    createBingoCard() {
        const letters = ['B', 'I', 'N', 'G', 'O'];
        const table = document.createElement('table');
        table.className = 'bingo-table';
        
        // Crear encabezado
        const thead = document.createElement('thead');
        const headerRow = document.createElement('tr');
        letters.forEach(letter => {
            const th = document.createElement('th');
            th.textContent = letter;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);
        
        // Crear cuerpo
        const tbody = document.createElement('tbody');
        for (let i = 0; i < 5; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('td');
                cell.textContent = Math.floor(Math.random() * 15) + 1 + (j * 15);
                cell.onclick = () => this.markNumber(cell);
                row.appendChild(cell);
            }
            tbody.appendChild(row);
        }
        table.appendChild(tbody);
        
        this.bingoCard.appendChild(table);
    }

    markNumber(cell) {
        cell.classList.toggle('marked');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new BingoGame();
});
