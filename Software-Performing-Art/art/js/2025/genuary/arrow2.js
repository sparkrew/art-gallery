(() => {
  let width;
  let height;

  function init() {
    width = O_widthCanva;
    height = O_heightCanva;
  }

  function draw_fleche_qui_pointe_par_la() {
    let x = width / 2;
    let y = height / 2 - height / 5;
    let angle = radians(180);
    let arrowWidth = 80;

    push();
    fill(255);
    rect(x + arrowWidth, 0, width * 2, height * 2);

    translate(x, y);
    rotate(angle);
    fill(255);
    noStroke();

    quad(
      -arrowWidth / 2,
      -height * 2,
      -arrowWidth / 2,
      0,
      -arrowWidth / 2 - width * 2,
      0,
      -width * 2,
      -height * 2
    );
    quad(
      arrowWidth / 2,
      -height * 2,
      arrowWidth / 2,
      0,
      arrowWidth / 2 + width * 2,
      0,
      width * 2,
      -height * 2
    );
    quad(
      -arrowWidth / 2,
      -400,
      arrowWidth / 2,
      -400,
      arrowWidth / 2,
      -height * 2,
      -arrowWidth / 2,
      -height * 2
    );
    quad(
      -arrowWidth / 2 - 40,
      0,
      -width * 2,
      height * 2,
      width * 2,
      120,
      0,
      120
    );
    quad(
      0,
      120,
      arrowWidth / 2 + 40,
      0,
      width * 2,
      -height * 2,
      width * 2,
      height * 2
    );
    quad(
      0,
      120,
      -arrowWidth / 2 - 40,
      0,
      -width * 2,
      height * 2,
      -width * 2,
      -height * 2
    );

    pop();
  }

  function draw_une_fleches_qui_pointe_a_quelque_part_qui_n_est_pas_la() {
    let mainArrowTop = height / 2 - height / 5 - 80;
    let mainArrowBottom = height / 2 - height / 5 + 400;

    let arrowHeight = random(mainArrowTop, mainArrowBottom);
    let arrowWidth = random(20, 100);
    let arrowLength = random(100, 300);
    let direction = random() > 0.5 ? 1 : -1;

    push();
    translate(width / 2 + random(-194, 194), arrowHeight);
    fill(random(255), random(255), random(255));
    noStroke();
    rect(0, -arrowWidth / 2, direction * arrowLength, arrowWidth);
    triangle(
      direction * arrowLength,
      -arrowWidth / 2 - 20,
      direction * arrowLength,
      arrowWidth / 2 + 20,
      direction * arrowLength + direction * 40,
      0
    );
    pop();

    draw_fleche_qui_pointe_par_la();
  }

  function setup() {
    let div = createDiv();
    let canvas = createCanvas(800, 800);
    canvas.parent(div);
    div.style("text-align", "center");
    background(255);
  }

  function draw() {
    background(255);
    background(0);
    draw_fleche_qui_pointe_par_la();

    let nbArrow = random(84, 84 + 26);
    for (let i = 0; i < nbArrow; i++) {
      setTimeout(() => {
        draw_une_fleches_qui_pointe_a_quelque_part_qui_n_est_pas_la();
      }, 50 * i);
    }

    noLoop();
  }
  function cleanup() {
    if (O_canvas) {
      O_canvas.remove();
    }
    noLoop();
    clear();
  }

  window.arrow2 = {
    init,
    draw,
    cleanup,
  };
})();
