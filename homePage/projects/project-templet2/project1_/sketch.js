let currentTool = 'svpen'; 
let strokeSize = 10;
let brushColor;
let drawingLayer;
let colorPicker;
let brushes = {};
let activeBrush = null;

function preload() {
  brushes.brush1 = loadImage('assets/plant1.png');
  brushes.brush2 = loadImage('assets/plant2.png');
}

function setup() {
  createCanvas(800, 600);
  background(240); 
  
  drawingLayer = createGraphics(width, height);
  drawingLayer.clear();
  
  brushColor = color(0); 
  
  // color picker
  colorPicker = createColorPicker(brushColor);
  colorPicker.position(10, height + 10);
}

function draw() {
  background(240);
  image(drawingLayer, 0, 0);
}

function mouseDragged() {
  drawingLayer.stroke(brushColor);
  drawingLayer.noFill();
  
  if (currentTool === 'svpen') {
    // Pen
    drawingLayer.strokeWeight(strokeSize);
    drawingLayer.line(mouseX, mouseY, pmouseX, pmouseY);
    
  } else if (currentTool === 'svairbrush') {
    // Airbrush
    drawingLayer.noStroke();
    drawingLayer.fill(brushColor, 30);
    for (let i = 0; i < 15; i++) {
      let r = strokeSize + random(-5, 5);
      let x = mouseX + random(-r, r);
      let y = mouseY + random(-r, r);
      drawingLayer.ellipse(x, y, r, r);
    }
    
  } else if (currentTool === 'sveraser') {
    // Eraser
    drawingLayer.erase();
    drawingLayer.strokeWeight(strokeSize);
    drawingLayer.line(mouseX, mouseY, pmouseX, pmouseY);
    drawingLayer.noErase();
    
  } else if (currentTool === 'svpngbrush' && activeBrush) {
    // PNG brush 
    let step = strokeSize / 2; 
    let d = dist(mouseX, mouseY, pmouseX, pmouseY);
    let steps = int(d / step);

    let brushScale = 3.0; 
    let brushSize = strokeSize * brushScale;

    for (let i = 0; i < steps; i++) {
      let t = i / steps;
      let x = lerp(pmouseX, mouseX, t);
      let y = lerp(pmouseY, mouseY, t);
      drawingLayer.image(activeBrush, x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    }
    
  } else if (currentTool === 'svtransparent') {
    // Transparent brush (soft circle with alpha)
    drawingLayer.noStroke();
    drawingLayer.fill(red(brushColor), green(brushColor), blue(brushColor), 100); // alpha=100
    drawingLayer.ellipse(mouseX, mouseY, strokeSize * 2, strokeSize * 2);
    
  } else if (currentTool === 'svrainbow') {
    // Rainbow vertical line brush
    let rainbow = [
      color(255, 0, 0),
      color(255, 127, 0),
      color(255, 255, 0),
      color(0, 255, 0),
      color(0, 0, 255),
      color(75, 0, 130),
      color(148, 0, 211)
    ];
    
    let lineHeight = strokeSize * 5;
    let stepY = lineHeight / rainbow.length;
    
    for (let i = 0; i < rainbow.length; i++) {
      drawingLayer.stroke(rainbow[i]);
      drawingLayer.strokeWeight(strokeSize);
      let y1 = mouseY + i * stepY - lineHeight / 2;
      let y2 = y1 + stepY;
      drawingLayer.line(mouseX, y1, mouseX, y2);
    }
  }
}

function keyPressed() {
  brushColor = colorPicker.color();

  if (key === 'p' || key === 'P') {
    currentTool = 'svpen';
  } else if (key === 'a' || key === 'A') {
    currentTool = 'svairbrush';
  } else if (key === 'e' || key === 'E') {
    currentTool = 'sveraser';
  } else if (key === 't' || key === 'T') {
    currentTool = 'svtransparent';
  } else if (key === 'r' || key === 'R') {
    currentTool = 'svrainbow';
  }

  // PNG brushes with L+1/2
  if (key === '1' && keyIsDown(76)) { 
    currentTool = 'svpngbrush';
    activeBrush = brushes.brush1;
  } else if (key === '2' && keyIsDown(76)) { 
    currentTool = 'svpngbrush';
    activeBrush = brushes.brush2;
  }
  
  // Stroke size
  if (key === '<' || key === ',') {
    strokeSize = max(1, strokeSize - 1);
  } else if (key === '>' || key === '.') {
    strokeSize += 1;
  }
}

function mousePressed() {
  brushColor = colorPicker.color();
}
