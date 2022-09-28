let x=191
let interval = 100

tid = setInterval (()=>{
    document.getElementById("image").style.backgroundPosition = `-${x}px 0px`

    if(x <573){
        x=x +191
    } else{
        x = 191
    }
}, interval)


function animateScript(){
document.getElementById("image").style.backgroundPosition ='-191px 0px'
}