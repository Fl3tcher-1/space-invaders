

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
alienStart = 0
alienTop = 0
alienStartPosition = 25
alienSpeed =5
alienDescendSpeed =15

// playerStart = Number(playerLeftMargin)
playerStart = playerBoundary.x
playerMovement =8

// horizontalMovementLimit =(marginRight.replace(/\D/g,''))/2 -150 //trims off "px" leaving only numerical values
horizontalMovementLimit = ParentBoundary2.width /2 -100

let verticalMovementLimit = marginBot.replace(/\D/g,'')-200


let alienDivs = document.getElementsByClassName("aliens") //gets all aliens
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

if(start && running == false) { //if game is set to start and is not running starts game loop--- to prevent speeding up of game
    running =true // sets running to true to stop increasing game speed on keydowns
    requestAnimationFrame(gameloop)
}
})

document.addEventListener('keyup', function(e){ // if no keys pressed re-assigns variable to empty string
    key = ""
})
console.log("player",playerBoundary)
console.log("boundary",ParentBoundary2)

//gameloop
function gameloop(){
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
        // aliens.push(alienDivs[i].getBoundingClientRect())
        console.log(alienDivs[i].getBoundingClientRect())
    }
    // console.log(aliens)

}

function Player(){
    // console.log(ParentBoundary2.width, ParentBoundary2.x, playerStart)
    // console.log(ParentBoundary2.width, playerStart)
        
        if(key == `ArrowRight` ){
            if(playerStart < ParentBoundary2.width +(playerBoundary.width/2)){
                playerStart +=playerMovement
                player.style.left = playerStart  +"px"
            }
        } 

        if(key == `ArrowLeft`){
            if(playerStart > ParentBoundary2.x +10){
                playerStart -=playerMovement
                player.style.left = playerStart +"px"

            }
        }
}

//updates position values
function updateAlien(){
    alienStartPosition += alienSpeed //updates starting position with the speed of movement

    // console.log("top",alienTop, "limit", verticalMovementLimit)

    //checks if at either edge of allowed horizontal movement, if true it will update vertical postion and flip horizontal counter from + to- & from - to+
      if (alienStartPosition >= horizontalMovementLimit || alienStartPosition <= alienStart +25) alienSpeed = -alienSpeed, alienTop +=alienDescendSpeed;
      
}

//draws visible change in position
function drawAlien(){

    for(let i =0; i < alienDivs.length; i ++){ //runs a loop for every alien and changes top & left margin based on values from update()
        alienDivs[i].style.left =alienStartPosition + "px" //horizontal position
        if(alienTop < ParentBoundary2.height/2){ 
            alienDivs[i].style.top = alienTop +"px" //vertical position

        }
        // console.log(alienTop, ParentBoundary2.height)
    }
}




// requestAnimationFrame(gameloop)






