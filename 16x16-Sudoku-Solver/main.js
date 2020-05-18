/*jshint esversion: 6 */

/* represents the board in array form */
let array = [
  [null, 5, null, null, null, null, null, 7, 10, null, null, 14, 13, null, null, 15],
  [14, 10, null, null, null, 15, 13, null, null, null, 11, null, null, 5, null, null],
  [12, null, 8, 11, null, null, null, null, 2, 15, 13, null, 14, 10, 9, null],
  [1, null, 15, null, 10, null, 14, 9, 0, null, null, null, null, null, null, null],
  [null, 14, 10, 9, null, null, 15, 1, 12, 7, 8, 11, null, null, null, null],
  [11, 12, null, null, 3, 0, 4, 5, 1, 2, null, null, null, null, 10, 9],
  [4, null, 5, 0, 11, null, 8, null, 14, 10, 9, 6, 15, null, null, 2],
  [null, 1, null, null, null, 9, null, 10, 5, null, 4, null, null, 12, null, 8],
  [9, 6, 14, 10, 15, null, null, null, 11, 12, null, null, null, null, null, 5],
  [8, null, null, null, null, null, 0, null, null, 1, null, 15, 9, null, null, 10],
  [0, null, 3, 5, 8, 12, null, null, 6, null, 10, null, 2, 15, null, null],
  [15, 13, null, null, 6, null, 9, 14, 3, 5, 0, null, null, null, 12, 7],
  [10, 9, null, 14, null, null, null, 15, 8, 11, 12, null, null, 0, 4, 3],
  [null, null, 11, null, 0, 3, 5, null, 15, null, null, null, 10, 9, null, null],
  [null, null, 4, null, 7, 11, 12, null, 9, null, null, 10, 1, null, null, 13],
  [2, 15, null, null, 9, null, null, 6, null, null, 5, null, null, null, 11, null]
];


/* global variables/instances */
const size = 16; // represents the 16x16 grid size
const empty = null; // represents an empty cell
let board = null; // represents the sudoku gird
let row = null; // row index of the grid
let col = null; // column index of the grid
let val = null; // value of the square


/* main */
function main() {
  window.addEventListener('keydown', writeToCell);
  drawGrid('#sudoku>table');
  //solve();
  //console.log("solve: " + solve());
  //console.log(array);
}


/*
 * fill the board with a solution if there is one
 *
 * @return true if program found a solution to the current board
 */
function solve() {
  // backtracking recursion
  for (let i = 0; i < size; i++) {
    row = i;
    for (let j = 0; j < size; j++) {
      col = j;
      if (array[row][col] === empty) {
        for (let k = 0; k < size; k++) {
          val = k;
                      console.log(val);
          if (validate()) {
            /*TODO: delete in production */
            //console.log("added " + val + " in row " + row + " in col " + col);
            array[row][col] = val;

            board.rows[row].cells[col].innerHTML = changeColor(val);
            // base case: if value leads to a solution
            if (solve()) {
              return true;
              // backtrack: if value does not lead to a solution
            } else {
              /*TODO: delete in production */
              //console.log("del row: " + row + "del col: " + col + "del value: " + val);
              array[row][col] = empty;
              board.rows[row].cells[col].innerHTML = empty;
            }
          }
        }
        //return false;
      }
    }
  }
  return true;
}


/*
 * @return true if there does not exists the same element placed
 *                  in its row, column, and 4x4 section
 */
function validate() {
  return checkRow() && checkColumn() && checkSection();
}


/*
 * return true if there does not exists the same element in this row
 */
function checkRow() {
  for (let i = 0; i < size; i++) {
    if (array[row][i] == val) return false;
  }
  return true;
}


/*
 * return true if there does not exists the same element in this column
 */
function checkColumn() {
  for (let i = 0; i < size; i++) {
    if (array[i][col] == val) return false;
  }
  return true;
}


/*
 * return true if there does not exists the same element in this section
 */
function checkSection() {
  const sectionSize = Math.sqrt(size); // represents the 4x4 section

  // formula for the first cell in given 4x4 section
  const rowSection = row - (row % sectionSize);
  const colSection = col - (col % sectionSize);

  for (let i = rowSection; i < rowSection + sectionSize; i++) {
    for (let j = colSection; j < colSection + sectionSize; j++) {
      if (array[i][j] == val) return false;
    }
  }
  return true;
}


/*
 * generates the table <tr> and <td> for the sudoku grid
 *
 * @param tag    the parent HTML tag that the table will be inserted
 */
function drawGrid(tag) {
  board = document.querySelector(tag);

  for (let i = 0; i < size; i++) {
    const tempRow = board.insertRow();
    tempRow.classList.add("row");

    for (let j = 0; j < size; j++) {
      const tempCol = tempRow.insertCell();
      tempCol.classList.add("col");

      if (array[i][j] != empty) {
        board.rows[i].cells[j].setAttribute('onclick', 'resetMouseClick()');
        board.rows[i].cells[j].innerHTML = array[i][j];
      } else {
        board.rows[i].cells[j].setAttribute('onclick', 'getCell(' + i + ',' + j + ')');
        board.rows[i].cells[j].innerHTML = empty;
      }
    }
  }
}


/*
 * return the row and column index of a cell
 *
 * @param rowIndex    the row being indexed
 * @param colIndex    the column being indexed
 */
function getCell(rowIndex, colIndex) {
  row = rowIndex;
  col = colIndex;

  /* TODO: DELETE DEBUG CODE IN PRODUCTION */
  console.log("row: " + row);
  console.log("col: " + col);
}


/*
 * resets the mouse click posistion
 */
function resetMouseClick() {
  row = null;
  col = null;
}


/*
 * allows the user to write a valid input on the sudoku board.
 * a valid input is a number 0-9 or letter A-F
 * @param event    user''s keyboard key input
 */
function writeToCell(event) {
  if (row === null || col === null) return;

  if (!checkInput(event.keyCode)) return;

  let key = event.key.toUpperCase();
  val = key;

  /* TODO: DELETE DEBUG CODE IN PRODUCTION */
  console.log("value: " + val);

  key = changeColor(key);
  board.rows[row].cells[col].innerHTML = key;
}


/*
 * @return true if the keyboard key is a number 0-9 or letter A-F
 */
function checkInput(input) {
  // keyCode  48 -> 0        57 -> 9          65 -> A        70 -> F
  if ((input >= 48 && input <= 57) || (input >= 65 && input <= 70)) return true;

  return false;
}


/*
 * change the color of given 'text'
 *
 * @pram text     the text to change color
 * @return        the text with its corresponding color
 */
function changeColor(text) {
  // add the color class to its tag and change the color in CSS
  const tag = board.rows[row].cells[col];
  const correctColor = "correct-color";
  const wrongColor = "wrong-color";

  if (validate()) {
    tag.classList.add(correctColor);
    tag.classList.remove(wrongColor);
  } else {
    tag.classList.add(wrongColor);
    tag.classList.remove(correctColor);
  }
  return text;
}


/*
 * converts double digits to single character
 *
 * @param num    the number to be converted to char
 * @return       number = 10 return 'A'
 *               number = 11 return 'B'
 */
function convertToChar(num) {
  let doubleDigit = 10; // represents when a number hits double digits
  if (num >= doubleDigit) {
    num = String.fromCharCode(num - doubleDigit + 'A'.charCodeAt(0));
  }
  return num;
}


main();