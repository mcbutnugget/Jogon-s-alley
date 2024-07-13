import REGISTER from './game/initializeBlocks.js';

// Key handler setup
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

// Fetch player data
const playerData = await fetch('textures/entity/player.json').then(res => res.json());

// Update Animation Frame
function updateAnimationFrame(entity) {
    entity.frames.current = (entity.frames.current + 1) % entity.frames.frameCount;
}

// Player object setup
let player = {
    velY: 0,
    velX: 0,
    w: 50,
    h: 50,
    x: 0,
    y: 50,
    colliding: false,
    images: [new Image()],
    frames: {
        width: playerData.width,
        height: playerData.height,
        frameCount: playerData.frames,
        current: 0,
        fps: playerData.fps,
        timer: 0,
    },
    init: function () {
        this.x += this.velX;
        this.y += this.velY;

        // Animation Timer Update
        this.frames.timer++;
        if (this.frames.timer >= 60 / this.frames.fps) {
            updateAnimationFrame(this);
            this.frames.timer = 0;
        }
    },
    checkCollision: function() {
        this.colliding = existingBlocks.some(block => {
            return (
                block[1] < (-player.y) + 50 && // Top of block above player's bottom
                block[1] > (-player.y) &&       // Bottom of block below player's top
                block[0] < (-player.x) + 50 && // Left of block left of player's right
                block[0] + 50 > (-player.x)     // Right of block right of player's left
            );
        });
    }
};

player.images[0].src = playerData.image;

// Camera setup
let camera = {
    x: player.x,
    y: player.y
};

// Level data
window.lvl1 = [
    [0,0,0,0,0,0,0,0,0,0,2,2,2,2,2],
    [0,0,0,0,0,0,0,0,0,3,2,2,2,2,2],
    [0,0,0,0,0,0,0,0,3,2,2,2,2,2,2],
    [0,0,0,0,0,0,0,0,2,2,2,2,2,2,1],
    [0,0,0,0,0,0,3,3,2,1,1,1,1,1,1],
    [3,3,3,3,3,3,2,2,1,1,1,1,1,1,1]];
let existingBlocks = []

// Initialize register
let register = new REGISTER();

// World Rendering
const world = {
    renderWorld: async function (fn) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        existingBlocks = [];
        let currentBlock = 0;

        for (let y = 0; y < lvl1.length; y++) {
            for (let x = 0; x < lvl1[y].length; x++) {
                if (lvl1[y][x] != 0) {
                    currentBlock++
                    let block = await register.blocks[register.blockIds[lvl1[y][x]]].place(x, y, ctx, camera);
                    existingBlocks.push([block.x,block.y])
                    //console.log(`block${currentBlock} `,[block.x,block.y]);
                }
            }
        }
        window.existingBlocks = existingBlocks;
        ctx.drawImage(
            player.images[0],
            player.frames.current * player.frames.width,
            0,
            player.frames.width,
            player.frames.height,
            player.x + (window.innerWidth / 2) - camera.x,
            player.y + (window.innerHeight / 2) - camera.y,
            player.w,
            player.h
        );

        // Debugging: Log after rendering everything
        
        requestAnimationFrame(fn);
    }
};

// Main Draw Loop
async function draw() {
    camera.x = player.x;
    camera.y = player.y;
    if(!player.colliding){
        player.velY -= 0.1;
    }else{
        player.velY = 0;
        player.y++;
        player.velX += -player.velX/20
    }
    if(Key["d"]){
        player.velX-=0.1;
    }
    if(Key["a"]){
        player.velX+=0.1;
    }
    if(Key[" "]&&player.colliding){
        player.velY=5;
    }
    player.init(); // Update player after camera adjustment
    player.checkCollision();
    await world.renderWorld(draw);
}

requestAnimationFrame(draw); // Initial call

window.canvas = canvas;
window.ctx = ctx;
window.player = player;
window.camera = camera;
window.REGISTER = REGISTER;
window.register = register;
window.world = world;
