export const blockNamesGround = ["block1_small","block4_grJump","block4_grJump1","block4_grJump2","block5_fire","block5_spike"];
export const players = ["hk_main1","hk_main2","hk_main3","hk_main4"];

export function loadingSprites(k) {
    k.loadSprite("bg", "assets/sprite/bg.png");
    k.loadSprite("jump", "assets/sprite/jump.png");
    k.loadSprite("coin","assets/sprite/coin.png")
    k.loadSprite("malware","assets/sprite/malware.png")
    blockNamesGround.forEach(name => k.loadSprite(name, `assets/sprite/ground/${name}.png`));
    players.forEach(name => k.loadSprite(name, `assets/sprite/characters/${name}.png`));
}