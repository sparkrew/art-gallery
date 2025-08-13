/*
Genuary: Bauhaus (?)

"At the core of Bauhaus art were principles that championed simplicity and utility:
- Unity of art and technology,
- Clean, abstract styles,
- Minimalism with emphasis on rationality."
from: https://filmlifestyle.com/what-is-bauhaus/

What if I:

- recreate my rubik's cube in a bauhaus style?
- can make my cube bigger?
- change the objects and their sizes randomly?
- change the transparancy?
- remove some objects and add random strokes?
- create some projections?

Is it already Bauhaus?

Rafaela Pinter
*/

var sketch = function (p) {
  // Playground variables
  // --------------------
  // Cube dimensions
  let dim_cube = 7;

  // Objects Grid
  let ext_space = 100;
  let int_space = 10;

  // Objects perimeter
  let round_edges = 50;
  let no_stroke = false;
  let stroke_weight = 1;
  let stroke_color = 0;

  // Object color
  let transp = 400;
  let no_fill = true;

  // Objects repetition
  let max_forms_square = 10;
  let max_forms_triangle = 10;
  let max_forms_circles = 10;
  let form_sep = 1.01;

  // Objects Randomness
  let random_sizes = true;
  let inc_limit = 50;
  let random_stroke = true;
  let random_objects = false;
  let object_number = 0; // Square:0 | Circle:1 | Triangle:2

  // Hidden objects
  let max_random_number = 5;

  // Text
  let add_text = false;

  // Background
  let mode = "white";
  let r = 237;
  let g = 237;
  let b = 237;

  // Canvas variables
  // ---------------
  let width;
  let height;
  let color_array = [];
  let sq_size;
  var cube;

  // Setup function
  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;

    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    sq_size = (width - ext_space * 2 - int_space * (dim_cube - 1)) / dim_cube;
    p.noLoop();

    // Probabilistic colors
    color_array = [
      p.color(157, 39, 25, transp), // red
      p.color(21, 64, 132, transp), // blue
      p.color(215, 180, 24, transp), // yellow
      p.color(237, 237, 237, transp), // white
      // color(237, 237, 237, transp), // white
      // color(237, 237, 237, transp), // white
      // color(237, 237, 237, transp), // white
      // color(34, 34, 34, transp), // black
      // color(249, 91, 19, transp), // orange
      // color(245, 245, 245), // white no transp
    ];

    cube = new Cube(
      dim_cube,
      ext_space,
      int_space,
      round_edges,
      color_array,
      sq_size
    );
  };

  // Draw function
  p.draw = function () {
    // Control background color
    if (mode == "dark") {
      r = 50;
      g = 50;
      b = 50;
    } else if (mode == "random") {
      r = p.random(0, 255);
      g = p.random(0, 255);
      b = p.random(0, 255);
    }
    p.background(p.color(r, g, b));

    p.strokeWeight(stroke_weight);
    for (let i = 0; i < cube.objects.length; i++) {
      cube.objects[i].display();
    }
    txtBottom();
  };

  function txtBottom() {
    // Font
    font = "Raleway";
    p.textFont(font);

    if (add_text) {
      // Control dark mode colors
      if (mode == "dark") {
        cor = 200;
      } else {
        cor = 30;
      }
      p.push();
      // Line
      p.translate(0, height * 0.875);
      p.stroke(cor);
      p.strokeWeight(height * 0.005);
      p.strokeCap(SQUARE);
      p.line(100, 0, 700, 0);
      p.noStroke();

      // Text
      p.fill(cor, cor, cor, 255);
      p.textAlign(100);
      p.textSize(height * 0.025);
      p.text("is it already bauhaus?", 100, height * 0.031);
      p.pop();
    }
  }

  // "Cube" data structure
  class Cube {
    constructor(
      shape,
      ext_space,
      int_space,
      round_edges,
      color_array,
      sq_size
    ) {
      this.shape = shape;
      this.ext_space = ext_space;
      this.int_space = int_space;
      this.round_edges = round_edges;
      this.color_array = color_array;
      this.sq_size = sq_size;
      this.create_objects();
    }

    create_objects() {
      this.objects = [];
      for (let i = 0; i < this.shape; i++) {
        for (let j = 0; j < this.shape; j++) {
          // Random form selection
          let randint;
          if (random_objects) {
            randint = floor(random(max_random_number));
          } else {
            randint = object_number;
          }
          //console.log(randint);

          if (randint === 0) {
            // Push square
            this.objects.push(
              new Square(
                i,
                j,
                this.sq_size,
                this.round_edges,
                this.color_array,
                this.ext_space,
                this.int_space
              )
            );
          } else if (randint === 1) {
            // Push circle
            this.objects.push(
              new Circle(
                i,
                j,
                this.sq_size,
                this.round_edges,
                this.color_array,
                this.ext_space,
                this.int_space
              )
            );
          } else if (randint === 2) {
            // Push triangle
            this.objects.push(
              new Triangle(
                i,
                j,
                this.sq_size,
                this.round_edges,
                this.color_array,
                this.ext_space,
                this.int_space
              )
            );
          }
        }
      }
    }
  }

  // Class for objects
  class GeometricForm {
    constructor(x, y, size, round_corner, color_array, ext_space, int_space) {
      this.x = x;
      this.y = y;
      this.size = size;
      this.round_corner = round_corner;
      this.color_array = color_array;
      this.ext_space = ext_space;
      this.int_space = int_space;

      // Functions
      this.dimensions();
      this.fill_object();
      this.object_stroke();
    }

    dimensions() {
      // Dimensions of the object
      this.xmin = this.ext_space + this.x * (this.size + this.int_space);
      this.xmax = this.xmin + this.size;
      this.ymin = this.ext_space + this.y * (this.size + this.int_space);
      this.ymax = this.ymin + this.size;
    }

    fill_object() {
      // Fill color
      this.fill_color = p.random(this.color_array);
    }

    object_stroke() {
      // Control stroke
      if (no_stroke == false) {
        if (mode == "dark") {
          stroke_color = 255 - stroke_color;
        }
        p.stroke(stroke_color);
      } else {
        p.noStroke();
      }
    }
  }

  // Circle data structure
  class Circle extends GeometricForm {
    display() {
      // Random stroke
      if (no_stroke == false) {
        if (random_stroke == true && p.floor(p.random(3)) == 2) {
          p.stroke(stroke_color);
        } else if (random_stroke == false) {
          p.p.noStroke();
        }
      } else {
        p.noStroke();
      }

      // Random size increment
      let inc = 0;
      if (random_sizes) {
        inc = p.random(-inc_limit, inc_limit);
      }

      // Multiple objects
      for (let i = 0; i < max_forms_circles; i++) {
        i = i * form_sep;

        if (no_fill) {
          p.noFill();
        } else {
          p.fill(this.fill_color);
        }
        circle(
          this.xmin + this.size / 2 + i,
          this.ymin + this.size / 2 + i,
          this.size + inc
        );
      }
    }
  }

  // Triangle data structure
  class Triangle extends GeometricForm {
    display() {
      // Triangle points
      let x1, y1, x2, y2, x3, y3;

      // Default triangle
      x1 = this.xmin;
      y1 = this.ymax;
      x2 = this.xmax;
      y2 = this.ymax;
      x3 = (this.xmin + this.xmax) / 2;
      y3 = this.ymin;

      // Random side of the triangle
      let randint = p.floor(p.random(3));

      // Other side
      if (randint === 1) {
        y1 = this.ymin;
        y2 = this.ymin;
        x3 = (this.xmin + this.xmax) / 2;
        y3 = this.ymax;
      }
      // Other side
      else if (randint === 2) {
        y1 = this.ymin;
        x2 = this.xmin;
        x3 = this.xmax;
        y3 = (this.ymin + this.ymax) / 2;
      }

      // Multiple forms
      for (let i = 0; i < max_forms_triangle; i++) {
        i = i * form_sep;
        // Displaying figure
        if (no_fill) {
          p.noFill();
        } else {
          p.fill(this.fill_color);
        }
        triangle(x1 - i, y1 - i, x2 - i, y2 - i, x3 - i, y3 - i);
      }
    }
  }

  // Squares data structure
  class Square extends GeometricForm {
    display() {
      // Random size increment
      let inc = 0;
      if (random_sizes) {
        inc = p.random(-inc_limit, inc_limit);
      }

      // Multiple objects
      for (let i = 0; i < max_forms_square; i++) {
        i = i * form_sep;
        // Drawing object
        if (no_fill) {
          p.noFill();
        } else {
          p.fill(this.fill_color);
        }

        if (round_edges != 0) {
          p.rect(
            this.xmin + i,
            this.ymin + i,
            this.size + inc + i,
            this.size + inc + i,
            this.round_corner
          );
        } else {
          rect(this.xmin + i, this.ymin + i, this.size + inc);
        }
      }
    }
  }

  /*
maybe the code is also bauhaus?
*/
};
