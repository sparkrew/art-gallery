var sketch = function (p) {
  let fr = 1 / 2;
  let osc;
  let frame_stop;
  let customFrameCount = 0;
  let width;
  let height;

  p.setup = function () {
    let container = document.getElementById("artwork-container");
    width = container.offsetWidth;
    height = container.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("artwork-container");
    p.colorMode(p.HSB, 360, 100, 100, 250);
    p.background(255);
    p.frameRate(fr);
    p.noStroke();
    frame_stop = p.floor(p.random(100, 200));

    osc = new p5.Oscillator("triangle");
    osc.freq(100);
    osc.start();
  };

  p.draw = function () {
    //p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.background(60, 10, 92.2);

    if (customFrameCount < frame_stop) {
      let new_freq = p.floor(p.random(1, 9)) * 110;
      osc.freq(new_freq);
      osc.start();

      p.fill(200.5, 100, 14.3);
      p.rect(
        p.width * p.random(),
        p.height * p.random(),
        p.random(100, p.height / 2),
        p.random(100, p.width / 2)
      );
      p.fill(355.5, 90.7, 75.7);
      p.rect(
        p.width * p.random(),
        p.height * p.random(),
        p.random(100, p.height / 2),
        p.random(100, p.width / 2)
      );

      p.fill(0, 0, 0);
      p.textSize(30);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(customFrameCount, p.width / 2, p.height / 2);

      if (fr < 12 && customFrameCount > 4 * fr) {
        fr += p.random(0, fr);
      }
      p.frameRate(fr);
    } else {
      osc.freq(220);
      p.background(0, 0, 0);
      p.fill(0, 0, 100);
      p.textSize(30);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(frame_stop, p.width / 2, p.height / 2);
    }

    customFrameCount++;

    if (customFrameCount > frame_stop + 4 * 12) {
      osc.stop();
      customFrameCount = 0;
      fr = 1 / 2;
      p.setup();
    }
  };
};
