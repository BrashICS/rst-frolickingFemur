/**
 * ICS4U - Final Project
 *
 * Description: Basic game over Minesweeper on an 8 x 8 grid with 7 mines
 *
 * Author: Kate Boyd
 * In the words of Mme Konan: Lord have mercy...
 */

'use strict';

// Globals, event listeners, and general tomfoolery
// Feel free to change values but beware the consequences
const CVS_WIDTH = 404;
const CVS_HEIGHT = 404;
const ROWS = 8;
const COLS = 8;
let cvs;
let grid = [];

document.getElementById("rest").addEventListener("click", restart)
document.getElementById("win").hidden = true;
document.getElementById("lose").hidden = true;
document.getElementById("zeroTime").hidden = false
document.getElementById("clock").hidden = true

let clicky = 1;
let yx;
let checkin = [];
let done = true;
let winny = 0;
let timesec = 0
let timemin = 0
let clock;
let end = false;

class Square {
  colour = [0, 0, 0];
  near = 0;
  mine = "o";
  uncovered = false;

  constructor(colour, near, mine, uncovered) {
    this.colour = colour;
    this.near = near;
    this.mine = mine;
    this.uncovered = uncovered;
  }
}

// Setup the scene (runs first)
function setup() {
  cvs = createCanvas(CVS_WIDTH, CVS_HEIGHT);

  // Initialize the grid to all black squares
  for (let y = 0; y < ROWS; y++) {
    grid[y] = [];
    for (let x = 0; x < COLS; x++) {
      grid[y].push(new Square([0,0,0],0,"o","o",false,));
    }
  }
}

// Draw a new frame of the scene
function draw() {
  // Clear the screen with a grey rectangle
  background(220);

  // Draw the grid
  draw_grid(COLS, ROWS);
}

/* Draw a grid that is x by y
 * Utilize the `grid` 2D array of Squares
 * Fill each square with the proper .colour and if the near
 * of the square is over 0, write the nears on the square.
 */
