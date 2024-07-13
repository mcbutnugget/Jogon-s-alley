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
    y: 0,
    collidingX: false,
    collidingY: false,
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
    }
};

player.images[0].src = playerData.image;

// Camera setup
let camera = {
    x: player.x,
    y: player.y
};

// Level data
let lvl1 = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1]
];

// Initialize register
let register = new REGISTER();

// World Rendering
const world = {
    renderWorld: async function (fn) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        
        for (let y = 0; y < lvl1.length; y++) {
            for (let x = 0; x < lvl1[y].length; x++) {
                if (lvl1[y][x] != 0) {
                    await register.blocks[register.blockIds[lvl1[y][x]]].place(x, y, ctx, camera);
                }
            }
        }
        
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
    player.velY -= 0.001;
    player.init(); // Update player after camera adjustment
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
