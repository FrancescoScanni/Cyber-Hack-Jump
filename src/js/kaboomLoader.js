//KABOOM IMPORT
import kaboom from "https://unpkg.com/kaboom@2000.2.10/dist/kaboom.mjs";

//KABOOM INIT
const k = kaboom({
    fullscreen: true,
    width: window.innerWidth,
    height: window.innerHeight,
    letterbox: true,
    global: true,
});
gravity(1200);
export default k 



//IMPORTS -->

//sprites
import {loadingSprites, blockNamesGround, players} from './sprites.js'
loadingSprites(k)
//scenes
import {loadStartingScene, loadGameScene, loadGOScene} from "./scenes.js"
loadStartingScene(k)
loadGameScene(k)
loadGOScene(k)




//BASIC GAME LOGIC


//music playing
go("start")
let isPlaying = false
const music = document.querySelector(".music")
const musicToggle = document.querySelector(".musicButton").addEventListener("click",()=>{
    if(!isPlaying){
        music.play()
    }else{
        music.pause()
    }
    isPlaying=!isPlaying
    
})


//start
const noCanvas = document.querySelector("#canvas")
const play = document.querySelector("#playButton").addEventListener("click",()=>{
    const starMusic = new Audio("src/static/sounds/start.mp3")
    noCanvas.classList.add("disappear")
    starMusic.play()
    setTimeout(()=>{
        music.play()
    },500)
    go("game")
    setTimeout(()=>{
        noCanvas.remove()
    },500)
})




