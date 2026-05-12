var sketch = function(p) {

    let blackBandY = 250;
    let blackBandSpeed = 1;
    const bandH = 150;
    const bandY0 = 250;
    let stateBigCircles = [];
    let groupNext = { center: 0, negativeSlope: 0, positiveSlope: 0 };
    const W = 600;
    const H = 550;

    p.setup = function() {
        let container = document.getElementById("artwork-container");
        let w = container.offsetWidth;
        let h = container.offsetHeight;
        let canvas = p.createCanvas(w, h);
        canvas.parent("artwork-container");
        initStateBigCircles();
    };

    function initStateBigCircles() {
        const xs = [230, 300, 370];
        const yOffs = [40, 110];

        stateBigCircles = [];

        for (let j = 0; j < yOffs.length; j++) {
            for (let i = 0; i < xs.length; i++) {
                if(xs[i] == 300){
                    stateBigCircles.push({
                        x: xs[i],
                        yOff: yOffs[j],
                        on: p.random() < 0.5,
                        group: "center",
                    });
                }
                else if((xs[i] == 230 && yOffs[j]==40) || (xs[i] == 370 && yOffs[j]==110)){
                    stateBigCircles.push({
                        x: xs[i],
                        yOff: yOffs[j],
                        on: p.random() < 0.3,
                        group: "negativeSlope"
                    });
                }
                else{
                    stateBigCircles.push({
                        x: xs[i],
                        yOff: yOffs[j],
                        on: p.random() < 0.7,
                        group: "positiveSlope"
                    });
                }
            }
        }
    }

    function drawBigCircles() {
        p.stroke(100, 100, 0);
        let now = p.millis();

        if (now >= groupNext.center) {
            for (let c of stateBigCircles) if (c.group === "center") c.on = !c.on;
            groupNext.center = now + p.random(5000, 7000);
        }

        if (now >= groupNext.negativeSlope) {
            for (let c of stateBigCircles) if (c.group === "negativeSlope") c.on = !c.on;
            groupNext.negativeSlope = now + p.random(200, 800);
        }

        if (now >= groupNext.positiveSlope) {
            for (let c of stateBigCircles) if (c.group === "positiveSlope") c.on = !c.on;
            groupNext.positiveSlope = now + p.random(3200, 4500);
        }

        for (let circle of stateBigCircles) {
            const y = blackBandY + circle.yOff;
            if(circle.on) {
                p.fill(250, 180, 0, 200);
            }
            else {
                p.noFill();
            }
            p.ellipse(circle.x, y, 60, 60);
        }
    }

    p.draw = function() {
        p.background(180, 0, 0);
        blackBandY += blackBandSpeed;

        if (blackBandY <= 0 || blackBandY >= p.height - 150) {
            blackBandSpeed *= -1;
        }

        p.fill(255, 255, 0, 150);
        p.noStroke();
        p.rect(0, blackBandY - 5, 600, 5);
        p.rect(0, blackBandY + 150, 600, 5);

        p.fill(0, 0, 0);
        p.stroke(0);
        p.rect(0, blackBandY, 600, 150);

        p.noFill();
        p.stroke(100,100,0);
        p.rect(140,20,320,520);

        drawBigCircles();
        p.noFill();

        p.line(190, blackBandY + 75, 410, blackBandY + 75);
        p.line(265, blackBandY + 5, 265, blackBandY + 145);
        p.line(335, blackBandY + 5, 335, blackBandY + 145);

        p.line(190, blackBandY + 30, 190, blackBandY + 120);
        p.line(410, blackBandY + 30, 410, blackBandY + 120);

        for (let i = 0; i < 6; i++) {
            p.rect(160 + i * 50, 420, 30, 100);
        }

        p.fill(100, 0, 0,200);
        for (let i = 0; i < 4; i++) {
            p.ellipse(175 , 435 + i * 24, 22, 22);
            p.ellipse(225 , 435 + i * 24, 22, 22);
            p.ellipse(275 , 435 + i * 24, 22, 22);
            p.ellipse(325 , 435 + i * 24, 22, 22);
            p.ellipse(375 , 435 + i * 24, 22, 22);
            p.ellipse(425 , 435 + i * 24, 22, 22);
        }

        p.fill(0, 0, 0, 150);
        for (let i = 0; i < 6; i++) {
            p.rect(145 + i * 50, 460, 15, 15);
        }
        p.rect(440, 460, 15, 15);

        for (let i = 0; i < 3; i++) {
            let ran1 = p.random(0,10);
            let ran2 = p.random(0,8);
            p.ellipse(525, blackBandY + 40 + i * 35, 30 + ran1, 30 + ran1);
            p.ellipse(565, blackBandY + 40 + i * 35, 30 + ran2, 30 + ran2);
        }

        p.line(500, blackBandY, 500, blackBandY + 150);
        p.line(500, blackBandY + 57, 590, blackBandY + 57);
        p.line(500, blackBandY + 93, 590, blackBandY + 93);

        for (let i = 0; i < 3; i++) {
            let rand1 = p.random(0,8);
            let rand2 = p.random(0,8);
            p.ellipse(35,  blackBandY + 40 + i * 35, 30 + rand1, 30 + rand1);
            p.ellipse(75, blackBandY + 40 + i * 35, 30 + rand2, 30 + rand2);
        }
        p.line(100, blackBandY, 100, blackBandY + 150);
        p.line(10, blackBandY + 57, 100, blackBandY + 57);
        p.line(10, blackBandY + 93, 100, blackBandY + 93);
    };

};
