//adapted from https://p5js.org/examples/simulate-l-systems.html
var sketch = function (p) {
  // TURTLE STUFF:
  let x, y; // the current position of the turtle
  let currentangle = 45; // which way the turtle is pointing
  let step = 15; // how much the turtle moves with each 'F'
  let angle = 90; // how much the turtle turns with a '-' or '+'

  // LINDENMAYER STUFF (L-SYSTEMS)
  let thestring = "-"; // "axiom" or start of the string
  let numloops = 5; // how many iterations to pre-compute
  let therules = []; // array for rules
  therules[0] = ["A", "ALPHA"];
  therules[1] = ["B", "BRAVO"];
  therules[2] = ["C", "CHARLIE"];
  therules[3] = ["D", "DELTA"];
  therules[4] = ["E", "ECHO"];
  therules[5] = ["F", "FOXTROT"];
  therules[6] = ["G", "GOLF"];
  therules[7] = ["H", "HOTEL"];
  therules[8] = ["I", "INDIA"];
  therules[9] = ["J", "JULIET"];
  therules[10] = ["K", "KILO"];
  therules[11] = ["L", "LIMA"];
  therules[12] = ["M", "MIKE"];
  therules[13] = ["N", "NOVEMBER"];
  therules[14] = ["O", "OSCAR"];
  therules[15] = ["P", "PAPA"];
  therules[16] = ["Q", "QUEBEC"];
  therules[17] = ["R", "ROMEO"];
  therules[18] = ["S", "SIERRA"];
  therules[19] = ["T", "TANGO"];
  therules[20] = ["U", "UNIFORM"];
  therules[21] = ["V", "VICTOR"];
  therules[22] = ["W", "WHISKEY"];
  therules[23] = ["X", "X-RAY"];
  therules[24] = ["Y", "YANKEE"];
  therules[25] = ["Z", "ZULU"];
  therules[26] = ["-", "THEQUICKBROWNFOXJUMPSOVERTHELAZYDOG"];

  let whereinstring = 0; // where in the L-system are we?

  let width;
  let height;

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.colorMode(p.HSB);
    p.background(0, 0, 0);
    p.stroke(0, 0, 0);

    // start the x and y position at lower-left corner
    x = 1;
    y = height - 1;

    // COMPUTE THE L-SYSTEM
    for (let i = 0; i < numloops; i++) {
      thestring = lindenmayer(thestring);
    }
  };

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  p.draw = function () {
    console.log(thestring);
    // draw the current character in the string:
    drawIt(thestring[whereinstring]);

    // increment the point for where we're reading the string.
    // wrap around at the end.
    whereinstring++;
    if (whereinstring > thestring.length - 1) whereinstring = 0;
  };

  // interpret an L-system
  function lindenmayer(s) {
    let outputstring = ""; // start a blank output string

    // iterate through 'therules' looking for symbol matches:
    for (let i = 0; i < s.length; i++) {
      let ismatch = 0; // by default, no match
      for (let j = 0; j < therules.length; j++) {
        if (s[i] == therules[j][0]) {
          outputstring += therules[j][1]; // write substitution
          ismatch = 1; // we have a match, so don't copy over symbol
          break; // get outta this for() loop
        }
      }
      // if nothing matches, just copy the symbol over.
      if (ismatch == 0) outputstring += s[i];
    }

    return outputstring; // send out the modified string
  }
  // do as sliding window ("size of snake") make it random
  // this is a custom function that draws turtle commands
  function drawIt(k) {
    // do as sliding window ("size of snake") make it random
    p.background(0, 0, 0, p.random(0, 5) * 0.001);
    huemax = 360;
    huemin = 0;
    if (k == "A") {
      currentangle += angle; // turn left
      huemax = 200;
      huemin = 180;
    } else if (k == "E") {
      currentangle -= angle; // turn right
      huemax = 225;
      huemin = 275;
    } else if (k == "I") {
      currentangle += angle / 2;
      huemax = 250;
      huemin = 295;
    } else if (k == "O") {
      currentangle -= angle / 2;
      huemin = 170;
      huemax = 195;
    } else if (k == "U") {
      currentangle += angle / 4;
      huemin = 25;
      huemax = 75;
    } else if (k == "Y") {
      currentangle -= angle;
      huemin = 0;
      huemax = 20;
    } else {
      // polar to cartesian based on step and currentangle:
      let x1 = x + step * p.cos(p.radians(currentangle));
      let y1 = y + step * p.sin(p.radians(currentangle));
      p.line(x, y, x1, y1); // connect the old and the new
      //store these lines and use slice to take only last 50 line
      // update the turtle's position:
      x = x1;
      if (x > width || x < 0) {
        x = 0;
      }
      y = y1;
      if (y < 0 || y > height) {
        y = height - 1;
      }
      ratio = (k.charCodeAt(0) - 64) / 27;
      huepoint = p.lerp(0, 360, ratio);
      huemin = huepoint - 5;
      huemax = huepoint + 5;
    }

    // give me some random color values:

    let h = p.random(huemin, huemax);
    let s = p.random(2, 100);
    let b = p.random(1, 100);
    let a = p.random(1, 100);

    // pick a gaussian (D&D) distribution for the radius:
    let radius = 0;
    radius += p.random(0, 5);
    radius += p.random(0, 15);
    radius += p.random(0, 25);
    radius = radius / 3;

    // draw the stuff:
    //fill(r, g, b, a);
    //stroke(r, g, b, a);
    p.fill(h, s, b, a);
    //stroke(h, s, b, a);
    p.ellipse(x, y, radius, radius);
    p.stroke(0, 0, 0);
  }
};
