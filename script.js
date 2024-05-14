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
let liveRule, deathRule;

const inputBoxes = document.querySelectorAll('.inputBox');

function enterInput(event) {
    if (event.key === 'Enter') {
        cellGrid = [];
        fillGrid();
    }
}
inputBoxes[0].addEventListener('input', function() {
    if (inputBoxes[0].value.trim() >= 0 && inputBoxes[0].value.trim() <= 9) {
        liveRule = inputBoxes[0].value.trim();
    }
});
inputBoxes[1].addEventListener('input', function() {
    if (inputBoxes[1].value.trim() >= 0 && inputBoxes[1].value.trim() <= 9) {
        deathRule = inputBoxes[1].value.trim();
    }
});
inputBoxes[0].addEventListener('keydown', enterInput);
inputBoxes[1].addEventListener('keydown', enterInput);


const sliderInput = document.getElementById('sliderInput');
const sliderValue = document.getElementById('sliderValue');
gridSize = Number(sliderInput.value);
sliderValue.textContent = sliderInput.value;
sliderInput.addEventListener('input', function() {
    sliderValue.textContent = this.value;
    cellGrid = [];
    gridSize = Number(this.value);
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
        if (cellGrid[i].alive && numNeighborsAlive >= liveRule) {
            console.log(liveRule);
            alive = false;
        }
        else if (!cellGrid[i].alive && numNeighborsAlive >= deathRule) {
            console.log(deathRule);
            alive = true;
        }
        if (cellGrid[i].age > 10) alive = false;
        // We handle survival here
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