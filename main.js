
//      CONTAINER
let container = document.getElementById("container");
let playArea = container.getBoundingClientRect().width / 2;
let instruction = document.getElementById('instruction')
let scoreboard = document.getElementById('scoreboard')
let boundary = document.getElementById('container').getBoundingClientRect()


// Character select
let characters =["dragon", "spaceship"]
let character 
let charSelectScreen =document.getElementById("characterSelect")
let dragonCharacter = document.getElementById("splitLeft")
let spaceshipCharacter = document.getElementById("splitRight")
let dragon = document.getElementById('dragon')

// character sprites
playerIdleImgPos = 191 //x size value for a single sprite image
playerIdleImgPosy = 161 // y value for a single sprite image
playerIdleImgPosyLeft = 483 //last y value for single sprite image
counter =0 //used to control animation speed

//      SPACESHIP 
const spaceshipVelocity = 12; // it's an int and refers to spaceships speed
let spaceship = document.getElementById("spaceship");
let spaceshipDiv = document.querySelector(".spaceshipDiv");
let middleOfSpaceShip = spaceship.getBoundingClientRect().width / 2;
container.append(spaceshipDiv);

//     BULLET
let bulletStart = spaceship.getBoundingClientRect().height + 45; //starting position of bullet(y axis)
let bulletVelocity = bulletStart;
// let bulletVelocity =15
let shootPressed = false; //used to control firing


//    KEYS
let started = false; //game started
let charChosen =false

//used to allow multiple input keys (move and shoot)
let move = {left:  0,
            right: 0, 
            shoot: 0 };
    let key; //inits key values
            
// SCORE  
let score = 0;
    
// TIMER 
    let time = new Date().getTime()
    let seconds = 0;
    let minutes = 0;
    let clock = document.getElementById('timer');
    
    let gameOver = false;
    let won = false

//~~~~~~~~~~~~~Sounds variables start~~~~~~~~~
var piuPiu = new Audio("sounds/piu.ogg");
var deadAngel = new Audio("sounds/deadAngel.ogg")
var endGame = new Audio("sounds/gameOver.ogg");
var haveWon = new Audio("sounds/haveWon.ogg");
var distantUFO = new Audio("sounds/distantUfoLights.ogg");
//~~~~~~~~~~~~~~Sounds variables end~~~~~~~~~~~~

let destroyed = false; 


//      ENEMY 
let aliens = Array.from(document.querySelectorAll(".aliens")); // all the aliens
const enemy = document.getElementById("enemy");


let position = 0;  // start position of the enemy 
let direction = true;
let curentY = 0;
let canFire = true;

window.addEventListener("load", () => {
  spaceship.style.position = "absolute";
  spaceship.style.left = playArea - middleOfSpaceShip + "px"; // center the Spaceship
});

let spaceshipStart = boundary.width/2 - spaceship.getBoundingClientRect().width


//      KEYDOWN
document.addEventListener("keydown", (e) => {
  // console.log(key)
  key = e.key;
  if(won){
    if (key === "r") {
      started = true;
      window.location.reload(true)
    }
  }
  if(key =='a'){
    character =characters[0]
    spaceship=dragon
    spaceship.style.left = playArea - middleOfSpaceShip + "px"; // center the Spaceship
    charSelectScreen.remove()
    instruction.style.opacity=1
    charChosen =true
  }
  if(key =='d'){
    character=characters[1]
    charSelectScreen.remove()
    instruction.style.opacity=1
    charChosen=true
  }
  if(!won && charChosen){
    if (key === "Enter") {
      started = true;
      playDistantUFO()
    } else if (key === "p") {
      if(started){
      instruction.style.opacity = 1;
      spaceship.style.opacity = 0;
      enemy.style.opacity = 0;
      cancelAnimationFrame(gameLoop)
      started=false
      playDistantUFO()
    } 
  } else if (key === "r") {
    started = true;
    window.location.reload(true)
    // document.location.reload()
  } else if (key === "ArrowLeft") {
    move.left = 1;
  } else if (key === "ArrowRight") {
    move.right = 1;
  } else if (key === " ") {
    move.shoot = 1;
    // shoot();
  }
}
});


//    KEYUP

document.addEventListener("keyup", (e) => {
  key = e.key;
  
  if (key === "ArrowLeft") {
    move.left = 0;
  } else if (key === "ArrowRight") {
    move.right = 0;
  } else if (key === " ") {
    move.shoot = 0;
  }
  key = "";
});


