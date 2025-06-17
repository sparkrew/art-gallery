// A MODIFIER !!!!!!!!!!!!
let PGNS = [];

let canvaSize = 800;
let boardSize = 800;
let cellsNumber = 8;
let cellSize = boardSize / cellsNumber;

let buffers;
let n = 5;
let N = 5 * 9;

let whiteColor = [];
let blackColor = [];
let c = 10;
class Piece {
  constructor(j, i, type, pieceColor) {
    this.pos = { x: i, y: j };
    this.type = type;
    this.pieceColor = pieceColor;
  }
}
class Cell {
  constructor(x, y, occupied) {
    this.x = x;
    this.y = y;
    this.occupied = false;
    this.piece = null;
    this.pieceColor = null;
  }
}

function preload() {
  loadStrings("art/js/2025/data/mind_duplication/data", selectGame);
}

async function setup() {
  frameRate(4);

  console.log(windowHeight, windowWidth);
  colorMode(HSL, 240, 240, 240);
  for (let i = 0; i < c; i++) {
    let hW = 194;
    let hB = 25;
    let s = 230;
    let l = map(i, 0, n - 1, 30, 90);
    let a = 0.8;
    whiteColor.push(color(hW, s, l, a));
    blackColor.push(color(hB, s, l, a));
  }
  console.log(whiteColor);
  buffers = await Promise.all(
    Array.from({ length: N }, async (_, i) => {
      let img = createGraphics(boardSize, boardSize);
      let fenPositions = await findFenpositions(PGNS[i]);
      let board = [];
      let pieces = [];
      let inc = 0;

      return { img, fenPositions, board, pieces, inc };
    })
  );

  createCanvas(windowWidth, windowHeight);

  console.log("Setup terminé avec toutes les données chargées !");
}

function draw() {
  noLoop();

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 5; j++) {
      let r = random();

      let buffer = buffers[i + j * n];
      buffer.img.colorMode(HSL, 240, 240, 240);
      buffer.img.background(10);

      if (r <= 0.25) {
        buffer.img.push();
        buffer.img.translate(buffer.img.width, 0);
        buffer.img.rotate((-3 * Math.PI) / 2);
        drawPieces(buffer);
        drawDots(buffer.img);
        buffer.img.pop();
      } else if (r <= 0.5) {
        buffer.img.push();
        buffer.img.translate(0, buffer.img.height);
        buffer.img.rotate(-Math.PI / 2);
        drawPieces(buffer);
        drawDots(buffer.img);
        buffer.img.pop();
      } else if (r <= 0.75) {
        buffer.img.push();
        buffer.img.translate(0, buffer.img.height);
        buffer.img.scale(1, -1);
        drawPieces(buffer);
        drawDots(buffer.img);
        buffer.img.pop();
      } else {
        drawPieces(buffer);
        drawDots(buffer.img);
      }

      image(
        buffers[i + j * n].img,
        (i * windowHeight) / n,
        (j * windowHeight) / n,
        windowHeight / n,
        windowHeight / n
      );
    }
  }

  stroke(200);
  strokeWeight(1);
  for (let x = 0; x <= width; x += windowHeight / n) {
    line(x, 0, x, height);
  }
  for (let y = 0; y <= height; y += windowHeight / n) {
    line(0, y, width, y);
  }

  mousePressed();
}

function mousePressed() {
  for (let buffer of buffers) {
    let r = random();
    if (r < 0.1) {
      nextMove(buffer);
    }
  }
  loop();
}

