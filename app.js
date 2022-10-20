
/*This is the pattern of a 'game loop':

let previous = getCurrentTime();
let lag = 0.0;
while (true)
{
  let current = getCurrentTime();
  let elapsed = current - previous;
  previous = current;
  lag += elapsed;

  processInput();

  while (lag >= 16)
  {
 update();
 lag -= 16;
  }
 
  render();

}
*/

/*move element until screen width -100px:
xpos = 0;
function move(){
  xpos = xpos + 5;
  box.style.transform = `translateX(${xpos}px)`;
  let ww = document.body.clientWidth - 100;
  if(xpos < ww){
    requestAnimationFrame(move);
  }
}

window.requestAnimationFrame(move);
*/


/*function update() {
  // Update the state of the world for the elapsed time since last render
}
function draw() {
  // Draw the state of the world
}*/




//To ensure users of different browsers can get the same experience
//window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(f){return setTimeout(f, 1000/60)}; // simulate calling code 60 
//window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function(requestID){clearTimeout(requestID)} //fall back
const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
const scoreDisplay = document.querySelector('.score');
//~~~~~~~~~~~~~Timer variables start~~~~~~~~~
//Stop Watch: https://codepen.io/madrine256/details/KKoRvBb
const timerContainer = document.querySelector('#time');//get timer element
let timeInterval = null,//time stamp at game start
    timeStatus = false,
    minutes = 0,
    seconds = 0,
    leadingMins = 0,
    leadingSecs = 0;
//~~~~~~~~~~~~~~Timer variables end~~~~~~~~~~~~
let currentShooterIndex = 390;
let width = 20;//gives the number of 'div' inside each row and column of the 'grid'
let direction = 1;
//let invadersId;
let goingRight = true;
let aliensRemoved = [];//stick dead invaders in h ere
let results = 0;//the score
let isPlaying = false;
let tries;//set # lives to 1
let lives;//to retain value in browser memory for 3 consecutive games
let square;
let currentLaserIndex = currentShooterIndex
//let laserId
let fps = 0;
let menu = document.querySelector(".menu")
let trophy = false
let lostHeart;
let explosion;
//let heart3 = document.getElementById("#heart3")

//++++++++++++ START OF GAME +++++++++++++++

//This is the timer function
function startTimer(){
  seconds++;
  //if seconds dived by 60 = 1 set back the seconds to 0 and increment the minutes 
  if(seconds/60 === 1 ){
    seconds =0;
    minutes++;
  }
  //add zero if seconds are less than 10
  if(seconds < 10){
    leadingSecs = '0' + seconds.toString();
  }else{
    leadingSecs = seconds;
  };
    //add zero if minutes are less than 10
        if(minutes < 10){
   leadingMins= '0' + minutes.toString();
  }else{
    leadingMins= minutes;
  };
   //Change timer text content to actaul stop watch
   timerContainer.innerHTML = `Time: ${leadingMins} : ${leadingSecs}`;
  }


for (let i = 0; i < 400; i++) {
  square = document.createElement('div')
  grid.appendChild(square)
}
const squares = Array.from(document.querySelectorAll('.grid div'))//
var alienInvaders = [//starting position of invaders
  0,1,2,3,4,5,6,7,8,9,
  20,21,22,23,24,25,26,27,28,29,
  40,41,42,43,44,45,46,47,48,49,
]

squares[currentShooterIndex].classList.add('shooter') //draw shooter AT START OF GAME

function draw() {//draw all invaders AT START OF GAME
    for (let i = 0; i < alienInvaders.length; i++) {
      if(!aliensRemoved.includes(i)) {
        squares[alienInvaders[i]].classList.add('invader')
      }
    }
}
draw()//draws invaders AT START OF GAME

//re-position invaders during game, after life has been lost
function drawAfterLost(){
  //console.log("drawAgain IS being called")
 removeInv()
 alienInvaders = [//re-starting position of invaders
  0,1,2,3,4,5,6,7,8,9,
  20,21,22,23,24,25,26,27,28,29,
  40,41,42,43,44,45,46,47,48,49,
]
console.log(squares[0].classList)
for(i=0;i<=19;i++){
  if(squares[i].classList.contains("laser")){
    squares[i].classList.remove('laser');
  }
}
draw()

}

function drawAfterWin(){//draw invaders after player has won one life
  aliensRemoved = []//clear all aliens from the 'aliensRemoved' array
 alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  20,21,22,23,24,25,26,27,28,29,
  40,41,42,43,44,45,46,47,48,49,
]
for(i=0;i<=19;i++){
  if(squares[i].classList.contains("laser")){
    squares[i].classList.remove('laser');
  }
}
draw()
}