if (started){
  spaceship.style.opacity = 1;
  enemy.style.opacity = 1;
}

function playDistantUFO(){
  if(started){
    distantUFO.currentTime = 0;
    distantUFO.play();
  }else{
    distantUFO.pause()
  }
}


//      TIMER 

function timer(){
 let currentTime = new Date().getTime()

 if(currentTime - time >= 1000){   // 1000 mili sec = 1 sec  
  time = currentTime     // reset time to curretTime 
  seconds++     // add the second to the time 
 }

 if(seconds == 60){
  minutes ++
  seconds = 0;
 }

 if(seconds < 10){
  clock.innerHTML = `00:0${seconds}`
 }
 else if(seconds > 10 && minutes == 0){
  clock.innerHTML  = `00:${seconds}`
}
if(minutes >10){
  if (seconds <10){
 clock.innerText =  `${minutes}:0${seconds}` 
} 
else if(seconds >10){
 clock.innerText =  `${minutes}:${seconds}`
}

} else if (minutes >0){
 if (seconds <10){
 clock.innerText =  `0${minutes}:0${seconds}` 
} 
else if(seconds >10){
 clock.innerText =  `0${minutes}:${seconds}`
}
}

}



//      MOVE ENEMY 

function animateEnemy() {
  position += 5;

  if (enemy.getBoundingClientRect().right < container.getBoundingClientRect().right && direction) {
      enemy.style.transform = `translate(${position}px, ${curentY}px)`;
  } else{
      if (direction === true){
      curentY += 60;
      // console.log("curentY", curentY);
      enemy.style.transform = `translate(${position}px, ${curentY}px)`;
      direction = false;
    }
    position -= 10;
    enemy.style.transform = `translate(${position}px, ${curentY}px)`;
    if (position < 4) {
      curentY += 60;
       
      enemy.style.transform = `translate(${position}px, ${curentY}px)`;
      direction = true;
    }
  }
  if (enemy.getBoundingClientRect().bottom >= spaceship.getBoundingClientRect().top){
    let hearts = Array.from(document.getElementsByClassName('heart'))
    // console.log(hearts.length);
    
    if(hearts == null || hearts.length ==1 ){

      gameOver = true;
      hearts[Array.length-1].remove()
      spaceship.style.opacity= 0;
      enemy.style.opacity= 0;
      let gameover = document.getElementById('gameover')
      let finalScore = document.getElementById('finalscore')
      finalScore.innerHTML = `Final score: ${score}`
      gameover.style.opacity = 1; 
      distantUFO.pause()
      endGame.currentTime = 0;
      endGame.play();
      cancelAnimationFrame(gameLoop) 
      bullet.remove()
      for(let i=0; i<1; i++){
        // console.log({gameOver})
      }
    }

    position =0
    curentY =0  
      
    if(hearts.length > 0){
      hearts[Array.length-1].remove()
      deadAngel.currentTime = 0;
      deadAngel.play();
   }
    }
  }



//      MOVE SPACESHIP

function movePlayer(){
  // console.log(spaceship.style.left)

  let canAnimate = false
  let movingLeft =false
  let movingRight = false

  if (counter >=1.75){
    counter = 0
    canAnimate = true
  }

  if (move.left === 1){
    movingLeft = true
    if (spaceship.getBoundingClientRect().left >container.getBoundingClientRect().left){
      spaceshipStart -= spaceshipVelocity
      spaceship.style.left = parseInt(spaceship.style.left) - spaceshipVelocity + "px";

      if(canAnimate){
        // console.log("hello")
           dragon.style.backgroundPosition = `-${playerIdleImgPos}px -${playerIdleImgPosyLeft }px`
   
       if(playerIdleImgPos <573){
           playerIdleImgPos = playerIdleImgPos +191
       } else{
           playerIdleImgPos =191
       }

    }
    }
  }
  if (move.right === 1) {
    movingRight =true
    if (spaceship.getBoundingClientRect().right < container.getBoundingClientRect().right) {
      spaceshipStart += spaceshipVelocity
      spaceship.style.left = parseInt(spaceship.style.left) + spaceshipVelocity + "px";
      if (canAnimate){
                  
        dragon.style.backgroundPosition = `-${playerIdleImgPos}px -${playerIdleImgPosy}px` //gets dragon image and assigns x & y positions on sprite sheet 
   
       if(playerIdleImgPos <573){ //checks if past max width of sprite sheet and either shows next image or resets
           playerIdleImgPos = playerIdleImgPos +191
       } else{
           playerIdleImgPos =191
       }
        
    
    }
    }
  }
  if(counter ==1 && !movingLeft && !movingRight) {
    dragon.style.backgroundPosition = `-${playerIdleImgPos}px 0px`
    
        if(playerIdleImgPos <573){
            playerIdleImgPos = playerIdleImgPos +191
        } else{
            playerIdleImgPos =191
        }
  }
}


