

let aliens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

const body = document.body

// let box = document.getElementById("box")
// let box2= document.getElementById("box220")
// let startGame = document.getElementById("start")
// let stopGame = document.getElementById("stop")

let parentDiv = document.getElementById("parent") //gets parent div that holds aliens
let parentBoundary = getComputedStyle(parentDiv) //allows parsing style values from parent

let player = document.getElementById("player")
let PlayerStyleFetch = getComputedStyle(player)
let playerLeftMargin = PlayerStyleFetch.marginLeft .replace("px", '')
console.log(playerLeftMargin)

let marginLeft = parentBoundary.marginLeft //stores various margins
let marginRight = parentBoundary.width
// let marginTop =parentBoundary.marginTop
let marginBot =parentBoundary.height

// console.log(marginLeft, marginRight, marginBot)

//inits starting alien positions and then updates in loop
alienStart = 0
alienTop = 0
alienStartPosition = 25
alienSpeed =2
alienDescendSpeed =10

playerStart = Number(playerLeftMargin)
playerMovement =8
horizontalMovementLimit =(marginRight.replace(/\D/g,''))/2 -150 //trims off "px" leaving only numerical values

let verticalMovementLimit = marginBot.replace(/\D/g,'')-200


let alienDivs = document.getElementsByClassName("aliens") //gets all aliens

let key

document.addEventListener('keydown', function(e){ //lstens for key presses and assigns them to a variable
key=e.key
})

document.addEventListener('keyup', function(e){ // if no keys pressed re-assigns variable to empty string
    key = ""
})

//gameloop
function gameloop(){
    console.log(playerStart)
    
    move()
    update() //first updates postion values
    draw() //draws updated postion values
    requestAnimationFrame(gameloop) //calls requestanimationframe and parses itself allowing the function to be re-run again
}

function move(){

        // console.log(e)
        // console.log(player.style.left)
        // console.log(e.key)
        
        if(key == `ArrowRight` ){

            playerStart +=playerMovement
            player.style.left = playerStart  +"px"
            console.log(playerMovement, playerStart)
            // playerMovement 
        } 

        if(key == `ArrowLeft`){
            playerStart -=playerMovement
            player.style.left = playerStart +"px"
        }
}

//updates position values
function update(){
    alienStartPosition += alienSpeed //updates starting position with the speed of movement

    console.log("top",alienTop, "limit", verticalMovementLimit)

    //checks if at either edge of allowed horizontal movement, if true it will update vertical postion and flip horizontal counter from + to- & from - to+
      if (alienStartPosition >= horizontalMovementLimit || alienStartPosition <= alienStart +25) alienSpeed = -alienSpeed, alienTop +=alienDescendSpeed;
      
}

//draws visible change in position
function draw(){

    for(let i =0; i < alienDivs.length; i ++){ //runs a loop for every alien and changes top & left margin based on values from update()
        alienDivs[i].style.left =alienStartPosition + "px"
        alienDivs[i].style.top = alienTop +"px"
    }
}


// let key
//  document.addEventListener('keydown', function(e){
//     key = e
//     console.log(key)
//     if(key == " "){
//         requestAnimationFrame(gameloop)
//     }
    // requestAnimationFrame(gameloop, key)

    
    // console.log(e)
// })
requestAnimationFrame(gameloop)






