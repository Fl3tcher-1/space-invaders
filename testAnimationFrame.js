

let aliens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

const body = document.body

// let box = document.getElementById("box")
// let box2= document.getElementById("box220")
// let startGame = document.getElementById("start")
// let stopGame = document.getElementById("stop")

let parentDiv = document.getElementById("parent") //gets parent div that holds aliens
let parentBoundary = getComputedStyle(parentDiv) //allows parsing style values from parent
let marginLeft = parentBoundary.marginLeft //stores various margins
let marginRight = parentBoundary.width
// let marginTop =parentBoundary.marginTop
let marginBot =parentBoundary.height

console.log(marginLeft, marginRight, marginBot)

//inits starting alien positions and then updates in loop
alienStart = 0
alienTop = 0
alienStartPosition = 25
alienSpeed =2
alienDescendSpeed =10
horizontalMovementLimit =(marginRight.replace(/\D/g,''))/2 -150 //trims off "px" leaving only numerical values

let verticalMovementLimit = marginBot.replace(/\D/g,'')-200


let gameRunning=true

// let alien = document.getElementById("alien0")
// console.log(alien)

let alienDivs = document.getElementsByClassName("aliens") //gets all aliens
console.log(alienDivs[4])
console.log(alienDivs.length)


//game loop
function gameloop(){
    update() //first updates postion values
    draw() //draws updated postion values
    requestAnimationFrame(gameloop) //calls requestanimationframe and parses itself allowing the function to be re-run again
}

//updates position values
function update(){
    alienStartPosition += alienSpeed //updates starting position with the speed of movement

    console.log("top",alienTop, "limit",verticalMovementLimit)

    //checks if at either edge of allowed horizontal movement, if true it will update vertical postion and flip horizontal counter from + to- & from - to+
      if (alienStartPosition >= horizontalMovementLimit || alienStartPosition <= alienStart +25) alienSpeed = -alienSpeed, alienTop +=alienDescendSpeed;
      
}

//draws visible change in position
function draw(){
    // alien.style.left =alienStartPosition +"px"
    // box.style.left = alienStartPosition +"px"
    // box.style.top = alienTop +"px"
    // box2.style.left =alienStartPosition +"px"
    
    // alienDivs[0].style.left =alienStartPosition +"px"
    // context.fillStyle=color
    // context.fillRect(100,50,200,175)
    
    for(let i =0; i < alienDivs.length; i ++){ //runs a loop for every alien and changes top & left margin based on values from update()
        alienDivs[i].style.left =alienStartPosition + "px"
        alienDivs[i].style.top = alienTop +"px"
    }
}

requestAnimationFrame(gameloop)






