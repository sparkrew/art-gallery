var sketch = function (p) {
  // Global variable only used here in the orchestrator sketch
  var O_widthexquis,
    O_heightexquis,
    O_canvas,
    O_policeexquise,
    O_sections,
    O_nbsectionshorizontal,
    O_nbsectionsvertical,
    O_configurationexquise,
    O_nbartworks,
    O_allcode;

  // Global variables that can be used in all sketches
  var O_sectionwidth; // Width of a section
  var O_sectionheight; // Height of a section
  var O_sectionduration; // Duration (in frames) for one section animation
  var O_currentsection; // Object that has data for the section that is currently drawing
  var O_counter = 0; // Global frame counter

  p.setup = async function () {
    // Load the font and the configuration file
    O_policeexquise = await p.loadFont("art/js/2025/exquis/asset/FreeMono.otf");
    const response = await fetch("art/js/2025/exquis/exquisite.json");
    O_configurationexquise = await response.json();

    // Get the number of artworks
    O_nbartworks = Object.keys(O_configurationexquise).length;

    let container = document.querySelector(".artwork-container") || p._userNode;
    O_widthexquis = container.offsetWidth;
    O_heightexquis = container.offsetHeight;
    O_canvas = p.createCanvas(O_widthexquis, O_heightexquis);
    O_canvas.parent("artwork-container");

    // Create the canvas
    // O_widthexquis = Math.floor(windowWidth);
    //O_heightexquis = Math.floor(windowHeight); //O_widthexquis / 1.82);
    //O_canvas = createCanvas(O_widthexquis, O_heightexquis);

    // Center the canvas
    /* let x = (windowWidth - O_widthexquis) / 2;
    let y = (windowHeight - O_heightexquis) / 2;
    O_canvas.position(x, y); */
    p.colorMode(p.HSB, 360, 100, 100, 250);

    // Set the duration of a section
    O_sectionduration = 60 * 21;

    // Compute the number of sections their size
    O_nbsectionsvertical = 3;
    O_nbsectionshorizontal = 6; // Math.ceil(O_nbartworks / O_nbsectionsvertical);
    O_sectionwidth = Math.floor(O_widthexquis / O_nbsectionshorizontal);
    O_sectionheight = Math.floor(O_heightexquis / O_nbsectionsvertical);

    // Get the number of artworks
    let nbsketches = Object.keys(O_configurationexquise).length;
    let nbsections = O_nbsectionshorizontal * O_nbsectionsvertical;
    O_nbartworks = nbsketches < nbsections ? nbsketches : nbsections;

    // Initialize all sections and shuffle them
    initsections();
    O_sections = p.shuffle(O_sections);

    // Initialize drawing parameters
    p.textSize(42);
    p.textFont(O_policeexquise);
    p.stroke(0, 0, 100);
    p.pixelDensity(0.5);

    // Shuffle the artworks
    //O_configurationexquise = shuffle(O_configurationexquise);

    // Initialize the artworks
    initallworks();
  };

  async function initallworks() {
    // Initialize the artworks
    let promises = [];
    O_allcode = [];
    let piececode;
    for (let i = 0; i < O_nbartworks; i++) {
      // Initialize all sketches
      O_currentsection = O_sections[i];
      let artCode = O_configurationexquise[i].art_code;
      let promise = window[artCode]["init"]();
      promises.push(promise);
      piececode = await p.loadStrings(artCode + ".js");
      O_allcode.push(piececode);
    }
    await Promise.all(promises);
    onelineCode(O_allcode);
  }

  function initsections() {
    // Initialize some variables
    O_sections = [];
    let x1, y4, id;
    id = 0;

    // Create all sections
    for (let i = 0; i < O_nbsectionshorizontal; i++) {
      for (let j = 0; j < O_nbsectionsvertical; j++) {
        // Check if we are at the beginning of a row
        if (i == 0) {
          y4 = p.random(O_sectionheight * 0.1, O_sectionheight * 0.9);
        } else {
          y4 = O_sections[(i - 1) * O_nbsectionsvertical + j].y2;
        }

        // Check if we are at the beginning of a column
        if (j == 0) {
          x1 = p.random(O_sectionwidth * 0.1, O_sectionwidth * 0.9);
        } else {
          x1 = O_sections[i * O_nbsectionsvertical + (j - 1)].x3;
        }

        // Create the section
        let section = {
          x: i * O_sectionwidth,
          y: j * O_sectionheight,
          x1: x1,
          y1: 0,
          x2: O_sectionwidth,
          y2: p.random(O_sectionheight * 0.1, O_sectionheight * 0.9),
          x3: p.random(O_sectionwidth * 0.1, O_sectionwidth * 0.9),
          y3: O_sectionheight,
          x4: 0,
          y4: y4,
          id: id,
        };

        // Add the section to the list and increment the id
        O_sections.push(section);
        id++;
      }
    }
  }

  p.draw = function () {
    // draw only a grid; used for calibration
    // background(0,0,0); drawsections(true,true);
    // drawcorpse draws the generative exquisite corspe, we use it when the grid is calibrated
    drawcorpse();
    if (index > 0) {
      console.log(
        p.frameRate() + " " + O_configurationexquise[index - 1].art_code
      );
    }
  };

  let index = 0;
  let stablepiece = 0;
  let stablecode = 0;

  function drawcorpse() {
    // Check if we are done with all the artworks
    if (
      O_counter ==
      O_nbsectionshorizontal * O_nbsectionsvertical * O_sectionduration
    ) {
      if (stablepiece < O_sectionduration) {
        stablepiece++;
      } else {
        if (stablecode < O_sectionduration * 2) {
          if (stablecode == 0) {
            p.background(0, 0, 100);
            showcode();
          }
          stablecode++;
        } else {
          p.background(0, 0, 0);
          // Shuffle the artworks and the sequence of sections
          // artworks and sections appear in a different order and location at every loop of the corpse
          O_configurationexquise = p.shuffle(O_configurationexquise);
          O_sections = p.shuffle(O_sections);
          initallworks();
          O_counter = 0;
          index = 0;
          stablepiece = 0;
          stablecode = 0;
        }
      }
      return;
    }

    // Check if we need to initialize a new section
    if (O_counter % O_sectionduration == 0 && index < O_nbartworks) {
      console.log(
        "index: " +
          index +
          "; nb artworks: " +
          O_nbartworks +
          "; nb sections: " +
          O_nbsectionshorizontal * O_nbsectionsvertical +
          "; nb sketches: " +
          Object.keys(O_configurationexquise).length
      );
      O_currentsection = O_sections[index];
      let artCode = O_configurationexquise[index].art_code;
      console.log("drawing " + O_configurationexquise[index].art_code);
      window[artCode]["init"]();
      index++;
    }

    // Draw the current section
    if (O_counter % O_sectionduration > 0) {
      let artCode = O_configurationexquise[index - 1].art_code;
      window[artCode]["draw"]();
    }
    O_counter++;
  }

  function drawsections(flash, showframerate) {
    var s;
    for (index in O_sections) {
      p.push();
      p.stroke(0, 0, 100);
      p.noFill();
      if (flash && p.random() < 0.05) {
        p.fill(0, 0, 100);
      }
      s = O_sections[index];
      p.translate(s.x, s.y);
      p.rect(0, 0, O_sectionwidth, O_sectionheight);
      p.pop();
    }
    if (showframerate) {
      p.push();
      p.fill(0, 0, 0);
      p.noStroke();
      p.rect(
        O_widthexquis * 0.37,
        O_heightexquis * 0.5 - 70,
        O_widthexquis * 0.15,
        84
      );
      p.stroke(110, 100, 100);
      p.fill(110, 100, 100);
      p.text(
        p.frameRate().toFixed(2),
        O_widthexquis * 0.37,
        O_heightexquis * 0.5
      );
      p.pop();
    }
  }

  function showcode() {
    var fSize = 33;
    for (var i in O_sections) {
      var s = O_sections[i];
      p.push();
      p.translate(s.x, s.y);
      p.noStroke();
      p.fill(0, 0, 100);
      p.rect(0, 0, O_sectionwidth, O_sectionheight);
      p.noStroke();
      p.fill(0, 0, 80);
      p.rect(s.x1 - 21, s.y1, 42, 42);
      p.rect(s.x2 - 42, s.y2 - 21, 42, 42);
      p.rect(s.x3 - 21, s.y3 - 42, 42, 42);
      p.rect(s.x4, s.y4 - 21, 42, 42);
      var x, y, c, tw, lineofcode;
      x = 0;
      y = fSize;
      p.textSize(fSize);
      lineofcode = O_allcode[i];
      //stroke(110,100,100);
      p.fill(110, 100, 100);
      for (b in lineofcode) {
        c = lineofcode.charAt(b);
        tw = textWidth(c);
        if (x + tw > O_sectionwidth) {
          x = 0;
          y += fSize + 1;
        }
        p.text(c, x, y);
        x += tw;
      }
      p.pop();
    }
  }

  // receives an array of arrays of strings, where each array the src code of one piece
  // transforms each array of source code into one single string of src code
  // stores each string into O_allcode
  function onelineCode(codearrays) {
    var temparray = [];
    for (i in codearrays) {
      var codestring = "";
      for (j in codearrays[i]) {
        codestring += codearrays[i][j];
      }
      temparray.push(codestring);
    }
    O_allcode = [];
    O_allcode = temparray;
  }

  function windowResized() {
    w = document.documentElement.clientWidth; //width of window that is available for drawing
    h = document.documentElement.clientHeight; //width of window that is available for drawing
    resizeCanvas(w, h);
  }
};