//++++++++++++ GAME IS ON +++++++++++++++


//include inside 'paintGameState' function
function paintShooter() {//paints shooter movements
  squares[currentShooterIndex].classList.add('shooter');
  }

  //include inside 'paintGameState' function
function paintLaser() {//paints laser movements
  squares[currentLaserIndex].classList.add('laser')

}



  /*Not include inside requestAnimationFrame
function paintGameState(){

//paintInv()//draw invaders while game is on

//paintShooter()//draw shooter while game is on

//paintLaser()//draw laser while game is on
}*/





function removeInv() {//invader is removed when shot or it has reached grid's left or right edge
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
    //squares[alienInvaders[i]].style.opacity = "0";
  }
}

function moveShooter(e) {
  if(isPlaying){
  squares[currentShooterIndex].classList.remove('shooter')//erase shooter
  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1//first, check left border e.g. (0, or 20, or 40, or 60) / 20 = (0,2,4,6) i.e. no decimals, then move left
      break
    case 'ArrowRight' :
      if (currentShooterIndex % width < width -1) currentShooterIndex +=1 //first, check right border e.g. (19, or 39, or 59, or 79) / 20 = (0.95,1.95,2.95,3.95) and (0*20 = 0 => 19 reminder), then move right
      break
  }
  squares[currentShooterIndex].classList.add('shooter')// added to paintShooter() inside paintGameState()

}
}
//sets off explosion once after loss of one life
function puff(){
  explosion = document.getElementById(`explosion${tries}`);
  explosion.style.opacity="1";
  setTimeout(() => {
    explosion.style.opacity = "0"
  },500);
}

//repaints 'shooter' before new play
function resurrectShooter(){
  if(squares[currentShooterIndex].classList.contains('deadShooter')){
    setTimeout(() => {
      squares[currentShooterIndex].classList.remove('deadShooter')
  },4000)
}
}

function lostLife(){
  trophy = false;
  console.log("lostLife called")
  if(tries < 3 ){//player has at least one life left
    //console.log(tries)
    isPlaying = false;
    //cancelAnimationFrame(gameLoopID);
    //console.log(tries)
    lostHeart = document.getElementById(`heart${tries}`)
   // explosion = document.getElementById(`explosion${tries}`)
    //console.log(lostHeart)
    resultsDisplay.innerHTML = `
    YOU LOST
     Lives remaining: ${3-tries}
     `;//player has lost
    //document.getElementById("heart1").style.opacity="0"
    puff()
    lostHeart.style.opacity="0"
    resurrectShooter()
    //explosion.style.opacity="1";
    setTimeout(drawAfterLost, 4000);//re-set invaders' position after 4 seconds
    setTimeout(()=> menu.style.opacity = "1", 4000);//wait 4 seconds to show the menu
    tries++
    //localStorage.setItem("lives", tries);//to save 'tries' value in browser's memory variable 'lives', but doesn't work, gives 'undefined'
    console.log("tries after lost:", tries)
    setTimeout(() => isPlaying = true, 4000);//start playing after 4 seconds
    setTimeout(() => resultsDisplay.innerHTML = "Space Invaders",4000)// - Lives remaining: ${3-tries}`,4000)
    //setTimeout(() => {
    //  explosion.style.opacity = "0"
   // },500);
    // clearTimeout(myExplosion); No need to clearTimeout, or explosion keeps going.
    //console.log(tries)
    //console.log(localStorage.getItem("lives"))
  }else{//Player has no more lives left
    //console.log(tries)
    isPlaying = false;
    //cancelAnimationFrame(gameLoopID);
    resultsDisplay.innerHTML = `
    GAME OVER - Lives used: ${tries}
     Press 'r' to play again?
     `;//player has lost
     puff();
    document.getElementById(`heart${tries}`).style.opacity="0"
    // explosion = document.getElementById(`explosion${tries}`);
    // explosion.style.opacity="1";
    // setTimeout(() => {
    //   explosion.style.opacity = "0"
    // },500);
    //setTimeout(function(){explosion.style.opacity="0"},1000);
    //document.getElementById(`heart${tries}`).style.opacity="0"
    //lives = localStorage.setItem("lives", tries);
    setTimeout(()=> menu.style.opacity = "1", 4000)//wait 4 seconds to show the menu
    //tries = 1
    //localStorage.setItem("lives", tries);//to save 'tries' value in browser's memory, but doesn't work, gives 'undefined'
    //console.log("lives in memory after lost 3 lives:",lives)
    //console.log(tries)
    //menu.style.opacity = "1";
     //document.getElementById('btnStop').style.display='none'//hide the Stop button
     window.addEventListener("keydown", function (e){//press "t" to play again
       if( e.key =="r"){
         //window.location.reload();
         location.reload(true)
         tries = 1
         //console.log("tries after lost 3 lives and hard reload:",tries)
         //tries = localStorage.getItem("lives")//maybe not needed here
       }
     })
  }

 //clearInterval(invadersId)
  //isPlaying = false
  //tries += 1
}

