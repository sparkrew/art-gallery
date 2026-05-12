// The fractal trees were inspired by Daniel Shiffmal fractal trees!
// Source: https://www.youtube.com/watch?v=0jjeOYMjmDU

var sketch = function(p) {

var len, len1, angle, angle1
var recdWidth, recHeight, recdX, recX, blocks, recY, extraheight
var maxflakes, snowX, snowWidth, snowY, snowHeight

p.setup = function() {
  let container = document.getElementById("artwork-container");
  let w = container.offsetWidth;
  let h = container.offsetHeight;
  let canvas = p.createCanvas(w, h);
  canvas.parent("artwork-container");
};


p.draw = function() {
  p.background(0);
  
  // Trees and the Frost
  frostTrees();
  
  // Statue
  Statue();
  
  // Snow 
  snowstrom(1200, 0, p.width, 0, p.height);
  
  p.noLoop();
};

// Functions for the statue!

function Statue(){
  recWidth = 500;  
  recHeight = 110; 
  recX = (p.width - recWidth) / 2;
  recY = (35)
  extraheight = 15;
  blocks = p.floor(p.random(2,6));
  drawIrregularrecs(recWidth,recHeight+extraheight,recX,recY);
  let temp = recHeight+extraheight+3 ;
  for (let i=0; i < blocks; i++){
  drawIrregulargrid(recWidth,recHeight,recX,recY + temp);
  temp += recHeight+3;
  }
  drawIrregularrecs(recWidth,recHeight+15,recX,recY+temp);
}

function drawIrregularrecs(recWidth,recHeight,recX,recY) {
  
    maxflakes = 5;
    
    let currentX = recX;
    let minWidth = 20;
    let maxWidth = 100;
    
    while (currentX < recX + recWidth) {
        let remainingSpace = (recX + recWidth) - currentX;
        let columnWidth;
        
        if (remainingSpace <= minWidth * 2) {
            columnWidth = remainingSpace;
        } else {
            columnWidth = p.random(minWidth, maxWidth);
        }
        
        columnWidth = p.min(columnWidth, remainingSpace);
        
        p.fill(p.random(150, 200));
        p.stroke(255); 
        p.strokeWeight(2);
        p.rect(currentX, recY, columnWidth, recHeight);
      
        snowstrom(maxflakes, currentX, columnWidth, recY, recHeight)
        
        currentX += columnWidth;
    }
    
}

function drawIrregulargrid(recWidth, recHeight, recX, recY) {
    maxflakes = 9;
    
    let currentX = recX;
    let minWidth = 20;
    let minHeight = 15;
    let maxWidth = 100;
    let maxHeight = 80;
    
    while (currentX < recX + recWidth) {
        let remainingWidth = (recX + recWidth) - currentX;
        let columnWidth;
        
        if (remainingWidth < minWidth * 2) {
            columnWidth = remainingWidth; 
        } else {
            columnWidth = p.random(minWidth, maxWidth);
        }
        columnWidth = p.min(columnWidth, remainingWidth);
        
        let currentY = recY;
        
        
        while (currentY < recY + recHeight) {
            let remainingHeight = (recY + recHeight) - currentY;
            let rowHeight;
            
            if (remainingHeight < minHeight * 2) {
                rowHeight = remainingHeight; 
            } else {
                rowHeight = p.random(minHeight, maxHeight);
            }
            rowHeight = p.min(rowHeight, remainingHeight);
            p.stroke(255);
            p.strokeWeight(2);
            p.fill(p.random(50, 100));
            p.rect(currentX, currentY, columnWidth, rowHeight);
            snowstrom(maxflakes, currentX, columnWidth, currentY, rowHeight);
            
            currentY += rowHeight;
        }
        
        currentX += columnWidth;
    }
}

// Function for the snow!

function snowstrom(maxflakes, snowX, snowWidth, snowY, snowHeight){
  p.noStroke();
  p.fill(255);
  margin = 5;
  numdots = p.floor(p.random(0, maxflakes+1));
  
  for (let i=0; i < numdots; i++){
    let dotX = p.random(snowX + margin, snowX + snowWidth - margin);
    let dotY = p.random(snowY + margin, snowY + snowHeight - margin);
    
    let size = p.random(3, 6);
    p.ellipse(dotX, dotY, size, size);
  }
  
}

// Functions for the trees and the frost!

function frostTrees(){
  len = p.random(50, 300);
  len1 = p.random(50, 300);
  p.stroke(255);
  p.strokeWeight(2);
  angle = p.random(p.PI/12, p.PI/3);
  angle1 = p.random(p.PI/20, p.PI/4); 
  
  // Draw tree 1
  p.push();
  p.translate(150, p.height);
  trees(len, angle);
  p.pop();
  
  // Draw tree 2
  p.push();
  p.translate(p.width - 150, p.height);
  trees(len1, angle1);
  p.pop();
  
  // Draw frost
  p.push();
  p.translate(0, p.height-100); 
  frost(len1, angle1);
  p.pop();
  
  p.push();
  p.translate(0, p.height-300); 
  frost(len, angle);
  p.pop();
}

function frost(len, angle){
  p.rotate(angle);
  
  p.line(0,0,0, -len);
  p.translate(0,-len)
  if (len>1
     ){
    frost(len*0.69,angle)
    frost(len*0.69,-angle)
  }
}

function trees(len, angle){
  p.line(0,0,0, -len);
  
  if (len>4){
    p.push();
    p.translate(0, -len);
    
    // Right branch
    p.push();
    p.rotate(angle);
    trees(len*0.69, angle);
    p.pop();
    
    // Left branch
    p.push();
    p.rotate(-angle);
    trees(len*0.69, angle);
    p.pop();
    
    p.pop();
  }
}

};
