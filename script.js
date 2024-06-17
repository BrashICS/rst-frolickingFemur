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
document.getElementById("zeroTime").hidden = false
document.getElementById("clock").hidden = true

let clicky = 1;
let yx;
let checkin = [];
let done = true;
let lose = 0;
let available = new Array()
let already = false;
let timesec = 0
let timemin = 0
let clock;

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

  stroke("grey");
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
          grid[y + checky][x + checkx].uncovered = true;
          grid[y + checky][x + checkx].colour = [255,255,255];
          if (y + checky != y && x + checkx != x) available.push([y + checky, x + checkx]);
        }
      }
    }

    console.log("Just finished first openings so here's available = " + available)

    //something wrong with my checking for repeats in available
    // Click check was done, now checking how far it can expand

    for (let checky = -1; checky <= 1; checky++){
      for (let checkx = -1; checkx <= 1; checkx++){
        for (let i = 0; i < available.length; i++){

          //Assuming that around open location is part of the grid
          if (available[i][0] + checky >= 0 && available[i][0]+ checky < 8 && available[i][1] + checkx >= 0 && available[i][1] + checkx < 8){

            //something here???
            //availcheck isnt actually used in this loop lmao what am i doing
            // Loop through availables to assure no repeats
            for (let availCheck = 0; availCheck < available.length; availCheck++){
              if(available[availCheck][0] + checky == available[i][0] && available[availCheck][1] + checkx == available[availCheck][1]){
               already = true
              }
            }


            // If it's mineless and not stored before then uncover
            if (grid[available[i][0] + checky][available[i][1] + checkx].mine != "m" && already == false){

              grid[available[i][0] + checky][available[i][1] + checkx].uncovered = true;
              grid[available[i][0] + checky][available[i][1] + checkx].colour = [255,255,255];

              if (grid[available[i][0] + checky][available[i][1] + checkx].near == 0){
                available.push([available[i][0] + checky, available[i][1] + checkx]);
              }
            }
          }
        }
      }
    }
  }

  // New clicks
  if (clicky > 1 && grid[y][x].flag == "o"){


    // If the click is mine, lose
    if (grid[y][x].mine == "m"){
      document.getElementById("lose").hidden = true;

      // Can no longer alter the grid
      clicky = undefined;

      //Stop the clock
      timesec = 0;
      timemin = 0;
      clearTimeout(clock)
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
      timesec = 0;
      timemin = 0;
      clearTimeout(clock)

    }

  }

  // Flagging on right click
  if (mouseButton == RIGHT){
    console.log('jfidsjafpdaf')
  }

  clicky++
  lose = 0;
  console.log("recent click coords = " + y,x)
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
  already = false;
  timesec = 0;
  timemin = 0;
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


// working on displaying the flagging ish maybe push to later
// need kill when mine is left clicked (future clicks)
// algorithm to open up that can be called upon for all #s of left clicks
// check how to win (when uncovered squares are all mine == o)
//problems with rightclick never registering

//try making things private
