let w,h,cnv,bowie

function preload() {
//    bowie = loadFont("../p5-experiments/fonts/FreeMono.ttf");
//    bowie = loadFont("./micrenc.ttf");
    bowie = loadFont("./Xirod.otf");
}

function setup() {
    w=42
    h=42
    cnv = createCanvas(w, h);
    cnv.parent("left-side");
    setCanvasSize()
    colorMode(HSB, 360, 100, 100, 250);
}

async function setCanvasSize() {
    var element = await document.getElementById("left-side");
    var positionInfo = element.getBoundingClientRect();
    var divh = positionInfo.height;
    var divw = positionInfo.width;
    w = divw
    h = divh
    resizeCanvas(w, h)
}


function draw(){
    background(100,100,80)
    console.log("hi")
    textFont(bowie)
    textSize(184)
    stroke(330,100,100)
    strokeWeight(13)
    fill(330,100,100)
    text("20260408",300,300)
    text("vernissage",300,484)

    noLoop()
}