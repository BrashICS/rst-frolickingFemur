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
  near = 0;
  mine = "o";
  open = 0;
  flag = 0;

  constructor(colour, near, mine, open, flag) {
    this.colour = colour;
    this.near = near;
    this.mine = mine;
    this.open = open;
    this.flag = flag;
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

  stroke("white");
  for (let row = 0; row < y; row++) {
    for (let col = 0; col < x; col++) {
      // Fill the square with the r,g,b values from the model
      fill(...grid[row][col].colour);
      rect(col*width + x_buffer, row*height + y_buffer, width, height);

      // Troubleshooting, get rid of later
      // Write the mines of the square in the center of it
      if (grid[row][col].mine == "m") {
        textAlign(CENTER, CENTER);
        fill("white");
        text(grid[row][col].mine, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
      }

      // Write the mines of the square in the center of it
      if (grid[row][col].near > 0) {
        textAlign(CENTER, CENTER);
        fill("white");
        text(grid[row][col].near, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
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

  // Highlight first click
  grid[y][x].colour = [255,255,255]

  // First click, generating grid with mines and math
  if (mouseButton == LEFT && clicky == 1){

    // Mines
    for (let m = 0; m <= 10; m++){
      // Place first mine
      if (m==0){
        newMine(y,x);
        checkin[0] = yx;
        grid[yx[0]][yx[1]].mine = "m";
        m++;
      }

      //Checking multiple mines
      if (m > 0){
        yx = [randInt(0,COLS-1), randInt(0,ROWS-1)];
        for (let i = 0; i < checkin.length; i++){
          if (yx[0] == checkin[i][0] && yx[1] == checkin[i][1] || yx[0] == y && yx[1] == x){
            i = 0;
            yx = [randInt(0,COLS-1), randInt(0,ROWS-1)];
          }
        }

        checkin.push(yx);
        grid[yx[0]][yx[1]].mine = "m";
      }
    }
    // Math
    for (let runy = 0; runy < ROWS; runy++) {
      for (let runx = 0; runx < COLS; runx++) {

        for (let checky = -1; checky <= 1; runy++){
          for (let checkx = -1; checkx <= 1; runx++){

            // Nearby mine, if they're touching a mine, on the grid, and not the same as the center check
            console.log(runy, runx, checky, checkx)
            console.log(checky+2)
            console.log('')

            // If on grid and if it's not main check box
            if (runy + checky >= 0 &&  runx + checkx >= 0 && runy + checky < 8 &&  runx + checkx < 8 && runy + checky != runy &&  runx + checkx != runx){
              // If there's a mine nearby
              if (grid[runy + checky][runx + checkx].mine == "m"){
                console.log("hi")
              }
            }
            //we got some kind of infinite loop crashing here 

            // Going off grid
          }
        }

      }
    }
    clicky++

  }
}

// also idk how to display the nears of each square on grid w console.log
// checking if statements at 151


// Helper function for first mine generated
function newMine(y,x){
  yx = [randInt(0,COLS-1), randInt(0,ROWS-1)];

  // Base case
  if (yx[0] != y && yx[1] != x){
    return yx;
  }

  newMine(y,x)
}
