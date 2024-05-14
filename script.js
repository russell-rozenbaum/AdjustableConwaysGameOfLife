const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Location of our grid
const xLoc = 200;
const yLoc = 200;
let clock = 0;
const clockPer = 10;

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
    }

    draw() {
        if (this.alive) {
            ctx.fillStyle = 'white';
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
    for (let i = 0; i < 27 * 27; i++) {
        let alive = (Math.random() < 0.25);
        cellGrid.push(new Cell(x, y, alive));
        if (x >= 460) {
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
        console.log(i);
        let numNeighborsAlive = 0;
        let alive = cellGrid[i].alive;
        // Look at cells to left and right
        const cellLeft = (i % 27) - 1 >= 0;
        const cellRight = (i % 27) + 1 <= 26;
        const cellAbove = i - 27 >= 0;
        const cellBelow = i + 27 < (27 * 27);
        if (cellLeft) {
            if (cellGrid[i - 1].alive) numNeighborsAlive++;
        }
        if (cellRight) {
            if (cellGrid[i + 1].alive) numNeighborsAlive++;
        }
        if (cellAbove) {
            if (cellGrid[i - 27].alive) numNeighborsAlive++;
            if (cellLeft) {
                if (cellGrid[i - 27 - 1].alive) numNeighborsAlive++;
            }
            if (cellRight) {
                if (cellGrid[i - 27 + 1].alive) numNeighborsAlive++;
            }
        }
        if (cellBelow) {
            if (cellGrid[i + 27].alive) numNeighborsAlive++;
            if (cellLeft) {
                if (cellGrid[i + 27 - 1].alive) numNeighborsAlive++;
            }
            if (cellRight) {
                if (cellGrid[i + 27 + 1].alive) numNeighborsAlive++;
            }
        }
        if (cellGrid[i].alive && numNeighborsAlive >= 4) {
            alive = false;
        }
        else if (!cellGrid[i].alive && numNeighborsAlive >= 4) {
            alive = true;
        }
        newCellGrid.push(new Cell(cellGrid[i].x, cellGrid[i].y, alive));
        console.log(i);
    }
    for (let i = 0; i < cellGrid.length; i++) {
        cellGrid[i] = newCellGrid[i];
    }
}


function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'grey';
    ctx.fillRect(xLoc - 5,yLoc - 5, 280, 280);
    ctx.fillStyle = 'black';
    ctx.fillRect(xLoc,yLoc, 270, 270);
    handleCells();
    requestAnimationFrame(animate);
}
animate();