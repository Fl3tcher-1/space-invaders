

// let aliens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

const body = document.body

// let box = document.getElementById("box")
// let box2= document.getElementById("box220")
// let startGame = document.getElementById("start")
// let stopGame = document.getElementById("stop")

let parentDiv = document.getElementById("parent") //gets parent div that holds aliens
let parentBoundary = getComputedStyle(parentDiv) //allows parsing style values from parent

let ParentBoundary2 = document.getElementById("parent").getBoundingClientRect()
let player = document.getElementById("player")
let playerBoundary = document.getElementById("player").getBoundingClientRect()

let PlayerStyleFetch = getComputedStyle(player)
let playerLeftMargin = PlayerStyleFetch.marginLeft .replace("px", '')
// console.log(playerLeftMargin)

let marginLeft = parentBoundary.marginLeft //stores various margins
let marginRight = parentBoundary.width
// let marginTop =parentBoundary.marginTop
let marginBot =parentBoundary.height

// console.log(marginLeft, marginRight, marginBot)

//inits starting alien positions and then updates in loop

let alienStarts 
alienStart = 0
alienTop = 0
alienStartPosition = 25
alienSpeed =5
alienDescendSpeed =15



// playerStart = Number(playerLeftMargin)
playerStart = 0
playerIdleImgPos = 191
playerIdleImgPosy = 161
playerIdleImgPosyLeft = 483
// playerStart=ParentBoundary2.x
playerMovement =8
let counter =0

// horizontalMovementLimit =(marginRight.replace(/\D/g,''))/2 -150 //trims off "px" leaving only numerical values
horizontalMovementLimit = ParentBoundary2.width /2 -100

let verticalMovementLimit = marginBot.replace(/\D/g,'')-200


let alienDivs = document.getElementsByClassName("aliens") //gets all aliens
for(let i=0; i <alienDivs.length; i ++){
    // console.log(alienDivs[i].getBoundingClientRect().x)
    // alienStarts =(alienDivs[i].getBoundingClientRect().x)
}
// console.log(alienStarts)
let key 

let start = false
let running = false


document.addEventListener('keydown', function(e){ //lstens for key presses and assigns them to a variable
    key=e.key
    if (key == "p" || key == "Enter"){ //checks if keys pressed if so, sets start to true
    start =true

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
// console.log(alienDivs[0].getBoundingClientRect())
// console.log(alienDivs[1].getBoundingClientRect())
// console.log(alienDivs[2].getBoundingClientRect())
// console.log(alienDivs[3].getBoundingClientRect())
// console.log(alienDivs[4].getBoundingClientRect())


//gameloop
function gameloop(){
    counter += 0.25
    console.log(counter)
    
    // console.log(progress)
    // console.log(playerStart)
    Aliens()
    Player()
    drawAlien() //draws updated postion values
    updateAlien() //first updates postion values
    if (running) requestAnimationFrame(gameloop) //calls requestanimationframe and parses itself allowing the function to be re-run again
    
}
function Aliens(){
    // let alienBoundaries = document.getElementById("alien13").getBoundingClientRect()
    // console.log("alien",alienBoundaries)
    // let aliens
    // console.log("alien 0",alienDivs[0].getBoundingClientRect())
    for (let i =0; i <alienDivs.length; i ++){
        // console.log(horizontalMovementLimit, `${i}`,alienDivs[i].getBoundingClientRect(), ParentBoundary2.width)
        // aliens.push(alienDivs[i].getBoundingClientRect())
        console.log(alienDivs[i].getBoundingClientRect())
    }
    // console.log(aliens)
    
}



function Player(){
   
    let canAnimate = false
    movingRight = false
    movingLeft = false
    
    if(counter >=2) {
        counter =0
        canAnimate = true
    }
   
       
            // p
    // console.log(ParentBoundary2.width, ParentBoundary2.x, playerStart)
    // console.log(ParentBoundary2.x, playerStart)
        
        if(key == `ArrowRight` ){
            movingRight = true
            if(playerStart < ParentBoundary2.width -(playerBoundary.width +12)){
                playerStart +=playerMovement
                player.style.left = playerStart  +"px"

                if (canAnimate){
                    document.getElementById("dragon").style.backgroundPosition = `-${playerIdleImgPos}px -${playerIdleImgPosy}px`
               
                   if(playerIdleImgPos <573){
                       playerIdleImgPos = playerIdleImgPos +191
                   } else{
                       playerIdleImgPos =191
                   }

                }
            }
        } 

        if(key == `ArrowLeft`){
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
         if(counter == 1 && movingRight ==false && movingLeft == false){
        document.getElementById("dragon").style.backgroundPosition = `-${playerIdleImgPos}px 0px`
    
        if(playerIdleImgPos <573){
            playerIdleImgPos = playerIdleImgPos +191
        } else{
            playerIdleImgPos =191
        }

    }
}

//updates position values
function updateAlien(){

    for(let i =0; i <alienDivs.length; i ++){

    }
    alienStartPosition += alienSpeed //updates starting position with the speed of movement

    // console.log("top",alienTop, "limit", verticalMovementLimit)

    //checks if at either edge of allowed horizontal movement, if true it will update vertical postion and flip horizontal counter from + to- & from - to+
      if (alienStartPosition >= horizontalMovementLimit || alienStartPosition <= alienStart +25) alienSpeed = -alienSpeed, alienTop +=alienDescendSpeed;
      
}

//draws visible change in position
function drawAlien(){

    for(let i =0; i < alienDivs.length; i ++){ //runs a loop for every alien and changes top & left margin based on values from update()
        alienDivs[i].style.left =alienStartPosition + "px" //horizontal position
        // if(alienTop < ParentBoundary2.height/2){ 
            alienDivs[i].style.top = alienTop +"px" //vertical position

        // }
        // console.log(alienTop, ParentBoundary2.height)
    }
}




// requestAnimationFrame(gameloop)