function nextMove(buffer) {
  let r = random();
  buffer.img.colorMode(HSL, 240, 240, 240);
  buffer.img.background(10);

  if (r <= 0.25) {
    buffer.img.push();
    buffer.img.translate(buffer.img.width, 0);
    buffer.img.rotate((-3 * Math.PI) / 2);
    drawPieces(buffer);
    drawDots(buffer.img);
    buffer.img.pop();
  } else if (r <= 0.5) {
    buffer.img.push();
    buffer.img.translate(0, buffer.img.height);
    buffer.img.rotate(-Math.PI / 2);
    drawPieces(buffer);
    drawDots(buffer.img);
    buffer.img.pop();
  } else if (r <= 0.75) {
    buffer.img.push();
    buffer.img.translate(0, buffer.img.height);
    buffer.img.scale(1, -1);
    drawPieces(buffer);
    drawDots(buffer.img);
    buffer.img.pop();
  } else {
    drawPieces(buffer);
    drawDots(buffer.img);
  }

  if (buffer.inc == buffer.fenPositions.length) {
    buffer.inc = 1;
    buffer.fenPositions.reverse();
  }
  fenToBoard(buffer, buffer.fenPositions[buffer.inc]);
  buffer.inc += 1;
}

function drawDots(img) {
  for (let i = 0; i < cellsNumber; i++) {
    for (let j = 0; j < cellsNumber; j++) {
      img.fill(255);
      img.noStroke();
      img.circle((i + 0.5) * cellSize, (j + 0.5) * cellSize, boardSize / 200);
    }
  }
}

function initializeBoard(buffer) {
  buffer.board = [];
  buffer.pieces = [];
  for (let i = 0; i < cellsNumber; i++) {
    buffer.board[i] = [];
    for (let j = 0; j < cellsNumber; j++) {
      buffer.board[i][j] = null;
    }
  }
}

function fenToBoard(buffer, fen) {
  initializeBoard(buffer);
  let rows = fen.split(" ")[0].split("/");
  let pieceMap = {
    p: "P",
    r: "R",
    n: "N",
    b: "B",
    q: "Q",
    k: "K",
  };

  for (let y = 0; y < cellsNumber; y++) {
    let x = 0;
    for (let char of rows[y]) {
      if (!isNaN(char)) {
        x += parseInt(char);
      } else {
        let color = char === char.toUpperCase() ? "W" : "B";
        let type = pieceMap[char.toLowerCase()];
        let piece = new Piece(y, x, type, color);
        buffer.pieces.push(piece);
        buffer.board[y][x] = piece;
        x++;
      }
    }
  }
}

function findFenpositions(pgn) {
  let fenPositions = [];
  const chess = new Chess();
  chess.load_pgn(pgn);
  let moves = chess.history();
  chess.reset();

  fenPositions.push(chess.fen());
  for (let move of moves) {
    chess.move(move);
    fenPositions.push(chess.fen());
  }
  return fenPositions;
}

function selectGame(lines) {
  for (let i = 0; i < N; i++) {
    let randomLine = floor(random(lines.length));
    PGNS.push(lines[randomLine]);
  }
}

function drawPiece(piece, buffer) {
  if (piece.pieceColor == "W") {
    buffer.img.stroke(200, 217, 100);
  } else {
    buffer.img.stroke(33, 217, 113);
  }

  buffer.img.strokeWeight(2);

  let x = piece.pos.x;
  let y = piece.pos.y;

  if (piece.type == "P") {
    drawPawn(piece, buffer);
  }
  if (piece.type == "K") {
    drawKing(piece, buffer);
  }
  if (piece.type == "Q") {
    drawQueen(piece, buffer);
  }
  if (piece.type == "B") {
    drawBishop(piece, buffer);
  }
  if (piece.type == "R") {
    drawRock(piece, buffer);
  } else if (piece.type == "N") {
    drawKnight(piece, buffer);
  }
}

function drawPieces(buffer) {
  buffer.pieces = shuffle(buffer.pieces, true);
  for (piece of buffer.pieces) {
    if (piece.type == "Q") {
      drawPiece(piece, buffer);
    }
  }
  for (piece of buffer.pieces) {
    if (piece.type != "Q") {
      drawPiece(piece, buffer);
    }
  }
}

