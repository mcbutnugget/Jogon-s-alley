//stuffs setup
import REGISTER from './game/initializeBlocks.js'

function createKeyHandler() {
    const keys = {};

    const keyDownHandler = (event) => {
        keys[event.key] = true;
    };

    const keyUpHandler = (event) => {
        keys[event.key] = false;
    };

    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    return () => keys;
}
window.PresentKeys = createKeyHandler();
window.Key = PresentKeys();


// Canvas setup
const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.imageSmoothingEnabled = false;






// Player object
let player = {
    x: 60,
    y: 0,
    velY:1,
    velX:0,
    w: 20,
    h: 15,
    collidingX:false,
    collidingY:false,
    images:[new Image()],
    currentImage:0,
    frames: {
        width: 10,
        height: 10,
        frameCount: 2,
        current: 0,
        fps: 2
    }
};
let camera = {
    x:player.x,
    y:player.y
}
let lvl1 = [
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [0,0,0,0,0],
    [1,1,1,1,1]
];
let register = new REGISTER();

player.images[0].src = "textures/entity/player.png";
console.log(register.blocks);
for(var y = 0; y<lvl1.length; y++){
    for(var x = 0; x<lvl1[y].length; x++){
await register.blocks[register.blockIds[lvl1[y][x]]].place(x,y,ctx,camera);
    }
}
async function draw() {
    camera.x = player.x;
    camera.y = player.y;
}

setInterval(draw,16);
window.canvas = canvas;
window.ctx = ctx;
window.player = player;
window.camera = camera;
window.REGISTER = REGISTER;
window.register = register
