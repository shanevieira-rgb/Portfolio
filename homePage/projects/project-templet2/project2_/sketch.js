function setup() {
  can = createCanvas(1920, 1080);
  background(0);
  frameRate(30);

  rad = height / 3;
  maxRadius = height / 2.2;

  mainSine = new SineSystem(NUMSINES, fund, ratio);
  slowSine = new SineSystem(NUMSINES, fund * 0.95, ratio);

  SVflock = new SVFlock();

  strokeWeight(2);
  noFill();

  actStartTime = millis();


}

function draw() {
  noStroke()
  let elapsed = millis() - actStartTime;

  fill(0, 8);
  rect(0, 0, width, height);

  // --- Act 1 ---
  SVdrawAct1(elapsed);

  // --- Act 2 ---
  if (elapsed > act2Start && elapsed < act3Start) {
    SVdrawAct2(elapsed - act2Start);
  }

  // --- Act 3 ---
  if (elapsed > act3Start) {
    SVdrawAct3(elapsed - act3Start);
  }


  SVrecordit();
}

// ---------------- ACT 1 ----------------
function SVdrawAct1(elapsed) {
  mainSine.update();
  slowSine.update();

  let p1 = mainSine.getLastPos();
  let p2 = slowSine.getLastPos();

  p1.limit(maxRadius);
  p2.limit(maxRadius);

  let progress = constrain(elapsed / zoomDuration, 0, 1);
  let zoomLevel = lerp(2.5, 1, SVeaseOutCubic(progress));

  globalPulse = map(sin(mainSine.angles[0] * 2), -1, 1, 0, 1);

  push();
  translate(width / 2, height / 2);
  scale(zoomLevel);

  stroke(100, 180, 255, alpha);
  SVdrawKaleidoLines(p1);

  stroke(255, 100, 200, alpha * 0.6);
  SVdrawKaleidoLines(p2);
  pop();
}

function SVeaseOutCubic(t) {
  return 1 - pow(1 - t, 3);
}

function SVdrawKaleidoLines(pos) {
  for (let i = 0; i < kaleidoSections; i++) {
    push();
    rotate((TWO_PI / kaleidoSections) * i);
    line(0, 0, pos.x, pos.y);
    pop();
    push();
    scale(1, -1);
    rotate((TWO_PI / kaleidoSections) * i);
    line(0, 0, pos.x, pos.y);
    pop();
  }
}

// ---------------- ACT 2 ----------------
function SVdrawAct2(t) {
  push();
  translate(width / 2, height / 2);

  let growthDuration = 15000;
  let progress = constrain(t / growthDuration, 0, 1);

  let amplitude = 60;
  let wavelength = 80;
  let speed = t * 0.003;

  let halfWidth = (width / 2) * progress;

  stroke(80, 150, 255, 100);
  SVdrawGrowingWave(amplitude, wavelength, speed, halfWidth);

  stroke(255, 120, 200, 60);
  SVdrawGrowingWave(amplitude * 0.7, wavelength * 1.2, speed * 0.95, halfWidth);
  pop();
}

function SVdrawGrowingWave(amplitude, wavelength, offset, halfWidth) {
  beginShape();
  for (let x = -halfWidth; x <= halfWidth; x += 8) {
    let y = sin((x / wavelength) + offset) * amplitude;
    vertex(x, y);
  }
  endShape();
}

// ---------------- ACT 3 ----------------
function SVdrawAct3(t) {
  if (SVflock.boids.length === 0) {
    for (let i = 0; i < 150; i++) {
      SVflock.SVaddBoid(new SVBoid(width / 2, height / 2));
    }
  }

  fill(0, 15);
  rect(0, 0, width, height);

  SVflock.SVrun();
}

// Sine 
class SineSystem {
  constructor(num, baseSpeed, speedRatio) {
    this.num = num;
    this.angles = Array(num).fill(PI);
    this.baseSpeed = baseSpeed;
    this.speedRatio = speedRatio;
  }

  update() {
    for (let i = 0; i < this.num; i++) {
      this.angles[i] =
        (this.angles[i] + (this.baseSpeed + this.baseSpeed * i * this.speedRatio)) % TWO_PI;
    }
  }

