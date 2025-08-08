var sketch = function (p) {
  // de quoi sera fait l'avenir
  let travelZ = 1;
  let travelX = 1;
  let travelY = 1;
  let xs = 1;
  let ys = 1;
  let zs = 1;
  let thefuture;
  let currentYear = 0;
  let scenario = 1;
  let ocean = ["#469280", "#2f7a78", "#1d5a67", "#13404d", "#10313e"];
  let lake = ["#26444c", "#011322", "#13455e", "#256685", "#6497b1"];
  let thebigone = 0.82;
  let bygones = 0.01;
  let dontmix = 68;

  let width;
  let height;

  p.preload = function () {
    //<Statistics Canada. Table 17-10-0057-01  Projected population, by projection scenario, age and sex, as of July 1 (x 1,000)
    //https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1710005701
    thefuture = p.loadTable(
      "../art/js/2024/data/dequoiserafaitlavenir/1710005701-noSymbol_trimmed.csv",
      "csv",
      "header"
    );
  };

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;

    const canvas = p.createCanvas(width, height, p.WEBGL);
    canvas.parent("artwork-container");
    p.frameRate(7);
    water = lake;
    shutDownEverything();
  };

  function shutDownEverything() {
    //reset the random values after awhile to keep things lively
    currentYear = 0;
    p.background("#424242");
    fate = p.random(1.618, 3.14); //factor width translation
    circumstance = p.random(15, 35);
    circonstance = p.random(20, 40);
    dizzy = p.random(8, 32);
    destin = p.random(60, 99);
    kismet = p.random(1.5, 2.1); //factor height translation
    xs = 1;
    ys = 1;
    zs = 1;
  }

  p.draw = function () {
    p.ambientLight(destin);
    let locX = p.mouseX - width / 2;
    let locY = p.mouseY - height / 2;
    p.pointLight(255, 255, 255, locX, locY, 50);
    p.specularMaterial(circonstance);
    p.shininess(80);

    //change the direction of travel into the future
    if (p.frameCount % 243 == 0) {
      travelX *= -1;
      //scenario += 1;
    }
    if (p.frameCount % 877 == 0) {
      travelY *= -1;
    }
    if (p.mouseIsPressed) {
      shutDownEverything();
      travelZ *= -1;
    }
    size = thefuture.getColumnCount();
    currentYear += 1;
    if (currentYear == thefuture.getRowCount()) {
      currentYear = 0;
    }
    if (scenario == thefuture.getColumnCount()) {
      scenario = 1;
      if (p.frameCount % thefuture.getColumnCount() == 0) {
        shutDownEverything();
      }
    }

    p.translate(-width / fate, -height / kismet, 0);
    futuresize =
      parseFloat(thefuture.getString(currentYear, scenario)) /
      parseFloat(thefuture.getString(0, scenario));
    futuresize = futuresize || 1;

    for (x = height; x > 0; x -= size) {
      for (y = width; y > 0; y -= size) {
        p.normalMaterial();
        c = Math.floor(y % water.length);
        p.push();
        p.translate(
          y + p.random(-3, 5) * size,
          x + p.random(-5, 4) * size,
          p.random(-0.5, 0.5)
        );
        p.rotateZ(travelZ * p.frameCount * p.random(0.01, 0.05));
        p.rotateX(travelX * p.frameCount * p.random(0.01, 0.05));
        p.rotateY(travelY * p.frameCount * p.random(0.01, 0.05));
        p.fill(p.color(water[c]));
        xs *= futuresize * p.random(0.85, 0.99);
        ys *= futuresize * p.random(0.77, 0.99);
        zs *= futuresize * p.random(0.69, 0.99);
        if (p.frameCount % dontmix == 0) {
          p.fill(p.color("#4D1526"));
        }
        p.ellipsoid(
          p.constrain(xs, 0.85 * bygones * size, 1.1 * thebigone * size),
          p.constrain(ys, 0.9 * bygones * size, 0.8 * thebigone * size),
          p.constrain(zs, 1.05 * bygones * size, 0.9 * thebigone * size)
        );
        p.pop();
      }
      if (
        xs * ys > 0.3 * height * width ||
        ys * zs > 0.2 * height * width ||
        xs * zs > 0.1 * height * width ||
        xs * ys * zs > 0.1 * height * width
      ) {
        xs = 1;
        ys = 1;
        zs = 1;
        break;
      }
    }
    scenario += 1;
  };
};