function drawRock(piece, buffer) {
  let x = piece.pos.x;
  let y = piece.pos.y;
  let up = 0;
  let right = 0;
  let down = 0;
  let left = 0;

  let endUp = false;
  let endRight = false;
  let endDown = false;
  let endLeft = false;

  for (let i = 1; i < cellsNumber; i++) {
    if (x + i < cellsNumber) {
      if (buffer.board[y][x + i] == null && !endRight) {
        right += 1;
      } else {
        endRight = true;
      }
    }
    if (x - i >= 0) {
      if (buffer.board[y][x - i] == null && !endLeft) {
        left -= 1;
      } else {
        endLeft = true;
      }
    }
    if (y + i < cellsNumber) {
      if (buffer.board[y + i][x] == null && !endDown) {
        down += 1;
      } else {
        endDown = true;
      }
    }
    if (y - i >= 0) {
      if (buffer.board[y - i][x] == null && !endUp) {
        up -= 1;
      } else {
        endUp = true;
      }
    }
  }

  // buffer.img.stroke(255);
  if (piece.pieceColor == "W") {
    buffer.img.fill(random(whiteColor));
  } else {
    buffer.img.fill(random(blackColor));
  }

  buffer.img.beginShape();
  buffer.img.curveVertex((x + 0.5) * cellSize, (y + (up - 1) + 0.5) * cellSize);
  buffer.img.curveVertex(
    (x + (right + 1) + 0.5) * cellSize,
    (y + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + 0.5) * cellSize,
    (y + (down + 1) + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + (left - 1) + 0.5) * cellSize,
    (y + 0.5) * cellSize
  );
  buffer.img.endShape(CLOSE);

  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + right + 1.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + left - 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + up - 0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + down + 1.5)*cellSize);
}

function drawQueen(piece, buffer) {
  let x = piece.pos.x;
  let y = piece.pos.y;
  let up = 0;
  let upRight = 0;
  let right = 0;
  let rightDown = 0;
  let down = 0;
  let downLeft = 0;
  let left = 0;
  let leftUp = 0;

  let endUp = false;
  let endRight = false;
  let endDown = false;
  let endLeft = false;
  let endUpRight = false;
  let endRightDown = false;
  let endDownLeft = false;
  let endLeftUp = false;

  for (let i = 1; i < cellsNumber; i++) {
    if (x + i < cellsNumber) {
      if (buffer.board[y][x + i] == null && !endRight) {
        right += 1;
      } else {
        endRight = true;
      }
    }
    if (x - i >= 0) {
      if (buffer.board[y][x - i] == null && !endLeft) {
        left -= 1;
      } else {
        endLeft = true;
      }
    }
    if (y + i < cellsNumber) {
      if (buffer.board[y + i][x] == null && !endDown) {
        down += 1;
      } else {
        endDown = true;
      }
    }
    if (y - i >= 0) {
      if (buffer.board[y - i][x] == null && !endUp) {
        up -= 1;
      } else {
        endUp = true;
      }
    }
    if (x + i < cellsNumber && y + i < cellsNumber) {
      if (buffer.board[y + i][x + i] == null && !endRightDown) {
        rightDown += 1;
      } else {
        endRightDown = true;
      }
    }
    if (x - i >= 0 && y - i >= 0) {
      if (buffer.board[y - i][x - i] == null && !endLeftUp) {
        leftUp -= 1;
      } else {
        endLeftUp = true;
      }
    }
    if (y + i < cellsNumber && x - i >= 0) {
      if (buffer.board[y + i][x - i] == null && !endDownLeft) {
        downLeft += 1;
      } else {
        endDownLeft = true;
      }
    }
    if (y - i >= 0 && x + i < cellsNumber) {
      if (buffer.board[y - i][x + i] == null && !endUpRight) {
        upRight -= 1;
      } else {
        endUpRight = true;
      }
    }
  }

  // buffer.img.stroke(255);
  if (piece.pieceColor == "W") {
    buffer.img.fill(random(whiteColor));
  } else {
    buffer.img.fill(random(blackColor));
  }

  buffer.img.beginShape();
  buffer.img.curveVertex((x + 0.5) * cellSize, (y + (up - 1) + 0.5) * cellSize);
  buffer.img.curveVertex(
    (x - (upRight - 1) + 0.5) * cellSize,
    (y + (upRight - 1) + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + (right + 1) + 0.5) * cellSize,
    (y + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + (rightDown + 1) + 0.5) * cellSize,
    (y + (rightDown + 1) + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + 0.5) * cellSize,
    (y + (down + 1) + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x - (downLeft + 1) + 0.5) * cellSize,
    (y + (downLeft + 1) + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + (left - 1) + 0.5) * cellSize,
    (y + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + (leftUp - 1) + 0.5) * cellSize,
    (y + (leftUp - 1) + 0.5) * cellSize
  );
  buffer.img.endShape(CLOSE);

  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + right + 1.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + left - 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + up - 0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + down + 1.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - upRight + 1.5)*cellSize, (piece.pos.y + upRight -   0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - downLeft - 0.5)*cellSize, (piece.pos.y + downLeft + 1.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + leftUp - 0.5)*cellSize, (piece.pos.y + leftUp - 0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + rightDown + 1.5)*cellSize, (piece.pos.y + rightDown + 1.5)*cellSize);
}

