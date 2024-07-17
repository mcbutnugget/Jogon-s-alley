import {Block} from './Block.js'

class SlabBlock extends Block{
    constructor(Settings){
        super(Settings);
    }

    place(x,y,ctx, cam){
        const image = new Image();
        image.src = `../../textures/${this.settings.id}.png`
        const pattern = ctx.createPattern(image,"no-repeat");
        ctx.fillStyle = pattern;
        ctx.fillRect(x*16-cam.x, y*16-cam.y);
        
    }
}