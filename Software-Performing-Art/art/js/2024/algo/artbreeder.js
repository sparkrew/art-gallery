var sketch = function (p) {
  // Global variables

  let population = [];
  const MAX_POPULATION_SIZE = 200; // Maximum number of artworks in the population
  let colorPalette; // Color palette for the artwork
  let alpha = 127; // 100;  // Semi-transparent

  //  The Setup function runs once when the program starts. It creates the canvas, color mode, and color palette.
  // It also creates the initial population of two artworks.

  let width;
  let height;

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height, p.WEBGL);
    canvas.parent("artwork-container");
    // Set color mode to HSB
    p.colorMode(p.HSB, 360, 100, 100);

    // Switch to RGB mode
    p.colorMode(p.RGB, 255);

    // Define a vibrant color palette with transparency
    colorPalette = [
      //color(255, 105, 97, alpha),  // Coral
      p.color(255, 179, 71, alpha), // Orange
      p.color(255, 223, 89, alpha), // Yellow
      p.color(128, 203, 196, alpha), // Teal
      p.color(119, 190, 119, alpha), // Green
      //color(158, 158, 158, alpha), // Grey
      p.color(255, 82, 82, alpha), // Red
      p.color(156, 39, 176, alpha), // Purple
      p.color(33, 150, 243, alpha), // Blue
      p.color(0, 188, 212, alpha), // Cyan
      p.color(76, 175, 80, alpha), // Light Green
      p.color(255, 235, 59, alpha), // Light Yellow
      //color(121, 85, 72, alpha),   // Brown
      p.color(96, 125, 139, alpha), // Blue Grey
      p.color(255, 87, 34, alpha), // Deep Orange
      p.color(233, 30, 99, alpha), // Pink
      p.color(103, 58, 183, alpha), // Deep Purple
      p.color(0, 150, 136, alpha), // Teal
      p.color(205, 220, 57, alpha), // Lime
      //color(255, 193, 7, alpha)    // Amber
    ];

    // Switch back to HSB mode
    p.colorMode(p.HSB, 360, 100, 100);

    // Create the initial population with two different artworks
    let artwork1 = new Artwork();
    let artwork2 = new Artwork();

    // Ensure the two artworks are different
    while (
      artwork1.form.shape === artwork2.form.shape &&
      artwork1.form.color.toString() === artwork2.form.color.toString()
    ) {
      artwork2 = new Artwork();
    }

    population = [artwork1, artwork2];
  };
  // Add fitness function
  function calculateFitness(artwork) {
    // Switch to RGB mode to calculate brightness
    p.colorMode(p.RGB, 255);
    // Calculate the brightness of the artwork's color
    let brightnessValue = brightness(artwork.form.color);
    // Switch back to HSB mode
    p.colorMode(p.HSB, 360, 100, 100);
    // Return the brightness value as the fitness
    return brightnessValue;
  }
  p.draw = function () {
    // Set the background color
    p.background(0);
    // Add ambient light
    p.ambientLight(100);

    // Rotate the scene
    p.rotateX(p.frameCount * 0.01);
    p.rotateY(p.frameCount * 0.01);

    // Draw each artwork in the population
    for (let artwork of population) {
      artwork.draw();
    }

    // Every 100 frames
    if (p.frameCount % 100 === 0) {
      // If the population size has reached the maximum
      if (population.length >= MAX_POPULATION_SIZE) {
        // Sort the population by fitness (brightness)
        // The sort function compares two artworks a and b
        // If the result is positive, b is sorted before a
        // If the result is negative, a is sorted before b
        // So this line sorts the population in descending order of fitness
        population.sort((a, b) => calculateFitness(b) - calculateFitness(a));
        // While the population size is above the maximum
        while (population.length > MAX_POPULATION_SIZE) {
          // Remove the artwork with the lowest fitness from the population
          // The pop function removes the last element from an array
          // So this line removes the artwork with the lowest fitness
          population.pop();
        }
      } else {
        // If the population size has not reached the maximum
        // Select two parents randomly from the population
        let parentA = p.random(population);
        let parentB = p.random(population);
        // Create a child by crossing over the parents
        let child = parentA.crossover(parentB);
        // Mutate the child
        child.mutate();
        // Add the child to the population
        population.push(child);
      }
    }
  };

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  class Artwork {
    constructor() {
      this.form = new Form();
    }

    draw() {
      this.form.draw();
    }

    crossover(other) {
      let child = new Artwork();
      child.form = this.form.crossover(other.form);
      return child;
    }

    mutate() {
      this.form.mutate();
    }
  }

  class Form {
    constructor() {
      // Each form has a random position, size, and color from the palette
      this.x = p.random(-width / 4, width / 4); // Random x position within the canvas
      this.y = p.random(-height / 4, height / 4); // Random y position within the canvas
      this.z = p.random(-200, 200); // Random z position for 3D space
      this.size = p.random(50, 200); // Random size for the form
      this.color = colorPalette[p.floor(p.random(colorPalette.length))]; // Random color from the palette

      // Random shape for the form
      this.shape = p.random([
        "sphere",
        "cone",
        "cylinder",
        "torus",
        "box",
        "pyramid",
      ]);

      // Random rotation variables for the form
      this.rotationX = p.random(p.TWO_PI);
      this.rotationY = p.random(p.TWO_PI);
      this.rotationSpeedX = p.random(-0.01, 0.01);
      this.rotationSpeedY = p.random(-0.01, 0.01);

      // Random movement variables for the form
      this.movementX = p.random(-2, 2);
      this.movementY = p.random(-2, 2);
      this.movementZ = p.random(-2, 2);
    }

    draw() {
      p.push(); // Save current drawing style
      p.translate(this.x, this.y, this.z); // Move to form's position
      p.rotateX(this.rotationX); // Rotate around X-axis
      p.rotateY(this.rotationY); // Rotate around Y-axis
      p.fill(this.color); // Set fill color to form's color

      // Draw the form based on its shape
      if (this.shape === "sphere") {
        p.sphere(this.size);
      } else if (this.shape === "cone") {
        p.cone(this.size, this.size * 2);
      } else if (this.shape === "cylinder") {
        p.cylinder(this.size, this.size * 2);
      } else if (this.shape === "torus") {
        p.torus(this.size, this.size / 2);
      } else if (this.shape === "box") {
        p.box(this.size);
      } else if (this.shape === "pyramid") {
        p.cone(this.size, this.size * 2, 4); // A pyramid is a cone with 4 sides
      }
      p.pop(); // Restore previous drawing style

      // Update rotation
      this.rotationX += this.rotationSpeedX;
      this.rotationY += this.rotationSpeedY;

      // Update position
      this.x += this.movementX;
      this.y += this.movementY;
      this.z += this.movementZ;

      // Boundary check and reverse direction if form is out of bounds
      if (this.x > width / 2 || this.x < -width / 2) {
        this.movementX *= -1;
      }
      if (this.y > height / 2 || this.y < -height / 2) {
        this.movementY *= -1;
      }
      if (this.z > 200 || this.z < -200) {
        this.movementZ *= -1;
      }
    }

    // Method to create a child form from two parent forms
    crossover(other) {
      // Create a new form object for the child
      let child = new Form();

      // Choose the shape for the child randomly from one of the parents
      child.shape = p.random([this.shape, other.shape]);

      // The size of the child is the average of the sizes of the parents
      child.size = (this.size + other.size) / 2;

      // Mix the colors of the parents to create the child's color
      let parentColor1 = this.color.levels;
      let parentColor2 = other.color.levels;
      let childColor = p.color(
        (parentColor1[0] + parentColor2[0]) / 2, // Average red component
        (parentColor1[1] + parentColor2[1]) / 2, // Average green component
        (parentColor1[2] + parentColor2[2]) / 2, // Average blue component
        alpha // Alpha component for transparency
      );
      child.color = childColor;

      // Return the new child form
      return child;
    }

    // Method to mutate the form
    mutate() {
      // Each attribute has a small chance of being changed

      // 10% chance to change the shape
      if (p.random() < 0.1) {
        this.shape = p.random([
          "sphere",
          "cone",
          "cylinder",
          "torus",
          "box",
          "pyramid",
        ]);
      }

      // 10% chance to change the size
      if (p.random() < 0.1) {
        this.size = p.random(50, 200);
      }

      // 50% chance to change the color
      if (p.random() < 0.5) {
        this.color = p.random(colorPalette);
      }
    }
  }
};
