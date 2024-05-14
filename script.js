const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Location of our grid
const xLoc = 200;
const yLoc = 200;
let clock = 0;
const clockPer = 40;
const gridSize = 50;

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Our actial cell grid, where all of our cells will live
let cellGrid = [];

class Cell {
    constructor(x, y, alive) {
        this.x = x;
        this.y = y;
        this.alive = alive;
        this.recentlyAlive = false;
    }

    draw() {
        if (this.alive) {
            ctx.fillStyle = 'white';
            ctx.fillRect(this.x, this.y, 10, 10);
        }
        else if (this.recentlyAlive) {
            ctx.fillStyle = 'tan';
            ctx.fillRect(this.x, this.y, 10, 10);
        }
        else {
            ctx.fillStyle = 'black';
            ctx.fillRect(this.x, this.y, 10, 10);
        }
    }
}

function fillGrid() {
    let x = xLoc;
    let y = yLoc;
    for (let i = 0; i < gridSize * gridSize; i++) {
        console.log(i)
        let alive = false;
        if (i% gridSize <= 15 && i % gridSize >= 10 && i >= gridSize * 10 && i <= gridSize * 15) {
            alive = Math.random() < 0.3;
        }
        cellGrid.push(new Cell(x, y, alive));
        if (x >= xLoc + (gridSize - 1) * 10) {
            x = xLoc;
            y += 10;
        }
        else x += 10;
    }
}
fillGrid();

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
        let recentlyAlive = cellGrid[i].recentlyAlive;
        // Look at cells to left and right
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
            if (cellGrid[i + gridSize].alive) numNeighborsAlive++;
            if (cellLeft) {
                if (cellGrid[i + gridSize - 1].alive) numNeighborsAlive++;
            }
            if (cellRight) {
                if (cellGrid[i + gridSize + 1].alive) numNeighborsAlive++;
            }
        }
        if (cellGrid[i].alive && numNeighborsAlive >= 3) {
            alive = false;
        }
        else if (cellGrid[i].recentlyAlive && numNeighborsAlive >= 3) {
            alive = false;
        }
        else if (!cellGrid[i].alive && numNeighborsAlive >= 3) {
            alive = true;
        }
        newCellGrid.push(new Cell(cellGrid[i].x, cellGrid[i].y, alive));
        newCellGrid[i].recentlyAlive = (!alive && cellGrid[i].alive);
    }
    for (let i = 0; i < cellGrid.length; i++) {
        cellGrid[i] = newCellGrid[i];
    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'grey';
    ctx.fillRect(xLoc - 5, yLoc - 5, gridSize * 10 + 10, gridSize * 10 + 10);
    ctx.fillStyle = 'black';
    ctx.fillRect(xLoc,yLoc, gridSize * 10, gridSize * 10);
    handleCells();
    requestAnimationFrame(animate);
}
animate();