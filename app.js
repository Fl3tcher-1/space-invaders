
/*Play a sound:
  var x = document.getElementById("myAudio");
  x.play(), or: x.pause()
  or:
  var audio = new Audio("folder_name/audio_file.mp3");
  audio.play(); audio.pause();
  also:
  The 'currentTime' property sets or returns the current position (in seconds) 
  of the audio/video playback. When setting this property, the playback 
  will jump to the specified position.
  audio.currentTime = 0;
  audio.play();
*/
//To ensure users of different browsers can get the same experience
//window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(f){return setTimeout(f, 1000/60)}; // simulate calling code 60 
//window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function(requestID){clearTimeout(requestID)} //fall back
const grid = document.querySelector('.grid');
const messageDisplay = document.querySelector('.message');
const scoreDisplay = document.querySelector('.score');
//~~~~~~~~~~~~~Timer variables start~~~~~~~~~
//Stop Watch from: https://codepen.io/madrine256/details/KKoRvBb
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
let aliensRemoved = [];//stick dead invaders in here
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
//~~~~~~~~~~~~~Sounds variables start~~~~~~~~~
var piuPiu = new Audio("sounds/piu.ogg");
var deadAngel = new Audio("sounds/deadAngel.ogg");
var capturedShooter = new Audio("sounds/capturedShooter.ogg");//not used as I don't like it
var gameOver = new Audio("sounds/gameOver.ogg");
var haveWon = new Audio("sounds/haveWon.ogg");
var distantUFO = new Audio("sounds/distantUfoLights.ogg");
//~~~~~~~~~~~~~~Sounds variables end~~~~~~~~~~~~

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
//make the grid of 400 divs that will contain invaders, shooter, and laser
for (let i = 0; i < 400; i++) {
  square = document.createElement('div')
  grid.appendChild(square)
}
//make an array from grid divs named 'squares'
const squares = Array.from(document.querySelectorAll('.grid div'))//
//make an array for alien invaders
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
//console.log(squares[0].classList)
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
  if(squares[i].classList.contains("laser")||squares[i].classList.contains("boom")){
    squares[i].classList.remove('laser');
    squares[i].classList.remove('boom');
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
//play 'distantUfoLights' when game is on
function playDistantUFO(){
  if(isPlaying){
    distantUFO.currentTime = 0;
    distantUFO.play();
  }else{
    distantUFO.pause()
  }
}
function removeInv() {//invader is removed when shot or it has reached grid's left or right edge
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
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
//sets off explosion once after loss of one life, and plays 'deadAngel'
function puff(){
  deadAngel.currentTime = 0;
  deadAngel.play();
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
  setTimeout(function(){
    gameOver.pause()
  },4000)
}
}
function lostLife(){
  trophy = false;
  if(tries < 3 ){//player has at least one life left
    isPlaying = false;
    lostHeart = document.getElementById(`heart${tries}`)
      messageDisplay.innerHTML = '<p>YOU LOST<br>'
                               + `Lives remaining: ${3-tries} </p>`;
    // messageDisplay.innerHTML = `
    // YOU LOST........
    // Lives remaining: ${3-tries}
    //  `;//player has lost
    //document.getElementById("heart1").style.opacity="0"
    puff()
    lostHeart.style.opacity="0"
    resurrectShooter()
    //explosion.style.opacity="1";
    setTimeout(drawAfterLost, 4000);//re-set invaders' position after 4 seconds
    setTimeout(()=> menu.style.opacity = "1", 4000);//wait 4 seconds to show the menu
    tries++
    //localStorage.setItem("lives", tries);//to save 'tries' value in browser's memory variable 'lives', but doesn't work, gives 'undefined'
    //stop playing 'gameOver' after 4 secs
    setTimeout(() => gameOver.pause(), 4000);
    setTimeout(() => isPlaying = true, 4000);//game back on after 4 seconds
    setTimeout(() => messageDisplay.innerHTML = "Space Invaders",4000)// - Lives remaining: ${3-tries}`,4000)
    //wait 4 seconds before start timer
    setTimeout(function(){
      timeStatus = true;
      timeInterval = setInterval(startTimer, 1000);
    }, 4000);
    //wait 4 seconds before start playing 'distantUfoLights'
    setTimeout(playDistantUFO,4000);
  }else{//Player has no more lives left
    //stop aliens
    isPlaying = false;
    //cancelAnimationFrame(gameLoopID);
    messageDisplay.innerHTML = '<p> GAME OVER<br>'
                              + 'Press \'r\' to play again? </p>'
     ;//player has lost
     puff();
    document.getElementById(`heart${tries}`).style.opacity="0"
    setTimeout(()=> menu.style.opacity = "1", 4000)//wait 4 seconds to show the menu
    //wait 4 secs before stopping playing'gameOver'
    setTimeout(function(){
      gameOver.pause();
    },4000);
     window.clearInterval(timeInterval);
     minutes =0, seconds =0;
     timeStatus = false;
     window.addEventListener("keydown", function (e){
       if( e.key =="r"){
         location.reload(true)
         tries = 1
       }
     })
  }
}
function wonLife(){//player has earned one life, continues playing
  console.log("wonLife called")
  isPlaying = false;
  //show 'triumph message' for 4 seconds
    messageDisplay.innerHTML = "<span style='color: gold;'><p>🏆 YOU WON ONE LIFE!</span><br>"
                             + `You have ${3 - tries +1} lives left</p>`;
  // messageDisplay.innerHTML = `
  // 🏆 YOU WON ONE LIFE!
  // You have ${3 - tries +1} lives left
  // `;
  setTimeout(drawAfterWin, 4000);//re-draw invaders' at starting position after 4 seconds
  setTimeout(()=> menu.style.opacity = "1", 4000);//wait 4 seconds to show the menu
  setTimeout(() => isPlaying = true, 4000);//wait 4 seconds before start playing again
  //wait 4 seconds before you stop playing 'haveWon'
  setTimeout(function(){
    haveWon.pause();
  },4000);
    //wait 4 seconds before start playing 'distantUfoLights'
    setTimeout(playDistantUFO,4000);
  //wait 4 seconds before start timer
  setTimeout(function(){
    timeStatus = true;
    timeInterval = setInterval(startTimer, 1000);
  }, 4000);
}
document.addEventListener('keydown', moveShooter)//invoke moveShooter
function moveInvaders() {
  scoreDisplay.innerHTML = `Score: ${results}`;
 if(tries == null || tries == undefined || tries == NaN || tries == 0){
    tries = 1;
  } else if(tries == 1 && !isPlaying && !trophy){
    menu.style.opacity="1";
    messageDisplay.innerHTML = '<p>SPACE INVADERS<br>'
                             + 'Press \'p\' to play</p>';
    // messageDisplay.innerHTML = `//this doesn't work...
    // SPACE INVADERS
    // Press 'p' to play
    // `;
  };
  if(isPlaying){
  messageDisplay.innerHTML = "SPACE INVADERS"
  window.last_render = Date.now()
  const leftEdge = alienInvaders[0] % width === 0//define left edge as modulus = 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1//define right edge as modulus = 19
  removeInv()//remove invaders from grid
  if (rightEdge && goingRight) {//if invaders have reached grid's right edge
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width +1//+= ensures that all aliens are processed; move invaders down and left
      direction = -1 //leftwards
      goingRight = false
    }
  }
  if(leftEdge && !goingRight) {//if invaders have reached grid's left edge
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width -1//+= ensures that all aliens are processed; move invaders down and right
      direction = 1 //rightwards
      goingRight = true
    }
  }
  for (let i = 0; i < alienInvaders.length; i++) {//else if invaders are inside the grid
    alienInvaders[i] += direction//assign new position to all invaders
  }
   draw()//paint invaders at their new position. Previously moved to: paintGameState()
  //End of game 1: shooter is captured
  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {//check if shooter was captured
    squares[currentShooterIndex].classList.add('deadShooter')
    squares[currentShooterIndex].classList.remove('invader')
    //stop the 'distantUfoLights' tune
    distantUFO.pause()
    trophy = false
    //play the 'gameOver' tune
    gameOver.currentTime = 0;
    gameOver.play();
    //stop the timer
    timeStatus = false;
    window.clearInterval(timeInterval);
     lostLife()
    return
  }
 //End of game 2: Invaders have touched grid's bottom
  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[alienInvaders.length-1] >= 390 && alienInvaders[alienInvaders.length-10]<= 399) {//if lowest row of aliens has reached grid's bottom
      //stop the 'distantUfoLights' tune
      distantUFO.pause()
      //play the 'gameOver' tune
      gameOver.currentTime = 0;
      gameOver.play();
      trophy = false
      //stop the timer
      timeStatus = false;
      window.clearInterval(timeInterval);
      lostLife();
      return
    }
  }
  // //End of game 3: if all aliens have been shot
  if (aliensRemoved.length === alienInvaders.length) {//if all aliens have been shot
    //stop the 'distantUfoLights' tune
    distantUFO.pause()
    trophy = true
    //play the 'haveWon' tune
    haveWon.currentTime = 0;
    haveWon.play();
    //stop the timer
    timeStatus = false;
    window.clearInterval(timeInterval);
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
    }
  }
  switch(e.key) {
    case ' ':
      laserId = setInterval(moveLaser, 100)
      //play shoot sound
      piuPiu.currentTime = 0;
      piuPiu.play();
  }
}
document.addEventListener('keydown', shoot) //invoking the 'shoot' function
  

