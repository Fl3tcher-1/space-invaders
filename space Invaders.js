
const body = document.body

let characters =["dragon", "spaceship"]
let character 
let charSelectScreen =document.getElementById("characterSelect")
let dragonCharacter = document.getElementById("splitLeft")
let spaceshipCharacter = document.getElementById("splitRight")

let parentDiv = document.getElementById("parent") //gets parent div that holds aliens
let parentBoundary = getComputedStyle(parentDiv) //allows parsing style values from parent

let ParentBoundary2 = document.getElementById("parent").getBoundingClientRect() //gets boundingclient from parent
let player = document.getElementById("player")
let player2 =document.getElementById("player2")
let playerBoundary = document.getElementById("player").getBoundingClientRect()  //gets bounding client from player

let boundarygrid = document.getElementById("boundaryGrid")

let PlayerStyleFetch = getComputedStyle(player) //gets styles from player
let playerLeftMargin = PlayerStyleFetch.marginLeft .replace("px", '') //gets margin from player and replaces into a value with only numbers

let marginLeft = parentBoundary.marginLeft //stores various margins
let marginRight = parentBoundary.width
let marginBot =parentBoundary.height

let start = false //inits start

alienStart = 50 //how far from left side of screen
alienTop = 0 //how far from the top
alienStartPosition = ParentBoundary2.width /2 -(750/2) //centers aliens on screen
alienSpeed =5 //horizontal movement speed
                let destroyed = []


alienDescendSpeed = 15 //vertical movement speed

horizontalMovementLimit = ParentBoundary2.width /2 +100 //how far are assets allowed to move horizontally

playerStart = ParentBoundary2.width/2 - playerBoundary.width //gets centered location
playerMovement =9 //how fast player moves horizontally
player.style.left = (ParentBoundary2.width/2 - playerBoundary.width +"px") //sets centered location

playerIdleImgPos = 191 //x size value for a single sprite image
playerIdleImgPosy = 161 // y value for a single sprite image
playerIdleImgPosyLeft = 483 //last y value for single sprite image

let bulletStart = playerBoundary.height -25
let bulletMovement = bulletStart
let bulletVelocity = 22


let counter =0 //uses to count elapsed time in game loop

let canFire = true

let alienDivs = document.getElementsByClassName("aliens") //gets all aliens

let key //will store keypresses

let running = false

let row1 =[0,5,10]

let time = new Date().getTime()
    let seconds =0
    let minutes =0


dragonCharacter.addEventListener("click", () =>{
    character =characters[0]
    charSelectScreen.remove()
    start =true
    running=true
    player.style.opacity =1
    boundarygrid.style.opacity =1
    requestAnimationFrame(gameloop)
    
})


spaceshipCharacter.addEventListener ("click", () =>{
    character=characters[1]
    player=player2
    player.style.left = ParentBoundary2.width/2 - playerBoundary.width +"px"
    charSelectScreen.remove()
    start = true
    running =true
    player.style.opacity =1
    boundarygrid.style.opacity =1
    requestAnimationFrame(gameloop)

})

if(start && !running) { //if game is set to start and is not running starts game loop--- to prevent speeding up of game
    running =true // sets running to true to stop increasing game speed on keydowns
    requestAnimationFrame(gameloop)
}
document.addEventListener('keydown', function(e){ //lstens for key presses and assigns them to a variable
    key=e.key
    if (key == "p" || key == "Enter"){ //checks if keys pressed if so, sets start to true
        start =true
        charSelectScreen.remove()
        
    }
    if(running && key == "p" ){ //checks if game is running and correspinding key pressed- if true, stops the game
        start = false
    running =false //sets to false to allow restart of game
    // console.log("jkbgjyuj")
    cancelAnimationFrame(gameloop) //stops game
}

if(start && !running) { //if game is set to start and is not running starts game loop--- to prevent speeding up of game
    running =true // sets running to true to stop increasing game speed on keydowns
    requestAnimationFrame(gameloop)
}
})

