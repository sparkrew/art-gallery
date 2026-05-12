//Author: Félix Cormier

var sketch = function(p) {

    const noiseConstant = 0.0005;
    const heightConstant = 14/9;
    const showgrid = false;
    const showInitColours = false;
    const useRGB = false;

    let tilesArray = [];
    let stripesHeights = [];

    let width, height, aspectRatio, hPointsAmount, stripeAmount, hPointsInterval, vPointsAmount, vPointsInterval;

    p.setup = function() {
        let container = document.getElementById("artwork-container");
        let w = container.offsetWidth;
        let h = container.offsetHeight;
        let canvas = p.createCanvas(w, h);
        canvas.parent("artwork-container");

        width = w;
        height = h;
        aspectRatio = width / height;
        hPointsAmount = width * 0.0305;
        stripeAmount = hPointsAmount / 2;
        hPointsInterval = width / hPointsAmount;
        vPointsAmount = hPointsAmount / aspectRatio;
        vPointsInterval = height / vPointsAmount;

        p.background(0);

        if (useRGB) {
            p.colorMode(p.RGB, 255, 255, 255);
        } else {
            p.colorMode(p.HSB, 360, 100, 100);
        }

        p.noStroke();

        if (showgrid) {
            p.stroke(200);
        }

        if (showInitColours || showgrid) {
            p.noLoop();
        }

        initArrays(stripesHeights, tilesArray);

        genTopBorder(tilesArray);
        genMiddleTiling(tilesArray);
        computeNeighbours(tilesArray);

        if ((!showgrid && !showInitColours) || showInitColours)
            if (useRGB) {
                initColoursRGB(tilesArray);
            } else initColours(tilesArray);
    };

    p.draw = function() {
        if (p.frameCount % 160 == 0) {
            setStripesHeights(stripesHeights);
        }
        if (p.frameCount % 4 == 0) {
            if (useRGB) {
                genColoursRGB(tilesArray);
            } else genColours(tilesArray);
            for (i = 0; i < stripesHeights.length; i++) {
                if (stripesHeights[i][1] > stripesHeights[i][0]) {
                    stripesHeights[i][0]++;
                    for (j = 0; j < tilesArray[i].length; j++) {
                        if (!tilesArray[i][j].drawn) {
                            tilesArray[i][j].drawn = true;
                            break;
                        }
                    }
                } else {
                    stripesHeights[i][0]--;
                    for (j = 2; j < tilesArray[i].length; j++) {
                        if (!tilesArray[i][j].drawn) {
                            tilesArray[i][j - 1].drawn = false;
                            break;
                        }
                    }
                }
            }
        }
    };

    function initArrays(stripesHeights, tilesArray) {
        for (i = 0; i < stripeAmount; i++) {
            tilesArray[i] = [];
            stripesHeights[i] = [1, 1 + p.random(vPointsAmount * 4 / 3)];
        }
    }

    function setStripesHeights(stripesHeights) {
        for (i = 0; i < stripeAmount; i++) {
            stripesHeights[i][1] = 1 + p.random(vPointsAmount * heightConstant);
        }
    }

    function initColours(tilesArray) {
        for (i = 0; i < stripeAmount; i++) {
            if (p.random(10) <= 3) {
                tilesArray[i][2].hue = p.random(360);
                tilesArray[i][2].drawn = true;
                tilesArray[i][1].drawn = true;
                stripesHeights[i][0] = 3;
            }
            tilesArray[i][0].drawn = true;
        }
    }

    function initColoursRGB(tilesArray) {
        for (i = 0; i < tilesArray.length; i++) {
            for (j = 0; j < stripesHeights[i][1]; j++) {
                let randomValue = p.random(400);
                if (randomValue <= 400 * 4 / 11) {
                    tilesArray[i][j + 2].RGB = [p.random((randomValue % 3) * 100, 255), p.random(((randomValue + 1) % 3) * 100, 255), p.random(((randomValue + 2) % 3) * 100, 255)];
                    tilesArray[i][j + 2].drawn = true;
                    tilesArray[i][j + 2].draw();
                    tilesArray[i][j + 1].drawn = true;
                    tilesArray[i][j + 1].draw();
                    tilesArray[i][j].drawn = true;
                    tilesArray[i][j].draw();
                    stripesHeights[i][0] = 3;
                } else tilesArray[i][0].drawn = true;
            }
        }
    }

    function genColours(tilesArray) {
        for (i = 0; i < tilesArray.length; i++) {
            for (j = 0; j < tilesArray[i].length; j++) {
                if (tilesArray[i][j].drawn) {
                    if (tilesArray[i][j].brightness < 90) {
                        tilesArray[i][j].brightness += 5;
                    }
                    let currentHue = tilesArray[i][j].hue;
                    let newHue = tilesArray[i][j].hue;
                    for (k = 0; k < tilesArray[i][j].neighbours.length; k++) {
                        if (tilesArray[i][j].neighbours[k].drawn) {
                            if (tilesArray[i][j].neighbours[k].hue > currentHue) {
                                newHue += p.min(tilesArray[i][j].neighbours[k].hue - currentHue, 3) + p.noise(noiseConstant * p.frameCount);
                            } else {
                                newHue += p.max(tilesArray[i][j].neighbours[k].hue - currentHue, -3) + p.noise(noiseConstant * p.frameCount);
                            }
                        }
                    }

                    tilesArray[i][j].hue = newHue % 360;
                    tilesArray[i][j].draw();
                } else {
                    if (tilesArray[i][j].brightness > 0) {
                        tilesArray[i][j].brightness -= 5;
                        let currentHue = tilesArray[i][j].hue;
                        let newHue = tilesArray[i][j].hue;
                        for (k = 0; k < tilesArray[i][j].neighbours.length; k++) {
                            if (tilesArray[i][j].neighbours[k].drawn) {
                                if (tilesArray[i][j].neighbours[k].hue > currentHue) {
                                    newHue += p.min(tilesArray[i][j].neighbours[k].hue - currentHue, 3) + p.noise(noiseConstant * p.frameCount);
                                } else {
                                    newHue += p.max(tilesArray[i][j].neighbours[k].hue - currentHue, -3) + p.noise(noiseConstant * p.frameCount);
                                }
                            }
                        }
                        tilesArray[i][j].hue = newHue % 360;
                        tilesArray[i][j].draw();
                    }
                }
            }
        }
    }

    function genColoursRGB(tilesArray) {
        for (i = 0; i < tilesArray.length; i++) {
            for (j = 0; j < tilesArray[i].length; j++) {
                if (tilesArray[i][j].drawn) {
                    let currentRed = tilesArray[i][j].RGB[0];
                    let currentGreen = tilesArray[i][j].RGB[1];
                    let currentBlue = tilesArray[i][j].RGB[2];
                    for (k = 0; k < tilesArray[i][j].neighbours.length; k++) {
                        if (tilesArray[i][j].neighbours[k].drawn) {
                            currentRed += tilesArray[i][j].neighbours[k].RGB[0];
                            currentGreen = tilesArray[i][j].neighbours[k].RGB[1];
                            currentBlue += tilesArray[i][j].neighbours[k].RGB[2];
                        }
                    }

                    tilesArray[i][j].RGB = [(currentRed + p.random(-10, 10)) % 255, (currentGreen + p.random(-10, 10)) % 255, (currentBlue + p.random(-10, 10)) % 255];
                    tilesArray[i][j].draw();
                } else {
                    if (tilesArray[i][j].RGB[0] - 10 > 0) {
                        tilesArray[i][j].RGB[0] -= 10;
                    } else {
                        tilesArray[i][j].RGB[0] = 0;
                    }
                    if (tilesArray[i][j].RGB[1] - 10 > 0) {
                        tilesArray[i][j].RGB[1] -= 10;
                    } else {
                        tilesArray[i][j].RGB[1] = 0;
                    }
                    if (tilesArray[i][j].RGB[2] - 10 > 0) {
                        tilesArray[i][j].RGB[2] -= 10;
                    } else {
                        tilesArray[i][j].RGB[2] = 0;
                    }

                    tilesArray[i][j].draw();
                }
            }
        }
    }

    function computeNeighbours(tilesArray) {
        for (i = 0; i < tilesArray.length; i++) {
            for (j = 0; j < tilesArray[i].length - 2; j += 3) {
                Tile.makeNeighbours(tilesArray[i][j + 2], tilesArray[i][j]);
                Tile.makeNeighbours(tilesArray[i][j + 2], tilesArray[i][j + 1]);
                Tile.makeNeighbours(tilesArray[i][j + 2], tilesArray[i][j + 3]);
                Tile.makeNeighbours(tilesArray[i][j + 2], tilesArray[i][j + 4]);
            }
        }

        for (i = 0; i < tilesArray.length - 1; i++) {
            for (j = 1; j < tilesArray[i].length; j += 3) {
                Tile.makeNeighbours(tilesArray[i][j], tilesArray[i + 1][j - 1]);
            }
        }
    }

    function genTopBorder(tilesArray) {
        let commonPoint1 = new Point(0, 0);
        let commonPoint2 = new Point(0, vPointsInterval / 2);
        for (i = 0; i < hPointsAmount / 2; i++) {
            let j = 0;
            let midPoint = new Point((2 * i + 1) * hPointsInterval, 0);

            tilesArray[i][j++] = new Tile(commonPoint1, commonPoint2, midPoint);
            commonPoint1 = new Point((2 * i + 2) * hPointsInterval, 0);
            commonPoint2 = new Point((2 * i + 2) * hPointsInterval, vPointsInterval / 2);
            tilesArray[i][j] = new Tile(midPoint, commonPoint1, commonPoint2);
        }
    }

    function genMiddleTiling(tilesArray) {
        for (i = 0; i < hPointsAmount / 2; i++) {
            let commonPointH = new Point(2 * i * hPointsInterval, vPointsInterval / 2);
            let commonPointV = new Point((2 * i + 1) * hPointsInterval, 0);
            let tileCounter = 2;
            for (j = 0; j <= vPointsAmount; j++) {
                let newCommonPointH = new Point((2 * i + 2) * hPointsInterval, (2 * j + 1) * vPointsInterval / 2);
                let newCommonPointV = new Point((2 * i + 1) * hPointsInterval, (j + 1) * vPointsInterval);
                let futureCPH = new Point(commonPointH.x, commonPointH.y + vPointsInterval);
                tilesArray[i][tileCounter++] = Tile.new4(commonPointH, commonPointV, newCommonPointH, newCommonPointV);
                tilesArray[i][tileCounter - 1].draw();
                tilesArray[i][tileCounter++] = new Tile(commonPointH, newCommonPointV, futureCPH);
                tilesArray[i][tileCounter - 1].draw();
                tilesArray[i][tileCounter++] = new Tile(newCommonPointH, newCommonPointV, new Point(newCommonPointH.x, newCommonPointH.y + vPointsInterval));
                tilesArray[i][tileCounter - 1].draw();
                commonPointH = futureCPH;
                commonPointV = newCommonPointV;
            }
        }
    }

    class Tile {
        constructor(point1, point2, point3) {
            this.points = [point1, point2, point3];
            this.drawn = false;
            this.hue = p.random(360);
            this.RGB = [0, 0, 0];
            this.brightness = 0;
            this.neighbours = [];
        }

        static new4(point1, point2, point3, point4) {
            let newObject = new Tile(point1, point2, point3);
            newObject.addPoint(point4);
            return newObject;
        }

        static newX(pointsArray) {
            for (i = 0; i < pointsArray.length; i++) {
                this.points[i] = pointsArray[i];
            }
        }

        addNeighbour(newNeighbour) {
            this.neighbours[this.neighbours.length] = newNeighbour;
        }

        equals(tile) {
            for (i = 0; i < this.points.length; i++) {
                if (!tile.hasPointpoints[3](this.points[i])) return false;
            }
            return true;
        }

        hasPoint(x, y) {
            for (i = 0; i < this.points.length; i++) {
                if (this.points[i].x == x && this.points[i].y == y) return true;
            }
            return false;
        }

        addPoint(point) {
            this.points[this.points.length] = point;
        }

        setDrawn(value) {
            this.drawn = value;
        }

        draw() {
            if (useRGB) {
                p.fill(this.RGB[0], this.RGB[1], this.RGB[2]);
            } else {
                p.fill(this.hue, 80, this.brightness);
            }
            if (this.points.length == 3) {
                p.triangle(this.points[0].x, height - this.points[0].y, this.points[1].x, height - this.points[1].y, this.points[2].x, height - this.points[2].y);
            } else if (this.points.length == 4) {
                p.quad(this.points[0].x, height - this.points[0].y, this.points[1].x, height - this.points[1].y, this.points[2].x, height - this.points[2].y, this.points[3].x, height - this.points[3].y);
            } else p.print("Cannot draw this shape\n");
        }

        static makeNeighbours(neighbour1, neighbour2) {
            neighbour1.addNeighbour(neighbour2);
            neighbour2.addNeighbour(neighbour1);
        }
    }

    class Point {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        equals(point) {
            if (point.x == this.x && point.y == this.y) return true;
            else return false;
        }
    }
};
