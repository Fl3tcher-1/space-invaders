

// let frameID;
// const getDiv = document.getElementsByClassName("frame");
// const smoothAnimation = () => {
//   getDiv[0].insertAdjacentHTML("afterend", "<div class='frame'></div>");
//   frameID = requestAnimationFrame(smoothAnimation);
// };

// const onStart = () => {
//   frameID = requestAnimationFrame(smoothAnimation);
// };

// const onStop = () => {
//   cancelAnimationFrame(frameID);
// };

// let div

let aliens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

const body = document.body


// for(alien in aliens){

//     let div = document.createElement("div")
//     // div.style.backgroundColor = "blue"
//     div.classList.add("aliens")
//     // div.className = "aliens"
//     div.innerText = `alien${alien}`
//     div.id = div.innerText
//     div.style.fontSize = "30px"
//     boundaryGrid.appendChild(div)
//     // body.appendChild(div)

// }
let box = document.getElementById("box")
let box2= document.getElementById("box220")
let startGame = document.getElementById("start")
let stopGame = document.getElementById("stop")

boxStart = 0
boxTop = 0
boxPos = 100
boxVelocity =2
boxDownSpeed =10
limit =500

let gameRunning=true

let alien = document.getElementById("alien0")
// console.log(alien)

let alienDivs = document.getElementsByClassName("aliens")
console.log(alienDivs[4])
console.log(alienDivs.length)



// function init(){
//     div = document.getElementById("div")
//     // context = canvas.getContext(`2d`)
//     // requestAnimationFrame(gameloop)
// }


// requestAnimationFrame(gameloop)
// startGame.addEventListener("click", function(){
//     gameRunning = true
//     gameState(gameRunning)
// })
// // console.log(gameRunning)

// function gameState(gameRunning){

//     stopGame.addEventListener("click", function(){
//     gameRunning = false
//     cancelAnimationFrame(gameloop)
// })

// if(gameRunning) {
//     gameloop
//     requestAnimationFrame(gameloop)

// } 

// }





function gameloop(){
    update()
    draw()
    requestAnimationFrame(gameloop)
}

function update(){
    boxPos += boxVelocity
    // console.log(boxPos)
      if (boxPos >= limit || boxPos <= boxStart) boxVelocity = -boxVelocity, boxTop +=boxDownSpeed;
      
}

function draw(){
    // alien.style.left =boxPos +"px"
    // box.style.left = boxPos +"px"
    // box.style.top = boxTop +"px"
    // box2.style.left =boxPos +"px"
    
    // alienDivs[0].style.left =boxPos +"px"
    // context.fillStyle=color
    // context.fillRect(100,50,200,175)
    for(let i =0; i < alienDivs.length; i ++){
        alienDivs[i].style.left =boxPos + "px"
        alienDivs[i].style.top = boxTop +"px"
    }
}

requestAnimationFrame(gameloop)






