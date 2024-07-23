import perlinNoise from "./perlinNoise.js";

class createLevel {
    constructor(width, height) {  // Adjust 'scale' for terrain roughness
        this.width = width;
        this.height = height;
        this.scale = 0.6;
        this.noise = new perlinNoise();
        return this.generate();
    }

    generate() {
        const level = [];
        for (let y = 0; y < this.height; y++) {
            let row = [];
            for (let x = 0; x < this.width; x++) {
                // 1D Noise for Terrain Height
                let terrainHeight = this.noise.noise(x * (this.scale/50)) * (this.height/10) + this.height/2;
                //deep stone generation
                let bedrockRandom = this.noise.noise2D(x * 0.8, y * 0.8) * 3 + 3;
                // 2D Noise for Caves (optional)
                let caveNoise = this.noise.noise2D(x * (this.scale/10), y * (this.scale/10)); 

                let blockType;
                 if(y < bedrockRandom){
                    blockType = 4; //deep stone
                }else if (y > terrainHeight) {
                    blockType = 0; // Air
                }else if (caveNoise < 0) { // Adjust threshold for cave density
                   blockType = 0; // Air (cave)
                } else if (y > terrainHeight - 1) {
                    blockType = 3; // Dirt
                } else if (y > terrainHeight - 7) {
                    blockType = 2; // Grass
                } else {
                    blockType = 1; // Stone
                }
                row.push(blockType);
            }
            level.push(row);
        }
        return level.reverse();
    }
}

export default createLevel;