  getLastPos() {
    let x = 0;
    let y = 0;
    for (let i = 0; i < this.num; i++) {
      let r = rad / (i + 1);
      x += sin(this.angles[i]) * r;
      y += cos(this.angles[i]) * r;
    }
    return createVector(x, y);
  }
}

//  Flocking 
class SVFlock {
  constructor() {
    this.boids = [];
  }

  SVrun() {
    for (let b of this.boids) {
      b.SVrun(this.boids);
    }
  }

  SVaddBoid(b) {
    this.boids.push(b);
  }
}

class SVBoid {
  constructor(x, y) {
    this.acceleration = createVector(0, 0);
    this.velocity = p5.Vector.random2D().mult(random(1, 5));
    this.position = createVector(x, y);
    this.rBase = 3.0;
    this.r = this.rBase;
    this.maxspeed = 3;
    this.maxforce = 0.05;
  }

  SVrun(boids) {
    this.SVflock(boids);
    this.SVupdate();
    this.SVborders();
    this.SVrender();
  }

  SVapplyForce(force) {
    this.acceleration.add(force);
  }

  SVflock(boids) {
    let sep = this.SVseparate(boids);
    let ali = this.SValign(boids);
    let coh = this.SVcohesion(boids);
    sep.mult(1.5);
    ali.mult(1.0);
    coh.mult(1.0);
    this.SVapplyForce(sep);
    this.SVapplyForce(ali);
    this.SVapplyForce(coh);
  }

  SVupdate() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxspeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
    this.r = this.rBase + sin(globalPulse * PI * 2) * 1.5;
  }

  SVrender() {
    let theta = this.velocity.heading() + radians(90);
    let brightness = map(globalPulse, 0, 1, 120, 255);
    let col = color(100, 180, 255, brightness);
    stroke(col);
    fill(red(col), green(col), blue(col), brightness * 0.8);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -this.r * 2);
    vertex(-this.r, this.r * 2);
    vertex(this.r, this.r * 2);
    endShape(CLOSE);
    pop();
  }

  SVborders() {
    if (this.position.x < -this.r) this.position.x = width + this.r;
    if (this.position.y < -this.r) this.position.y = height + this.r;
    if (this.position.x > width + this.r) this.position.x = -this.r;
    if (this.position.y > height + this.r) this.position.y = -this.r;
  }

  SVseparate(boids) {
    let desiredseparation = 25.0;
    let steer = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < desiredseparation) {
        let diff = p5.Vector.sub(this.position, other.position);
        diff.normalize();
        diff.div(d);
        steer.add(diff);
        count++;
      }
    }
    if (count > 0) steer.div(count);
    if (steer.mag() > 0) {
      steer.normalize();
      steer.mult(this.maxspeed);
      steer.sub(this.velocity);
      steer.limit(this.maxforce);
    }
    return steer;
  }

  SValign(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighbordist) {
        sum.add(other.velocity);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(this.maxspeed);
      let steer = p5.Vector.sub(sum, this.velocity);
      steer.limit(this.maxforce);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  SVcohesion(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;
    for (let other of boids) {
      let d = p5.Vector.dist(this.position, other.position);
      if (d > 0 && d < neighbordist) {
        sum.add(other.position);
        count++;
      }
    }
    if (count > 0) {
      sum.div(count);
      return this.SVseek(sum);
    } else {
      return createVector(0, 0);
    }
  }

  SVseek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.normalize();
    desired.mult(this.maxspeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxforce);
    return steer;
  }
}

//  RECORDING
function keyPressed() {
  if (key === ' ' || key === 'Spacebar') {
    console.log("Start Recording");
    recMode = true;
  } else if (key === 's' || key === 'S') {
    console.log("Stopped Recording");
    recMode = false;
  }
}

function SVrecordit() {
  if (recMode === true) {
    let ext = nf(frameCount, 4);
    saveCanvas(can, 'frame-' + ext, 'jpg');
    console.log("rec " + ext);
  }
}