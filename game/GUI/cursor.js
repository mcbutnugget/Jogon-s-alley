class cursor{
    constructor(canvas, camera){
            canvas.addEventListener("mousemove", (event)=>{
                let canvasRect = canvas.getBoundingClientRect();
                let mouseX = event.clientX- canvasRect.left;
                let mouseY = event.clientY- canvasRect.top;

                this.x = mouseX;
                this.y = mouseY;


            });
    }
    drawCursor(ctx, camera){

        //I want to have a cursor position that is fixed with the world grid
        //we are gonna need a formula for finding the world grid based off block cords instead of real cord
        
        //the formula: blkX * 50 + camera.x + (window.innerWidth / 2)

        //now that we have a block -> real formula, we need to get real -> block formula

        //the inverse formula: Math.floor((this.x - this.camera.x - (window.innerWidth / 2)) / 50)

        //applies the real -> block formula to the cursor
        let worldY = Math.floor((this.y - camera.y - (window.innerHeight / 2)) / 50);
        let worldX = Math.floor((this.x - camera.x - (window.innerWidth / 2)) / 50);

        //applies the block->real formula to the real->block formula
        let newX = Math.floor(worldX) * 50 + camera.x + (window.innerWidth / 2);
        let newY = Math.floor(worldY) * 50 + camera.y + (window.innerHeight/ 2);

        ctx.strokeRect(newX, newY, 50, 50);
        ctx.fillStyle = "black";
        ctx.fillText(`${worldX}, ${worldY}`,0,60,100);
        ctx.fillText(`${newX},${newY}`,0,120,100000);

        return [worldY, worldX];
    }
}


export default cursor;