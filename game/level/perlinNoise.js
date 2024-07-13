class perlinNoise {
    generateRandomOrder(count) {
        // Create an array of numbers from 0 to count-1
        const array = Array.from({ length: count }, (_, index) => index);
    
        // Function to shuffle the array (Fisher-Yates shuffle algorithm)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }
    
        // Shuffle the array
        const shuffledArray = shuffleArray(array);
    
        return shuffledArray;
    }
    constructor() {
        this.permutation = this.generateRandomOrder(255);
        this.p = new Array(512);
        for (let i = 0; i < 256; i++) {
            this.p[i] = this.p[i + 256] = this.permutation[i];
        }
    }

    fade(t) {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    lerp(t, a, b) {
        return a + t * (b - a);
    }

    grad(hash, x, y) {
        const h = hash & 7;
        const u = h < 4 ? x : y;
        const v = h < 4 ? y : x;
        return ((h & 1) ? -u : u) + ((h & 2) ? -2 * v : 2 * v);
    }

    noise2D(x, y) {
        // Integer part of x and y
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;

        // Fractional part of x and y
        x -= Math.floor(x);
        y -= Math.floor(y);

        // Fade curves for x and y
        const u = this.fade(x);
        const v = this.fade(y);

        // Hash coordinates of the 4 corners
        const A = this.p[X] + Y;
        const AA = this.p[A];
        const AB = this.p[A + 1];
        const B = this.p[X + 1] + Y;
        const BA = this.p[B];
        const BB = this.p[B + 1];

        // Gradient values from the corners
        const gradAA = this.grad(this.p[AA], x, y);
        const gradAB = this.grad(this.p[AB], x - 1, y);
        const gradBA = this.grad(this.p[BA], x, y - 1);
        const gradBB = this.grad(this.p[BB], x - 1, y - 1);

        // Bilinear interpolation
        return this.lerp(v,
            this.lerp(u, gradAA, gradAB),
            this.lerp(u, gradBA, gradBB)
        );
    }

    generateNoise(width, height, scale) {
        const noise = new Array(height);
        for (let y = 0; y < height; y++) {
            noise[y] = new Array(width);
            for (let x = 0; x < width; x++) {
                noise[y][x] = this.noise2D(x * scale, y * scale);
            }
        }
        return noise;
    }
}
export default perlinNoise;