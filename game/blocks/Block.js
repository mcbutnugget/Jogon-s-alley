class Block {
    constructor(settings) {
        this.settings = settings;
        this.model = null;
        this.parentModel = null;

        // Fetch the model and parent model JSON files
        this.loadModel();
    }

    async loadModel() {
        const modelUrl = `/models/blocks/${this.settings.id}.json`;
        const modelResponse = await fetch(modelUrl);
        this.model = await modelResponse.json();

        if (this.model.parent) {
            const parentModelUrl = `/models/${this.model.parent}.json`;
            const parentModelResponse = await fetch(parentModelUrl);
            this.parentModel = await parentModelResponse.json();
        }
    }

    async place(x, y, ctx, cam) {
        // Wait for the model and parent model to be loaded
        if (!this.model) {
            await this.loadModel();
        }

        const width = this.parentModel?.bl1.width || 16;
        const height = this.parentModel?.bl1.height || 16;

        const image = new Image();
        image.src = `/textures/${this.model.texture}.png`;
        image.onload = () => {
            ctx.drawImage(image, x * 50 + cam.x, y * 50 + cam.y, width, height);
        };
        image.onerror = () => {
            console.error(`Failed to load image: /textures/${this.model.texture}.png`);
        };
    }
}

export default Block;
