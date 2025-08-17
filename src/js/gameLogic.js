import kaboom from "https://unpkg.com/kaboom@2000.2.10/dist/kaboom.mjs";

// init
kaboom({ fullscreen: true, global: true });

const blockSpeed = 200;
const blockY = 300;
const gap = 30;

// front square
const front = add([
    rect(20, 20),
    pos(400, blockY),
    color(0, 255, 0),
    area(),
    solid(),
    move(LEFT, blockSpeed / 2),
]);

// three rectangles behind
for (let i = 0; i < 3; i++) {
    const r =add([
        rect(100, 20),
        pos(400 + front.width + gap + i * (100 + gap), blockY),
        color(255, 0, 0),
        area(),
        solid(),
        move(LEFT, blockSpeed),
    ]);
}