function draw_grid(x, y) {
  // Get the size of each square
  let width = Math.floor(CVS_WIDTH/x);
  let height = Math.floor(CVS_HEIGHT/y);

  // Center the grid on the canvas if there's a rounding error
  let x_buffer = (CVS_WIDTH - width*x)/2
  let y_buffer = (CVS_HEIGHT - height*y)/2

  stroke("grey");
  for (let row = 0; row < y; row++) {
    for (let col = 0; col < x; col++) {
      // Fill the square with the r,g,b values from the model
      fill(...grid[row][col].colour);
      rect(col*width + x_buffer, row*height + y_buffer, width, height);

      if (grid[row][col].uncovered == true){
        grid[row][col].colour = [255,255,255];
        if (grid[row][col].near > 0) {
          textAlign(CENTER, CENTER);
          if(grid[row][col].near == 1) fill ("red")
          if(grid[row][col].near == 2) fill ("blue")
          if(grid[row][col].near == 3) fill ("green")
          if (grid[row][col].near > 3)fill ("purple")
          text(grid[row][col].near, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
        }
      }
      // Write the mines of the square in the center of it when game is won/lost
      if (end) {
        clearTimeout(clock)
        if (grid[row][col].mine == "m"){
          textAlign(CENTER, CENTER);
          fill("yellow");
          text(grid[row][col].mine, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
        }
      }
    }
  }
}

function mouseClicked(){
  let x = Math.floor((mouseX/100)/0.5);
  let y = Math.floor((mouseY/100)/0.5);

  // First click, generating grid with mines and math
  if (mouseButton == LEFT && clicky == 1){
    document.getElementById("zeroTime").hidden = true
    document.getElementById("clock").hidden = false

    // Clock, counts up every second
    clock = setInterval(countUp, 1000)

    // Highlight first click
    grid[y][x].uncovered = true;

    // Mines
    for (let m = 0; m < 7; m++){
      done = true;

      // Place first mine
      if (m==0){
        newMine(y,x);
        checkin[0] = yx;
        grid[yx[0]][yx[1]].mine = "m";
      }

      //Checking multiple mines
      if (m > 0){
        yx = [randInt(0,COLS-1), randInt(0,ROWS-1)];

        // Check mines aren't near original click
        for (let noy = -1; noy <= 1; noy++){
          for (let nox = -1; nox <= 1; nox++){
            // Need the check when noy and nox = 0
            if (yx[0] == y + noy && yx[1] == x + nox) done = false
          }
        }

        for (let i = 0; i < checkin.length; i++){
          // Restart if it's repeating or too close to first click
          if (yx[0] == checkin[i][0] && yx[1] == checkin[i][1]){
            done = false;
            yx = [randInt(0,COLS-1), randInt(0,ROWS-1)];
          }
        }

        if (done){
          checkin.push(yx);
          grid[yx[0]][yx[1]].mine = "m";
        }
        else m--
      }
    }

    // Math for near values
    for (let runy = 0; runy < ROWS; runy++) {
      for (let runx = 0; runx < COLS; runx++) {
        for (let checky = -1; checky <= 1; checky++){
          for (let checkx = -1; checkx <= 1; checkx++){
            // If on grid and if it's not main check box and initial spot is not a mine
            if (runy + checky >= 0 &&  runx + checkx >= 0 && runy + checky < 8 &&  runx + checkx < 8 && grid[runy][runx].mine != "m"){
              // If there's a mine nearby
              if (grid[runy + checky][runx + checkx].mine == "m") grid[runy][runx].near +=1
            }
          }
        }
      }
    }

    // Check open spots around click
    for (let checky = -1; checky <= 1; checky++){
      for (let checkx = -1; checkx <= 1; checkx++){
        //Assuming that location is part of the grid
        if (y + checky >= 0 && y + checky < 8 && x + checkx >= 0 && x + checkx < 8){
          grid[y + checky][x + checkx].uncovered = true;
        }
      }
    }
  }

  // New clicks
  if (clicky > 1){

    // If the click is mine, lose
    if (grid[y][x].mine == "m"){
      document.getElementById("lose").hidden = false;
      end = true;
    }

    // Check open spots around click
    for (let checky = -1; checky <= 1; checky++){
      for (let checkx = -1; checkx <= 1; checkx++){
        //Assuming that location is part of the grid and not mines
        if (y + checky >= 0 && y + checky < 8 && x + checkx >= 0 && x + checkx < 8 && grid[y + checky][x + checkx].mine == "o"){
          grid[y + checky][x + checkx].uncovered = true;
        }
      }
    }

    // Check if in total all the uncovered squares AREN'T mines
    for (let runy = 0; runy < ROWS; runy++){
      for (let runx = 0; runx < COLS; runx++){
        // If the spot is covered and there's no mine you count up
        if(grid[runy][runx].uncovered == true && grid[runy][runx].mine == "o"){
          winny++
        }
      }
    }

    //If you won, show win, stop timer
    if (winny == 57){
      document.getElementById("win").hidden = false;
      end = true;
    }
  }

  clicky++
  winny = 0;
}

// HELPER FUNCTIONS
//---------------------------------------------------------
// Helper function for first mine generated
function newMine(y,x){
  done = true;
  yx = [randInt(0,COLS-1), randInt(0,ROWS-1)];

  // Check circle around mine for first click
  for(let noy = -1; noy <= 1; noy++){
    for (let nox = -1; nox <= 1; nox++){
      if(yx[0] == y + noy && yx[1] == x + nox){
        done = false
      }
    }
  }

  // Base case
  if (done) return yx;
  newMine(y,x)
}

// Restarting grid
function restart(){
  grid = []
  clicky = 1;
  checkin = []
  done = true;
  winny = 0;
  timesec = 0;
  timemin = 0;
  end = false;
  document.getElementById("win").hidden = true;
  document.getElementById("lose").hidden = true;
  clearTimeout(clock)
  setup()
}

function countUp(){
  if (timesec == 59){
    timesec = 0;
    timemin++
  }
  else timesec++

  document.getElementById("clock").innerText = "Timer " + timemin + ":"  + timesec
}