//    SHOOT BULLET 

function shoot() {
  // console.log(move.shoot, canFire, started)
  if(move.shoot && canFire && started){
    canFire = false;
    shootPressed = true;
    
    let bullet = document.createElement("IMG");
    bullet.src = "./resources/img/bullet.png";
    bullet.setAttribute("id", "laser");
    const body = document.querySelector("body");
    // body.append(bullet);
    // console.log({bulletStart}, {bulletVelocity})
    
    bullet.style.marginLeft=(spaceshipStart +(spaceship.getBoundingClientRect().width *0.75))+"px"
    bullet.style.bottom = bulletStart + "px";
    container.appendChild(bullet)
    piuPiu.currentTime = 0;
    piuPiu.play();
    // console.log(bullet.style.bottom)
    
    // const bulletY = spaceship.getBoundingClientRect().top-13 + "px";
    // const bulletX =(spaceship.getBoundingClientRect().right + spaceship.getBoundingClientRect().left)/2-13 +"px";

    // bullet.style.bottom = bulletStart + "px";
    // bullet.style.left = bulletX;
  }

  let bullet = document.getElementById("laser");

  if (bullet != null){
    bullet.style.bottom = bulletVelocity + "px";
    bulletVelocity += 20;
  if (bulletVelocity - spaceship.getBoundingClientRect().height / 2 >= container.getBoundingClientRect().height){
      bulletVelocity = bulletStart;
      bullet.remove();
      canFire = true;
    }
  }
}


//    COLLISION

function collisionDetection(){

  let bullet = document.getElementById("laser")
  let aliens = Array.from(document.querySelectorAll(".aliens")); 
  // aliens[i].getBoundingClientRect().x   // getBoundingClient works for each element of the array 

  if(aliens.every(alien =>{
    !aliens.includes('aliens')
  })){  
    spaceship.style.opacity=0
    won = true
    distantUFO.pause()
    let win = document.getElementById('winner')
    win.style.opacity =1
    haveWon.currentTime = 0;
    haveWon.play();
    let finalScore = document.getElementById('finalscore2')
    finalScore.innerHTML = `Final score: ${score}`
    cancelAnimationFrame(gameLoop)
    started= false
    bullet.remove()   
  }
  if (bullet != null){

  for(i = 0; i < aliens.length; i++){
   // horizontal check ---  (alien.x < bullet.x + bullet.y  && alien.x + alien.width > bullet.x)
   if (aliens[i].getBoundingClientRect().x <( bullet.getBoundingClientRect().x + bullet.getBoundingClientRect().width) && (aliens[i].getBoundingClientRect().x + aliens[i].getBoundingClientRect().width) > bullet.getBoundingClientRect().x){ 
     // vertical check  --- (alien.y < bullet.y + bullet.height && alien.y + allien.height > bullet.y)
   if (aliens[i].getBoundingClientRect().y < bullet.getBoundingClientRect().y + bullet.getBoundingClientRect().height && aliens[i].getBoundingClientRect().y + aliens[i].getBoundingClientRect().height > bullet.getBoundingClientRect().y){
   if(aliens[i].className !== "dead"){
      //  console.log(i,aliens[i],aliens[i].className === "dead");
      aliens[i].className = "dead"
    // remove bullet so it doesn't go throught the next row of aliens  
      bullet.remove()
      //reposition the bullet to it's starting point  
      bulletVelocity=bulletStart
      canFire = true; 
      score += 5
      document.getElementById('score').innerHTML = score
          }
       }
      }
    }
  }
}

//      GAME LOOP 
  
function gameLoop() {
  counter +=0.25
  if (started === true) {
    if (started){
      spaceship.style.opacity = 1;
      enemy.style.opacity = 1;
      instruction.style.opacity = 0;
      scoreboard.style.opacity =1
    }
  if (gameOver === false) {
    timer()
    animateEnemy();
    movePlayer();
    shoot();
    collisionDetection(); 
      }
    }
  requestAnimationFrame(gameLoop);
  }




window.requestAnimationFrame(gameLoop);
