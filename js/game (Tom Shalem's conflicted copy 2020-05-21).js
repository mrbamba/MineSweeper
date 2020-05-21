'use strict';
const MINE = '💣';
const FLAG = '⛳';
const EMPTY = ' ';

// A Matrix containing cell objects:
// Each cell: { minesAroundCount: 4, isShown: true, isMine: false, isMarked: true }

var gBoard;

var gLevel = {
    SIZE: 4,
    MINES: 2
};

// console.log(gBoard)

var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
};

function init() {
    // create board model
    gBoard = buildBoard(gLevel.SIZE)

    // Add Mines:
    // // update model:
    gBoard[2][3].isMine = true
    gBoard[1][1].isMine = true

    console.table(gBoard);
    // Render Board:
    setMinesNegsCount(gBoard)
    renderBoard(gBoard, '.board-container');

    // // // update DOM
    renderCell({ i: 1, j: 1 }, MINE)
    renderCell({ i: 2, j: 3 }, MINE)
}

function setMinesNegsCount(board) {
    // Count mines around each cell and set the cell's minesAroundCount. 
    // renderBoard(board) Render the board as}
    var mineNegSum = 0;
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            mineNegSum = countMineNeighbors(i, j, board);
            board[i][j].minesAroundCount = mineNegSum
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
    var cell=gBoard[coord.i][coord.j]
    console.log(cell)
    if(cell.minesAroundCount>=0&&cell.minesAroundCount<=8){
        cell.isShown=true
        renderCell(coord, cell.minesAroundCount)
        renderCellClass(coord, 'is-shown')

    }
    console.log('cell clicked location', coord)
}

function cellMarked(elCell) {
    // Called on right click to mark a cell (suspected to be a mine) 
    // Search the web (and implement) how to hide the context menu on right click
    var cell = getCellCoord(elCell.id)

    console.log('cell right clicked location', cell)
}

function checkGameOver() {
    // Game ends when all mines are marked, and all the other cells are shown
}

function expandShown(board, elCell, i, j) {
    // When user clicks a cell with no mines around,
    // we need to open not only that cell, but also its neighbors.
    // NOTE:
    // Start with a basic implementation that only opens the non - mine 1st degree neighbors 
    // BONUS: if you have the time later, try to work more like the real algorithm
    // (see description at the Bonuses section below)
}




function getCellCoord(strCellId) {
    var parts = strCellId.split('-')
    var coord = { i: +parts[0], j: +parts[1] };
    console.log(coord)
    return coord;
}