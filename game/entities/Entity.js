class Entity{
    constructor(settings){
        this.settings = settings;
        this.model = null;
        this.parentModel = null;
        this.image = new Image();

        // Fetch the model and parent model JSON files
        this.loadModel();


    }

    async loadModel() {
        try {
            const modelUrl = `./models/entity/${this.settings.id}.json`;
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
}

export default Entity;