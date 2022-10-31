
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

let move = {left:  0, //used to allow multiple input keys (move and shoot)
            right: 0, 
            shoot: 0 };
  let key; //inits key values
            
// SCORE  
let score = 0;
    
// TIMER 
    let time = new Date().getTime()  //init time when project started to use as a counter-counter
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


//      ENEMY 
let aliens = Array.from(document.querySelectorAll(".aliens")); // creates an array from all aliens with class aliens
let enemies = document.getElementsByClassName('aliens')
let destroyed = false; 
const enemy = document.getElementById("enemy");


let position = 0;  // start position of the enemy 
let direction = true;
let curentY = 0;
let canFire = true;

//on load sets users spaceship position --- only used for spaceship not for dragon
window.addEventListener("load", () => {
  spaceship.style.position = "absolute";
  spaceship.style.left = playArea - middleOfSpaceShip + "px"; // center the Spaceship
});

let spaceshipStart = boundary.width/2 - spaceship.getBoundingClientRect().width


//      KEYDOWN
document.addEventListener("keydown", (e) => {
  // console.log(key)
  key = e.key;
  //if user has won && key is r reloads game window-- used to fix a bug not restarting correctly
  if(won){ 
    if (key === "r") {
      started = true;
      window.location.reload(true)
    }
  }
  //selects playable character, sets position, removes charselect screen and makes instructions visibile
  if(key =='a'){
    character =characters[0] // sets char to dragon
    spaceship=dragon //makes spaceship div = dragon div
    spaceship.style.left = playArea - middleOfSpaceShip + "px"; // center the Spaceship
    charSelectScreen.remove()
    instruction.style.opacity=1
    charChosen =true // used to only allow other menus to be accessed and game started after char is chosen
  }
  if(key =='d'){ //selects spaceship
    character=characters[1]
    charSelectScreen.remove()
    instruction.style.opacity=1
    charChosen=true
  }

  // WIN CONDITIONS, KEY SELECTOR AND ASSIGNMENT
  // start game and play sound if char chosen and game not over
  if(!won && charChosen){ 
    if (key === "Enter") {
      started = true;
      playDistantUFO()

  //pauses game and makes instructions appear
    } else if (key === "p" && !gameOver) { 
      if(started){
      instruction.style.opacity = 1;
      spaceship.style.opacity = 0;
      enemy.style.opacity = 0;
      cancelAnimationFrame(gameLoop)
      started=false
      playDistantUFO()
    } 
  //restart game 
  } else if (key === "r") {
    started = true;
    window.location.reload(true)
    // document.location.reload()

  //assign movement keys to object
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

document.addEventListener("keyup", (e) => { // sets values of keys that have been let go to nil
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


//make game assets
if (started){
  spaceship.style.opacity = 1;
  enemy.style.opacity = 1;
}

//game bg music
function playDistantUFO(){
  if(started){
    distantUFO.currentTime = 0;
    distantUFO.play();
  }else{
    distantUFO.pause()
  }
}

//      TIMER 
// creates a new timer when function called that is updated every call, to compare with default set value and calculkate elapsed seconds
function timer(){
    let currentTime = new Date().getTime() 

    //  seconds
    if(currentTime - time >= 1000){   // 1000 mili sec = 1 sec  
      time = currentTime     // reset time to curretTime 
      seconds++     // add the second to the time 
    }

    // minutes
    if(seconds == 60){ 
      minutes ++
      seconds = 0;
    }

    //  seconds html display format
    if(seconds < 10){
      clock.innerHTML = `00:0${seconds}`
    }
    else if(seconds > 10 && minutes == 0){
      clock.innerHTML  = `00:${seconds}`
    }

    //minutes html display format
    if(minutes >10){
      if (seconds <10){
    clock.innerText =  `${minutes}:0${seconds}` 
    } else if(seconds >10){
    clock.innerText =  `${minutes}:${seconds}`
    }
    // alternate minutes html display format
    } else if (minutes >0){
      if (seconds <10){
        clock.innerText =  `0${minutes}:0${seconds}` 
      } else if(seconds >10){
        clock.innerText =  `0${minutes}:${seconds}`
      }
    }

    }

//      MOVE ENEMY 
function animateEnemy() {
  position += 5; //increases x position

  //check for boundary collisions to dictate movement direction
  

  // for(let i=0; i <enem.length; i ++){

  // }


  if (enemy.getBoundingClientRect().right < container.getBoundingClientRect().right && direction) {
      enemy.style.transform = `translate(${position}px, ${curentY}px)`;
  } else{
      if (direction === true){
      curentY += 60;
      // console.log("curentY", curentY);
      enemy.style.transform = `translate(${position}px, ${curentY}px)`;
      direction = false;
    }
    // reverse direction when boundary reached
    position -= 10;
    enemy.style.transform = `translate(${position}px, ${curentY}px)`;
    if (position < 4) {
      curentY += 60;
       
      enemy.style.transform = `translate(${position}px, ${curentY}px)`;
      direction = true;
    }
  }

  
//CHECKS IF ENEMY HAS REACHED THE BOTTOM/SPACESHIP TO REMOVE LIFE AND CHANGE CORRESPONDING ELEMENTS
    if (enemy.getBoundingClientRect().bottom >= spaceship.getBoundingClientRect().top){
      let hearts = Array.from(document.getElementsByClassName('heart'))
      // console.log(hearts.length);
      
       //if no hearts-- game is over
      if(hearts == null || hearts.length ==1 ){ 
        hearts[Array.length-1].remove()
  
        let gameover = document.getElementById('gameover')
        let finalScore = document.getElementById('finalscore')

        //changes game menu visibility to show gameover screen and final score
        gameOver = true;
        spaceship.style.opacity= 0;
        enemy.style.opacity= 0;
        finalScore.innerHTML = `Final score: ${score}`
        gameover.style.opacity = 1; 
        
        //plays defeat music
        distantUFO.pause()
        endGame.currentTime = 0;
        endGame.play();
        cancelAnimationFrame(gameLoop) 
        bullet.remove()
        
      }

      //reset alien values
      position =0 
      curentY =0  
        
      //plays sound when life lost
      if(hearts.length > 0){
        hearts[Array.length-1].remove()
        deadAngel.currentTime = 0;
        deadAngel.play();
     }
      }
    }

//      MOVE SPACESHIP
function movePlayer(){

  //sets values to allow smooth animation
  let canAnimate = false
  let movingLeft =false
  let movingRight = false

    //allow animation to take place
  if (counter >=1.75){
    counter = 0
    canAnimate = true
  }

  //moving left
  if (move.left === 1){
    movingLeft = true

    //checks if spaceship is not at boundary and updates x position
    if (spaceship.getBoundingClientRect().left >container.getBoundingClientRect().left){
      spaceshipStart -= spaceshipVelocity
      spaceship.style.left = parseInt(spaceship.style.left) - spaceshipVelocity + "px";

      //if can animate, updates image from sprite sheet
      if(canAnimate){
 
           dragon.style.backgroundPosition = `-${playerIdleImgPos}px -${playerIdleImgPosyLeft }px` //sets x&y position of sprite sheet to use

        // checks if at the end of sprite sheet and either reset or move position
       if(playerIdleImgPos <573){
           playerIdleImgPos = playerIdleImgPos +191
       } else{
           playerIdleImgPos =191
       }

    }
    }
  }

  //MOVING RIGHT
  if (move.right === 1) {
    movingRight =true
        //checks if spaceship is not at boundary and updates x position

    if (spaceship.getBoundingClientRect().right < container.getBoundingClientRect().right) {
      spaceshipStart += spaceshipVelocity
      spaceship.style.left = parseInt(spaceship.style.left) + spaceshipVelocity + "px";

            //if can animate, updates image from sprite sheet

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

  //dragon idling animation 
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

  //if game started and can fire, create a bullet
  if(move.shoot && canFire && started){
    canFire = false;
    shootPressed = true;

    //CREATE BULLET
    let bullet = document.createElement("IMG");
    bullet.src = "./resources/img/bullet.png"; //img for the bullet
    bullet.setAttribute("id", "laser");
    const body = document.querySelector("body");

    //UPDATE BULLET POSITIONS, add to document and play sound
    bullet.style.marginLeft=(spaceshipStart +(spaceship.getBoundingClientRect().width *0.75))+"px"
    bullet.style.bottom = bulletStart + "px";
    container.appendChild(bullet)
    piuPiu.currentTime = 0;
    piuPiu.play();
   
  }

  let bullet = document.getElementById("laser");

  //if a bullet is created, move it by a set amount every function call
  if (bullet != null){
    bullet.style.bottom = bulletVelocity + "px";
    bulletVelocity += 20;
    //if bullet at boundary, remove bullet, reset position and allow to fire again
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

  //WIN SCREEN
  // FOR EVERY ALIEN, CHECK IF THEY ARE ALL DESTROYED
  if(aliens.every(alien =>{
    !aliens.includes('aliens')
  })){  
    //play win sounds
    cancelAnimationFrame(gameLoop)
    distantUFO.pause()
    haveWon.play();
    bullet.remove()   

    spaceship.style.opacity=0
    let win = document.getElementById('winner')
    let finalScore = document.getElementById('finalscore2')

    //show winning on html
    won = true
    win.style.opacity =1
    haveWon.currentTime = 0; //reset time
    finalScore.innerHTML = `Final score: ${score}`
    started= false
  }


  //ALIENS STILL ALIVE and there is a bullet
  if (bullet != null){

    //check every alien for hit detection
  for(i = 0; i < aliens.length; i++){
   // horizontal check ---  (alien.x < bullet.x + bullet.y  && alien.x + alien.width > bullet.x)
   if (aliens[i].getBoundingClientRect().x <( bullet.getBoundingClientRect().x + bullet.getBoundingClientRect().width) && (aliens[i].getBoundingClientRect().x + aliens[i].getBoundingClientRect().width) > bullet.getBoundingClientRect().x){ 
     // vertical check  --- (alien.y < bullet.y + bullet.height && alien.y + allien.height > bullet.y)
   if (aliens[i].getBoundingClientRect().y < bullet.getBoundingClientRect().y + bullet.getBoundingClientRect().height && aliens[i].getBoundingClientRect().y + aliens[i].getBoundingClientRect().height > bullet.getBoundingClientRect().y){

    //chnge class name to dead
   if(aliens[i].className !== "dead"){
      //  console.log(i,aliens[i],aliens[i].className === "dead");
      aliens[i].className = "dead"
    // remove bullet so it doesn't go throught the next row of aliens  
      bullet.remove()
      //reposition the bullet to it's starting point  
      bulletVelocity=bulletStart
      canFire = true; 
      score += 5
      document.getElementById('score').innerHTML = score //update score
          }
       }
      }
    }
  }
}

//      GAME LOOP 
function gameLoop() {
  counter +=0.25 // used for animations
  if (started === true) {

    //make game items appear
    if (started){
      spaceship.style.opacity = 1;
      enemy.style.opacity = 1;
      instruction.style.opacity = 0;
      scoreboard.style.opacity =1
    }
    //if game has not ended run the game loop
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
