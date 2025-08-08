//  Redimensionner les personnages !!!!
var sketch = function (p) {
  let speech;
  let lang;
  let arms = true;
  let type;
  let myFont;
  let col;

  let csvData_pos = [];
  let csvData_neg = [];
  let csvData;
  let size;

  let width;
  let height;

  const langs = [
    "en-US",
    "de-DE",
    "id-ID",
    "es-ES",
    "fr-FR",
    "it-IT",
    "nl-NL",
    "pt-BR",
  ];

  p.preload = function () {
    myFont = p.loadFont("../art/js/2025/data/artwork_3/game_over.ttf");
    p.loadStrings("../art/js/2025/data/artwork_3/data/pos.csv", (data) =>
      processCSV(data, "pos")
    );
    p.loadStrings("../art/js/2025/data/artwork_3/data/neg.csv", (data) =>
      processCSV(data, "neg")
    );
  };

  function processCSV(data, type) {
    let csvText = data.join("\n");

    Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      complete: function (results) {
        if (type === "pos") {
          csvData_pos = results.data;
          console.log("Données positives chargées", csvData_pos);
        } else if (type === "neg") {
          csvData_neg = results.data;
          console.log("Données négatives chargées", csvData_neg);
        }
      },
    });
  }

  function getWordByLanguage(language, type) {
    csvData = type ? csvData_pos : csvData_neg;
    if (csvData.length === 0) return "Data not loaded";

    let randomIndex = p.floor(p.random(csvData.length));
    return csvData[randomIndex][language];
  }

  p.setup = function () {
    let container = document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    speech = new p5.Speech();
    size = p.int(p.height / 50);
  };

  p.draw = function () {
    p.noLoop();

    arms = !arms;
    type = p.random() < 0.8;

    lang = langs[p.int(p.random(langs.length))];
    speech.setLang(lang);
    speech.setPitch(p.random(0.01, 1.5));
    speech.setRate(p.random(0.01, 1.5));

    let word = getWordByLanguage(lang, type);
    speech.speak(word);

    col = type ? p.color(34, 139, 34) : p.color(210, 43, 43);

    p.background(0);
    if (arms) {
      drawStickMan(20, 25, size, true, arms);
      p.fill(col);
      p.textSize(128);
      p.textFont(myFont);
      p.textAlign(p.LEFT, p.BOTTOM);
      p.text(word, size * 28, size * 22);
      drawStickMan(80, 25, size, type, !arms);
    } else {
      drawStickMan(80, 25, size, true, !arms);
      p.fill(col);
      p.textSize(128);
      p.textAlign(p.RIGHT, p.BOTTOM);
      p.textFont(myFont);
      p.text(word, size * 72, size * 22);
      drawStickMan(20, 25, size, type, arms);
    }

    speech.onEnd = () => {
      console.log("Lecture finie");
      p.draw();
    };
  };

  function drawStickMan(x, y, size, smile = true, down = false) {
    p.noStroke();
    p.fill(255);

    for (let i = 0; i < 10; i++) p.rect(size * x, size * (y + i), size);

    for (let i = 1; i < 6; i++)
      p.rect(size * (x - i), size * (y + 9 + i), size);
    for (let i = 1; i < 6; i++)
      p.rect(size * (x + i), size * (y + 9 + i), size);

    if (down) {
      for (let i = 0; i < 5; i++)
        p.rect(size * (x - (1 + i)), size * (y + 4 + i), size);
      for (let i = 0; i < 5; i++)
        p.rect(size * (x + (1 + i)), size * (y + 4 + i), size);
    } else {
      for (let i = 0; i < 5; i++)
        p.rect(size * (x - (1 + i)), size * (y + 4 - i), size);
      for (let i = 0; i < 5; i++)
        p.rect(size * (x + (1 + i)), size * (y + 4 - i), size);
    }

    const blocks = [
      [0, -1],
      [-1, -1],
      [-2, -1],
      [-3, -2],
      [-4, -3],
      [-4, -4],
      [-4, -5],
      [-4, -6],
      [-3, -7],
      [-2, -8],
      [-1, -8],
      [0, -8],
      [1, -8],
      [2, -8],
      [3, -7],
      [4, -6],
      [4, -5],
      [4, -4],
      [4, -3],
      [3, -2],
      [1, -1],
      [2, -1],
    ];
    for (let [dx, dy] of blocks) {
      p.rect(size * (x + dx), size * (y + dy), size);
    }

    p.rect(size * (x + 1), size * (y - 6), size);
    p.rect(size * (x - 1), size * (y - 6), size);

    p.rect(size * x, size * (y - 3), size);
    p.rect(size * (x - 1), size * (y - 3), size);
    p.rect(size * (x + 1), size * (y - 3), size);

    if (smile) {
      p.rect(size * (x - 2), size * (y - 4), size);
      p.rect(size * (x + 2), size * (y - 4), size);
    }
  }
};
