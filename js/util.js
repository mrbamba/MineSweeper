
'use strict'
// function getRandomColor() {
//   var letters = '0123456789ABCDEF'.split('');
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color; 
// }
var gTimerInterval;
var gTimer=0


function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildBoard(SIZE) {
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
      }
      // board[i][j] = EMPTY;
      board[i][j] = cell;
    }
  }
  return board;
}


function renderBoard(mat, selector) {
  var cell;
  var strHTML = '<table border="0"><tbody>';
  for (var i = 0; i < mat.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < mat[0].length; j++) {
      var className = `cell cell${i}-${j}`;

      var item = mat[i][j];
      if (item.isShown && item.isMine) {
        cell = MINE;
        strHTML += `<td id="${i}-${j}" class="${className} is-shown" onclick="clickCell(this)"> ${cell} </td>`
        console.log('1st if', cell)
      }
      else if (item.isMarked) {
        cell = FLAG;
        strHTML += `<td id="${i}-${j}" class="${className} " oncontextmenu="cellMarked(this)"> ${cell}</td>`
        console.log('else if', cell)
      }
      else if (item.isShown && item.isMine === false) {
        cell = item.minesAroundCount;
        // console.log('item.minesAroundCount',cell)
        strHTML += `<td id="${i}-${j}" class=" ${className} is-shown"> ${cell} </td>`

      }
      else if (item.isShown && item.minesAroundCount > 0) {
        cell = item.minesAroundCount;
        strHTML += `<td id="${i}-${j}" class=" ${className} is-shown"> ${cell} </td>`
      }
      else {
        cell = EMPTY;
        // console.log('else ', cell)
        strHTML += `<td id="${i}-${j}" class=" ${className} "  onclick="cellClicked(this)"   oncontextmenu="cellMarked(this);return false;"> ${cell} </td>`

      }
      // strHTML += '<td class="' + className + '"> ' + cell + ' </td>' //original class name
      // var cell = mat[i][j];
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

function renderCell(location, value) {
  // // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

function renderCellClass(location, value) {
  // // Select the elCell and set the value
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.classList.add(value);
}

function findEmptyRandomCell(board) {
  var empties = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isShown === false) {
        empties.push({ i: i, j: j })
      }
    }
  }
  var res = empties[Math.floor(Math.random() * empties.length)];
  return res;
}

function getCellCoord(strCellId) {
  var parts = strCellId.split('-')
  var coord = { i: +parts[0], j: +parts[1] };
  return coord;
}

function timer() {
  var elStopWatch = document.querySelector('.stopwatch')
  gTimerInterval = setInterval(function () {
      gTimer++
      elStopWatch.innerHTML = gTimer / 100
          , 10000
  }); 

}