document.addEventListener('keyup', function(e){ // if no keys pressed re-assigns variable to empty string
    key = ""
})

console.log("player",playerBoundary)
console.log("boundary",ParentBoundary2)


for(let i =0; i < alienDivs.length; i ++){ //runs a loop for every alien and assigns starting x value
    alienDivs[i].style.left =alienStartPosition  + "px" //horizontal position
    
}







//gameloop
function gameloop(){
    
    counter += 0.25 //on every game loop call incraee by 0.25
    
    // console.log(character)
    timer()
    Player()
    shoot()
    drawAlien() //draws updated postion values
    updateAlien() //first updates postion values
    collisions()
    if (running) requestAnimationFrame(gameloop) //calls requestanimationframe and parses itself allowing the function to be re-run again
    
}

function timer(){
    let currentTime =new Date().getTime()
    let timer = document.getElementById("time")
    // console.log(timeDifference/60)

    if (currentTime - time >= 1000){
        time =currentTime
        seconds ++
    } 
    if(seconds == 60){
        minutes ++
        seconds =0
    }
    if (seconds <10){
        timer.innerText =  `00:0${seconds}` 
    } 
     else if(seconds >10 && minutes ==0){
        timer.innerText =  `00:${seconds}`
    }

    if(minutes >10){
         if (seconds <10){
        timer.innerText =  `${minutes}:0${seconds}` 
    } 
     else if(seconds >10){
        timer.innerText =  `${minutes}:${seconds}`
    }

    } else if (minutes >0){
        if (seconds <10){
        timer.innerText =  `0${minutes}:0${seconds}` 
    } 
     else if(seconds >10){
        timer.innerText =  `0${minutes}:${seconds}`
    }
}
    
    console.log(seconds)

}

//player controls
function Player(){ 
   
    let canAnimate = false // sets to false otherwise will keep animating
    movingRight = false //used to stop multiple animations at once like moving left/right and idling at same time
    movingLeft = false
    
    if(counter >=1.75) { // every 1.75 counters will reset counter and allow next image to be animated
        counter =0
        canAnimate = true
    }
           //if right key pressed, move player and animate
        if(key == `ArrowRight` ){ 
            movingRight = true

            if(playerStart < ParentBoundary2.width -191){ //checks that it is not moving outside boundary and assigns new value
                playerStart +=playerMovement
                player.style.left = playerStart  +"px"

                if (canAnimate){
                  
                    document.getElementById("dragon").style.backgroundPosition = `-${playerIdleImgPos}px -${playerIdleImgPosy}px` //gets dragon image and assigns x & y positions on sprite sheet 
               
                   if(playerIdleImgPos <573){ //checks if past max width of sprite sheet and either shows next image or resets
                       playerIdleImgPos = playerIdleImgPos +191
                   } else{
                       playerIdleImgPos =191
                   }
                    
                
                }
            }
        } 

        if(key == `ArrowLeft`){ //same as right arrow. but checks for left boundary
            movingLeft = true
            if(playerStart > 0){
                playerStart -=playerMovement
                player.style.left = playerStart +"px"

                if(canAnimate){
                    console.log("hello")
                       document.getElementById("dragon").style.backgroundPosition = `-${playerIdleImgPos}px -${playerIdleImgPosyLeft }px`
               
                   if(playerIdleImgPos <573){
                       playerIdleImgPos = playerIdleImgPos +191
                   } else{
                       playerIdleImgPos =191
                   }

                }
            }
        }
        //after all movement done it will check if player is idling (not moving) and will animate
         if(counter == 1 && movingRight ==false && movingLeft == false){
        document.getElementById("dragon").style.backgroundPosition = `-${playerIdleImgPos}px 0px`
    
        if(playerIdleImgPos <573){
            playerIdleImgPos = playerIdleImgPos +191
        } else{
            playerIdleImgPos =191
        }

    }
}

