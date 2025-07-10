/*
    title: Figures historiques
    author: LenaMK
    date: 2023-02-24
    description: Constellations aléatoires formées par des œuvres d'art public réalisées par des femmes 
    data source: https://observablehq.com/@maison-mona/preparation-reconciliation?collection=@maison-mona/gender-analysis
    notes: still buggy, looses background on click and sometimes stops

*/

var sketch = function (p) {
  var importedObject, data, selection;
  var minArtworks = 5;
  var maxArtworks = 12;

  var minLat, minLong, maxLat, maxLong, minYear, maxYear;
  var maxColor = 100;
  var minColor = 10;

  var drawTime;

  var transitionTime = 250;

  var art = "\u203B";

  let width;
  let height;

  p.preload = function () {
    importedObject = p.loadJSON(
      "../art/js/2024/data/figures_historiques/data.json"
    );
  };

  p.setup = function () {
    p.colorMode(p.HSB, 360, 100, 100, 250);

    const container =
      document.querySelector(".artwork-container") || p._userNode;
    width = container.offsetWidth;
    height = container.offsetHeight;

    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    startFrame = 50;
    drawTime = 50;
    data = Object.values(importedObject);

    //order by produced_at = from newest to oldest
    data
      .sort((a, b) => {
        return b.produced_at - a.produced_at;
      })
      .splice(data.length - 3, data.length - 3); //removes the 3 artworks without date

    minYear = Math.min(...data.map((item) => item.produced_at));
    maxYear = Math.max(...data.map((item) => item.produced_at));

    //canvas maps area of MTL
    minLat = 45.68;
    maxLat = 45.39;
    minLong = -73.95;
    maxLong = -73.4;

    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(28);

    //console.log(data)
    //console.log(art)
  };

  function mousePressed() {
    console.log("mouse Pressed");
    if (isLooping()) p.noLoop();
    else p.loop();
  }

  //sudo mapping to canvas
  function getPosition(lat, long) {
    var x, y, largelat, largelong;

    largelat = lat * 1000;
    largelong = long * 1000;

    x = p.map(largelong, minLong * 1000, maxLong * 1000, 0, width);
    y = p.map(largelat, minLat * 1000, maxLat * 1000, 0, height);

    return [x, y];
  }

  function colorScale(year) {
    var result = p.map(year, minYear, maxYear, maxColor, minColor);

    return result;
  }

  function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }

  function drawLines(selection) {
    selection.forEach((d) => {
      var currentLocation = getPosition(d.location.lat, d.location.lng);
      var currentIndex = selection.indexOf(d);
      if (currentIndex < selection.length - 1) {
        var nextLocation = getPosition(
          selection[currentIndex + 1].location.lat,
          selection[currentIndex + 1].location.lng
        );

        p.line(
          currentLocation[0],
          currentLocation[1],
          nextLocation[0],
          nextLocation[1]
        );
      }
    });
  }

  function drawArtSelection(selection) {
    selection.forEach((d) => {
      var currentLocation = getPosition(d.location.lat, d.location.lng);
      p.noStroke();
      p.fill(341, colorScale(d.produced_at), 67, 150);
      p.text(art, currentLocation[0], currentLocation[1]);
    });
  }

  function drawSelection(selection, start) {
    //always show the selection with more alpha
    drawArtSelection(selection);

    var status = p.frameCount - start;

    if (status > drawTime - transitionTime) {
      //reduce alpha
      var decreaseTime = drawTime - status;
      console.log(decreaseTime);

      var currentOpacity = p.map(
        transitionTime - decreaseTime,
        0,
        transitionTime,
        0,
        180
      );

      p.stroke(0, 0, 100, 180 - currentOpacity);
      drawLines(selection);
    } else if (status > transitionTime) {
      //Show full alpha
      p.stroke(0, 0, 100, 180);
      drawLines(selection);
    } else {
      //start appearing
      var currentOpacity = p.map(status, 0, transitionTime, 0, 180);
      p.stroke(0, 0, 100, currentOpacity);
      drawLines(selection);
    }
  }

  p.draw = function () {
    p.background(0, 0, 0);

    data.forEach((d) => {
      var location = getPosition(d.location.lat, d.location.lng);

      p.noStroke();
      p.fill(341, colorScale(d.produced_at), 67, 60);

      p.push();
      p.textSize(28);
      p.text(art, location[0], location[1]);
      p.pop();
    });

    //new selection
    if (p.frameCount - drawTime == startFrame) {
      startFrame = p.frameCount;
      var nbArtworks = Math.round(p.random(minArtworks, maxArtworks));
      var randomStart = Math.round(p.random(0, 276 - nbArtworks));
      console.log("randomStart", randomStart);

      selection = data.slice(randomStart, randomStart + nbArtworks);
      console.log("new selection", selection);

      nbSteps = selection.length - 1;
      console.log("nb Steps", nbSteps);

      drawTime = 800;
    }

    if (selection) drawSelection(selection, startFrame);
  };
};
