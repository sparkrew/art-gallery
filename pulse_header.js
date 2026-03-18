let w,h,cnv,bowie,hu,humin,humax,hudiff,hugrow

function preload() {
//    bowie = loadFont("../p5-experiments/fonts/FreeMono.ttf");
//    bowie = loadFont("./micrenc.ttf");
    bowie = loadFont("./Xirod.otf");
}

function setup() {
    w=840
    h=420
    cnv = createCanvas(w, h);
    humax=330
    humin=180
    hu=humax
    hudiff=0.1
    hugrow=false
    //cnv.parent("left-side");
    //setCanvasSize()
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
    background(hu,100,100)
    if(hu<humax && hugrow){
        hu+=hudiff
    }
    else{
        hugrow=false
    }
    if(hu>humin && !hugrow){
        hu-=hudiff
    }
    else{
        hugrow=true
    }
    let mouseSpeed = dist(mouseX, mouseY, pmouseX, pmouseY);
    if(mouseSpeed>1){
        hudiff=mouseSpeed*0.2
    }
    else{
        hudiff=0.1
    }
    console.log(mouseSpeed)
}