import REGISTER from './game/initializeBlocks.js';
import createLevel from './game/level/createLevel.js';

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
    x: -290,
    y: -150,
    mirrorX: 1,
    mirrorY:1,
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
    collisions:{
        colliding:false,
        direction:{
            up:false,
            down:false,
            left:false,
            right:false
        }
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
        this.collisions.colliding = existingBlocks.some(block => {
            return(
                block[1] < (-player.y) + 50 && // Top of block above player's bottom
                block[1]+50 > (-player.y) &&       // Bottom of block below player's top
                block[0] < (-player.x) + 50 && // Left of block left of player's right
                block[0] + 50 > (-player.x)     // Right of block right of player's left
            )
        });
        this.collisions.direction.down = existingBlocks.some(block => {
            return(
                block[1] <= (-player.y) + 50 && // Top of block above player's bottom
                block[1]+12.5  >= (-player.y) &&       // Bottom of block below player's top
                block[0] <= (-player.x) + 49 && // Left of block left of player's right
                block[0] + 49 >= (-player.x)     // Right of block right of player's left
            )
        });
        this.collisions.direction.up = existingBlocks.some(block => {
            return(
                block[1] <= (-player.y) + 12.5 && // Top of block above player's bottom
                block[1]+50 >= (-player.y) &&       // Bottom of block below player's top
                block[0] <= (-player.x) + 49 && // Left of block left of player's right
                block[0] + 49 >= (-player.x)     // Right of block right of player's left
            )
        });
        this.collisions.direction.left = existingBlocks.some(block => {
            return(
                block[1] <= (-player.y) + 49 && // Top of block above player's bottom
                block[1]+49 >= (-player.y) &&       // Bottom of block below player's top
                block[0] <= (-player.x) + 50 && // Left of block left of player's right
                block[0] + 12.5 >= (-player.x)     // Right of block right of player's left
            )
        });
        this.collisions.direction.right = existingBlocks.some(block => {
            return(
                block[1] <= (-player.y) + 49 && // Top of block above player's bottom
                block[1]+49 >= (-player.y) &&       // Bottom of block below player's top
                block[0] <= (-player.x) + 12.5 && // Left of block left of player's right
                block[0] + 50 >= (-player.x)     // Right of block right of player's left
            )
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
window.lvl1 = new createLevel(40,40);
let existingBlocks = []

// Initialize register
let register = new REGISTER();

// World Rendering
const world = {
    renderWorld: async function (fn) {
        ctx.fillStyle = "rgb(50,80,255)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
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
        ctx.save();

        // Translate to the position where you want to draw the image
        ctx.translate(
            player.x + (window.innerWidth / 2) - camera.x + player.w / 2,
            player.y + (window.innerHeight / 2) - camera.y + player.h / 2
        );
        
        // Scale the canvas horizontally by -1 to flip the image
        ctx.scale(player.mirrorY, player.mirrorX);
        
        // Draw the image with adjustments for the new origin and scaling
        ctx.drawImage(
            player.images[0],
            player.frames.current * player.frames.width,
            0,
            player.frames.width,
            player.frames.height,
            -player.w / 2,
            -player.h / 2,
            player.w,
            player.h
        );
        
        // Restore the canvas state
        ctx.restore();

        // Debugging: Log after rendering everything
        
        requestAnimationFrame(fn);
    }
};
// Main Draw Loop
async function draw() {
    player.checkCollision();
    camera.x = player.x;
    camera.y = player.y;

    // Gravity and friction
    if (!player.collisions.direction.down) {
        player.velY -= 0.1;
        player.velX += -player.velX / 20;
    } else {
        player.velY = 0;
        player.velX += -player.velX / 20;
    }

    // Vertical collision handling
    if (player.collisions.direction.up) {
        player.velY = 0;
        player.y -= 1; // Adjust position to prevent sticking to the ceiling
    }
    if (player.collisions.direction.down) {
        player.velY = 0;
        player.y += 1; // Adjust position to prevent sinking into the ground
    }

        // Player movement input
        if (Key["d"] && !player.collisions.direction.right) {
            player.velX -= 0.5;
            player.mirrorY = -1;
        }
        if (Key["a"] && !player.collisions.direction.left) {
            player.velX += 0.5;
            player.mirrorY = 1;
        }
        if (Key[" "] && player.collisions.direction.down) {
            player.velY = 5;
        }

    // Horizontal collision handling
    if (player.collisions.direction.left) {
        player.velX = 0;
        player.x += 1; // Adjust position to prevent sticking to the wall
    }
    if (player.collisions.direction.right) {
        player.velX = 0;
        player.x -= 1; // Adjust position to prevent sticking to the wall
    }

    await world.renderWorld(draw);
    player.init();
}


requestAnimationFrame(draw); // Initial call
window.canvas = canvas;
window.ctx = ctx;
window.player = player;
window.camera = camera;
window.REGISTER = REGISTER;
window.register = register;
window.world = world;
