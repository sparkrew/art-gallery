var sketch = function(p) {

p.setup = function() {
    let container = document.getElementById("artwork-container");
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    let canvas = p.createCanvas(w, h);
    canvas.parent("artwork-container");
    p.noLoop();
};

p.draw = function() {
   
    p.background(25, 25, 112); 
    
    const cream = p.color(255, 204, 153);
    const beige = p.color(76, 153, 0); 
    const darkBrown = p.color(102, 102, 0); 
    const black = p.color(101, 67, 33); 
    const lightGray = p.color(204, 102, 0); 
    const BlueGray = p.color(255, 153, 51); 
    const paleBlue = p.color(204, 204, 0); 
    const white = p.color(255, 255, 102); 
    const terracotta = p.color(204, 85, 0); 
    const bronze = p.color(51, 36, 33); 
    const silver = p.color(51, 36, 33); 
    
    const panelWidth = 600; 
    const panelHeight = 730; 
    const panelX = 95;
    const panelY = 100;
    
    
    p.fill(silver);
    p.noStroke();

    p.rect(panelX - 5, panelY - 5, panelWidth + 10, panelHeight + 10);
    
    p.fill(white);
    p.rect(panelX, panelY, panelWidth, panelHeight);



    
    const leftStripWidth = 150;
    const rightStripWidth = 120;
    const centerWidth = panelWidth - leftStripWidth - rightStripWidth;
    
    p.fill(silver);
    p.rect(panelX + leftStripWidth, panelY, 2, panelHeight);
    
    p.fill(silver);
    p.rect(panelX + leftStripWidth + centerWidth, panelY, 2, panelHeight);



    
    const leftX = panelX;
    
    const topHeight = p.random(10, 320); 
    const space1 = p.random(1, 40); 
    const middleHeight = p.random(50, 350); 
    const space2 = p.random(1, 40); 
    const bottomHeight = panelHeight - topHeight - space1 - middleHeight - space2;
    
    p.fill(cream);
    p.rect(leftX, panelY, leftStripWidth, topHeight);

    p.fill(lightGray);
    p.rect(leftX, panelY + topHeight, leftStripWidth, space1);
    
    p.fill(beige);
    p.rect(leftX, panelY + topHeight + space1, leftStripWidth, middleHeight);

    p.fill(lightGray);
    p.rect(leftX, panelY + topHeight + space1 + middleHeight, leftStripWidth, space2);
    
    p.fill(cream);    
    p.rect(leftX, panelY + topHeight + space1 + middleHeight + space2, leftStripWidth, bottomHeight);



    
    const rightX = panelX + leftStripWidth + centerWidth + 2;
    
    const rightTopHeight = p.random(10, 220); 
    const rightSpace1 = p.random(1, 20);
    const rightMiddleUpperHeight = p.random(50, 250);
    const rightSpace2 = p.random(1, 2);
    const rightMiddleLowerHeight = p.random(25, 250);
    const rightSpace3 = p.random(1, 20);
    const rightBottomHeight = panelHeight - rightTopHeight - rightSpace1 - rightMiddleUpperHeight - rightSpace2 - rightMiddleLowerHeight - rightSpace3;
    
    p.fill(cream);
    p.rect(rightX, panelY, rightStripWidth, rightTopHeight);

    p.fill(lightGray);
    p.rect(rightX, panelY + rightTopHeight, rightStripWidth, rightSpace1);
    
    p.fill(paleBlue);
    p.rect(rightX, panelY + rightTopHeight + rightSpace1, rightStripWidth, rightMiddleUpperHeight);
    
    p.fill(lightGray);
    p.rect(rightX, panelY + rightTopHeight + rightSpace1 + rightMiddleUpperHeight, rightStripWidth, rightSpace2);

    p.fill(paleBlue);
    p.rect(rightX, panelY + rightTopHeight + rightSpace1 + rightMiddleUpperHeight + rightSpace2, rightStripWidth, rightMiddleLowerHeight);

    p.fill(lightGray);
    p.rect(rightX, panelY + rightTopHeight + rightSpace1 + rightMiddleUpperHeight + rightSpace2 + rightMiddleLowerHeight, rightStripWidth, rightSpace3);

    p.fill(cream);
    p.rect(rightX, panelY + rightTopHeight + rightSpace1 + rightMiddleUpperHeight + rightSpace2 + rightMiddleLowerHeight + rightSpace3, rightStripWidth, rightBottomHeight);

    


    const centerX = panelX + leftStripWidth + 2;
    
    const topBandHeight = p.random(10, 110);
    const secondUpperHeight = p.random(10, 80);
    const secondLowerHeight = p.random(50, 120);
    
    p.fill(darkBrown);
    p.rect(centerX, panelY, centerWidth - 2, topBandHeight);
    
    p.fill(black);
    p.rect(centerX, panelY + topBandHeight, centerWidth - 2, secondUpperHeight);

    p.fill(black);
    p.rect(centerX, panelY + topBandHeight + secondUpperHeight, centerWidth - 2, secondLowerHeight);
    
    
    const thirdBandY = panelY + topBandHeight + secondUpperHeight + secondLowerHeight;
    const thirdBandHeight = p.random(80, 220); 
    
    const darkBrownPanelWidth = p.random(10, 200);
    p.fill(darkBrown);
    p.rect(centerX, thirdBandY, darkBrownPanelWidth, thirdBandHeight);

    
    const grayPanelX = centerX + darkBrownPanelWidth;
    const grayPanelWidth = centerWidth - darkBrownPanelWidth - 2;
    p.fill(BlueGray);
    p.rect(grayPanelX, thirdBandY, grayPanelWidth, thirdBandHeight);

    
    const leftCircleX = grayPanelX + p.random(grayPanelWidth * 0.15, grayPanelWidth * 0.35);
    const leftCircleY = thirdBandY + p.random(thirdBandHeight * 0.3, thirdBandHeight * 0.7);
    const leftCircleSize = p.random(90, 240);
    p.fill(cream);
    p.ellipse(leftCircleX, leftCircleY, leftCircleSize, leftCircleSize);
    
    const rightCircleX = grayPanelX + p.random(grayPanelWidth * 0.65, grayPanelWidth * 0.85);
    const rightCircleY = thirdBandY + p.random(thirdBandHeight * 0.3, thirdBandHeight * 0.7);
    const rightCircleSize = p.random(50, 180);
    p.fill(bronze);
    p.ellipse(rightCircleX, rightCircleY, rightCircleSize, rightCircleSize);
    
    
    const fourthBandY = thirdBandY + thirdBandHeight;
    const fourthBandHeight = p.random(80, 120);
    p.fill(black);
    p.rect(centerX, fourthBandY, centerWidth - 2, fourthBandHeight);

    const centerSpace = p.random(1, 20);
    p.fill(lightGray);
    p.rect(centerX, fourthBandY + fourthBandHeight, centerWidth - 2, centerSpace);
    
    const fifthBandHeight = p.random(60, 100);
    p.fill(darkBrown);
    p.rect(centerX, fourthBandY + fourthBandHeight + centerSpace, centerWidth - 2, fifthBandHeight);
    
    const sixthBandHeight = p.random(40, 60);
    p.fill(white);
    p.rect(centerX, fourthBandY + fourthBandHeight + centerSpace + fifthBandHeight, centerWidth - 2, sixthBandHeight);
    
    const bottomBandHeight = panelHeight - (fourthBandY - panelY) - fourthBandHeight - centerSpace - fifthBandHeight - sixthBandHeight;
    p.fill(terracotta);
    p.rect(centerX, fourthBandY + fourthBandHeight + centerSpace + fifthBandHeight + sixthBandHeight, centerWidth - 2, bottomBandHeight);
};

};
