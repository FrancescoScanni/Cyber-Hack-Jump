//importing sprites
import { loadingSprites,blockNamesGround,players} from "./sprites.js";


//scene 0
export function loadStartingScene(){
    scene("start",()=>{
        const bg = add([
            sprite("bg", { width: width(), height: height() })
        ]);
    })
}

//scene 1
export function loadGameScene(){
    scene("game", () => {

        //floating message
        const message = document.querySelector("#advice")
        setTimeout(()=>{
            message.style.opacity="1"
        },700)
        setTimeout(()=>{
            message.style.opacity="0"
        },7000)
        const bg = add([
            sprite("bg", { width: width(), height: height() })
        ]) //background
        const ground = add([
            pos(0, height() - 50),
            rect(width()+5000, 30),
            area(),
            opacity(0),
            solid()
        ]) //base rect
        const player = add([
            sprite(players[0]),
            pos(150, height() - 190),
            area(),
            body(),
            scale(0.35),
            "player"
        ]);//player


        //PLAYER RUNNING ANIMATION
        let currentFrame = 0;
        setInterval(() => {
            currentFrame = (currentFrame + 1) % players.length;
            player.use(sprite(players[currentFrame]));
        }, 165);
        //movement
        onKeyDown("right", () => {
        if (!player.isGrounded()) {
            player.move(300, 0);
        } else {
            player.move(155, 0);
        }
        });
        //blocks dragging
        player.onCollide("platform", ()=>{
            player.move(-50,0)
        })  
        //score

        //death
        player.onCollide("malware", ()=>{
            const failMusic = new Audio("src/static/sounds/fail.mp3")
            failMusic.play()
            go("gameover")
        }) 
        
        
        //BLOCKS SPAWNING
        let previous = "block4_grJump";
        let lastBlock = null;
        let cycle = 0
        let spawnX;
        let blockY = 580;
        //
        function spawnRndGRBlock() {
        let blockSpeed = 190;
        let bkName = choose(blockNamesGround);
          
        if (previous === "block4_grJump" || previous === "block4_grJump1" || previous === "block4_grJump2") {
            bkName = choose(["block1_small", "block5_fire", "block5_spike"]);
        }
        if (previous === "block5_fire" || previous === "block5_spike") {
            bkName = "block1_small";
        }
        switch(bkName){
            case "block4_grJump2":
                blockY = 500;
                break
            case "block4_grJump":
                blockY = 499;
                break
            case "block4_grJump1":
                blockY = 499;
                break
            case "block5_fire":
                blockY = 517;
                break
            case "block5_spike":
                blockY = 540.3;
                break
        }
        previous = bkName;
        if (lastBlock) {
            spawnX = lastBlock.pos.x + lastBlock.realWidth
        } else {
            spawnX = width()
        }

        //the first block is always the standard one
        let jumpUp
        let up_down =false
        //player's jump and sprite
        if(cycle===0){
            bkName="block1_small"
            jumpUp = add([
                sprite("jump"),
                pos(spawnX, blockY-155),
                move(LEFT, blockSpeed),
                scale(0.32)
            ])
            setInterval(() => {
                if(!up_down){
                    jumpUp.pos.y += 20;
                    up_down=true
                }
                else{
                    jumpUp.pos.y -= 20;
                    up_down=false
                }
                
            }, 700);
            spawnX+=200
        }
        onKeyPress(["space", "up", "w"], () => {
            if (player.isGrounded()) {
                player.jump(720);
                destroy(jumpUp)
            }
        });
        cycle++


        //BLOCKS VARIABLE PROPERTIES
        const block = add([
            sprite(bkName),
            pos(spawnX, blockY),
            scale(0.35),
            area(),
            body(),
            move(LEFT, blockSpeed),
            "platform",
        ]);
        

        //COINS GENERATION
        const realWidth = block.width * block.scale.x;
        block.realWidth = realWidth;
        let coinAlready=false
        if (Math.floor(Math.random() * 3) === 1) {
            coinAlready=true
            const coin = add([
                sprite("coin"),
                pos(spawnX + realWidth / 2, blockY - 100),
                scale(0.1),
                area(),
                move(LEFT, blockSpeed),
                "coin"
            ]);
            coin.onCollide("player",()=>{
                const coinSound = new Audio("src/static/sounds/coin.mp3")
                coinSound.play()
                coin.destroy()
            })
            let up=false
            setInterval(()=>{
                if(up){
                    coin.pos.y-=5
                    up=false
                }else{
                    coin.pos.y+=5
                    up=true
                }
            },500)
        }
        else{
            coinAlready=false
        }


        //MALWARE GENERATION
        if (Math.floor(Math.random() * 12) === 1 && !coinAlready) {
            const malware = add([
                sprite("malware"),
                pos(spawnX + realWidth / 2, blockY - 100),
                scale(0.15),
                area(),
                move(LEFT, blockSpeed),
                "malware"
            ]);
            let up=false
            setInterval(()=>{
                if(up){
                    malware.pos.x-=7
                    up=false
                }else{
                    malware.pos.x+=7
                    up=true
                }
            },500)
        }


        //BLOCKS IN SEQUENCE
        block.onUpdate(() => {
            if (!block.spawnedNext && (block.pos.x + block.width) < width()+5000) {
                    block.spawnedNext=true
                    spawnRndGRBlock();
            }
            if (block.pos.x < -block.realWidth) {
                destroy(block);
            }
        });
        lastBlock = block;
    }
    spawnRndGRBlock();

    
});
}

//scene 2
export function loadGOScene(){
    scene("gameover", () => {
         const bg = add([
            sprite("bg", { width: width(), height: height() })
        ]);
        add([
            text("Game Over!"),
            scale(2),
            pos(width() / 2, height() / 3),
            origin("center")
        ]);
 
        const plAgain = document.querySelector(".restart")
        plAgain.style.opacity="1"
        plAgain.classList.add("dis3")
        plAgain.addEventListener("click",()=>{
            plAgain.style.opacity="0"
            go("game")
        })
    });
}
 