function drawBishop(piece, buffer) {
  let x = piece.pos.x;
  let y = piece.pos.y;
  let upRight = 0;
  let rightDown = 0;
  let downLeft = 0;
  let leftUp = 0;

  let endUpRight = false;
  let endRightDown = false;
  let endDownLeft = false;
  let endLeftUp = false;

  for (let i = 1; i < cellsNumber; i++) {
    if (x + i < cellsNumber && y + i < cellsNumber) {
      if (buffer.board[y + i][x + i] == null && !endRightDown) {
        rightDown += 1;
      } else {
        endRightDown = true;
      }
    }
    if (x - i >= 0 && y - i >= 0) {
      if (buffer.board[y - i][x - i] == null && !endLeftUp) {
        leftUp -= 1;
      } else {
        endLeftUp = true;
      }
    }
    if (y + i < cellsNumber && x - i >= 0) {
      if (buffer.board[y + i][x - i] == null && !endDownLeft) {
        downLeft += 1;
      } else {
        endDownLeft = true;
      }
    }
    if (y - i >= 0 && x + i < cellsNumber) {
      if (buffer.board[y - i][x + i] == null && !endUpRight) {
        upRight -= 1;
      } else {
        endUpRight = true;
      }
    }
  }

  // buffer.img.stroke(255);
  if (piece.pieceColor == "W") {
    buffer.img.fill(random(whiteColor));
  } else {
    buffer.img.fill(random(blackColor));
  }

  buffer.img.beginShape();
  buffer.img.curveVertex(
    (x - (upRight - 1) + 0.5) * cellSize,
    (y + (upRight - 1) + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + (rightDown + 1) + 0.5) * cellSize,
    (y + (rightDown + 1) + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x - (downLeft + 1) + 0.5) * cellSize,
    (y + (downLeft + 1) + 0.5) * cellSize
  );
  buffer.img.curveVertex(
    (x + (leftUp - 1) + 0.5) * cellSize,
    (y + (leftUp - 1) + 0.5) * cellSize
  );
  buffer.img.endShape(CLOSE);

  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - upRight + 1.5)*cellSize, (piece.pos.y + upRight -   0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - downLeft - 0.5)*cellSize, (piece.pos.y + downLeft + 1.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + leftUp - 0.5)*cellSize, (piece.pos.y + leftUp - 0.5)*cellSize);
  // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + rightDown + 1.5)*cellSize, (piece.pos.y + rightDown + 1.5)*cellSize);
}

