import kaboom from "https://unpkg.com/kaboom@2000.2.10/dist/kaboom.mjs";

// kaboom init
kaboom({
    fullscreen: true,
    width: window.innerWidth,
    height: window.innerHeight,
    letterbox: true,
    global: true,
});

gravity(1200);

let blockNamesGround = [
    "block1_small",
    "block4_grJump",
    "block4_grJump1",
    "block4_grJump2",
    "block5_fire",
    "block5_spike"
];
let players = ["hk_main1","hk_main2","hk_main3","hk_main4"];

loadSprite("bg", "assets/sprite/bg.png");
blockNamesGround.forEach(name => loadSprite(name, `assets/sprite/ground/${name}.png`));
players.forEach(name => loadSprite(name, `assets/sprite/characters/${name}.png`));

scene("game", () => {
    const bg = add([
        sprite("bg", { width: width(), height: height() })
    ]);

    const ground = add([
        pos(0, height() - 50),
        rect(width()+1000, 30),
        area(),
        opacity(0),
        solid()
    ]);

    const player = add([
        sprite(players[0]),
        pos(150, height() - 190),
        area(),
        body(),
        scale(0.35),
    ]);
    // player running animation
    let currentFrame = 0;
    setInterval(() => {
        currentFrame = (currentFrame + 1) % players.length;
        player.use(sprite(players[currentFrame]));
    }, 165);
    // jump
    player.onUpdate
    onKeyPress(["space", "up", "w"], () => {
        if (player.isGrounded()) {
            player.jump(720);
        }
    });
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
    


    




    let previous = "block4_grJump";
    let lastBlock = null;
    let cycle = 0

    // function that makes blocks spawn
    function spawnRndGRBlock() {
    let blockSpeed = 150;
    let blockY = 580;
    let bkName = choose(blockNamesGround);
    let spawnX;
        
    if (previous === "block4_grJump" || previous === "block4_grJump1" || previous === "block4_grJump2") {
        bkName = choose(["block1_small", "block5_fire", "block5_spike"]);
    }
    if (previous === "block5_fire" || previous === "block5_spike") {
        bkName = "block1_small";
    }
        
    if (bkName === "block4_grJump2") {
        blockY = 500;
    }
    if (bkName === "block4_grJump") {
        blockY = 499;
    }
    if (bkName === "block4_grJump1") {
        blockY = 499;
    }
    
    if (bkName === "block5_fire") blockY = 517;
    if (bkName === "block5_spike") blockY = 540.3;

    previous = bkName;
    if (lastBlock) {
        spawnX = lastBlock.pos.x + lastBlock.realWidth
    } else {
        spawnX = width()
    }

    //the first block is always the standard one
    if(cycle===0){
        bkName="block1_small"
    }
    cycle++


    const block = add([
        sprite(bkName),
        pos(spawnX, blockY),
        scale(0.35),
        area(),
        body(),
        move(LEFT, blockSpeed),
        "platform",
    ]);

    
    
    
    
    const realWidth = block.width * block.scale.x;
    block.realWidth = realWidth;

    block.onUpdate(() => {
        if (!block.spawnedNext && (block.pos.x + block.width) < width()+1200) {
                block.spawnedNext=true
                spawnRndGRBlock();
        }
        if (block.pos.x < -block.realWidth) {
            destroy(block);
        }
    });
    lastBlock = block;
}
spawnRndGRBlock()



function spawnRndHRBlock(){
    
}
});

scene("gameover", () => {
    add([
        text("Game Over!"),
        pos(width() / 2, height() / 2),
        origin("center")
    ]);
});

go("game");
