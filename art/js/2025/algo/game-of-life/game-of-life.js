var sketch = function (p) {
  let cols, rows;
  let grid;
  let resolution = 10;
  let threshold = 0.9;
  let fps = 60;
  let alpha = 10;
  let pg; // Off-screen buffer
  let myShader;

  p.preload = function () {
    myShader = p.loadShader(
      "../art/js/2025/algo/game-of-life/shaders/shader.vert",
      "../art/js/2025/algo/game-of-life/shaders/shader.frag"
    );
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL); // Use WEBGL for shader support
    cols = p.floor(p.width / resolution);
    rows = p.floor(p.height / resolution);
    grid = make2DArray(cols, rows);

    // Initialize grid with random values
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        grid[i][j] = p.floor(p.random(2));
      }
    }

    p.frameRate(fps);
    pg = p.createGraphics(p.width, p.height);
    pg.pixelDensity(1); // Important for shader texture accuracy
  };

  p.draw = function () {
    pg.background(0, alpha);
    pg.noStroke();
    pg.fill(255);

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let x = i * resolution;
        let y = j * resolution;
        if (grid[i][j] === 1) {
          pg.rect(x, y, resolution, resolution);
        }
      }
    }

    // Compute next generation
    let next = make2DArray(cols, rows);
    grid[p.floor(p.random(0, cols - 1))][p.floor(p.random(0, rows - 1))] = 1;

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        let state = grid[i][j];
        let sum = 0;

        for (let xoff = -1; xoff <= 1; xoff++) {
          for (let yoff = -1; yoff <= 1; yoff++) {
            let col = (i + xoff + cols) % cols;
            let row = (j + yoff + rows) % rows;
            sum += grid[col][row];
          }
        }
        sum -= state;

        if (state === 0 && sum === 3) {
          next[i][j] = 1;
        } else if (state === 1 && (sum < 2 || sum > 3)) {
          next[i][j] = 0;
        } else {
          next[i][j] = state;
        }
      }
    }

    grid = next;

    // Apply shader
    p.shader(myShader);
    myShader.setUniform("threshold", threshold);
    myShader.setUniform("resolution", [p.width, p.height]);
    myShader.setUniform("texelSize", resolution);
    myShader.setUniform("tex", pg);

    p.rect(-p.width / 2, -p.height / 2, p.width, p.height);
  };

  function make2DArray(cols, rows) {
    let arr = new Array(cols);
    for (let i = 0; i < cols; i++) {
      arr[i] = new Array(rows).fill(0);
    }
    return arr;
  }
};