function drawKnight(piece, buffer) {
  let x = piece.pos.x;
  let y = piece.pos.y;

  if (piece.pieceColor == "W") {
    buffer.img.fill(random(whiteColor));
  } else {
    buffer.img.fill(random(blackColor));
  }

  buffer.img.ellipse(
    (piece.pos.x + 1.5) * cellSize,
    (piece.pos.y - 1.5) * cellSize,
    cellSize / 2,
    cellSize / 2
  );
  buffer.img.ellipse(
    (piece.pos.x - 0.5) * cellSize,
    (piece.pos.y - 1.5) * cellSize,
    cellSize / 2,
    cellSize / 2
  );
  buffer.img.ellipse(
    (piece.pos.x + 1.5) * cellSize,
    (piece.pos.y + 2.5) * cellSize,
    cellSize / 2,
    cellSize / 2
  );
  buffer.img.ellipse(
    (piece.pos.x - 0.5) * cellSize,
    (piece.pos.y + 2.5) * cellSize,
    cellSize / 2,
    cellSize / 2
  );
  buffer.img.ellipse(
    (piece.pos.x + 2.5) * cellSize,
    (piece.pos.y + 1.5) * cellSize,
    cellSize / 2,
    cellSize / 2
  );
  buffer.img.ellipse(
    (piece.pos.x + 2.5) * cellSize,
    (piece.pos.y - 0.5) * cellSize,
    cellSize / 2,
    cellSize / 2
  );
  buffer.img.ellipse(
    (piece.pos.x - 1.5) * cellSize,
    (piece.pos.y + 1.5) * cellSize,
    cellSize / 2,
    cellSize / 2
  );
  buffer.img.ellipse(
    (piece.pos.x - 1.5) * cellSize,
    (piece.pos.y - 0.5) * cellSize,
    cellSize / 2,
    cellSize / 2
  );
}

function drawKing(piece, buffer) {
  buffer.img.rect(
    (piece.pos.x + 0.5) * cellSize,
    (piece.pos.y + 0.5) * cellSize,
    cellSize,
    cellSize
  );
  buffer.img.noFill();
  buffer.img.strokeWeight(1);
  buffer.img.rect(
    piece.pos.x * cellSize,
    piece.pos.y * cellSize,
    2 * cellSize,
    2 * cellSize
  );
}

function drawPawn(piece, buffer) {
  if (piece.pieceColor == "W") {
    buffer.img.fill(random(whiteColor));
    buffer.img.beginShape();
    buffer.img.curveVertex(
      (piece.pos.x + 0.5) * cellSize,
      (piece.pos.y + 0.5) * cellSize
    );
    buffer.img.curveVertex(
      (piece.pos.x + 1.5) * cellSize,
      (piece.pos.y - 0.5) * cellSize
    );
    buffer.img.curveVertex(
      (piece.pos.x - 0.5) * cellSize,
      (piece.pos.y - 0.5) * cellSize
    );
    buffer.img.endShape(CLOSE);

    // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 1.5)*cellSize, (piece.pos.y - 0.5)*cellSize);
    // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 0.5)*cellSize, (piece.pos.y - 0.5)*cellSize);
  } else {
    buffer.img.fill(random(blackColor));
    buffer.img.beginShape();
    buffer.img.curveVertex(
      (piece.pos.x + 0.5) * cellSize,
      (piece.pos.y + 0.5) * cellSize
    );
    buffer.img.curveVertex(
      (piece.pos.x + 1.5) * cellSize,
      (piece.pos.y + 1.5) * cellSize
    );
    buffer.img.curveVertex(
      (piece.pos.x - 0.5) * cellSize,
      (piece.pos.y + 1.5) * cellSize
    );
    buffer.img.endShape(CLOSE);
    // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 1.5)*cellSize, (piece.pos.y + 1.5)*cellSize);
    // buffer.img.line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 0.5)*cellSize, (piece.pos.y + 1.5)*cellSize);
  }
}
