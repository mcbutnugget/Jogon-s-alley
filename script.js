import REGISTER from './game/initializeBlocks.js';
import createLevel from './game/level/createLevel.js';
import cursor from './game/GUI/cursor.js';

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

window.addEventListener("resize", resizeCanvas, false);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    ctx.imageSmoothingEnabled = false;
}

resizeCanvas();

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
    w: 40,
    h: 40,
    x: -290,
    y: -17399,
    mirrorX: 1,
    mirrorY: 1,
    images: [new Image()],
    currentBlock: 1,
    frames: {
        width: playerData.width,
        height: playerData.height,
        frameCount: playerData.frames,
        current: 0,
        fps: playerData.fps,
        timer: 0,
    },
    colliding: false,
    collidingWith: [null, null, null, null],
    collisionResolved: false,
    onGround: false,
    wallL: false,
    wallR:false,
    hittingCeiling: false,
    jumpAmmounts: 5,
    init: function () {

        // Animation Timer Update
        this.frames.timer++;
        if (this.frames.timer >= 60 / this.frames.fps) {
            updateAnimationFrame(this);
            this.frames.timer = 0;
        }
    },
    checkCollision: function () {
        this.colliding = existingBlocks.some(block => {
            return (block[1] < (-this.y) + this.h &&
                block[1] + block[3] > (-this.y) &&
                block[0] < (-this.x) + this.w &&
                block[0] + block[2] > (-this.x));
        });
        this.collidingWith = existingBlocks.find(block => {
            if (block[1] < (-this.y) + this.h &&
                block[1] + block[3] > (-this.y) &&
                block[0] < (-this.x) + this.w &&
                block[0] + block[2] > (-this.x)) {
                return block;
            }
        });
        if (this.collidingWith == undefined) {
            this.collidingWith = [undefined, undefined, undefined, undefined]
        }
    },
    resolveCollision: function() {
        const block = this.collidingWith;

        const blockBottom = block[1]+block[3];
        const playerBottom = (-player.y) + player.h;
        const playerRight = (-player.x) + player.w;
        const blockRight = block[0]+block[2];

        const BottomCollision = blockBottom - (-player.y);
        const TopCollision = playerBottom - (block[1]);
        const LeftCollision = playerRight - (block[0]);
        const RightCollision = blockRight - (-player.x);

        if (TopCollision < BottomCollision && TopCollision < LeftCollision && TopCollision < RightCollision) {
            player.y = -(block[1] - player.h);
            player.velY = 0;
            player.onGround = true;
        } else if (BottomCollision < TopCollision && BottomCollision < LeftCollision && BottomCollision < RightCollision) {
            player.y = -(block[1] + block[3]);
            player.velY = 0;
            player.hittingCeiling = true;
        } else if (LeftCollision < RightCollision && LeftCollision < TopCollision && LeftCollision < BottomCollision) {
            player.x = -(block[0] - player.w);
            player.velX = 0;
            player.wallL = true;
        } else if (RightCollision < LeftCollision && RightCollision < TopCollision && RightCollision < BottomCollision) {
            player.x = -(block[0] + block[2]);
            player.velX = 0;
            player.wallR = true;
        }


    },
    controls:function(){
        if (Key["d"] && player.onGround) { // Move right only if not hitting wall
            player.velX -= 0.5;
            player.mirrorY = -1;
        }else if(Key["d"]){
            player.velX -= 0.1;
        }
        if (Key["a"] && player.onGround) { // Move left only if not hitting wall
            player.velX += 0.5;
            player.mirrorY = 1;
        }else if(Key["a"]){
            player.velX += 0.1;
        }
        if (Key[" "] && (player.onGround||player.wallL||player.wallR)) {
            player.velY = 10; // Jump from ground OR wall
            if((player.wallL || player.wallR) && player.velY > -1 && player.jumpAmmounts > 0){
                player.mirrorY = -player.mirrorY;
                player.velX = player.mirrorY * 10;
                player.jumpAmmounts--;
            }
        }
        if(player.onGround){
            player.velX += -player.velX / 20; // Friction
            player.jumpAmmounts = 5;
        }
        player.onGround = false;
        player.wallL = false;
        player.wallR = false;
        player.hittingCeiling = false;
        player.checkCollision();
        player.velY -= 0.5; // Gravity applied AFTER collision resolution
        if(player.colliding){
            player.resolveCollision();
        }
        this.x += this.velX;
        this.y += this.velY;
    }
};

