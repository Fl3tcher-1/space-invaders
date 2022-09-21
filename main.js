let aliens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

const body = document.body

let boundaryGrid = document.createElement ("div")
let parent = document.getElementById("parent")
console.log(parent)
// boundaryGrid.width = "500px"
// boundaryGrid.height = "500px"
boundaryGrid.className ="BoundaryGrid"
boundaryGrid.id ="boundaryGrid"
// boundaryGrid.innerText = "grid"
parent.append(boundaryGrid)


// body.append(boundaryGrid)


for(alien in aliens){

    let div = document.createElement("div")
    // div.style.backgroundColor = "blue"
    div.classList.add("aliens")
    // div.className = "aliens"
    div.innerText = `alien${alien}`
    div.id = div.innerText
    div.style.fontSize = "30px"
    boundaryGrid.appendChild(div)
    // body.appendChild(div)

}

// let speed = 10
let direction =1 //inits movement direction

myVar = setInterval(moveDiv, 25) // sets speed of movement

let margin =0 //sets margin to be based on starting position (centered div)
let boundaryStyle = getComputedStyle(boundaryGrid) //allows the parsing of margins
 let topMarginInit = boundaryStyle.marginTop //gets the top margin of start position
 let topMargin = topMarginInit.replace(/\D/g,'') //removes px leaving only numbers
 topMargin = Number(topMargin) //convert to number

 let increment = 10


// let l = window.screen.width
let w = 500
let minusW = -500

 div= boundaryGrid

    
    function moveDiv(){
    // console.log(margin, w, minusW)
    
    //if margin == specified width of screen to either side-- move vertically
    // if( margin == w || margin == minusW){
    //     margin = 0 +"px"
    //     console.log("hello")
    //     topMargin +=30
    //     div.style.marginTop = topMargin +"px"
    //     // margin =0

    // } else{ // otherwise keep changing the margin on every function call
    // }
    
    div.style.marginLeft =margin + "px"

    // console.log("negative margin", margin - minusW)
    // console.log( "margin -w ",margin -w)

    //checks if current margin is == specified margins and swaps directions accordingly
    if (w-margin == increment){ 
        direction =-1
         topMargin +=10
        div.style.marginTop = topMargin +"px"
        console.log("iohiuagfiugauifwhuaifh")
    } else if( margin - minusW == increment){
        direction =1
         topMargin +=10
        div.style.marginTop = topMargin +"px"
    }

    // changes margin values based on movement direction
    if (direction ==1){
        margin +=increment
    } else if (direction ==-1){
        margin -=increment
    } 

}




// div.innerHTML = "hello"
// body.append("Hello World")