//stop, resume, restart menu
function toggleMenu(){
  window.addEventListener(
    "keydown",
    (event) => {
      const keyName = event.key;
      switch (keyName){
        case "s": //stop
          menu.style.opacity = "0.5";
          //stop the timer
          timeStatus = false;
          window.clearInterval(timeInterval);
          if(isPlaying){ //stop game by setting isPlaying to 'false'
            isPlaying = false
          }
         //stop playing the 'distantUfoLights' tune
         playDistantUFO()
          break 

        case "r": //restart
          location.reload(true)
          console.log({tries})
          //remove timer numbers
          window.clearInterval(timeInterval);
          minutes =0, seconds =0;
          timeStatus = false;
          timerContainer.innerHTML = `0${hours} : 0${minutes}`;
          
        case "c": //continue 
          //start the timer by invoking the 'startTimer' function
          if(timeStatus === false){
            timeInterval = setInterval(startTimer, 1000);
            timeStatus = true;
          };
          //continue game by setting isPlaying to 'true'
          isPlaying = true 
          //play the 'distantUfoLights' tune
          playDistantUFO()
        //play 
        case "p":
          if(menu.style.opacity = "0.5"){
            menu.style.opacity = "1";
          }else{
            menu.style.opacity = "0.5"
          };
          //start the timer by invoking the 'startTimer' function every second
          if(timeStatus === false){
            timeInterval = setInterval(startTimer, 1000);
            timeStatus = true;
          }
          //restart the game
          isPlaying = true;
          //play the 'distantUfoLights' tune
          playDistantUFO()
       }
  })
}
toggleMenu() //invoking the 'toggleMenu' function
//My game loop function v.0.1, used to achieve 60 frames per second
  function gameLoop() {
      if(fps === 4){
        moveInvaders();
        fps = 0;
      }
  fps++
      gameLoopID = window.requestAnimationFrame(gameLoop);//gameLoop is automatically passed a timestamp indicating the precise time requestAnimationFrame() was called.
    }
 
 let gameLoopID = window.requestAnimationFrame(gameLoop)//starts things off


