const game = document.getElementById('game');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');
let rows;
let cols;
let minesCount;
let mines = [];
let cells = [];

const difficultySettings = {
    easy: { rows: 8, cols: 8, mines: 10 },
    medium: { rows: 16, cols: 16, mines: 40 },
    hard: { rows: 24, cols: 24, mines: 99 }
};

startBtn.addEventListener('click', resetGame);

function init() {
    const difficulty = difficultySelect.value;
    const settings = difficultySettings[difficulty];
    rows = settings.rows;
    cols = settings.cols;
    minesCount = settings.mines;

    // Ajustar el tamaño del grid en CSS
    game.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
    game.style.gridTemplateRows = `repeat(${rows}, 30px)`;

    // Crear celdas
    for (let i = 0; i < rows * cols; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.dataset.index = i;
        cell.addEventListener('click', clickCell);
        cell.addEventListener('contextmenu', flagCell);
        game.appendChild(cell);
        cells.push(cell);
    }

    // Colocar minas
    mines = [];
    while (mines.length < minesCount) {
        const index = Math.floor(Math.random() * (rows * cols));
        if (!mines.includes(index)) {
            mines.push(index);
        }
    }
}

function clickCell(e) {
    const cell = e.target;
    const index = parseInt(cell.dataset.index);
    if (mines.includes(index)) {
        cell.classList.add('mine'); // Mostrar la mina en rojo
        revealMines();
        alert('¡Has perdido!');
        resetGame();
    } else {
        openCell(cell);
        checkWin();
    }
}

function flagCell(e) {
    e.preventDefault();
    const cell = e.target;
    if (!cell.classList.contains('open')) {
        cell.classList.toggle('flag');
    }
}

function openCell(cell) {
    if (cell.classList.contains('open') || cell.classList.contains('flag')) return;
    cell.classList.add('open');
    const index = parseInt(cell.dataset.index);
    const count = countMinesAround(index);
    if (count > 0) {
        cell.textContent = count;
        cell.classList.add('number'); // Añadido para fondo verde
    } else {
        const neighbors = getNeighbors(index);
        neighbors.forEach(i => openCell(cells[i]));
    }
}

function countMinesAround(index) {
    const neighbors = getNeighbors(index);
    let count = 0;
    neighbors.forEach(i => {
        if (mines.includes(i)) count++;
    });
    return count;
}

function getNeighbors(index) {
    const neighbors = [];
    const isLeftEdge = index % cols === 0;
    const isRightEdge = index % cols === cols - 1;

    // Arriba
    if (index - cols >= 0) neighbors.push(index - cols);
    // Abajo
    if (index + cols < rows * cols) neighbors.push(index + cols);
    // Izquierda
    if (!isLeftEdge) neighbors.push(index - 1);
    // Derecha
    if (!isRightEdge) neighbors.push(index + 1);
    // Arriba Izquierda
    if (!isLeftEdge && index - cols - 1 >= 0) neighbors.push(index - cols - 1);
    // Arriba Derecha
    if (!isRightEdge && index - cols + 1 >= 0) neighbors.push(index - cols + 1);
    // Abajo Izquierda
    if (!isLeftEdge && index + cols - 1 < rows * cols) neighbors.push(index + cols - 1);
    // Abajo Derecha
    if (!isRightEdge && index + cols + 1 < rows * cols) neighbors.push(index + cols + 1);

    return neighbors;
}

function revealMines() {
    mines.forEach(i => {
        const cell = cells[i];
        cell.classList.add('mine');
    });
}

function checkWin() {
    const openedCells = document.querySelectorAll('.cell.open').length;
    if (openedCells === rows * cols - minesCount) {
        alert('¡Has ganado!');
        resetGame();
    }
}

function resetGame() {
    game.innerHTML = '';
    cells = [];
    init();
}