//shooting
function shoot(){
 
    if (key == ' '  && canFire){

        canFire =false
        let bullet = document.createElement('div')
        bullet.classList.add = "bullet"
        bullet.id =`bullet`
        bullet.className ='bullet'

        bullet.style.marginLeft = (playerStart + (playerBoundary.width * 0.7)) +"px"
        bullet.style.bottom = bulletStart +"px"

        parentDiv.appendChild(bullet)  
        
    }    
     let bullets = document.getElementsByClassName('bullet')
     

    if( bullets !=null && bullets.length >0) {
        bulletMovement +=bulletVelocity

        Array.from(bullets).forEach((bullet)=>{
            
            if(bulletMovement +"px" <= parentBoundary.height){
                bullet.style.bottom = bulletMovement + "px"
            } else{
                bulletMovement =bulletStart
                bullet.remove()
                canFire = true
            }
        })

    }
    
}

//updates position values
function updateAlien(){

    
    alienStartPosition += alienSpeed //updates starting position with the speed of movement

    //checks if at either edge of allowed horizontal movement, if true it will update vertical postion and flip horizontal counter from + to- & from - to+
      if (alienStartPosition >= horizontalMovementLimit || alienStartPosition <= alienStart ) alienSpeed = -alienSpeed, alienTop +=alienDescendSpeed;
      
}

//draws visible change in position
function drawAlien(){
    // console.log(alienStartPosition)

    for(let i =0; i < alienDivs.length; i ++){ //runs a loop for every alien and changes top & left margin based on values from update()
        alienDivs[i].style.left =alienStartPosition + "px" //horizontal position
        // if(alienTop < ParentBoundary2.height/2){ 

        // console.log(alienDivs[i].style.top, ParentBoundary2.height)
        if( alienDivs[i].style.top.replace("px", '') < ParentBoundary2.height/2 +75){
            alienDivs[i].style.top = alienTop +"px" //vertical position

        }
    }
}

function collisions(){

    let aliens = document.getElementsByClassName("aliens")
    let weaponFire = document.getElementById("bullet")


    // console.log(aliens[2].getBoundingClientRect(),aliens[2].getBoundingClientRect().x +50)
    if(weaponFire != null){
        // let bulletWidth = weaponFire.getBoundingClientRect().width
        let bulletBoundary = weaponFire.getBoundingClientRect()
        for(let i=0; i <aliens.length; i ++){
            let alienBoundary = aliens[i].getBoundingClientRect()
            if(alienBoundary.x +3 <(bulletBoundary.x + bulletBoundary.width) &&(alienBoundary.x + alienBoundary.width ) >bulletBoundary.x){ // checks for x collisons
                if(alienBoundary.y <(bulletBoundary.y + bulletBoundary.height)&& (alienBoundary.y +alienBoundary.height)> bulletBoundary.y){ //checks for y collisions
                // aliens[i].remove()
                    weaponFire.remove()
                    bulletMovement =bulletStart
                    canFire = true
                
                // aliens[i].style.opacity = 0 
                // console.log(Array.from(aliens).splice(i,4, " "))
                destroyed.push(aliens[i].id)

                console.log(destroyed)
                aliens[i].className ="destroyed"

                if(destroyed.includes("alien0") && destroyed.includes("alien5") && destroyed.includes("alien10") && !destroyed.includes("l1")){
                        alienStart -=100
                        destroyed.push("l1")
                }
                
                if(destroyed.includes("alien4") &&  destroyed.includes("alien9") && destroyed.includes("alien14") && !destroyed.includes("r1")){
                    horizontalMovementLimit +=100
                    destroyed.push("r1")
                }

                // console.log(destroyed.includes("alien" +row1[0]))

                    
                // aliens[i].innerHTML = "destroyed"
                // console.log(aliens[i].innerHTML)
                // console.log("iugiuuhuaeg")
                

                
          
            }
                // console.log(aliens[i].id, getComputedStyle(aliens[i]).opacity)
            }


        }

        // console.log(bulletBoundary,alienBoundary)
        
        
        // console.log(aliens[2].getBoundingClientRect(), weaponFire.getBoundingClientRect())
        // if(aliens[2].getBoundingClientRect.x +50)
    }


}







