import kaboom from "../../lib/kaboom.mjs";
export default kaboom

//kaboom init
kaboom({
	width: 640,
	height: 360,
	letterbox: true,
	global: true,
});


//main canvas
let blockSpeed = 80
let blockNamesGround = [
    "block1_small",
    "block4_grJump",
    "block4_grJump1",
    "block4_grJump2",
    "block5_fire",
    "block5_spike"
]
let blockNamesFloatig = [
    "block2_jumpSM",
    "block2_jumpSM2",
    "block3_jumpB",
    "block3_jumpB2"
]
let players = ["hk_main1","hk_main2","hk_main3","hk_main4"];

loadSprite("bg", "assets/sprite/bg.png");
blockNamesGround.forEach(name => {
    loadSprite(name, `assets/sprite/ground/${name}.png`);
});
players.forEach(name => {
    loadSprite(name, `assets/sprite/characters/${name}.png`);
});



//scene1 game
scene("game", ()=>{
    const bg = add([
        sprite("bg", { width: width(), height: height() })
    ]);
    const ground = add([
        rect(width(), 10),
        pos(0, height() - 25),
        opacity(0),
        area(),
        body({ isStatic: true })
    ]);
    const player = add([
        sprite(players[0]),
        scale(0.2),
        pos(60, 250), // was too low before
        area(),
        body()
    ]);
    //player running
    let currentFrame=0
    setInterval(() => {
		currentFrame = (currentFrame + 1) % players.length;
		player.use(sprite(players[currentFrame]));
	}, 165);
    

    
    let previous = "block4_grJump"
    let lastBlock=null
    //function that makes blocks spawn
    function spawnRndGRBlock() {
        let blockY = 305;
        let bkName = choose(blockNamesGround);
        let spawnX
        
        if (previous === "block4_grJump"|| previous === "block4_grJump1" || previous === "block4_grJump2") {
            bkName = choose(["block1_small","block5_fire","block5_spike"]);
        }
        if (previous === "block5_fire" || previous === "block5_spike" ) {
            bkName = choose(["block1_small"]);
        }
        if (bkName === "block4_grJump"|| bkName === "block4_grJump1"|| bkName === "block4_grJump2") {
            blockY = 259;
        }
        if (bkName==="block5_fire") {
            blockY = 268.8;
        }
        if (bkName==="block5_spike") {
            blockY = 282.5;
        }
        previous = bkName
        if (lastBlock) {
        spawnX = lastBlock.pos.x + lastBlock.width * lastBlock.scale.x 
        } else {
            spawnX = width() 
        }

        const block = add([
            sprite(bkName),
            pos(spawnX, blockY),
            scale(0.2),
            area(),
            body({ isStatic: true }),
            "platform",
        ]);


        block.onUpdate(() => {
            block.move(-blockSpeed, 0)
            if (!block.spawnedNext && block.pos.x <= 600) {
                block.spawnedNext = true
                spawnRndGRBlock()
            }
            if (block.pos.x < -block.width) {
                destroy(block)
            }
        });
        lastBlock = block
    }
    spawnRndGRBlock()    
})

go("game")