function wonLife(){//player has earned one life, continues playing
  //trophy = true;
  console.log("wonLife called")
  isPlaying = false;
  //clearInterval(laserId)
  //show 'triumph message' for 4 seconds
  resultsDisplay.innerHTML = `
  🏆 YOU WON ONE LIFE!
  You still have ${3 - tries +1} lives left
  `;
  //trophy = false
  //document.getElementById(`heart${tries}`).style.opacity="0";
  //localStorage.setItem("lives", tries)
  //setTimeout(trophy.style.opacity="0",4000);//hide trophy after 4 seconds
  setTimeout(drawAfterWin, 4000);//re-draw invaders' at starting position after 4 seconds
  setTimeout(()=> menu.style.opacity = "1", 4000);//wait 4 seconds to show the menu
  setTimeout(() => isPlaying = true,4000);//wait 4 seconds before start playing again
 //document.getElementById('btnStop').style.display='none'//hide the Stop button
 /* window.addEventListener("keydown", function (e){
    if( e.key =="t"){
    
    window.location.reload();
    tries = localStorage.getItem("lives")//maybe not needed here
  }
})*/
}


document.addEventListener('keydown', moveShooter)//invoke moveShooter

var time_passed_since_last_render = Date.now() - window.last_render;

function moveInvaders() {
  scoreDisplay.innerHTML = `Score: ${results}`;
 // tries = localStorage.getItem("lives")
  //console.log(tries)
 if(tries == null || tries == undefined || tries == NaN || tries == 0){
    tries = 1;
  } else if(tries == 1 && !isPlaying && !trophy){
    menu.style.opacity="1";
    resultsDisplay.innerHTML = `
    SPACE INVADERS
    Press 'p' to play
    `;
  };
  //console.log(tries)
  if(isPlaying){
  resultsDisplay.innerHTML = "SPACE INVADERS"
  window.last_render = Date.now()
  const leftEdge = alienInvaders[0] % width === 0//define left edge as modulus = 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1//define right edge as modulus = 19
  removeInv()//remove invaders from grid
  if (rightEdge && goingRight) {//if invaders have reached grid's right edge
    for (let i = 0; i < alienInvaders.length; i++) {
      //console.log('before alien[i]:',alienInvaders[i] )
      alienInvaders[i] += width +1//+= ensures that all aliens are processed; move invaders down and left
      //console.log('after alien[i]:',alienInvaders[i] )
      direction = -1 //leftwards
      goingRight = false
    }
  }
  if(leftEdge && !goingRight) {//if invaders have reached grid's left edge
    for (let i = 0; i < alienInvaders.length; i++) {
      //console.log('before alien[i]:',alienInvaders[i] )
      alienInvaders[i] += width -1//+= ensures that all aliens are processed; move invaders down and right
      //console.log('after alien[i]:',alienInvaders[i] )
      direction = 1 //rightwards
      goingRight = true
    }
  }
  for (let i = 0; i < alienInvaders.length; i++) {//else if invaders are inside the grid
    alienInvaders[i] += direction//assign new position to all invaders
  }
   draw()//paint invaders at their new position. Previously moved to: paintGameState()

  //End of game 1: shooter is captured
  //console.log(tries)
  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {//check if shooter was captured
    squares[currentShooterIndex].classList.add('deadShooter')
    squares[currentShooterIndex].classList.remove('invader')
    console.log("Shooter dead, tries:", tries);
    trophy = false

    //resultsDisplay.innerHTML = 'GAME OVER'//player has lost
    
     lostLife()
    return
  }
 //End of game 2: Invaders have touched grid's bottom
  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[alienInvaders.length-1] >= 390 && alienInvaders[alienInvaders.length-10]<= 399) {//if lowest row of aliens has reached grid's bottom
      console.log("Aliens touch ground, tries:", tries);
      //resultsDisplay.innerHTML = 'GAME OVER'//player has lost
      //menu.style.opacity = "1";
      trophy = false
      lostLife();
      return
    }
  }
  // //End of game 3: if all aliens have been shot
  if (aliensRemoved.length === alienInvaders.length) {//if all aliens have been shot
    console.log(tries)
    console.log("All aliens shot, tries:", tries);
    //resultsDisplay.innerHTML = 'YOU WON'//player wins
    //menu.style.opacity = "1";
    //clearInterval(invadersId)
    //isPlaying = false
    trophy = true
    wonLife();
     return
  }
}
}
//I am removing setInterval function because I am using requestAnimationFrame function
//invadersId = setInterval(moveInvaders, 100)//invoke moveInvaders at speed of 100 nanoseconds

