const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerHeight;
canvas.height = window.innerHeight;

window.addEventListener('resize', function() {
    canvas.width = window.innerHeight;
    canvas.height = window.innerHeight;
});

// Our actial cell grid, where all of our cells will live
let cellGrid = [];
// Location of our grid
const xLoc = 0;
const yLoc = 0;
let gridSize = null;
const cellSize = 10;
let clock = 0;
const clockPer = 5;
let survivalLowerBound, survivalUpperBound, birthLowerBound, birthUpperBound, maxAge;

const inputBoxes = document.querySelectorAll('.inputBox');

function enterInput(event) {
    if (event.key === 'Enter') {
        cellGrid = [];
        fillGrid();
    }
}

const ageInput = document.getElementById('ageInput');
const ageValue = document.getElementById('ageValue');
maxAge = Number(ageInput.value);
ageValue.textContent = ageInput.value;
if (maxAge >= 21) ageValue.textContent = 'Inf';
ageInput.addEventListener('input', function() {
    ageValue.textContent = this.value;
    maxAge = Number(this.value);
    if (maxAge >= 21) ageValue.textContent = 'Inf';
});
const survivalLBInput = document.getElementById('survivalLBInput');
const survivalLBValue = document.getElementById('survivalLBValue');
survivalLowerBound = Number(survivalLBInput.value);
survivalLBValue.textContent = survivalLBInput.value;
survivalLBInput.addEventListener('input', function() {
    survivalLBValue.textContent = this.value;
    survivalLowerBound = Number(this.value);
});
const survivalUBInput = document.getElementById('survivalUBInput');
const survivalUBValue = document.getElementById('survivalUBValue');
survivalUpperBound = Number(survivalUBInput.value);
survivalUBValue.textContent = survivalUBInput.value;
survivalUBInput.addEventListener('input', function() {
    survivalUBValue.textContent = this.value;
    survivalUpperBound = Number(this.value);
});
const birthLBInput = document.getElementById('birthLBInput');
const birthLBValue = document.getElementById('birthLBValue');
birthLowerBound = Number(birthLBInput.value);
birthLBValue.textContent = birthLBInput.value;
birthLBInput.addEventListener('input', function() {
    birthLBValue.textContent = this.value;
    birthLowerBound = Number(this.value);
});
const birthUBInput = document.getElementById('birthUBInput');
const birthUBValue = document.getElementById('birthUBValue');
birthUpperBound = Number(birthUBInput.value);
birthUBValue.textContent = birthUBInput.value;
birthUBInput.addEventListener('input', function() {
    birthUBValue.textContent = this.value;
    birthUpperBound = Number(this.value);
});
const sliderInput = document.getElementById('sliderInput');
const sliderValue = document.getElementById('sliderValue');
gridSize = Number(sliderInput.value);
sliderValue.textContent = sliderInput.value;
sliderInput.addEventListener('input', function() {
    sliderValue.textContent = this.value;
    cellGrid = [];
    gridSize = Number(this.value);
});
window.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        console.log('event key pressed');
        cellGrid = [];
        fillGrid();
    }
});


class Cell {
    constructor(x, y, alive, wasAlive, age, agePast) {
        this.x = x;
        this.y = y;
        this.alive = alive;
        this.wasAlive = wasAlive;
        this.age = age;
        this.agePast = agePast;
    }

    draw() {
        if (this.alive) {
            let lightness;
            this.age > 10 ? lightness = 50 : lightness = 100 - (this.age * 5);
            ctx.fillStyle = 'hsl(200, 30%, ' + lightness + '%)';
            ctx.fillRect(this.x, this.y, cellSize, cellSize);
        }
        else if (this.wasAlive) {
            let lightness;
            this.agePast > 10 ? lightness = 10 : lightness = (60 - this.agePast * 5);
            ctx.fillStyle = 'hsl(10, ' + (20 - this.agePast) + '%, ' + lightness + '%)';
            ctx.fillRect(this.x, this.y, cellSize, cellSize);
        }
        else {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, cellSize, cellSize);
        }
    }
}

