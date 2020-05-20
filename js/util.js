
'use strict'
// function getRandomColor() {
//   var letters = '0123456789ABCDEF'.split('');
//   var color = '#';
//   for (var i = 0; i < 6; i++) {
//     color += letters[Math.floor(Math.random() * 16)];
//   }
//   return color; 
// }

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
        isShown: true,
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
        strHTML += '<td class="' + className + ' is-shown"> ' + cell + ' </td>'
        console.log('1st if', cell)
      } else if (item.isMarked) {
        cell = FLAG;
        strHTML += '<td class="' + className + '"> ' + cell + ' </td>'
        console.log('else if', cell)
      } else if (item.isShown && item.isMine === false) {
        cell = item.minesAroundCount;
        strHTML += '<td class="' + className + ' is-shown"> ' + cell + ' </td>'

        // if(item.minesAroundCount===0){}
        console.log(cell)
      } else if (item.isShown) {
        cell = EMPTY;
        strHTML += '<td class="' + className + ' is-shown"> ' + cell + ' </td>'
      } else {
        cell = EMPTY;
        console.log('else ', cell)
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
  console.log(elCell)
  elCell.innerHTML = value;
}