function shoot(e) {
  console.log("shoot called")
  let laserId
  let currentLaserIndex = currentShooterIndex
  function moveLaser() {
    console.log("moveLaser called")
    if(currentLaserIndex >= 0 && currentLaserIndex <= 19 ) {//if laser is in grid's top row
      squares[currentLaserIndex].classList.remove('laser')//remove laser 
    }else{
      squares[currentLaserIndex].classList.remove('laser')//if inside grid, move laser upwards
      currentLaserIndex -= width
      squares[currentLaserIndex].classList.add('laser')
    }
    if (squares[currentLaserIndex].classList.contains('invader')) {//check laser collision event with invader
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.add('boom')
      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 200)//laser hits an alien
      clearInterval(laserId)
      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)//position of shot alien
      aliensRemoved.push(alienRemoved)//append shot alien position to 'aliensRemoved' array
      results++//increase score
      scoreDisplay.innerHTML = `Score: ${results}`;
      //aliensRemoved.style.display='block';

    }
  }
  switch(e.key) {
    case ' ':
      laserId = setInterval(moveLaser, 100)
  /*  case 't':
      window.location.reload(); */
  }
}
document.addEventListener('keydown', shoot) //invoking the 'shoot' function
  

/*Moved to paintGameState
function shoot(e) {
  let laserId
  switch(e.key) {
    case ' ':
      laserId = setInterval(moveLaser, 16)//calling 'shoot' function in rAF
      moveLaser();
  }
}

document.addEventListener('keydown', shoot) //invoking the 'shoot' function*/

//stop, resume, restart buttons
function toggleMenu(){
  window.addEventListener(
    "keydown",
    (event) => {
      const keyName = event.key;
      switch (keyName){
        case "s": //stop and show restart and continue buttons
          //var show1 = document.getElementById("btnContinue")
          //var show2 = document.getElementById("btnRestart")
          //var stop = document.getElementById('btnStop')
          //stop.classList.remove("btnStop")//hide the Stop button
          //stop.classList.add("btnStopHide")//hide the Stop button
          //show1.classList.toggle("canSee");
          //show2.classList.toggle("canSee");
          //stop the timer
          menu.style.opacity = "0.5";
          //stop the timer
          timeStatus = false;
          window.clearInterval(timeInterval);
          if(isPlaying){ //stop game by setting isPlaying to 'false'
            isPlaying = false
          }/*else{
            isPlaying = true
          }*/
          break 
        case "r": //hide restart and continue buttons and BEGIN AGAIN
          //document.getElementById('btnStop').classList.remove("btnStopHide")
          //window.location.reload();
          //console.time(startTime);
          location.reload(true)
          //remove timer numbers
          window.clearInterval(timeInterval);
          minutes =0, seconds =0;
          timeStatus = false;
          timerContainer.innerHTML = `0${hours} : 0${minutes}`;
          
        case "c": //hide restart and continue buttons and CONTINUE
          //var show1 = document.getElementById("btnContinue")
          //var show2 = document.getElementById("btnRestart")
          //show1.classList.toggle("canSee");
          //show2.classList.toggle("canSee");
          //document.getElementById('btnStop').classList.remove("btnStopHide")
          //document.getElementById('btnStop').classList.add("btnStop")//show the Stop button
          //start the timer by invoking the 'startTimer' function
          if(timeStatus === false){
            //timeInterval = setInterval(startTimer, 1000);
            timeInterval = setInterval(startTimer, 1000);
            timeStatus = true;
          };
          isPlaying = true //continue game by setting isPlaying to 'true'
          
        case "p":
          if(menu.style.opacity = "0.5"){
            menu.style.opacity = "1";
          }else{
            menu.style.opacity = "0.5"
          };
          //start the timer by invoking the 'startTimer' function
          if(timeStatus === false){
            timeInterval = setInterval(startTimer, 1000);
            timeStatus = true;
          }
          //restart the game
          isPlaying = true;
          //tries++
          //tries = localStorage.getItem("lives");
       }
  })
}