function fillGrid() {
    let x = xLoc;
    let y = yLoc;
    for (let i = 0; i < gridSize * gridSize; i++) {
        let alive = false;
        if (i% gridSize <= 15 && i % gridSize >= 10 && i >= gridSize * 10 && i <= gridSize * 15) {
            alive = Math.random() < 0.3;
        }
        cellGrid.push(new Cell(x, y, alive, false, 0, 0));
        if (x >= xLoc + (gridSize - 1) * cellSize) {
            x = xLoc;
            y += cellSize;
        }
        else x += cellSize;
    }
}

function handleCells() {
    if (clock > clockPer) {
        updateMethod();
        clock = 0;
    }
    else clock++;
    for (let i = 0; i < cellGrid.length; i++) {
        cellGrid[i].draw();
    }
}

function updateMethod() {
    let newCellGrid = [];
    
    for (let i = 0; i < cellGrid.length; i++) {
        let numNeighborsAlive = 0;
        let alive = cellGrid[i].alive;
        let wasAlive = cellGrid[i].alive;
        let age = cellGrid[i].age;
        let agePast = cellGrid[i].agePast;
        // Gather information on neighboring cells
        const cellLeft = (i % gridSize) - 1 >= 0;
        const cellRight = (i % gridSize) + 1 <= gridSize - 1;
        const cellAbove = i - gridSize >= 0;
        const cellBelow = i + gridSize < (gridSize * gridSize);
        if (cellLeft) {
            if (cellGrid[i - 1].alive) numNeighborsAlive++;
        }
        if (cellRight) {
            if (cellGrid[i + 1].alive) numNeighborsAlive++;
        }
        if (cellAbove) {
            if (cellGrid[i - gridSize].alive) numNeighborsAlive++;
            if (cellLeft) {
                if (cellGrid[i - gridSize - 1].alive) numNeighborsAlive++;
            }
            if (cellRight) {
                if (cellGrid[i - gridSize + 1].alive) numNeighborsAlive++;
            }
        }
        if (cellBelow) {
            if (cellGrid[i + gridSize].alive)  {
                numNeighborsAlive++;
            }
            if (cellLeft) {
                if (cellGrid[i + gridSize - 1].alive) numNeighborsAlive++;
            }
            if (cellRight) {
                if (cellGrid[i + gridSize + 1].alive) numNeighborsAlive++;
            }
        }

        // We handle survival here
        if (alive && (numNeighborsAlive >= survivalLowerBound && numNeighborsAlive <= survivalUpperBound)) {
            alive = true;
        }
        else if (!alive && (numNeighborsAlive >= birthLowerBound && numNeighborsAlive <= birthUpperBound)) {
            alive = true;
        }
        else {
            alive = false;
        }
        

        // Update accordingly
        if (cellGrid[i].age > maxAge && maxAge <= 20) alive = false;
        // keeps track of cells that were alive
        wasAlive = (!alive && (cellGrid[i].alive || cellGrid[i].wasAlive));
        // keeps track of living cells' age
        if (cellGrid[i].alive) alive ? age++ : age = 0;
        // keeps track of how long a dead cell has been dead for
        if (!cellGrid[i].alive) !alive ? agePast++ : agePast = 0;
        newCellGrid.push(new Cell(cellGrid[i].x, cellGrid[i].y, alive, wasAlive, age, agePast));
    }
    for (let i = 0; i < cellGrid.length; i++) {
        cellGrid[i] = newCellGrid[i];
    }
}

function calcMeanAge() {
    let sum = 0;
    for (let i = 0; i < cellGrid.length; i++) {
        sum += cellGrid[i].age;
    }
    return sum/cellGrid.length;
 }

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'grey';
    ctx.fillRect(xLoc - 5, yLoc - 5, gridSize * cellSize + 10, gridSize * cellSize + 10);
    ctx.fillStyle = 'black';
    ctx.fillRect(xLoc,yLoc, gridSize * cellSize, gridSize * cellSize);
    handleCells();
    requestAnimationFrame(animate);
}
animate();