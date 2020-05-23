'use strict'

// timer variables


function stopwatch(){
  seconds++
  if(seconds/60===1){
    seconds=0
    minutes++
  }
  var elStopWatch = document.querySelector('.stopwatch').innerText=minutes+":"+seconds;

}

// returns random int- inclusive
function getRandomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
 
// builds the matrix of objects 
function buildBoard(SIZE) {
  var board = [];
  for (var i = 0; i < SIZE; i++) {
    board.push([]);
    for (var j = 0; j < SIZE; j++) {
      var cell = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
        expandChecked: false
      }
      board[i][j] = cell;
    }
  }
  return board;
}

// renders the board according the model 
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
      else if (item.isShown && item.isMine === false && item.minesAroundCount!==0) {
        cell = item.minesAroundCount;
        strHTML += `<td id="${i}-${j}" class=" ${className} is-shown"> ${cell} </td>`

      }
      else if (item.isShown && item.minesAroundCount > 0) {
        cell = item.minesAroundCount;
        strHTML += `<td id="${i}-${j}" class=" ${className} is-shown"> ${cell} </td>`
      }else if (item.isShown && item.isMine === false && item.minesAroundCount===0) {
        cell = EMPTY;
        strHTML += `<td id="${i}-${j}" class=" ${className} is-shown"> ${cell} </td>`
      } else {
        cell = EMPTY;
        strHTML += `<td id="${i}-${j}" class=" ${className}  "  onclick="cellClicked(this)"   oncontextmenu="cellMarked(this);return false;"> ${cell} </td>`

      }
    }
    strHTML += '</tr>'
  }
  strHTML += '</tbody></table>';
  var elContainer = document.querySelector(selector);
  elContainer.innerHTML = strHTML;
}

// // Select the elCell and set the value
function renderCell(location, value) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.innerHTML = value;
}

// // Select the elCell and adds a class value
function renderCellClass(location, value) {
  var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
  elCell.classList.add(value);
}

// Goes through the matrix, finds a random mineless cell and returns it
function findEmptyRandomCell(board) {
  var empties = []
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[0].length; j++) {
      if (board[i][j].isShown === false && board[i][j].isMine === false) {
        empties.push({ i: i, j: j })
      }
    }
  }
  var res = empties[Math.floor(Math.random() * empties.length)];
  return res;
}

// translates from cell-i-j to object
function getCellCoord(strCellId) {
  var parts = strCellId.split('-')
  var coord = { i: +parts[0], j: +parts[1] };
  return coord;
}


// stopWatch taken from 
// https://github.com/JamieMcGibbon/TechnicalCafe/tree/master/Misc%20Tutorials/Stopwatch%20Tutorial
//Define vars to hold time values
let seconds = 0;
let minutes = 0;
let hours = 0;

//Define vars to hold "display" value
let displaySeconds = 0;
let displayMinutes = 0;
let displayHours = 0;

//Define var to hold setInterval() function
let interval = null;

//Define var to hold stopwatch status
let status = "stopped";

//Stopwatch function (logic to determine when to increment next value, etc.)
function stopWatch(){

    seconds++;

    //Logic to determine when to increment next value
    if(seconds / 60 === 1){
        seconds = 0;
        minutes++;

        

    }

    //If seconds are only one digit, add a leading 0 to the value
    if(seconds < 10){
        displaySeconds = "0" + seconds.toString();
    }
    else{
        displaySeconds = seconds;
    }


    //Display updated time values to user
    document.querySelector('.stopwatch').innerHTML =  minutes + ":" + displaySeconds;

}



function startStop(){

    if(status === "stopped"){

        //Start the stopwatch (by calling the setInterval() function)
        interval = window.setInterval(stopWatch, 1000);
        status = "started";

    }
    else{

        window.clearInterval(interval);
        status = "stopped";

    }

}

//Function to reset the stopwatch
function reset(){

    window.clearInterval(interval);
    seconds = 0;
    minutes = 0;
    hours = 0;
    document.querySelector('.stopwatch').innerHTML = "0:00";

}