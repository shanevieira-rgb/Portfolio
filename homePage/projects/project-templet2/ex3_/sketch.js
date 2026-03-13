let counter = 0;

let bug1x = 250;
let bug1y = 200;

let bug2x = 300;
let bug2y = 500;


let bug1Speed = 2;  
let bug2Speed = -2;  

let lilyImg;

function preload() {
  lilyImg = loadImage("assets/lilly_pads.png");
}

function setup() {
  createCanvas(725, 725);
  background(20);
  fill(255);
}

function draw() {
  background(78,165,181);
  stroke(83, 83, 83, 55);

  counter += .7;
  let flap = sin(counter) * 20; 


  bug1x += bug1Speed;
  bug2x += bug2Speed;


  if (bug1x > width + 165) {
    bug1x = -100;
  }

 
  if (bug2x < -250) {
    bug2x = width + 100;
  }

  SVlillyP(150, 650, 0, 0.6);
  SVlillyP(300, 450, 15, .9);
  SVlillyP(500, 580, -10, 0.7);
  SVlillyP(600, 700, 20, 0.8);
  SVlillyP(100, 400, -15, 0.4);
  SVlillyP(400, 300, 10, 0.5);
  SVlillyP(650, 350, -5, 0.6);
  SVlillyP(150, 150, -30, .8);
  SVlillyP(550, 150, 12, 0.55);

//---------------bugs
  SVbugbody(bug1x, bug1y, 90, .8, flap);
  SVbugbody2(bug2x, bug2y, -90, 1, flap);


  
}





function SVbugbody(lx, ly, rot, sz, flap) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);

  SVLleg(-20, 65, 40, 1);
  SVLleg(10, 41, 85, 1);
  SVRleg(10, 70, -40, 1);
  SVRleg(-8, 52, -85, 1);

  // Back wings 
  SVbwings(80, 50, flap * 0.5, 1);
  SVbwings(-80, 50, -flap * 0.5, 1);

  // Top wings 
  SVtwings(81, 40, 153 + flap, 1);
  SVtwings(-75, 0, 26 - flap, 1);

  // Body
  fill(0, 216, 176);
  ellipse(0, 0, 45, 45);
  fill(37, 150, 190);
  ellipse(0, 115, 40, 200);
  fill(15, 193, 174);
  ellipse(0, 75, 40, 70);
  fill(15, 193, 174);
  ellipse(0, 45, 45, 65);
  fill(0, 216, 176);
  ellipse(0, 20, 30, 25);

  // Eyes
  fill(7, 206, 182);
  SVeyes(20, -5, 340, 1);
  SVeyes(-20, -5, 20, 1);

  pop();
}

function SVbugbody2(lx, ly, rot, sz, flap) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);

   SVLleg(20, 32, -130, .7)
   SVRleg(-15, 30, 130, .7)
  SVLleg(-20, 65, 40, 1);
  SVLleg(10, 41, 85, 1);
  SVRleg(10, 70, -40, 1);
  SVRleg(-8, 52, -85, 1);

  // Back wings 
  SVbwings(80, 50, flap * 0.5, 1);
  SVbwings(-80, 50, -flap * 0.5, 1);

  // Top wings 
  SVtwings(81, 40, 153 + flap, 1);
  SVtwings(-75, 0, 26 - flap, 1);

  // Body
  fill(216, 8, 12);
  ellipse(0, 0, 45, 45);
  fill(191, 49, 38);
  ellipse(0, 115, 40, 200);
  fill(216, 8, 12);
  ellipse(0, 75, 40, 70);
  fill(216, 8, 12);
  ellipse(0, 45, 45, 65);
  fill(216, 8, 12);
  ellipse(0, 20, 30, 25);

  // Eyes
  fill(204, 11, 6);
  SVeyes(20, -5, 340, 1);
  SVeyes(-20, -5, 20, 1);
   SVeyes(7, 3, 340, .5);
    SVeyes(-7, 3, 20, .5);
  pop();
}


function SVtwings(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  fill(192, 191, 190, 190);
  ellipse(0, 20, 200, 60);
  pop();
}

function SVbwings(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  fill(192, 191, 190, 190);
  ellipse(0, 20, 200, 60);
  pop();
}

function SVeyes(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  
  ellipse(0, 0, 25, 29);

  fill("black");
  ellipse(0, 0, 17, 21);

  fill("white");
  ellipse(0, -5, 9, 13);
  pop();
}

function SVLleg(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  fill("black");
  rect(0, 0, 10, 50, 15);
  SVLfoot(-25, 14, -35, 1);
  SVtoe(60, 0, 5, 1);
  pop();
}

function SVLfoot(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  fill("black");
  rect(3, 40, 5, 50);
  pop();
}

function SVRleg(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  fill("black");
  rect(0, 0, 10, 50, 15);
  SVLfoot(25, 8, 35, 1);
  SVtoe(0, 0, 5, 1);
  pop();
}

function SVRfoot(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  fill("black");
  rect(3, 40, 5, 50);
  pop();
}

function SVtoe(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  fill("black");
  rect(-23, 85, 10, 5, 10);
  pop();
}

function SVlillyP(lx, ly, rot, sz) {
  push();
  translate(lx, ly);
  rotate(radians(rot));
  scale(sz);
  imageMode(CENTER);   // centers the lily pad
  image(lilyImg, 0, 0); // draws it
  pop();
}