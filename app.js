
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
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
let currentShooterIndex = 390;
let width = 20;//gives the number of 'div' inside each row and column of the 'grid'
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];//stick dead invaders in here
let results = 0;//the score
let isPlaying = false;
let tries = 3;//number of player's lives



for (let i = 0; i < 400; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}
const squares = Array.from(document.querySelectorAll('.grid div'))//
const alienInvaders = [//starting position of invaders
  0,1,2,3,4,5,6,7,8,9,
  20,21,22,23,24,25,26,27,28,29,
  40,41,42,43,44,45,46,47,48,49,
]
function draw() {//draw all invaders at beginning of game
    for (let i = 0; i < alienInvaders.length; i++) {
      if(!aliensRemoved.includes(i)) {
        squares[alienInvaders[i]].classList.add('invader')
       
      }
    }
}
draw()//invoke draw

function remove() {//invader is removed when shot or it has reached grid's left or right edge
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}

squares[currentShooterIndex].classList.add('shooter') //draw shooter at start of game

function moveShooter(e) {
  if(isPlaying){
  squares[currentShooterIndex].classList.remove('shooter')//erase shooter
  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1//check left border e.g. (0, or 20, or 40, or 60) / 20 = (0,2,4,6) and no decimals
      break
    case 'ArrowRight' :
      if (currentShooterIndex % width < width -1) currentShooterIndex +=1 //check right border e.g. (19, or 39, or 59, or 79) / 20 = (0.95,1.95,2.95,3.95) and (0*20 = 0 => 19 reminder)
      break
  }
  squares[currentShooterIndex].classList.add('shooter')//paint shooter
}
}

document.addEventListener('keydown', moveShooter)//invoke moveShooter

var time_passed_since_last_render = Date.now() - window.last_render;

function moveInvaders() {
  if(isPlaying){
  window.last_render = Date.now()
  const leftEdge = alienInvaders[0] % width === 0//define left edge as modulus = 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1//define right edge as modulus = 19
  remove()//remove invaders from grid
  if (rightEdge && goingRight) {//if invaders have reached grid's right edge
    for (let i = 0; i < alienInvaders.length; i++) {
      //console.log('before alien[i]:',alienInvaders[i] )
      alienInvaders[i] += width +1//+= ensures that all aliens are processed; move invaders down and left
      //console.log('after alien[i]:',alienInvaders[i] )
      direction = -1
      goingRight = false
    }
  }
  if(leftEdge && !goingRight) {//if invaders have reached grid's left edge
    for (let i = 0; i < alienInvaders.length; i++) {
      //console.log('before alien[i]:',alienInvaders[i] )
      alienInvaders[i] += width -1//+= ensures that all aliens are processed; move invaders down and right
      //console.log('after alien[i]:',alienInvaders[i] )
      direction = 1
      goingRight = true
    }
  }
  for (let i = 0; i < alienInvaders.length; i++) {//else if invaders are inside the grid
    alienInvaders[i] += direction//assign new position to all invaders
  }
  draw()//paint invaders at their new position

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {//check if shooter was captured
    squares[currentShooterIndex].classList.add('deadShooter')
    squares[currentShooterIndex].classList.remove('invader')
    resultsDisplay.innerHTML = 'GAME OVER'//player has lost
    document.getElementById('btnStop').style.display='none'//hide the Stop button
    window.addEventListener("keydown", function (e){
      if( e.key =="t"){
        window.location.reload();
      }
    })

    clearInterval(invadersId)
    // isPlaying = false
    tries -= 1
  }
  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[i] > (squares.length)) {//if aliens have reached grid's bottom
      resultsDisplay.innerHTML = 'GAME OVER'//player has lost
      document.getElementById('btnStop').style.display='none'//hide the Stop button
      window.addEventListener("keydown", function (e){
        if( e.key =="t"){
          window.location.reload();
        }
      })
      // window.location.reload();
      clearInterval(invadersId)
      // isPlaying = false
      tries -= 1
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {//if all aliens have been shot
    resultsDisplay.innerHTML = 'YOU WON'//player wins
    document.getElementById('btnStop').style.display='none'//hide the Stop button
    window.addEventListener("keydown", function (e){
      if( e.key =="t"){
        window.location.reload();
      }
    })
    clearInterval(invadersId)
    isPlaying = false
    tries -= 1
  }
}
}

invadersId = setInterval(moveInvaders, 100)//invoke moveInvaders at speed of 100 nanoseconds

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
      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 300)//laser hits an alien
      clearInterval(laserId)
      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)//position of shot alien
      aliensRemoved.push(alienRemoved)//append shot alien position to 'aliensRemoved' array
      results++//increase score
      resultsDisplay.innerHTML = `The score is ${results}`;
     // aliensRemoved.style.display='block';
    }
  }
  switch(e.key) {
    case ' ':
      laserId = setInterval(moveLaser, 100)
  }
}

document.addEventListener('keydown', shoot) //invoking the 'shoot' function

//stop, resume, restart buttons
function toggleMenu(){
  window.addEventListener(
    "keydown",
    (event) => {
      const keyName = event.key;
      switch (keyName){
        case "s": //stop and show restart and continue buttons
          var show1 = document.getElementById("btnContinue")
          var show2 = document.getElementById("btnRestart")
          var stop = document.getElementById('btnStop')
          stop.classList.remove("btnStop")//hide the Stop button
          stop.classList.add("btnStopHide")//hide the Stop button
          show1.classList.toggle("canSee");
          show2.classList.toggle("canSee");
          if(isPlaying){ //stop game by setting isPlaying to 'false'
            isPlaying = false
          }else{
            isPlaying = true
          }
          break 
        case "n": //hide restart and continue buttons and BEGIN AGAIN
          document.getElementById('btnStop').classList.remove("btnStopHide")
          window.location.reload();
          
        case "c": //hide restart and continue buttons and CONTINUE
          var show1 = document.getElementById("btnContinue")
          var show2 = document.getElementById("btnRestart")
          show1.classList.toggle("canSee");
          show2.classList.toggle("canSee");
          document.getElementById('btnStop').classList.remove("btnStopHide")
          document.getElementById('btnStop').classList.add("btnStop")//show the Stop button
          isPlaying = true //continue game by setting isPlaying to 'true'
          
        case "t":
          isPlaying = true;
       }
  })
}

toggleMenu() //invoking the 'toggleMenu' function

//This is the TIMER
//var countDownDate = new Date("Jan 5, 2024 15:37:25").getTime();
// Update the count down every 1 second
var x = setInterval(function() {
  
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
}, 1000);

clearInterval(x)

/*//My game loop function is used to achieve 60 frames per second

  function gameLoop(time) {
    if(resultsDisplay.innerHTML = 'YOU WON' || resultsDisplay.innerHTML = 'GAME OVER' ){
      return
    }else if(!isPlaying){
      return
    }else{
    draw()
    moveInvaders()
}
window.addEventListener("keydown", (event) => {
    switch(event.key) {
      case "t": case "s": case "n": case "b":
        toggleMenu();
        break;
      case ' ':
        shoot(event);
        break;
      case 'ArrowLeft': case 'ArrowRight':
        moveShooter(event)
}, true) 

   window.requestAnimationFrame(gameLoop)
 }
 window.requestAnimationFrame(gameLoop)
*/

/*Kingsley's gameLoop:
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
