var sketch = function(p) {

  function normalizedRandoms(n, min = 0.6, max = 1.4) {
    let vals = [];
    let sum = 0;

    for (let i = 0; i < n; i++) {
      let v = p.random(min, max);
      vals.push(v);
      sum += v;
    }

    return vals.map(v => v / sum);
  }

  p.setup = function() {
    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let canvas = p.createCanvas(w, h);
    canvas.parent("artwork-container");
    p.rectMode(p.CORNER);
    p.noLoop();
  };

  p.draw = function() {
    p.background(230);

    p.stroke(125);
    p.strokeWeight(2.5);

    const palettes = [
      {
        black: "#0b0b0b",
        white: "#f5fbff",
        blue: "#7fb3d5",
        darkBlue: "#1f4f63",
        olive: "#9fb7a0",
        rust: "#a64b3a"
      },
      {
        black: "#1a1a1a",
        white: "#fffaf6",
        blue: "#a8d0e6",
        darkBlue: "#5b6b77",
        olive: "#d6d6a3",
        rust: "#f2b5a0"
      },
      {
        black: "#161411",
        white: "#f7f3ee",
        blue: "#5b7b8c",
        darkBlue: "#2e3d44",
        olive: "#8c7e58",
        rust: "#8c3b2b"
      }
    ];

    const palette = p.random(palettes);

    // columns
    let colRatios = normalizedRandoms(6);
    let col1W = colRatios[0] * p.width;
    let col2W = colRatios[1] * p.width;
    let col3W = colRatios[2] * p.width;
    let col4W = colRatios[3] * p.width;
    let col5W = colRatios[4] * p.width;
    let col6W = colRatios[5] * p.width;

    // rows
    let rowRatios = normalizedRandoms(5);
    let row1H = rowRatios[0] * p.height;
    let row2H = rowRatios[1] * p.height;
    let row3H = rowRatios[2] * p.height;
    let row4H = rowRatios[3] * p.height;
    let row5H = rowRatios[4] * p.height;


    // column 1
    p.fill(palette.white);
    p.rect(0, 0, col1W, row1H);
    p.fill(palette.blue);
    p.rect(0, row1H, col1W, row2H);
    p.fill(palette.blue);
    p.rect(0, row1H + row2H, col1W, row2H);
    p.fill(palette.rust);
    p.rect(0, row1H + row2H + row3H/p.random(1, 5), col1W, 0.15*row3H);
    p.fill(palette.white);
    p.rect(p.random(0.05, 0.7)*col1W, row1H + row2H, 0.28*col1W, row3H);
    p.fill(palette.blue);
    p.rect(0, row1H + row2H + row3H, col1W, row4H);
    p.fill(palette.white);
    p.rect(0, row1H + row2H + row3H + row4H, col1W, row5H);


    // column 2
    p.fill(palette.black);
    p.rect(col1W, 0, col2W, row1H);
    p.fill(palette.black);
    p.rect(col1W, row1H, col2W, row2H + row3H + row4H);
    p.fill(palette.white);
    p.ellipse(col1W + col2W/2, row1H + p.random(0.5,1)*row2H + p.random(0.1, 1.5)*row3H, p.random(0.6, 0.9)*col2W);
    p.fill(palette.blue);
    p.rect(col1W, row1H + row2H + row3H + row4H, col2W, row5H);
    p.fill(palette.white);
    p.rect(col1W, row1H + row2H + row3H + row4H + p.random(0.1,0.8)*row5H, col2W, 0.2*row5H);



    // column 3
    p.fill(palette.white);
    p.rect(col1W + col2W, 0, col3W, row1H);
    p.fill(palette.blue);
    p.rect(col1W + col2W, row1H, col3W, row2H);
    p.fill(palette.olive);
    p.rect(col1W + col2W, row1H + row2H, col3W, row3H);
    p.fill(palette.blue);
    p.ellipse(col1W + col2W + 0.35*col3W, row1H + row2H + 0.26*row3H, 0.425*col3W);
    p.fill(palette.blue);
    p.ellipse(col1W + col2W + 0.35*col3W, row1H + row2H + 0.74*row3H, 0.425*col3W);
    p.fill(palette.white);
    p.rect(col1W + col2W + p.random(0.6,0.7)*col3W, row1H + row2H, col3W, row3H);
    p.fill(palette.black);
    p.rect(col1W + col2W + p.random(0.85,0.9)*col3W, row1H + row2H, 0.15*col3W, row3H);
    p.fill(palette.blue);
    p.rect(col1W + col2W, row1H + row2H + row3H, col3W, row4H);
    p.fill(palette.white);
    p.rect(col1W + col2W, row1H + row2H + row3H + row4H, col3W, row5H);


    // column 4
    p.fill(palette.black);
    p.rect(col1W + col2W + col3W, 0, col4W, row1H);
    p.fill(palette.white);
    p.rect(col1W + col2W + col3W, row1H, col4W, row2H);
    p.fill(palette.darkBlue);
    p.rect(col1W + col2W + col3W, row1H + p.random(0.1, 0.8)*row2H, col4W, 0.275*row2H);
    p.fill(palette.rust);
    p.rect(col1W + col2W + col3W, row1H + row2H, col4W, row3H);
    p.fill(palette.blue);
    p.rect(col1W + col2W + col3W, row1H + row2H + p.random(0.1,0.8)*row3H, col4W, 0.15*row3H);
    p.fill(palette.black);
    p.rect(col1W + col2W + col3W + p.random(0.5,0.75)*col4W, row1H + row2H, col4W, row3H);
    p.fill(palette.white);
    p.rect(col1W + col2W + col3W, row1H + row2H + row3H, col4W, row4H);
    p.fill(palette.blue);
    p.rect(col1W + col2W + col3W, row1H + row2H + row3H + p.random(0.1,0.8)*row4H, col4W, 0.38*row2H);
    p.fill(palette.olive);
    p.rect(col1W + col2W + col3W, row1H + row2H + row3H + row4H, col4W, row5H);


    // column 5
    p.fill(palette.blue);
    p.rect(col1W + col2W + col3W + col4W, 0, col5W, row1H);
    p.fill(palette.blue);
    p.rect(col1W + col2W + col3W + col4W, row1H, col5W, row2H);
    p.fill(palette.white);
    p.rect(col1W + col2W + col3W + col4W, row1H + row2H, col5W, row3H);
    p.fill(palette.olive);
    p.ellipse(col1W + col2W + col3W + col4W + col5W/2, row1H + row2H + row3H/2, 0.6*col5W);
    p.fill(palette.blue);
    p.rect(col1W + col2W + col3W + col4W, row1H + row2H + row3H, col5W, row4H);
    p.fill(palette.black);
    p.rect(col1W + col2W + col3W + col4W + p.random(0.05,0.5)*col5W, row1H + row2H + row3H, 0.5*col5W, row4H);
    p.fill(palette.white);
    p.rect(col1W + col2W + col3W + col4W, row1H + row2H + row3H + row4H, col5W + col6W, row5H);
    p.fill(palette.blue);
    p.rect(col1W + col2W + col3W + col4W, row1H + row2H + row3H + row4H + p.random(0.1,0.8)*row5H, col5W + col6W, 0.225*row5H);

    // column 6
    p.fill(palette.white);
    p.rect(col1W + col2W + col3W + col4W + col5W, 0, col6W, row1H);
    p.fill(palette.darkBlue);
    p.rect(col1W + col2W + col3W + col4W + col5W, p.random(0.05,0.6)*row1H, col6W, 0.33*row1H);
    p.fill(palette.darkBlue);
    p.rect(col1W + col2W + col3W + col4W + col5W, row1H, col6W, row2H);
    p.fill(palette.black);
    p.rect(col1W + col2W + col3W + col4W + col5W, row1H + row2H, col6W, row3H);
    p.fill(palette.white);
    p.ellipse(col1W + col2W + col3W + col4W + col5W + col6W/2, row1H + row2H + row3H/2, 0.75*col6W);
    p.fill(palette.darkBlue);
    p.rect(col1W + col2W + col3W + col4W + col5W, row1H + row2H + row3H, col6W, row4H);
  };

  p.mousePressed = function() {
    p.redraw();
  };

};
