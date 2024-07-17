class perlinNoise {
  constructor() {
      this.permutationTable = this.generatePermutationTable();
  }

  generatePermutationTable() {
      const p = Array.from({length: 256}, (_, i) => i);
      for (let i = p.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [p[i], p[j]] = [p[j], p[i]];
      }
      return p//.concat(p); // Double the table for wrapping
  }

  fade(t) {
      return t * t * t * (t * (t * 6 - 15) + 10); // Smoother interpolation curve
  }

  lerp(t, a, b) {
      return a + t * (b - a);
  }

  grad(hash, x, y, z) {
      const h = hash & 15;
      const u = h < 8 ? x : y;
      const v = h < 4 ? y : h == 12 || h == 14 ? x : z;
      return ((h & 1) == 0 ? u : -u) + ((h & 2) == 0 ? v : -v);
  }

  noise(x) {
      const X = Math.floor(x) & 255;
      const xf = x - Math.floor(x);
      const u = this.fade(xf);

      return this.lerp(u, this.grad(this.permutationTable[X], xf, 0, 0), 
                           this.grad(this.permutationTable[X + 1], xf - 1, 0, 0)) * 2; 
  }

  noise2D(x, y) {
      const X = Math.floor(x) & 255;
      const Y = Math.floor(y) & 255;
      const xf = x - Math.floor(x);
      const yf = y - Math.floor(y);

      const u = this.fade(xf);
      const v = this.fade(yf);

      const A = this.permutationTable[X] + Y;
      const B = this.permutationTable[X + 1] + Y;

      return this.lerp(v, this.lerp(u, this.grad(this.permutationTable[A], xf, yf, 0),
                                        this.grad(this.permutationTable[B], xf - 1, yf, 0)),
                           this.lerp(u, this.grad(this.permutationTable[A + 1], xf, yf - 1, 0),
                                        this.grad(this.permutationTable[B + 1], xf - 1, yf - 1, 0))) * 2;
  }
}

  
  export default perlinNoise;