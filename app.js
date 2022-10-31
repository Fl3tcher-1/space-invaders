//Miscellaneous notes to self
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

// this way its possible to lose the layout
box.style.transform = `translateX(${x * 100}px)`
It is possible to remove painting by adding a layer:

 this will take care of the painting by creating a layer and transform it
#box {
  width: 100px;
  height: 100px;
  ....
  will-change: transform;
}
*/
//To ensure users of different browsers can get the same experience
//window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(f){return setTimeout(f, 1000/60)}; // simulate calling code 60 
//window.cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame || function(requestID){clearTimeout(requestID)} //fall back
//
//~~~~~~~~~~~~~Start of Global Variables Declarations~~~~~~~~~~~~~~~~~~~~
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
//array of alien invaders
var alienInvaders = [//starting position of invaders
  20,21,22,23,24,25,26,27,28,29,
  40,41,42,43,44,45,46,47,48,49,
  60,61,62,63,64,65,66,67,68,69,
]
let leftEdge = 0 //define grid's left edge as modulus = 0
let rightEdge = 19 //define grid's right edge as modulus = 19
let currentShooterIndex = 390;
let width = 20;//gives the number of 'div' inside each row and column of the 'grid'
let direction = 1;
let goingRight = true;
let aliensRemoved = [];//stick dead invaders in here
let results = 0;//the score
let isPlaying = false;
let tries;//set # lives to 1
let lives;//to retain value in browser memory for 3 consecutive games
let square;
let currentLaserIndex = currentShooterIndex
let fps = 0;
let menu = document.querySelector(".menu")
let trophy = false
let lostHeart;
let explosion;
let speed = 4;
//~~~~~~~~~~~~~Sounds variables start~~~~~~~~~
var piuPiu = new Audio("sounds/piu.ogg");
var deadAngel = new Audio("sounds/deadAngel.ogg");
var capturedShooter = new Audio("sounds/capturedShooter.ogg");//not used as I don't like it
var gameOver = new Audio("sounds/gameOver.ogg");
var haveWon = new Audio("sounds/haveWon.ogg");
var distantUFO = new Audio("sounds/distantUfoLights.ogg");
//~~~~~~~~~~~~~~Sounds variables end~~~~~~~~~~~~
//
//~~~~~~~~~~~~~End of Global Variables Declarations~~~~~~~~~~~~~~~~~~~~
//
//++++++++++++ START OF GAME +++++++++++++++
//
//change speed of game
function changeSpeed(){
  if(speed >=2){
    --speed;
}else{
  speed;
}
}
//
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
  //
//Start of game: make the grid of 400 divs that will contain invaders, shooter, and laser
for (let i = 0; i < 400; i++) {
  square = document.createElement('div')
  grid.appendChild(square)
}
//
//make an array from grid divs named 'squares'
const squares = Array.from(document.querySelectorAll('.grid div'))//
//
//draw shooter AT START OF GAME
squares[currentShooterIndex].classList.add('shooter')
//
//draw all invaders AT START OF GAME
function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
      if(!aliensRemoved.includes(i)) {
          squares[alienInvaders[i]].classList.add('invader')
        }
      }
    }

//invoke draw AT START OF GAME
draw()
//
//re-position invaders during game, after life has been lost
function drawAfterLost(){
 removeInv()
 alienInvaders = [//re-starting position of invaders
  20,21,22,23,24,25,26,27,28,29,
  40,41,42,43,44,45,46,47,48,49,
  60,61,62,63,64,65,66,67,68,69,
]
draw()
}
//
//draw invaders after player has won one life
function drawAfterWin(){
  aliensRemoved = []//clear all aliens from the 'aliensRemoved' array
 alienInvaders = [
  20,21,22,23,24,25,26,27,28,29,
  40,41,42,43,44,45,46,47,48,49,
  60,61,62,63,64,65,66,67,68,69,
]
draw()
}
//
//++++++++++++ GAME IS ON +++++++++++++++
//
//include inside 'paintGameState' function
function paintShooter() {//paints shooter movements
  squares[currentShooterIndex].classList.add('shooter');
  }
