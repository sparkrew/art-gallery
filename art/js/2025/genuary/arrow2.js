var sketch = function (p) {
  let width;
  let height;

  function draw_fleche_qui_pointe_par_la() {
    x = p.width / 2;
    y = p.height / 2 - p.height / 5;
    angle = p.radians(180);
    let arrowWidth = 80;

    p.push();
    p.fill(255);
    p.rect(x + arrowWidth, 0, p.width * 2, p.height * 2);

    p.translate(x, y);
    p.rotate(angle);
    p.fill(255);
    p.noStroke();

    p.quad(
      -arrowWidth / 2,
      -p.height * 2,
      -arrowWidth / 2,
      0,
      -arrowWidth / 2 - p.width * 2,
      0,
      -p.width * 2,
      -p.height * 2
    );
    p.quad(
      arrowWidth / 2,
      -p.height * 2,
      arrowWidth / 2,
      0,
      arrowWidth / 2 + p.width * 2,
      0,
      p.width * 2,
      -p.height * 2
    );
    p.quad(
      -arrowWidth / 2,
      -400,
      arrowWidth / 2,
      -400,
      arrowWidth / 2,
      -p.height * 2,
      -arrowWidth / 2,
      -p.height * 2
    );
    p.quad(
      -arrowWidth / 2 - 40,
      0,
      -p.width * 2,
      p.height * 2,
      p.width * 2,
      120,
      0,
      120
    );
    p.quad(
      0,
      120,
      arrowWidth / 2 + 40,
      0,
      p.width * 2,
      -p.height * 2,
      p.width * 2,
      p.height * 2
    );
    p.quad(
      0,
      120,
      -arrowWidth / 2 - 40,
      0,
      -p.width * 2,
      p.height * 2,
      -p.width * 2,
      -p.height * 2
    );

    p.pop();
  }

  function draw_une_fleches_qui_pointe_a_quelque_part_qui_n_est_pas_la() {
    let mainArrowTop = p.height / 2 - p.height / 5 - 80;
    let mainArrowBottom = p.height / 2 - p.height / 5 + 400;

    let arrowHeight = p.random(mainArrowTop, mainArrowBottom);
    let arrowWidth = p.random(20, 100);
    let arrowLength = p.random(100, 300);
    let direction = p.random() > 0.5 ? 1 : -1;

    p.push();
    p.translate(p.width / 2 + p.random(-194, 194), arrowHeight);
    p.fill(p.random(255), p.random(255), p.random(255));
    p.noStroke();
    p.rect(0, -arrowWidth / 2, direction * arrowLength, arrowWidth);
    p.triangle(
      direction * arrowLength,
      -arrowWidth / 2 - 20,
      direction * arrowLength,
      arrowWidth / 2 + 20,
      direction * arrowLength + direction * 40,
      0
    );
    p.pop();

    draw_fleche_qui_pointe_par_la();
  }

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.background(255);
  };

  p.draw = function () {
    p.background(0);
    draw_fleche_qui_pointe_par_la();

    nbArrow = p.random(84, 84 + 26);
    for (let i = 0; i < nbArrow; i++) {
      setTimeout(() => {
        draw_une_fleches_qui_pointe_a_quelque_part_qui_n_est_pas_la();
      }, 50 * i);
    }

    p.noLoop();
  };
};
