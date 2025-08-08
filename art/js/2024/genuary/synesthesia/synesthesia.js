// genuary prompts attempted
// Jan 1 particles, lots of them ?
// Jan 2 No palettes. ?
// Jan 8 Chaotic system ?
// Jan 9 ASCII ?
// Jan 16 Draw 10000 of something ?
// Jan 19 Flocking
// Jan 21 Use a library that you haven’t used before.
var sketch = function (p) {
  const words = [
    "#000ABA",
    "#000AB5",
    "#ACCE55",
    "#000ACE",
    "#AC1D00",
    "#000ADD",
    "#000AD0",
    "#0AD0BE",
    "#000AD2",
    "#000A1D",
    "#A1DE00",
    "#0A51DE",
    "#000A55",
    "#A55E55",
    "#000A20",
    "#000BAA",
    "#000BAD",
    "#BA5E00",
    "#0BA5E5",
    "#0BA51C",
    "#0BA515",
    "#BA5500",
    "#000BED",
    "#000BEE",
    "#BEEF00",
    "#BE51DE",
    "#B1A500",
    "#B1A5ED",
    "#000B1B",
    "#000B1D",
    "#000B10",
    "#000B15",
    "#000B12",
    "#000B0A",
    "#000B0B",
    "#000B0D",
    "#000B00",
    "#B05500",
    "#000CAB",
    "#000CAD",
    "#CAFE00",
    "#CA5E00",
    "#0CEA5E",
    "#000CEE",
    "#0C15C0",
    "#000C0B",
    "#C0CA00",
    "#000C0D",
    "#C0DE00",
    "#C0FFEE",
    "#000C00",
    "#000C05",
    "#000C02",
    "#000DAB",
    "#000DAD",
    "#DEAD00",
    "#DEAF00",
    "#000DEB",
    "#DECADE",
    "#DEC1DE",
    "#000DEE",
    "#DEED00",
    "#000DEF",
    "#000D1B",
    "#D1CE00",
    "#000D1D",
    "#000D1E",
    "#000D15",
    "#D15C00",
    "#000D0C",
    "#000D0E",
    "#D0E500",
    "#000D0F",
    "#D05E00",
    "#000D20",
    "#EA5E00",
    "#000EBB",
    "#000EFF",
    "#000E55",
    "#000FAB",
    "#FACE00",
    "#000FAD",
    "#FADE00",
    "#000FED",
    "#000FEE",
    "#FEED00",
    "#000FE2",
    "#000F1B",
    "#000F1D",
    "#000F1E",
    "#000F0B",
    "#000F0E",
    "#F00D00",
    "#0001CE",
    "#0001DE",
    "#1DEA00",
    "#0001FF",
    "#0000AF",
    "#0000BA",
    "#0000B1",
    "#0000B0",
    "#0000CA",
    "#0000DD",
    "#0DD500",
    "#0000DE",
    "#0000FF",
    "#0FF1CE",
    "#00000F",
    "#0005AB",
    "#0005AC",
    "#0005AD",
    "#0005AE",
    "#5AFE00",
    "#0005A1",
    "#5A1D00",
    "#0005A2",
    "#0005EA",
    "#0005EC",
    "#0005ED",
    "#0005EE",
    "#5EED00",
    "#0005E1",
    "#05E12E",
    "#0005E2",
    "#00051B",
    "#00051C",
    "#51DE00",
    "#051DED",
    "#00051F",
    "#000515",
    "#512E00",
    "#0512ED",
    "#00050B",
    "#00050C",
    "#00050D",
    "#50DA00",
    "#50FA00",
    "#000505",
    "#000502",
    "#0002A5",
    "#0002EA",
    "#0002ED",
    "#0002EE",
    "#00020A",
    "#000200",
    "#000222",
    "#ABA000",
    "#AB5000",
    "#ACCE55",
    "#ACE000",
    "#00AC1D",
    "#ADD000",
    "#AD0000",
    "#AD0BE0",
    "#AD2000",
    "#A1D000",
    "#00A1DE",
    "#A51DE0",
    "#A55000",
    "#A55E55",
    "#A20000",
    "#BAA000",
    "#BAD000",
    "#00BA5E",
    "#BA5E50",
    "#BA51C0",
    "#BA5150",
    "#00BA55",
    "#BED000",
    "#BEE000",
    "#00BEEF",
    "#BE51DE",
    "#00B1A5",
    "#B1A5ED",
    "#B1B000",
    "#B1D000",
    "#B10000",
    "#B15000",
    "#B12000",
    "#B0A000",
    "#B0B000",
    "#B0D000",
    "#B00000",
    "#00B055",
    "#CAB000",
    "#CAD000",
    "#00CAFE",
    "#00CA5E",
    "#CEA5E0",
    "#CEE000",
    "#C15C00",
    "#C0B000",
    "#00C0CA",
    "#C0D000",
    "#00C0DE",
    "#C0FFEE",
    "#C00000",
    "#C05000",
    "#C02000",
    "#DAB000",
    "#DAD000",
    "#00DEAD",
    "#00DEAF",
    "#DEB000",
    "#DECADE",
    "#DEC1DE",
    "#DEE000",
    "#00DEED",
    "#DEF000",
    "#D1B000",
    "#00D1CE",
    "#D1D000",
    "#D1E000",
    "#D15000",
    "#00D15C",
    "#D0C000",
    "#D0E000",
    "#00D0E5",
    "#D0F000",
    "#00D05E",
    "#D20000",
    "#00EA5E",
    "#EBB000",
    "#EFF000",
    "#E55000",
    "#FAB000",
    "#00FACE",
    "#FAD000",
    "#00FADE",
    "#FED000",
    "#FEE000",
    "#00FEED",
    "#FE2000",
    "#F1B000",
    "#F1D000",
    "#F1E000",
    "#F0B000",
    "#F0E000",
    "#00F00D",
    "#1CE000",
    "#1DE000",
    "#001DEA",
    "#1FF000",
    "#0AF000",
    "#0BA000",
    "#0B1000",
    "#0B0000",
    "#0CA000",
    "#0DD000",
    "#000DD5",
    "#0DE000",
    "#0FF000",
    "#0FF1CE",
    "#00F000",
    "#5AB000",
    "#5AC000",
    "#5AD000",
    "#5AE000",
    "#005AFE",
    "#5A1000",
    "#005A1D",
    "#5A2000",
    "#5EA000",
    "#5EC000",
    "#5ED000",
    "#5EE000",
    "#005EED",
    "#5E1000",
    "#5E12E0",
    "#5E2000",
    "#51B000",
    "#51C000",
    "#0051DE",
    "#51DED0",
    "#51F000",
    "#515000",
    "#00512E",
    "#512ED0",
    "#50B000",
    "#50C000",
    "#50D000",
    "#0050DA",
    "#0050FA",
    "#505000",
    "#502000",
    "#2A5000",
    "#2EA000",
    "#2ED000",
    "#2EE000",
    "#20A000",
    "#200000",
    "#222000",
    "#0FF1C3",
    "#C0FF33",
    "#D3C1D3",
    "#D3C4D3",
    "#4CC355",
    "#6351D3",
    "#61453D",
    "#455355",
    "#F00D1E",
  ];

  //from https://p5js.org/examples/objects-array-of-objects.html
  let bugs = [];
  let width;
  let height;

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;

    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.noFill();
    p.stroke(0);
    p.frameRate(10);
    img = p.loadImage("../art/js/2024/genuary/synesthesia/small.JPG");
    //img = loadImage('assets/hedgehog.png');
    tenthousand = false;
    flock_adj = 1;
    if (tenthousand) {
      p.stroke(0);
      p.frameRate(10);
      num_objects = 10000;
      min_size = 1;
      max_size = 5;
    } else {
      // just number of words in list
      p.stroke(255);
      p.frameRate(30);
      num_objects = words.length;
      min_size = 5;
      max_size = 9;
    }

    for (let i = 0; i < num_objects; i++) {
      bugs.push(new Jitter(words[i % words.length]));
    }
  };

  p.draw = function () {
    p.background("#B1A5ED");
    for (let i = 0; i < bugs.length; i++) {
      bugs[i].move();
      bugs[i].display();
    }

    if (p.mouseIsPressed) {
      for (let i = 0; i < bugs.length; i++) {
        bugs[i].move();
        bugs[i].displaytext();
      }
    } else {
      for (let i = 0; i < bugs.length; i++) {
        bugs[i].move();
        bugs[i].display();
      }
    }

    if (p.keyIsPressed) {
      p.set(0, 0, img);
    }
  };

  // Jitter class from https://p5js.org/examples/objects-array-of-objects.html
  class Jitter {
    constructor(colour) {
      this.x = p.random(width);
      this.y = p.random(height);
      //flock is based on length of word (sort of)
      this.flock = colour.replaceAll("0", "").length;
      this.diameter = p.random(min_size, max_size) * this.flock;
      this.speed = 0.1 * this.flock * flock_adj;
      this.color = p.color(colour);
      this.word = colour;
    }

    move() {
      this.x += p.random(-this.speed, this.speed);
      this.y += p.random(-this.speed, this.speed);
    }

    display() {
      p.fill(this.color);
      p.ellipse(this.x, this.y, this.diameter, this.diameter);
      //rect(this.x,this.y,this.x+3,this.y+3);
    }
    displaytext() {
      p.fill(this.color);
      p.ellipse(this.x, this.y, this.diameter, this.diameter);
      //rect(this.x,this.y,this.x+3,this.y+3);
      p.text(this.word, this.x, this.y);
    }
  }
};
