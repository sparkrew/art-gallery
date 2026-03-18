new p5(function (p) {
    let w, h;
    let hu = 330;
    const humin = 180;
    const humax = 330;
    let hudiff = 0.1;
    let hugrow = false;

    function containerSize() {
        const el = document.getElementById("header-sketch");
        if (!el) return { w: 800, h: 100 };
        const r = el.getBoundingClientRect();
        return { w: r.width || 800, h: r.height || 100 };
    }

    function resizeCanvasToHeader() {
        const s = containerSize();
        w = s.w;
        h = s.h;
        if (p._renderer) {
            p.resizeCanvas(w, h);
        } else {
            p.createCanvas(w, h);
        }
    }

    p.setup = function () {
        p.pixelDensity(1);
        resizeCanvasToHeader();
        p.frameRate(60);
        p.noStroke();
    };

    p.windowResized = function () {
        resizeCanvasToHeader();
    };

    p.draw = function () {
        // Oscillate hue between humin (180) and humax (330)
        if (hu < humax && hugrow) {
            hu += hudiff;
        } else {
            hugrow = false;
        }
        if (hu > humin && !hugrow) {
            hu -= hudiff;
        } else {
            hugrow = true;
        }

        // Speed up based on mouse movement
        const mouseSpeed = p.dist(p.mouseX, p.mouseY, p.pmouseX, p.pmouseY);
        hudiff = mouseSpeed > 1 ? mouseSpeed * 0.2 : 0.1;

        // Horizontal gradient: left = hu, right = hu offset by 60 degrees
        const hue2 = ((hu - humin + 60) % (humax - humin + 60)) + humin;
        const grd = p.drawingContext.createLinearGradient(0, 0, w, 0);
        grd.addColorStop(0, `hsl(${hu}, 100%, 50%)`);
        grd.addColorStop(1, `hsl(${hue2}, 100%, 50%)`);
        p.drawingContext.fillStyle = grd;
        p.drawingContext.fillRect(0, 0, w, h);
    };

}, "header-sketch");
