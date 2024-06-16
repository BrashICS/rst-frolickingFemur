/**
 * ICS4U - Final Project
 *
 * Description: Basic game over Minesweeper on an 8 x 8 grid with 7 mines
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

document.getElementById("rest").addEventListener("click", restart)
document.getElementById("win").hidden = true;
document.getElementById("lose").hidden = true;


class Square {
  colour = [0, 0, 0];
  near = 0;
  mine = "o";
  flag = "o";
  uncovered = false

  constructor(colour, near, mine, flag) {
    this.colour = colour;
    this.near = near;
    this.mine = mine;
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

  stroke("white");
  for (let row = 0; row < y; row++) {
    for (let col = 0; col < x; col++) {
      // Fill the square with the r,g,b values from the model
      fill(...grid[row][col].colour);
      rect(col*width + x_buffer, row*height + y_buffer, width, height);

      /*
      // Flag
      if (grid[row][col].flag == "F") {
        textAlign(CENTER, CENTER);
        fill("red");
        text(grid[row][col].mine, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
      }

      */
      //--------------------------------------------------------------------
      // Troubleshooting, get rid of later
      // Write the mines of the square in the center of it
      if (grid[row][col].mine == "m") {
        textAlign(CENTER, CENTER);
        fill("yellow");
        text(grid[row][col].mine, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
      }

      // Write the mines of the square in the center of it
      if (grid[row][col].near > 0) {
        textAlign(CENTER, CENTER);
        if(grid[row][col].near == 1) fill ("red")
        if(grid[row][col].near == 2) fill ("blue")
        if(grid[row][col].near == 3) fill ("green")
        if (grid[row][col].near > 3)fill ("purple")
        text(grid[row][col].near, (col*width + x_buffer)+width/2, (row*height + y_buffer)+width/2);
      }

      //--------------------------------------------------------------------
    }
  }
}

let clicky = 1;
let yx;
let checkin = [];
let done = true;
let lose = 0;
let open = new Array()

function mouseClicked(){
  let x = Math.floor((mouseX/100)/0.5);
  let y = Math.floor((mouseY/100)/0.5);


  // First click, generating grid with mines and math
  if (mouseButton == LEFT && clicky == 1){
    // Highlight first click
    grid[y][x].colour = [255,255,255]
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
          // If it's mineless and not touching anything uncover
          if (grid[y + checky][x + checkx].mine == "o"){
            grid[y + checky][x + checkx].uncovered = true;
            grid[y + checky][x + checkx].colour = [255,255,255];

            if (grid[y + checky][x + checkx].near == 0){
              open.push([y + checky, x + checkx]);
            }
          }
        }
      }
    }

    // Click check was done, now checking how far it can expand
    for (let i = 0; i < open.length; i++){
      for (let checky = -1; checky <= 1; checky++){
        for (let checkx = -1; checkx <= 1; checkx++){

          //Assuming that location is part of the grid
          if (open[i][0] + checky >= 0 && open[i][0] < 8 && open[i][1] + checkx >= 0 && open[i][1] + checkx < 8){

            // If it's mineless and not touching anything uncover
            if (grid[open[i][0] + checky][open[i][1] + checkx].mine == "o"){
              grid[open[i][0] + checky][open[i][1] + checkx].uncovered = true;
              grid[open[i][0] + checky][open[i][1] + checkx].colour = [255,255,255];

              if (grid[open[i][0] + checky][open[i][1] + checkx].near == 0){
                open.push([open[i][0] + checky, open[i][1] + checkx]);
              }
            }
          }
        }
      }
    }

    console.log("done with looping through open spots, open = " + open)
    //oopsie daisy looks like im pushing thigns to open wrong
  }

  // New clicks
  if (clicky > 1 && grid[y][x].flag == "o"){

    // If the click is mine, lose
    if (grid[y][x].mine == "m"){
      document.getElementById("lose").hidden = true;

      // Can no longer alter the grid
      clicky = undefined;

      //Stop the clock
    }


    // Check if in total all the uncovered squares AREN'T mines
    for (let runy = 0; runy < ROWS; runy++){
      for (let runx = 0; runx < COLS; runx++){
        // If the spot is uncovered but there's not mine to it
        if(grid[runy][runx].uncovered == false && grid[runy][runx].mine == "o"){
          lose++
        }
      }
    }

    //If you won, show win, stop timer
    if (lose == 0){
      document.getElementById("win").hidden = false;

      // Can no longer alter the grid
      clicky = undefined
      // Stop the timer also


    }

  }

  // Flagging on right click
  if (mouseButton == RIGHT){
    console.log('jfidsjafpdaf')
  }

  clicky++
  lose = 0;
  console.log('done click')
  console.log(" ")
}

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
  lose = 0;
  setup()
}

//SUNDAY - WORKING FUNCTIONAL GAME
//MONDAY TIMER AND TIMER RESTARTS


// working on displaying the flagging ish maybe push to later
// need kill when mine is left clicked (future clicks)
// algorithm to open up that can be called upon for all #s of left clicks
// check how to win (when uncovered squares are all mine == o)
//problems with rightclick never registering

//remember to stop clock when lost/won
