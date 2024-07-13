import perlinNoise from "./perlinNoise.js";

class createLevel{
    constructor(width, height){
        const array = [];
        const thing = 0.07;
        const perlin = new perlinNoise();
        // Initialize layers based on configuration
                const perlinLayer = perlin.generateNoise(width, height, thing);
                //console.table(perlinLayer);
                for (let y = 0; y < height; y++) {
                    if (!array[y]) {
                        array[y] = [];
                    }
                    for (let x = 0; x < width; x++) {
                        if (!array[y][x]) {
                            array[y][x] = 0;
                        }
                        // Assign layer value based on Perlin noise
                        if (perlinLayer[y][x] > 0.1) {
                            array[y][x] = Math.ceil(perlinLayer[y][x]);
                        }
                    }
                }
    
        return array;
    }
}
export default createLevel;