player.images[0].src = playerData.image;

// Camera setup
let camera = {
    x: player.x,
    y: player.y
};

// Cursor setup
const Cursor = new cursor(canvas);

// Level data
window.lvl1 = new createLevel(1000, 700);
let existingBlocks = [];

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
                if (lvl1[y][x] != 0 &&
                    y <= Math.floor(((window.innerHeight) - camera.y - (window.innerHeight / 2)) / 50) &&
                    y >= Math.floor(((0) - camera.y - (window.innerHeight / 2)) / 50) &&
                    x <= Math.floor(((window.innerWidth) - camera.x - (window.innerWidth / 2)) / 50) &&
                    x >= Math.floor(((0) - camera.x - (window.innerWidth / 2)) / 50)
                ) {
                    currentBlock++;
                    let block = await register.blocks[String(register.blockIds[lvl1[y][x]]).replace(/_(.)/gm, (match, p1) => p1.toUpperCase())].place(x, y, ctx, camera);
                    existingBlocks.push([block.x, block.y, block.w, block.h]);
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
    },
    fps: 60,
    lastUpdateTime: 0,
    currentTime: 0
};

let cursorPosition;

document.addEventListener("mousedown", (event) => {
    console.log("player pos: ", (Math.floor(-player.x / 50) * 50), (Math.floor(-player.y / 50) * 50), "cursor pos:", cursorPosition[1] * 50, cursorPosition[0] * 50);
    if (lvl1[cursorPosition[0]][cursorPosition[1]] != (0 | 4) && event.button == 0) {
        lvl1[cursorPosition[0]][cursorPosition[1]] = 0;
    } else if (lvl1[cursorPosition[0]][cursorPosition[1]] == 0 && event.button == 2 &&
        !((Math.floor(-player.x / 50) * 50) == cursorPosition[1] * 50 &&
            (Math.floor(-player.y / 50) * 50) == cursorPosition[0] * 50)) {
        lvl1[cursorPosition[0]][cursorPosition[1]] = player.currentBlock;
    }
});

document.addEventListener("keypress", (e) => {
    //console.log(/[1-9]/g.test((e.key)));
    //console.log(e.key);
    //console.log(register.blockIds.length>Number.parseInt(e.key));
    if (/([^04[a-zA-Z])/g.test(e.key) && register.blockIds.length > Number.parseInt(e.key)) {
        player.currentBlock = Number.parseInt(e.key);
        //console.log(player.currentBlock);
    }
});

document.addEventListener("contextmenu", (event) => {
    event.preventDefault();
});

player.x = -(lvl1[0].length / 2) * 50;

// Main Draw Loop
async function draw(currentTime) {
    world.currentTime = currentTime;

    await world.renderWorld(draw);
    ctx.strokeStyle = "black";
    cursorPosition = Cursor.drawCursor(ctx, camera);
    ctx.beginPath();

    player.init(); // Update player

    ctx.fill();
    ctx.stroke();
    //ctx.fillText(JSON.stringify(player.collisions.direction), 16, 200, 2000);

    camera.x = player.x;
    camera.y = player.y;
    player.controls();
}

requestAnimationFrame(draw); // Initial call
window.canvas = canvas;
window.ctx = ctx;
window.player = player;
window.camera = camera;
window.REGISTER = REGISTER;
window.register = register;
window.world = world;
