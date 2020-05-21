'use strict';

// The constant icons used throughout the game
const MINE = '💣';
const FLAG = '⛳';
const EMPTY = ' ';
const HAPPY = '😃';
const LOST = '😔';
const WIN = '😎';
const LIFE = '⭐';
// const HINT = '🤔';

// A Matrix containing cell objects:
var gBoard;

// the current selected game level
var currLevel = 1;

// The different levels the user can select and their properties
var gLevel = [{
    size: 4,
    mines: 2
}, {
    size: 8,
    mines: 12
}, {
    size: 12,
    mines: 30
}];

// game status
var gGame = {
    isOn: false,
};

// Life left count
var lives = 3;

// Initializes the game
function init() {
    // create board model
    resetIconUpdate(HAPPY)

    clearInterval(gTimerInterval)
    lifeCounter()
    gBoard = buildBoard(gLevel[currLevel].size)
    gGame.isOn = false
    gTimer = 0;
    lives = 3

    console.table(gBoard);
    // Render Board:
    renderBoard(gBoard, '.board-container');

}

// handles the users level selection buttons
function pickBoard(level) {
    if (level === 4) {
        currLevel = 0;
    } else if (level === 8) {
        currLevel = 1;
    } else {
        currLevel = 2;
    }
    init()
    console.log(currLevel)
}

// starts the game happens when the user clicks on the first cell
function gameStart(cell, coord) {
    timer()
    gGame.isOn = true;
    cell.isShown = true;
    renderCell(coord, EMPTY);
    renderCellClass(coord, 'is-shown');
    expandShown(gBoard, coord);
    randomMines(gLevel[currLevel].mines);
    setMinesNegsCount(gBoard);
    renderBoard(gBoard, '.board-container');

}

// counts the neighbours next to each cell, runs countMineNeighbors() on each cell
function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var mineNegSum = countMineNeighbors(i, j, gBoard);
            gBoard[i][j].minesAroundCount = mineNegSum
        }

    }


}

// counts the neighbours for each cell
function countMineNeighbors(cellI, cellJ, mat) {
    var mineSum = 0;
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;

            if (mat[i][j].isMine === true) {
                mineSum++;
            }
        }
    }
    return mineSum;
}

// Called when a cell (td) is clicked
function cellClicked(elCell) {
    var coord = getCellCoord(elCell.id)
    var cell = gBoard[coord.i][coord.j]
    if (gGame.isOn === false) {
        gameStart(cell, coord);
    }
    if (cell.minesAroundCount !== NaN && cell.isMine === false && cell.isMarked === false) {
        cell.isShown = true
        if (cell.minesAroundCount === 0) {
            renderCell(coord, EMPTY)
            renderCellClass(coord, 'is-shown')
            expandShown(gBoard, coord)

        } else {
            renderCell(coord, cell.minesAroundCount)
            renderCellClass(coord, 'is-shown')
        }
    }
    if (cell.isMine && lives > 1) {
        lives--
        lifeCounter()
        notifyLifeLost()
    } else if (cell.isMine) {
        lives--
        lifeCounter()

        gameLost();
    }
    checkGameOver()
    return
}

// When user clicks a cell with no mines around,
// we need to open not only that cell, but also its neighbors.
// NOTE:
// Start with a basic implementation that only opens the non - mine 1st degree neighbors 
// BONUS: if you have the time later, try to work more like the real algorithm
// (see description at the Bonuses section below)
function expandShown(board, elCell) {
    for (var i = elCell.i - 1; i <= elCell.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = elCell.j - 1; j <= elCell.j + 1; j++) {
            var cell = board[i][j];
            var location = { i: i, j: j }
            if (j < 0 || j >= board[i].length) continue;
            if (i === elCell.i && j === elCell.j) continue;

            if (cell.isMine === true) {
                continue;
            }
            if (cell.minesAroundCount >= 1 && cell.minesAroundCount <= 8) {
                cell.isShown = true
                renderCellClass(location, 'is-shown')
                renderCell(location, cell.minesAroundCount)
            } else if (cell.minesAroundCount === 0) {
                cell.isShown = true
                renderCellClass(location, 'is-shown')
                renderCell(location, EMPTY)
                // expandShown(board, location)
            }
        }
    }
    return
}

// handles right clicking the table field
function cellMarked(elCell) {
    // Called on right click to mark a cell (suspected to be a mine) 
    // Search the web (and implement) how to hide the context menu on right click
    var coord = getCellCoord(elCell.id);
    var cell = gBoard[coord.i][coord.j];
    if (cell.isShown === false && cell.isMarked === false) {
        cell.isMarked = true
        renderCell(coord, FLAG)
    } else if (cell.isShown === false && cell.isMarked === true) {
        cell.isMarked = false
        renderCell(coord, EMPTY)
    }
    checkGameOver()
    return
}

// Game ends when all mines are marked, and all the other cells are shown
function checkGameOver() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine === true && cell.isMarked === false) {
                return false;
            }
            if (cell.isMine === false && cell.isShown === false) {
                return false;
            }
        }
    }

    console.log('game over you won')
    clearInterval(gTimerInterval)
    resetIconUpdate(WIN)
    return;
}

// blows up the mines and posts game over notice when the user clicked a mine
function gameLost() {

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var cell = gBoard[i][j];
            if (cell.isMine === true) {
                cell.isShown = true;
                renderCellClass({ i: i, j: j }, 'is-shown')
                renderCell({ i: i, j: j }, MINE)

            }
        }
    }
    clearInterval(gTimerInterval)
    var elStopWatch = document.querySelector('.stopwatch')
    resetIconUpdate(LOST)

    elStopWatch.innerHTML = 'Game Over!'

    console.log('game over, you lost!')
    return
}

// puts in random mines
function randomMines(minesNeeded) {
    for (var i = 0; i < minesNeeded; i++) {
        var mineLocation = findEmptyRandomCell(gBoard);
        //update model
        gBoard[mineLocation.i][mineLocation.j].isMine = true;
    }
    return
}

function lifeCounter() {
    var elLife = document.querySelector('.life-counter')
    if (lives === 3) elLife.textContent = LIFE + LIFE + LIFE;
    if (lives === 2) elLife.textContent = LIFE + LIFE;
    if (lives === 1) elLife.textContent = LIFE;
    if (lives <= 0) elLife.textContent = EMPTY;
    return;
}


function notifyLifeLost() {
    var elBody = document.body.style.backgroundColor = "yellow";
    setTimeout(removeLifeLostAlert, 50);
    return;
}

function removeLifeLostAlert() {
    var elBody = document.body.style.backgroundColor = "#dadada";
    return;
}

resetIconUpdate()
function resetIconUpdate(status) {
    var icon = document.getElementById('restart')
    icon.innerText = status
    return;
}