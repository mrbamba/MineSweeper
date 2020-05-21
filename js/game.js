'use strict';
const MINE = '💣';
const FLAG = '⛳';
const EMPTY = ' ';

// A Matrix containing cell objects:
// Each cell: { minesAroundCount: 4, isShown: true, isMine: false, isMarked: true }

var gBoard;
var currLevel = 1;
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

// console.log(gBoard)
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function init() {
    // debugger
    // create board model
    gBoard = buildBoard(gLevel[currLevel].size)

    // Add Mines:
    // // update model:
    // randomMines(gLevel[currLevel].mines)
    console.table(gBoard);
    // Render Board:
    // setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container');

    // // // // update DOM
    // renderCell({ i: 1, j: 1 }, MINE)
    // renderCell({ i: 2, j: 3 }, MINE)
}
function pickBoard(level){
    if(level===4){
        currLevel=0;
    }else if(level===8){
        currLevel=1;
    }else{
        currLevel=2;
    }
    init()
    console.log(currLevel)
}
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

function setMinesNegsCount() {
    // Count mines around each cell and set the cell's minesAroundCount. 
    // renderBoard(board) Render the board as}
    // var mineNegSum = 0;
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            var mineNegSum = countMineNeighbors(i, j, gBoard);
            gBoard[i][j].minesAroundCount = mineNegSum
        }

    }


}


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


function cellClicked(elCell) {
    // Called when a cell (td) is clicked
    var coord = getCellCoord(elCell.id)
    var cell = gBoard[coord.i][coord.j]
    if (gGame.isOn === false) {
        gameStart(cell, coord);

        // return
    }
    if (cell.minesAroundCount !== NaN && cell.isMine === false && cell.isMarked === false) {
        cell.isShown = true
        // renderCellClass(coord, 'is-shown')
        if (cell.minesAroundCount === 0) {
            renderCell(coord, EMPTY)
            renderCellClass(coord, 'is-shown')
            expandShown(gBoard, coord)
            // expandShown(gBoard, coord)

        } else {
            renderCell(coord, cell.minesAroundCount)
            renderCellClass(coord, 'is-shown')


        }

    }
    if (cell.isMine) {
        gameLost()

    } checkGameOver()
    // renderBoard(gBoard, '.board-container');

}

// When user clicks a cell with no mines around,
// we need to open not only that cell, but also its neighbors.
// NOTE:
// Start with a basic implementation that only opens the non - mine 1st degree neighbors 
// BONUS: if you have the time later, try to work more like the real algorithm
// (see description at the Bonuses section below)
function expandShown(board, elCell) {
    // var mineSum = 0; 
    // console.log(elCell)
    for (var i = elCell.i - 1; i <= elCell.i + 1; i++) {
        if (i < 0 || i >= board.length) continue;
        for (var j = elCell.j - 1; j <= elCell.j + 1; j++) {
            var cell = board[i][j];
            // console.log(cell,'i:',i,' j:',j)
            var location = { i: i, j: j }
            if (j < 0 || j >= board[i].length) continue;
            if (i === elCell.i && j === elCell.j) continue;

            if (cell.isMine === true) {
                continue;
            }
            if (cell.minesAroundCount >= 1 && cell.minesAroundCount <= 8) {
                cell.isShown = true
                // console.log('cell should be shown=true',cell.isShown)
                renderCellClass(location, 'is-shown')
                renderCell(location, cell.minesAroundCount)
            } else if (cell.minesAroundCount === 0) {
                cell.isShown = true
                renderCellClass(location, 'is-shown')
                renderCell(location, EMPTY)



            }
        }
    }

}

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
    // console.log('cell right clicked location', cell)
}

function checkGameOver() {
    // Game ends when all mines are marked, and all the other cells are shown

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
    return true;
}


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

    console.log('game over, you lost!')
}









function randomMines(minesNeeded) {
    for (var i = 0; i < minesNeeded; i++) {
        var mineLocation = findEmptyRandomCell(gBoard);
        //update model
        gBoard[mineLocation.i][mineLocation.j].isMine = true;
    }
    // update DOM 
    // renderCell({ i:mineLocation.i, j:mineLocation.j }, MINE)
    // renderBoard(gBoard, '.board-container');

}