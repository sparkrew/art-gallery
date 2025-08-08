var sketch = function (p) {
  let width;
  let height;
  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
  };

  p.draw = function () {
    p.noLoop();
    p.background("white");
    var couleurs = ["red", "black", "white"];
    var coureurs2 = ["white", "black"];
    var linesWidth;
    //var choiceGenuary;
    //choiceGenuary = random(["horizontal lines", 2]);

    var numLines;
    numLines = p.round(p.random(1, 1000));
    //on va diviser l'écran en sous-parties
    for (let i = 1; i < 5; i++) {
      //var width = p.windowWidth;
      //var height = p.windowHeight;

      for (let i = 0; i < numLines; i++) {
        linesWidth = p.random([0.5, 1, 2, 3, 4.5, 6]);
        p.strokeWeight(linesWidth);
        var couleur = p.random(couleurs);

        p.stroke(couleur);

        var positionX = p.random(p.width);
        var positionY = p.random(p.height);
        var lentgh = p.random(p.width - positionY);
        // if (couleur == 'white') {
        //   background("black")
        // }

        p.line(positionX, positionY, positionX, positionY + lentgh);
      }
    }
  };
};
