//importing sprites
import { loadingSprites, blockNamesGround, players } from "./sprites.js";
//importing sounds
import { gameover,coinSound,x2Sound,speed,win } from "./sounds.js";




//scene 0
export function loadStartingScene() {
    scene("start", () => {
        add([
            sprite("bg", { width: width(), height: height() })
        ]);
        const noCanvas = document.querySelector("#canvas")
    });
}



//scene 1
export function loadGameScene() {
    scene("game", () => {
        const bg = add([ sprite("bg", { width: width(), height: height() })]); 
        const ground = add([ pos(0, height() - 50), rect(width()+5000, 30), area(), opacity(0), solid(), "ground" ]) //base rect

        const player = add([
            sprite(players[0]),
            pos(150, height() - 190),
            area(),
            body(),
            scale(0.35),
            "player"
        ]);//player

        // Score
        const totScore = document.querySelector(".earned");
        let earnedCoins = 0;
        totScore.innerHTML = "0";
        // Animation
        let currentFrame = 0;
        loop(0.165, () => {
            currentFrame = (currentFrame + 1) % players.length;
            player.use(sprite(players[currentFrame]));
        });
        // Movement
        onKeyDown("right", () => {
            if (player.isGrounded()) {
                player.move(250, 0);
            } else {
                player.move(155, 0);
            }
        });
        // Double jump
        let jumps = 0;
        onKeyPress("space", () => {
            if (jumps < 2) {
                player.jump(700);
                jumps++;
            }
        });
        player.onUpdate(() => {
            if (player.isGrounded()) jumps = 0;
            if (player.pos.x < -100) {
                gameover.play()
                go("gameover")
            }
        });
        // Collisions
        setTimeout(()=>{
            player.onCollide("ground", () => {
            gameover.play()
            go("gameover")
        });
        },5000)
        


        // Block spawning
        let previous = "block4_grJump";
        let lastBlock = null;
        let x2Active = false
        let blockSpeed = 200;
        let activeBlocks = []
        let cycle =0
        const gearMessage=document.querySelector(".float")

        function spawnRndGRBlock() {
            let bkName = choose(blockNamesGround);
            let blockY = 580;
            

            if (["block4_grJump", "block4_grJump1", "block4_grJump2"].includes(previous)) {
                bkName = "block1_small";
            }
            if (bkName === "block4_grJump2") blockY = 500;
            if (bkName === "block4_grJump" || bkName === "block4_grJump1") blockY = 499;

            previous = bkName;
            let spawnX = lastBlock ? lastBlock.pos.x + lastBlock.realWidth : width();


            //player's jump and sprite
            if(cycle===0){
                bkName="block1_small"
                let jumpUp = add([
                    sprite("jump"),
                    pos(spawnX-200, blockY-155),
                    move(LEFT, blockSpeed),
                    scale(0.32)
                ])
                jumpUp.onUpdate(() => {
                    jumpUp.pos.y += Math.sin(time() * 5) * 0.5;
                });
            }
            cycle++


            //BLOCK CONF
            const block = add([
                sprite(bkName),
                pos(spawnX+10, blockY),
                scale(0.35),
                area(),
                body({ isStatic: true }),
                move(LEFT, blockSpeed),
                "platform",
            ]);
            activeBlocks.push(block)
                    block.onDestroy(() => {
                activeBlocks = activeBlocks.filter(b => b !== block)
            })
            block.realWidth = block.width * block.scale.x;


            // Coin
            let alradySpawned=false
            let mlwAlready = false
            let coinAlr =false
            if (rand(0, 1) < 0.60) {
                alradySpawned=true
                const coin = add([
                    sprite("coin"),
                    pos(spawnX + block.realWidth / 2, blockY - 100),
                    scale(0.1),
                    area(),
                    move(LEFT, blockSpeed),
                    "coin"
                ]);
                activeBlocks.push(coin)
                coin.onCollide("player", () => {
                    coinSound.play()
                    if(x2Active){
                        earnedCoins+=2
                        setTimeout(() => {
                            totScore.style.color = "white"
                            x2Active=false
                        }, 10000);  
                    }else{
                        earnedCoins++;            
                        console.log(earnedCoins)
                        totScore.style.color = "#02fa44";
                        setTimeout(() => totScore.style.color = "white", 300);    
                    }
                    totScore.innerHTML = earnedCoins;
                    destroy(coin);
                });
                coin.onUpdate(() => {
                    if(earnedCoins>=30){
                        win.play()
                        go("win")
                    }
                    coin.pos.y += Math.sin(time() * 5) * 0.5
                });
            }
            // Malware
            if (rand(0, 1) < 0.4 && !alradySpawned) {
                mlwAlready=true
                const malware = add([
                    sprite("malware"),
                    pos(spawnX + block.realWidth / 2, blockY - 100),
                    scale(0.15),
                    area(),
                    move(LEFT, blockSpeed),
                    "malware"
                ]);
                activeBlocks.push(malware)
                malware.onCollide("player",()=>{
                    gameover.play()
                    go("gameover")
                })
                malware.onUpdate(() => {
                    malware.pos.x += Math.sin(time() * 5) * 0.5;
                });
            }
            // x2
            if (rand(0, 1) < 0.4 && !alradySpawned && !mlwAlready) {
                coinAlr=true
                const x2 = add([
                    sprite("x2"),
                    pos(spawnX + block.realWidth / 2, blockY - 100),
                    scale(0.15),
                    area(),
                    move(LEFT, blockSpeed),
                    "x2"
                ]);
                activeBlocks.push(x2)
                x2.onCollide("player",()=>{
                    //gear message
                    gearMessage.innerHTML="Gold Fever! (double coins for 10 s)"
                    gearMessage.style.color="rgba(255, 255, 0, 1)"
                    gearMessage.classList.remove("scale-0")
                    gearMessage.classList.add("scale-50")
                    setTimeout(()=>{
                        gearMessage.classList.add("scale-0")
                        gearMessage.classList.remove("scale-50")
                    },1250)
                    x2Sound.play()
                    totScore.style.color = "#fff700ff";
                    x2Active=true
                    x2.destroy()
                })
                x2.onUpdate(() => {
                    x2.pos.x += Math.sin(time() * 5) * 0.5;
                });
            }
            //clock speed boost
            if (rand(0, 1) < 0.55 && !alradySpawned && !mlwAlready && !coinAlr) {
                const clock = add([
                    sprite("clock"),
                    pos(spawnX + block.realWidth / 2, blockY - 100),
                    scale(0.15),
                    area(),
                    move(LEFT, blockSpeed),
                    "clock"
                ]);
                activeBlocks.push(clock)
                clock.onCollide("player",()=>{
                    //gear message
                    gearMessage.innerHTML="Speed Surge! (blocks are faster for 5s)"
                    gearMessage.style.color="rgba(255, 255, 0, 1)"
                    gearMessage.classList.remove("scale-0")
                    gearMessage.classList.add("scale-50")
                    setTimeout(()=>{
                        gearMessage.classList.add("scale-0")
                        gearMessage.classList.remove("scale-50")
                    },1250)
                    speed.play()
                    blockSpeed=300
                    activeBlocks.forEach(b => b.use(move(LEFT, blockSpeed)))
                    let speedBost = setTimeout(() => {
                        blockSpeed = 200
                        activeBlocks.forEach(b => b.use(move(LEFT, blockSpeed)))
                        
                    }, 5000)
                    clearTimeout(speedBost)
                    clock.destroy()
                })
                clock.onUpdate(() => {
                    clock.pos.x += Math.sin(time() * 5) * 0.5;
                });
            }
            alradySpawned=false
            mlwAlready=false
            coinAlr=false


            // Spawn next
            block.onUpdate(() => {
                if (!block.spawnedNext && block.pos.x + block.realWidth < width()) {
                    block.spawnedNext = true;
                    spawnRndGRBlock();
                }
                if (block.pos.x < -block.realWidth) destroy(block);
            });
            lastBlock = block;
        }
        spawnRndGRBlock();
    });
}




//scene 2
export function loadGOScene() {
    const plAgainDiv = document.querySelector(".restartDiv");
    const plAgain = document.querySelector(".restart");
    const canvas = document.querySelector("canvas")
    canvas.focus()

    scene("gameover", () => {
        add([
            sprite("bg", { width: width(), height: height() })
        ]); 
        plAgain.style.opacity = "1";
        plAgainDiv.style.opacity = "1";
    });

    // register click ONCE
    plAgain.onclick = () => {
        plAgain.style.opacity = "0";
        plAgainDiv.style.opacity = "0";
        window.location.href="index.html"
    };
}




//scene 3
export function loadWScene(){
    const winBanner = document.querySelector(".winDiv")
    const winTitle=document.querySelector(".win")
    const winP = document.querySelector(".pWin")
    scene("win", () => {
        add([
            sprite("win", { width: width()+100, height: height() })
        ]);
        winBanner.style.opacity="1"
        winTitle.style.opacity="1"
        winP.style.opacity="1" 
    });
    
}
