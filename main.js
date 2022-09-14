let aliens = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

const body = document.body

let boundaryGrid = document.createElement ("div")
// boundaryGrid.width = "500px"
// boundaryGrid.height = "500px"
boundaryGrid.className ="BoundaryGrid"
boundaryGrid.id ="boundaryGrid"
// boundaryGrid.innerText = "grid"

body.append(boundaryGrid)

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

let speed = 10
let direction =1

let divs =[]
let alien0 = document.getElementById("alien0")
let alien1 = document.getElementById("alien1")
let alien2 = document.getElementById("alien2")
let alien3 = document.getElementById("alien3")
let alien4 = document.getElementById("alien4")
let alien5 = document.getElementById("alien5")
let alien6 = document.getElementById("alien6")
let alien7 = document.getElementById("alien7")
let alien8 = document.getElementById("alien8")
let alien9 = document.getElementById("alien9")

divs.push(alien0,alien1,alien2,alien3)

var div = document.getElementById("alien0")

// console.log(divs)
// console.log(div)


myVar = setInterval(moveDiv, 40)
let margin =0

// let l = window.screen.width
let w = 700

for (let i =0; i <divs.length-1; i++ ){
    div = divs[i]
    console.log(i, div.id)
    // moveDiv(div.id)
    

}
console.log(div)

function moveDiv(id){
    // let div = document.getElementById(id)
    // console.log(div)
    // console.log(l,w)
    if( margin == w){
        margin = 0 +"px"
    } else{
        div.style.marginLeft =margin + "px"
    }
    margin +=10
}




// div.innerHTML = "hello"
// body.append("Hello World")