var sketch = function(p) {

    //Changing the average number of stipes/arcs
    let nbStripes = 12;
    let nbArcs = 7;

    //Changing the overall movement of the arcs/rings (angles)
    let minSpeed = 1;
    let maxSpeed = 1;
    let angleRandomness = 1;

    let stripeCount;
    let rings;
    let currentArcCount;

    p.setup = function() {
        let container = document.getElementById("artwork-container");
        let w = container.offsetWidth;
        let h = container.offsetHeight;
        let canvas = p.createCanvas(w, h);
        canvas.parent("artwork-container");
        p.angleMode(p.DEGREES);

        initStripes();
        initRings();
    };

    p.draw = function() {
        p.background('#d61e2a');

        for (let r of rings) {
            r.angle += r.speed;
        }

        stripes();

        bigTriangle();

        arcs();
    };

    function initStripes() {
        const minStripes = p.max(1, nbStripes - 2);
        const maxStripes = nbStripes + 2;
        stripeCount = p.int(p.random(minStripes, maxStripes));
    }

    function initRings() {
        rings = [];

        const minArcs = p.max(1, nbArcs - 2);
        const maxArcs = nbArcs + 2;
        currentArcCount = p.int(p.random(minArcs, maxArcs));

        for (let i = 0; i < currentArcCount; i++) {
            rings.push({
                angle: p.random(angleRandomness),
                speed: p.random(minSpeed, maxSpeed)
            });
        }
    }

    function bigTriangle() {
        p.noStroke();
        p.fill("#524e4e");

        const baseY = p.height;
        const marginX = p.width;
        const apexY = p.height * 0.01;
        const apexX = p.width / 2;

        p.triangle(marginX, baseY, p.width - marginX, baseY, apexX, apexY);
    }

    function stripes() {
        const totalSlots = stripeCount * 2 - 1;
        const stripeWidth = p.width / totalSlots;

        p.noStroke();
        p.fill("#641116");

        for (let i = 0; i < stripeCount; i++) {
            const x = i * 2 * stripeWidth;
            p.rect(x, 0, stripeWidth, p.height);
        }
    }

    function arcs() {
        const baseY = p.height;
        const apexY = p.height * 0.01;
        const apexX = p.width / 2;
        const marginX = p.width;

        // Clip drawing to triangle so rings stay inside
        p.push();
        const ctx = p.drawingContext;
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(marginX, baseY);
        ctx.lineTo(p.width - marginX, baseY);
        ctx.lineTo(apexX, apexY);
        ctx.closePath();
        ctx.clip();

        p.noFill();

        const count = currentArcCount;

        const baseHalfWidth = p.width / 2 - marginX;

        for (let i = 0; i < count; i++) {
            const r = rings[i];

            const t = (count === 1) ? 0 : i / (count - 1);

            const refPoint = p.lerp(baseY, apexY, t);
            const halfWidth = p.lerp(baseHalfWidth, 0, t) * 0.9;
            const diameter = halfWidth * 2;

            p.push();
            p.translate(apexX, refPoint);
            p.rotate(r.angle);

            p.strokeWeight(25);

            // Top half of the ring
            p.stroke("#ffffff");
            p.arc(0, 0, diameter, diameter, 180, 360);

            // Bottom half of the ring
            p.stroke('#333333');
            p.arc(0, 0, diameter, diameter, 0, 180);
            p.pop();
        }

        ctx.restore();
        p.pop();
    }
};
