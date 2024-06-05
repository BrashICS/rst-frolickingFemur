/**
 * ICS4U - Final Project
 *
 * Description:
 *
 * Author: Kate Boyd
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

//document.getElementById("rest").addEventListener("click", test)

class Square {
  colour = [0, 0, 0];
  value = 0;

  constructor(colour, value) {
    this.colour = colour;
    this.value = value;
  }
}

// Setup the scene (runs first)
function setup() {
  cvs = createCanvas(CVS_WIDTH, CVS_HEIGHT);

  // Initialize the grid to all black squares
  for (let y = 0; y < ROWS; y++) {
    grid[y] = [];
    for (let x = 0; x < COLS; x++) {
      grid[y].push(new Square([0, 0, 0], 0));
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
 * Fill each square with the proper .colour and if the value
 * of the square is over 0, write the value on the square.
 */
function draw_grid(x, y) {
  // Get the size of each square
  let width = Math.floor(CVS_WIDTH/x);
  let height = Math.floor(CVS_HEIGHT/y);

  // Center the grid on the canvas if there's a rounding error
  let x_buffer = (CVS_WIDTH - width*x)/2
  let y_buffer = (CVS_HEIGHT - height*y)/2

  stroke("black");
  for (let row = 0; row < y; row++) {
    for (let col = 0; col < x; col++) {
      // Fill the square with the r,g,b values from the model
      fill(...grid[row][col].colour);
      rect(col*width + x_buffer, row*height + y_buffer, width, height);

      // Write the value of the square in the center of it
      if (grid[row][col].value > 0) {
        textAlign(CENTER, CENTER);
        fill("white")
        text(grid[row][col].value, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
      }
    }
  }
}

function mouseClicked(){
  let x = Math.floor((mouseX/100)/0.5)
  let y = Math.floor((mouseY/100)/0.5)

  if (mouseButton == LEFT){
    grid[y][x].colour= (0,0,0)}

    for(let y = 0; y<ROWS;y++){
      for(let x = 0; x < COLS; x++){
        console.log(grid[y][x].colour)
      }
    }
}
/*
let clicky = 1;
let checkinx = []
let chenkiny = []

function mouseClicked(){
  let x = Math.floor((mouseX/100)/0.5)
  let y = Math.floor((mouseY/100)/0.5)

  // First click, generating grid with mines and math
  if (mouseButton == LEFT && clicky == 1){
    grid[y][x].colour = (0,0,0)

    console.log('yeehaw')
    // Insert algorithm to generate mines
    for (let m = 0; m< 10; m++){

      // Make sure mines are in different spots
      for (let i = 0; i < checkin.length; i++){
        if (y == checkiny[i] && x == checkinx[i]){
          yx = [lib.randInt(0,COLS), lib.randInt(0,ROWS)]
          i = -1
        }
      }

      // Throws mines in grid
      checkiny.push(y)
      checkinx.push(x)
      grid[y][x].value = -1
      console.log(grid)
    }
    console.log(grid)
  }

  // Flagging mine
  if (mouseButton == RIGHT){
  grid[y][x].value = 0
  console.log('hi')
 }

 clicky++
}


let clicky = 1;
let checkinx = []
let chenkiny = []

function mouseClicked(){
  let x = Math.floor((mouseX/100)/0.5)
  let y = Math.floor((mouseY/100)/0.5)

  // First click, generating grid with mines and math
  if (mouseButton == LEFT && clicky == 1){
    console.log(grid[y][x].colour)
    grid[y][x].colour = (255,255,255)
    grid.colour=(0,0,0)

    console.log(grid[y][x].colour)


    console.log('yeehaw')

    }
  console.log(grid)


  // Flagging mine
  if (mouseButton == RIGHT){
    grid[y][x].value = -2
    console.log('hi')
  }

 clicky++
}
*/

//problem is the grey rectangle its regenerating from where i click onwards