//
//include inside 'paintGameState' function
function paintLaser() {//paints laser movements
  squares[currentLaserIndex].classList.add('laser')
}
//
//play 'distantUfoLights' when game is on
function playDistantUFO(){
  if(isPlaying){
    distantUFO.currentTime = 0;
    distantUFO.play();
  }else{
    distantUFO.pause()
  }
}
//
//invader is removed when shot or it has reached grid's left or right edge
function removeInv() {
  for (let i = 0; i < alienInvaders.length; i++) {
    if(!aliensRemoved.includes(i)){
      squares[alienInvaders[i]].classList.remove('invader')
    }

  }
}
//
//re-position shooter left or right
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
//
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
//
//repaints 'shooter' before new play
function resurrectShooter(){
  if(squares[currentShooterIndex].classList.contains('deadShooter')){
      squares[currentShooterIndex].classList.remove('deadShooter')
} else if(squares[currentShooterIndex].classList.contains('shooter')){
    squares[currentShooterIndex].classList.remove('shooter')
}
currentShooterIndex = 390
squares[currentShooterIndex].classList.add('shooter')
}
//
//play ended with one life lost
function lostLife(){
  trophy = false;
  if(tries < 3 ){//player has at least one life left
    isPlaying = false;
    lostHeart = document.getElementById(`heart${tries}`)
      messageDisplay.innerHTML = '<p>YOU LOST<br>'
                               + `Lives remaining: ${3-tries} </p>`;
    puff()
    lostHeart.style.opacity="0"
    setTimeout(drawAfterLost, 4000);//re-set invaders' position after 4 seconds
    setTimeout(resurrectShooter, 4000)//re-draw shooter at starting position after 4 seconds
    setTimeout(()=> menu.style.opacity = "1", 4000);//wait 4 seconds to show the menu
    tries++
    //stop playing 'gameOver' after 4 secs
    setTimeout(() => gameOver.pause(), 4000);
    setTimeout(() => isPlaying = true, 4000);//game back on after 4 seconds
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
    cancelAnimationFrame(gameLoopID);
    messageDisplay.innerHTML = '<p> GAME OVER<br>'
                              + 'Press \'r\' to play again? </p>'
     ;
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
  }
}
//
//player has earned one life, continues playing
function wonLife(){
  isPlaying = false;
  changeSpeed()
  //show 'triumph message' for 4 seconds
    messageDisplay.innerHTML = "<span style='color: gold;'><p>🏆 YOU WON ONE LIFE!</span><br>"
                             + `You have ${3 - tries +1} lives left</p>`;
  setTimeout(drawAfterWin, 4000);//re-draw invaders' at starting position after 4 seconds
  setTimeout(resurrectShooter, 4000)//re-draw shooter at starting position after 4 seconds
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
//
document.addEventListener('keydown', moveShooter)//invoke moveShooter
//
//This is 'space invaders' key function that makes aliens move left/right and down
function moveInvaders() {
  scoreDisplay.innerHTML = `Score: ${results}`;
 if(tries == null || tries == undefined || tries == NaN || tries == 0){
    tries = 1;
  } else if(tries == 1 && !isPlaying && !trophy){
    menu.style.opacity="1";
    messageDisplay.innerHTML = '<p>SPACE INVADERS<br>'
                             + 'Press \'p\' to play</p>';
  };
  if(isPlaying){
  messageDisplay.innerHTML = '<p>SPACE INVADERS</p>'
  removeInv()//remove invaders from grid
    leftEdge = alienInvaders[0] % width === 0//define left edge as modulus = 0
    rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1//define right edge as modulus = 19
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
    if(!aliensRemoved.includes(i) && alienInvaders[i] >= 380 && alienInvaders[i]<= 399) {//aliens have reached grid's bottom
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
//
//This is 'space invaders' second most important function that moves shooter's laser up and down
function shoot(e) {
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
      if(isPlaying){
        laserId = setInterval(moveLaser, 100)
        //play shoot sound
        piuPiu.currentTime = 0;
        piuPiu.play();
      }
  }
}
//
document.addEventListener('keydown', shoot) //invoking the 'shoot' function
//
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
          //location.reload(true) //not used as it caused frame drop
          if(!isPlaying){
          tries = 1
          speed = 4 
          removeInv() 
          drawAfterWin()
          resurrectShooter()
          document.getElementById('heart1').style.opacity="1"
          document.getElementById('heart2').style.opacity="1"
          document.getElementById('heart3').style.opacity="1"
          //remove timer numbers
          window.clearInterval(timeInterval);
          minutes =0, seconds =0;
          timeStatus = false;
          timerContainer.innerHTML = `Time: 0${minutes} : 0${seconds}`;
          //wipe out the score
          results = 0
          break
          }
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
//
toggleMenu() //invoking the 'toggleMenu' function
//
//My game loop function v.0.1, used to achieve 60 frames per second
  function gameLoop() {
      if(fps === speed){
        moveInvaders();
        fps = 0;
      }
  fps++
      gameLoopID = window.requestAnimationFrame(gameLoop);//gameLoop is automatically passed a timestamp indicating the precise time requestAnimationFrame() was called.
    }
 
 let gameLoopID = window.requestAnimationFrame(gameLoop)//starts things off


