class CardGenerator {
    generateCard() {
        const card = [];
        const columns = ['B', 'I', 'N', 'G', 'O'];

        for (let i = 0; i < columns.length; i++) {
            const columnNumbers = this.generateUniqueNumbers(i * 15 + 1, i * 15 + 15);
            card.push(columnNumbers.slice(0, 5));
        }

        card[2][2] = null; // Espacio libre en el centro
        return card;
    }

    generateUniqueNumbers(min, max) {
        const numbers = [];
        while (numbers.length < 5) {
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            if (!numbers.includes(num)) {
                numbers.push(num);
            }
        }
        return numbers;
    }
}

class Sorter {
    constructor() {
        this.numbers = Array.from({ length: 75 }, (_, i) => i + 1);
        this.drawnNumbers = new Set();
    }

    drawNumber() {
        if (this.numbers.length === 0) return null;

        const randomIndex = Math.floor(Math.random() * this.numbers.length);
        const number = this.numbers.splice(randomIndex, 1)[0];
        this.drawnNumbers.add(number);
        return number;
    }

    reset() {
        this.numbers = Array.from({ length: 75 }, (_, i) => i + 1);
        this.drawnNumbers.clear();
    }

    getDrawnNumbers() {
        return Array.from(this.drawnNumbers);
    }
}

class BingoRoom {
    constructor() {
        this.players = new Map();
        this.isGameStarted = false;
    }

    addPlayer(name) {
        if (this.players.has(name)) {
            return false;
        }
        this.players.set(name, {
            card: cardGenerator.generateCard(),
            marks: new Set()
        });
        this.updatePlayersView();
        return true;
    }

    updatePlayersView() {
        const container = document.getElementById('players-cards');
        container.innerHTML = '';
        
        this.players.forEach((player, name) => {
            const playerDiv = document.createElement('div');
            playerDiv.className = 'col-md-6 col-lg-4';
            playerDiv.innerHTML = `
                <div class="card">
                    <div class="card-header bg-info text-white">
                        ${name}
                    </div>
                    <div class="card-body p-2">
                        ${this.createCardHTML(player.card)}
                    </div>
                </div>
            `;
            container.appendChild(playerDiv);
        });
        
        document.getElementById('player-count').textContent = this.players.size;
    }

    createCardHTML(card) {
        let html = '<table class="table table-bordered text-center">';
        card.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                html += `<td class="${cell === null ? 'free-space bg-secondary text-white' : ''}">${cell !== null ? cell : ''}</td>`;
            });
            html += '</tr>';
        });
        html += '</table>';
        return html;
    }
}

const cardGenerator = new CardGenerator();
const sorter = new Sorter();
const bingoRoom = new BingoRoom();

function createReferenceTable() {
    const container = document.querySelector('.reference-table');
    const table = document.createElement('table');
    table.classList.add('table', 'table-sm', 'table-bordered', 'text-center');
    
    // Agregar encabezado BINGO
    const header = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['B', 'I', 'N', 'G', 'O'].forEach(letter => {
        const th = document.createElement('th');
        th.textContent = letter;
        th.classList.add('bg-dark', 'text-white');
        headerRow.appendChild(th);
    });
    header.appendChild(headerRow);
    table.appendChild(header);
    
    // Crear el cuerpo de la tabla
    const tbody = document.createElement('tbody');
    for (let i = 0; i < 15; i++) {
        const row = document.createElement('tr');
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('td');
            const number = j * 15 + i + 1;
            cell.textContent = number;
            cell.dataset.number = number;
            cell.style.width = '20%';
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    }
    table.appendChild(tbody);
    container.appendChild(table);
}

let gamesCount = 0;

document.getElementById('generate-card').addEventListener('click', () => {
    const card = cardGenerator.generateCard();
    displayCard(card);
});

document.getElementById('draw-number').addEventListener('click', () => {
    const number = sorter.drawNumber();
    if (number !== null) {
        displayDrawnNumbers(sorter.getDrawnNumbers());
        highlightNumberInReference(number);
        bingoRoom.players.forEach(player => {
            if (player.card.flat().includes(number)) {
                player.marks.add(number);
            }
        });
        updateStats();
    } else {
        alert('¡Todos los números han sido sorteados!');
    }
});

document.getElementById('reset').addEventListener('click', () => {
    sorter.reset();
    document.getElementById('drawn-numbers').innerHTML = '';
    document.getElementById('bingo-card').innerHTML = '';
    document.querySelectorAll('.reference-table td').forEach(cell => {
        cell.classList.remove('bg-marked');
    });
    gamesCount++;
    updateStats();
});

document.getElementById('join-game').addEventListener('click', () => {
    const nameInput = document.getElementById('player-name');
    const playerName = nameInput.value.trim();
    
    if (playerName) {
        if (bingoRoom.addPlayer(playerName)) {
            nameInput.value = '';
            nameInput.disabled = true;
            document.getElementById('join-game').disabled = true;
        } else {
            alert('Ese nombre ya está en uso');
        }
    }
});

document.addEventListener('DOMContentLoaded', createReferenceTable);

function updateStats() {
    document.getElementById('games-count').textContent = gamesCount;
    document.getElementById('drawn-count').textContent = sorter.getDrawnNumbers().length;
}

function highlightNumberInReference(number) {
    const referenceCell = document.querySelector(`.reference-table td[data-number="${number}"]`);
    if (referenceCell) {
        referenceCell.classList.add('bg-marked');
    }
}

function highlightNumberOnCard(number) {
    const bingoCardDiv = document.getElementById('bingo-card');
    const cells = bingoCardDiv.querySelectorAll('td');
    cells.forEach(cell => {
        if (cell.textContent == number) {
            cell.classList.add('bg-warning', 'text-dark', 'fw-bold');
        }
    });
}

function displayCard(card) {
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'text-center');
    card.forEach(row => {
        const tr = document.createElement('tr');
        row.forEach(cell => {
            const td = document.createElement('td');
            td.textContent = cell !== null ? cell : '';
            if (cell === null) {
                td.classList.add('free-space', 'bg-secondary', 'text-white');
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });
    const bingoCardDiv = document.getElementById('bingo-card');
    bingoCardDiv.innerHTML = '';
    bingoCardDiv.appendChild(table);
}

function displayDrawnNumbers(numbers) {
    const drawnNumbersDiv = document.getElementById('drawn-numbers');
    drawnNumbersDiv.innerHTML = `<strong>Números sorteados:</strong> ${numbers.join(', ')}`;
}
