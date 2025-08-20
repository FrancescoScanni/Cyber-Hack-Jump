//importing sprites
import { loadingSprites, blockNamesGround, players } from "./sprites.js";

//scene 0
export function loadStartingScene() {
    scene("start", () => {
        add([
            sprite("bg", { width: width(), height: height() })
        ]);
    });
}



//scene 1
export function loadGameScene() {
    scene("game", () => {
        const bg = add([ sprite("bg", { width: width(), height: height() })]); 
        const ground = add([ pos(0, height() - 50), rect(width()+5000, 30), area(), opacity(0), solid() ]) //base rect

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
        });

        // Collisions
        player.onCollide("platform", () => {
            player.move(-50, 0);
        });



        // Block spawning
        let previous = "block4_grJump";
        let lastBlock = null;
        let x2Active = false

        function spawnRndGRBlock() {
            let bkName = choose(blockNamesGround);
            let blockY = 580;
            let blockSpeed = 200;

            if (["block4_grJump", "block4_grJump1", "block4_grJump2"].includes(previous)) {
                bkName = "block1_small";
            }
            if (bkName === "block4_grJump2") blockY = 500;
            if (bkName === "block4_grJump" || bkName === "block4_grJump1") blockY = 499;

            previous = bkName;
            let spawnX = lastBlock ? lastBlock.pos.x + lastBlock.realWidth : width();

            //BLOCK CONF
            const block = add([
                sprite(bkName),
                pos(spawnX, blockY),
                scale(0.35),
                area(),
                body({ isStatic: true }),
                move(LEFT, blockSpeed),
                "platform",
            ]);
            block.realWidth = block.width * block.scale.x;

            // Coin
            let alradySpawned=false
            let mlwAlready = false
            let coinAlr =false
            if (rand(0, 1) < 0.50) {
                alradySpawned=true
                const coin = add([
                    sprite("coin"),
                    pos(spawnX + block.realWidth / 2, blockY - 100),
                    scale(0.1),
                    area(),
                    move(LEFT, blockSpeed),
                    "coin"
                ]);
                coin.onCollide("player", () => {
                    const coinSound = new Audio("src/static/sounds/coin.mp3") 
                    coinSound.play()
                    if(x2Active){
                        earnedCoins+=2
                        setTimeout(() => {
                            totScore.style.color = "white"
                            x2Active=false
                        }, 10000);
                        
                    }else{
                        earnedCoins++;
                        totScore.style.color = "#02fa44";
                        setTimeout(() => totScore.style.color = "white", 300);
                    }
                    totScore.innerHTML = earnedCoins;
                    destroy(coin);
                });
                coin.onUpdate(() => {
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
                malware.onCollide("player",()=>{
                    const failMusic = new Audio("src/static/sounds/fail.mp3")
                    failMusic.play()
                    go("gameover")
                })
                malware.onUpdate(() => {
                    malware.pos.x += Math.sin(time() * 5) * 0.5;
                });
            }
            // x2
            if (rand(0, 1) < 0.3 && !alradySpawned && !mlwAlready) {
                coinAlr=true
                const x2 = add([
                    sprite("x2"),
                    pos(spawnX + block.realWidth / 2, blockY - 100),
                    scale(0.15),
                    area(),
                    move(LEFT, blockSpeed),
                    "x2"
                ]);
                x2.onCollide("player",()=>{
                    const failMusic = new Audio("src/static/sounds/fail.mp3")
                    failMusic.play()
                    totScore.style.color = "#fff700ff";
                    x2Active=true
                    x2.destroy()
                })
                x2.onUpdate(() => {
                    x2.pos.x += Math.sin(time() * 5) * 0.5;
                });
            }

            //clock speed boost
            if (rand(0, 1) < 0.4 && !alradySpawned && !mlwAlready && !coinAlr) {
                const clock = add([
                    sprite("clock"),
                    pos(spawnX + block.realWidth / 2, blockY - 100),
                    scale(0.4),
                    area(),
                    move(LEFT, blockSpeed),
                    "clock"
                ]);
                clock.onCollide("player",()=>{
                    const speed = new Audio("src/static/sounds/fail.mp3")
                    speed.play()
                    totScore.style.color = "#fff700ff";
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
        go("game");
    };
}