toggleMenu() //invoking the 'toggleMenu' function

//This is the TIMER
//var countDownDate = new Date("Jan 5, 2024 15:37:25").getTime();
// Update the count down every 1 second
/*var x = setInterval(function() {
  
  // Get today's date and time
  //var now = new Date().getTime();
  // Find the distance between now and the count down date
  //var distance = countDownDate - now;
//4 minutes per game in nanoseconds
  var distance = 240000;
  // Time calculations for days, hours, minutes and seconds
  //var days = Math.floor(distance / (1000 * 60 * 60 * 24));
  // var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  var minutes = Math.floor(distance/ (1000 * 60));
  var seconds = Math.floor(distance/ 1000);
  // Display the result in the element with id="demo"
  document.getElementById("countdown").innerHTML = "Time left: " + minutes + " m " + seconds + " sec ";
  // If the count down is finished, write some text
  if (distance < 0) {
    clearInterval(x);
    document.getElementById("demo").innerHTML = 'GAME OVER';
    isPlaying = false
  }
}, 1000)

clearInterval(x)*/


/*function start() {
  startTime = new Date();
};

function end() {
  endTime = new Date();
  var timeDiff = endTime - startTime; //in ms
  // strip the ms
  timeDiff /= 1000;*/

  /*function theTimer(e){
    if(e.key = 'r'){
      console.time(startTime/1000)
    }
    while(isPlaying = true){
      console.timeLog(startTime/1000);
    }
  }

  document.addEventListener('keydown',theTimer)*/


//Show time while playing
/*function theTimer(e){
  startTime = new Date().getTime();
  console.log({startTime})
  if(e = 'r'){
    timeElapsed = new Date().getTime - startTime
    console.log({timeElapsed})
    var minutes = Math.floor(timeElapsed/ (1000 * 60));
    var seconds = Math.floor(timeElapsed/ 1000);
    timeDisplay.innerHTML = "Time: "+ minutes + " m " + seconds + " sec ";
}
}

document.addEventListener('keydown', theTimer)*/



//My game loop function v.0.1, used to achieve 60 frames per second

  function gameLoop() {
  /*  if(timestamp >= 1000/60){
      return
    }else{*/
    //console.log(timestamp)
      if(fps === 4){
        moveInvaders();
        //moveLaser()
        //paintGameState();
        //moveShooter(e);
        //moveLaser(e);
        /*window.addEventListener("keydown", (event) => { //Not needed for rAF
         switch(event.key) {
         case "t": case "s": case "n": case "b":
            toggleMenu();
            break;
          case ' ':
            shoot(event);
            break;
          case 'ArrowLeft': case 'ArrowRight':
            moveShooter(event);
      }
    }, true)*/


        fps = 0;
      }
  fps++
     
    //const timeElapsed = performance.now();//gives time interval since last frame
  
      gameLoopID = window.requestAnimationFrame(gameLoop);//gameLoop is automatically passed a timestamp indicating the precise time requestAnimationFrame() was called.
    }
 
 let gameLoopID = window.requestAnimationFrame(gameLoop)//starts things off
 //let startLoop = window.requestAnimationFrame(gameLoop)//starts things off


//cancelAnimationFrame(startLoop)


//My game loop function v.0.2 that includes time stamp
/*function gameLoop() {
//let d = new Date()
//let previous = d.getSeconds() * 1000;
let lag = 0.0;
while (isPlaying)
{
  //d = new Date()
  //let current = d.getSeconds() * 1000;
  //let elapsed = current - previous;
  let elapsed = performance.now();
 // previous = current;
  lag += elapsed;

  //processInput();

  while (lag >= 16)
  {
 //update();
 moveInvaders();
     window.addEventListener("keydown", (event) => { 
         switch(event.key) {
    /* case "t": case "s": case "n": case "b":
            toggleMenu();
            break;
          case ' ':
            shoot(event);
            break;
          case 'ArrowLeft': case 'ArrowRight':
            moveShooter(event);
      }
    }, true)


 lag -= 16;
  }
 
  //render();
  window.requestAnimationFrame(gameLoop);
}
}
let startLoop = window.requestAnimationFrame(gameLoop)//starts things off
*/


/*Kingsley's gameLoop:
function loopAnimation(){
if(lost){
  return
}else if(gamePaused){
  return
}
moveBall()
window.reequestAnimationFrame(loopAnimation)
}
window.requestAnimationFrame(loopAnimation);//start things off

*/

