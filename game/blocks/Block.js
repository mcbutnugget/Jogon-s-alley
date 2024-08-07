class Block {
    constructor(settings) {
        this.settings = settings;
        this.model = null;
        this.parentModel = null;
        this.image = new Image();

        // Fetch the model and parent model JSON files
        this.loadModel();
    }

    async loadModel() {
        try {
            const modelUrl = `./models/blocks/${this.settings.id}.json`;
            const modelResponse = await fetch(modelUrl);
            this.model = await modelResponse.json();
            console.log(`Loaded model for ${this.settings.id}`, this.model);

            if (this.model.parent) {
                const parentModelUrl = `./models/${this.model.parent}.json`;
                const parentModelResponse = await fetch(parentModelUrl);
                this.parentModel = await parentModelResponse.json();
                console.log(`Loaded parent model for ${this.settings.id}`, this.parentModel);
            }

            // Preload image
            this.image.src = `./textures/${this.model.texture}.png`;
            await new Promise((resolve, reject) => {
                this.image.onload = resolve;
                this.image.onerror = reject;
            });
            console.log(`Loaded image for ${this.settings.id}`);
        } catch (error) {
            console.error(`Failed to load model or image for ${this.settings.id}`, error);
        }
    }

    async place(blkX, blkY, ctx, cam) {
        // Wait for the model and parent model to be loaded
        if (!this.model || !this.image.complete) {
            await this.loadModel();
        }

        //console.log("the parent model", this.parentModel?.cubes);

        this.parentModel?.cubes?.forEach((obj)=>{
            const width = obj?.width || 50;
            const height = obj?.height ||50;
            const x = obj?.x || 0;
            const y = obj?.y || 0;
            ctx.drawImage(
                this.image,Math.floor(blkX) * 50 + cam.x + (window.innerWidth / 2) + x, //get the block's precieved X
                Math.floor(blkY) * 50 + cam.y + (window.innerHeight / 2) + y, //do the same for the Y
                width, height); //just set it to the width and height

        });

        const realPosition = {
            x: blkX * 50,
            y: blkY * 50,
            w:50,
            h:50
        };

        
        return realPosition;
    }
}

export default Block;
