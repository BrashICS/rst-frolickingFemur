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
  let x_buffer = (CVS_WIDTH - width*x)/2;
  let y_buffer = (CVS_HEIGHT - height*y)/2;

  stroke("black");
  for (let row = 0; row < y; row++) {
    for (let col = 0; col < x; col++) {
      // Fill the square with the r,g,b values from the model
      fill(...grid[row][col].colour);
      rect(col*width + x_buffer, row*height + y_buffer, width, height);

      // Write the value of the square in the center of it
      if (grid[row][col].value > 0) {
        textAlign(CENTER, CENTER);
        fill("white");
        text(grid[row][col].value, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
      }
    }
  }
}

let clicky = 1;
let yx;
let checkin = [];

function mouseClicked(){
  let x = Math.floor((mouseX/100)/0.5);
  let y = Math.floor((mouseY/100)/0.5);

  // First click, generating grid with mines and math
  if (mouseButton == LEFT && clicky == 1){
    grid[y][x].colour = [255,255,255];

    // Generate 10 mines
    for (let m = 0; m<10; m++){

      // Generate mines and make sure they're in different spots
      yx = [randInt(0,COLS), randInt(0,ROWS)];
      console.log('mine')

      for (let i = 0; i < checkin; i++){

        console.log("lemme get a yeeyee")
        //Why is it not surviving apst this
        // If not first spot and doesn't already have a mine
        if (yx[0] != y && yx[1] != x && yx[0] != checkin[i][0] && yx[1] != checkin[i][0]){
          // Throws mines in grid
          checkin.push[yx];
          grid[y][x].value = -1;
          console.log(grid[y][x].value)
        }


        // If they match start a new mine
        else m--;


        console.log('here')
      }
    }

    //Done generating mines, add numbers on rest of grid

    // Need algorithm to open up

    console.log('made thru');
    console.log(grid.value);
  }

  // Flagging mine
  if (mouseButton == RIGHT){
  grid[y][x].value = -1;
  console.log('hi');
 }

 clicky++
}


//trobule at line 108 ish its not making it far enough
// also idk how to display the values of each square on grid w console.log
