
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

/*keyboard codes:
s:          83 for 'stop'
b:          66 for 'begin again'
c:          67 for 'continue'
left arrow: 37
up arrow:   38
right arrow:39
down arrow: 40
*/


function update() {
  // Update the state of the world for the elapsed time since last render
}

function draw() {
  // Draw the state of the world
}


// function loop() {

//   moveInvaders()

//   window.requestAnimationFrame(loop)
// }

// window.requestAnimationFrame(loop)


//To ensure users of different browsers can get the same experience
var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
let fps = 60;
const grid = document.querySelector('.grid');
const resultsDisplay = document.querySelector('.results');
let currentShooterIndex = 390;
let width = 20;
let direction = 1;
let invadersId;
let goingRight = true;
let aliensRemoved = [];
let results = 0;
let isPlaying = true;
let tries = 3;

for (let i = 0; i < 400; i++) {
  const square = document.createElement('div')
  grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienInvaders = [
  0,1,2,3,4,5,6,7,8,9,
  40,41,42,43,44,45,46,47,48,49,
  80,81,82,83,84,85,86,87,88,89,

]

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
      if(!aliensRemoved.includes(i)) {
        squares[alienInvaders[i]].classList.add('invader')
       
      }
    }
}

draw()

function remove() {
  for (let i = 0; i < alienInvaders.length; i++) {
    squares[alienInvaders[i]].classList.remove('invader')
  }
}

squares[currentShooterIndex].classList.add('shooter')



function moveShooter(e) {
  if(isPlaying){
  squares[currentShooterIndex].classList.remove('shooter')

  switch(e.key) {
    case 'ArrowLeft':
      if (currentShooterIndex % width !== 0) currentShooterIndex -=1
      break
    case 'ArrowRight' :
      if (currentShooterIndex % width < width -1) currentShooterIndex +=1
      break
  }
  squares[currentShooterIndex].classList.add('shooter')
}
}
document.addEventListener('keydown', moveShooter)

var time_passed_since_last_render = Date.now() - window.last_render;

function moveInvaders() {
  if(isPlaying){
  window.last_render = Date.now()

  const leftEdge = alienInvaders[0] % width === 0
  const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width -1
  remove()

  if (rightEdge && goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width +1
      direction = -1
      goingRight = false
    }
  }

  if(leftEdge && !goingRight) {
    for (let i = 0; i < alienInvaders.length; i++) {
      alienInvaders[i] += width -1
      direction = 1
      goingRight = true
    }
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    alienInvaders[i] += direction
  }

  draw()

  if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
    resultsDisplay.innerHTML = 'GAME OVER'
    clearInterval(invadersId)
    isPlaying = false
    tries -= 1
  }

  for (let i = 0; i < alienInvaders.length; i++) {
    if(alienInvaders[i] > (squares.length)) {
      resultsDisplay.innerHTML = 'GAME OVER'
      clearInterval(invadersId)
      isPlaying = false
      tries -= 1
    }
  }
  if (aliensRemoved.length === alienInvaders.length) {
    resultsDisplay.innerHTML = 'YOU WIN'
    clearInterval(invadersId)
    isPlaying = false
    tries -= 1
  }
}
}

invadersId = setInterval(moveInvaders, 100)

function shoot(e) {
  let laserId
  let currentLaserIndex = currentShooterIndex
  function moveLaser() {
    squares[currentLaserIndex].classList.remove('laser')
    currentLaserIndex -= width
    squares[currentLaserIndex].classList.add('laser')

    if (squares[currentLaserIndex].classList.contains('invader')) {
      squares[currentLaserIndex].classList.remove('laser')
      squares[currentLaserIndex].classList.remove('invader')
      squares[currentLaserIndex].classList.add('boom')

      setTimeout(()=> squares[currentLaserIndex].classList.remove('boom'), 200)
      clearInterval(laserId)

      const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
      aliensRemoved.push(alienRemoved)
      results++
      resultsDisplay.innerHTML = results
      console.log(aliensRemoved)

    }

  }
  switch(e.key) {
    case ' ':
      laserId = setInterval(moveLaser, 100)
  }
}
//stop, resume, restart buttons
function toggleMenu(){
  window.addEventListener(
    "keydown",
    (event) => {
      const keyName = event.key;
      switch (keyName){
        case "s": //stop and show restart and continue buttons
          var show = document.querySelector(".restartContinue")
          var stop = document.getElementById('btnStop')
          stop.style.display='none'//hide the Stop button
          show.classList.toggle("canSee");
          if(isPlaying){ //stop game by setting isPlaying to 'false'
            isPlaying = false
          }else{
            isPlaying = true
          }
          break 
        case "b": //hide restart and continue buttons and BEGIN AGAIN
          window.location.reload();
          
        case "c": //hide restart and continue buttons and CONTINUE
          var show = document.querySelector(".restartContinue")
          show.classList.toggle("canSee"); 
          var stop = document.getElementById('btnStop')
          stop.style.display='block'//show the Stop button
          isPlaying = true //continue game by setting isPlaying to 'true'
       }
  })
}


toggleMenu()



document.addEventListener('keydown', shoot)