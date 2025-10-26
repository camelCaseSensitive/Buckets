// console.log(window.app)
// let bounce = new Audio('bounce.mp3')
let particles = [];
let clickedInCanvas = 0;

let leader = 0;
let leaderboard = [];
let fire = 1;

class Particle {
  constructor() {
    this.x = random(x - radius + 2, x + radius - 2);
    this.y = random(y-radius, y);
    this.vx = random(-1, 1);
    this.vy = random(-4, -2);
    this.alpha = 255;
    this.d = 16;
  }

  finished() {
    return this.alpha < 0;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 3;
    this.d -= random(0.05, 0.1);
  }

  show() {
    noStroke();
    if(this.alpha > 120){
      fill(random(200,230), random(50, 150), 10, this.alpha);
    } else {
      fill(random(100,130), random(10, 90), 10, this.alpha);
    }
    ellipse(this.x, this.y, this.d);
  }
}

function setup() {
  canvas = createCanvas(600, 400); //600 x 400 pixels
  canvas.parent('sketch-holder');
  canvas.id('mysketch')
  // Starting position of the ball
  x_start = 50;
  y_start = 325;
  let canvas_dom = document.getElementById("mysketch")
  canvas_dom.addEventListener("touchstart",  function(event) {event.preventDefault()})
canvas_dom.addEventListener("touchmove",   function(event) {event.preventDefault()})
canvas_dom.addEventListener("touchend",    function(event) {event.preventDefault()})
canvas_dom.addEventListener("touchcancel", function(event) {event.preventDefault()})
  
  mouseJustPressed = 0;
  shotMade = 0;
  score = 0;
  shots = 0;
  tries = 0;
  rims = 0;
  bricks = 0;
  textDisplay = 0;
  hotStreak = 0;
  bestStreak = 0;
  
  skyBall = 0;
  
  scoreCounted = 0;

  
  // Initialize variables x and y to ball start position
  // x and y are the screen coordinates of the ball
  x = x_start;
  y = y_start;
  
  // Hoop location
  hoopX = 500
  hoopY = 150
  
  // Direction the ball is moving? up or down 
  direction=1;
  speedX = 0.3; // this is really the x-speed
  
  speedY = -9;
  
  speed = sqrt(speedX*speedX + speedY*speedY);
  
  g = - 0.3;
  
  // Let Ball Fly
  shoot = 0;
  
  // Basketball radius
  radius = 20;
  
  
  // db.collection('leaderboard').doc('SHwtkrdAPsXSxOL6n8qB').update({
  //   name: "Harry",
  //   score: 25
  // })
}



let docId = "";
let docScore = 0;
let addDocument = true;

firebase.auth().signInAnonymously()
  .then(() => {
    // Signed in..
    // console.log("You're signed in (anonymously)!");
    // console.log("hello")
    db.collection('leaderboard').get()
      .then((snapshot) => {
      // console.log(snapshot.docs)
      snapshot.docs.forEach(doc => {
        let d = doc.data();
        if(d.owner == firebase.auth().currentUser.uid){
          // console.log("Owner is " + d.owner + " and current user is " + firebase.auth().currentUser.uid + " so they are the same: " + (d.owner == firebase.auth().currentUser.uid));
          docId = doc.id;
          docScore = d.score;
          addDocument = false;
        }
      })
    })
  .then(() => {
    // console.log(addDocument)
      if(addDocument){
          db.collection('leaderboard').add({
            name: "name",
            score: 0,
            owner: firebase.auth().currentUser.uid
          })
          .then(function(docRef) {
              console.log("Document written with ID: ", docRef.id);
              docId = docRef.id;
          })
          .catch(function(error) {
              // console.error("Error adding document: ", error);
          });
        }
    });
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    // ...
  });


function draw() {
  textAlign(CENTER)
  background(220);
  fill(210,180,140) // This is color of rect below
  rect(0, 200, 600, 200) // (x, y, width, height)
  
  // Coding assignment!  Play around with the values below, try to copy and paste to make a stadium steps 
  
  // First step
  fill(210,255,140) // This is color of rect below
  rect(25, 175, 550, 25) // (x, y, width, height)
  
  // second step
  fill(205,250,135) // This is color of rect below
  rect(50, 150, 500, 25) // (x, y, width, height)
  
  // Third Step
  fill(200,245,130) // This is color of rect below
  rect(75, 125, 450, 25)
  
  // Fourth step
  fill(195,240,125) // This is color of rect below
  rect(100, 100, 400, 25)
  
  fill(205,250,135) // This is color of rect below
  rect(125, 75, 350, 25)
  
  fill(205,250,135) // This is color of rect below
  rect(150, 50, 300, 25)
  fill(0)
  textSize(28)
  text("Buckets: " + score, 300, 35)
  fill(255, 100, 100)
  text("Shots: " + shots, 100, 35)
  fill(230, 200, 0)
  text("Hot Streak: " + hotStreak, 500, 35)
  
    
  
  //fill(205,250,135) // This is color of rect below
  //rect(175, 25, 250, 25)
  
  //fill(205,250,135) // This is color of rect below
  //rect(200, 0, 200, 25)
  
  // Hoop is an ellipse and some lines for the net
  noFill()
  stroke(0);
  strokeWeight(4);
  stroke(255,140,0);
  ellipse(hoopX,hoopY,radius*3,radius/2)
  stroke(0)
  fill(0,0,0)
  quad(hoopX + radius*3/2 - radius/5, hoopY-radius/5, hoopX + radius*3/2 + radius*0.75 - radius/5, hoopY + radius/5, hoopX + radius*3/2 + radius*0.75 - radius/5, hoopY - radius*3 + radius/5, hoopX + radius*3/2 - radius/5, hoopY - radius*3 - radius/5)
  line(hoopX + radius*3/2 + radius/10, hoopY, hoopX + radius*3/2 + radius/10,y_start+radius)
  //rect(hoopX + radius*3/2,hoopY-radius*3, radius*0.75, radius*3)
  noFill()
  //circle(440,100,5)
  stroke(255)
  // line(440,100, 540,200)
  // line(560, 100, 460, 200)
  stroke(0)
  
  strokeWeight(1);
  
  
  stroke(255)
  strokeWeight(4);
  line(hoopX-radius*3/2, hoopY , hoopX-radius, hoopY + 3*radius)
  line(hoopX +radius, hoopY + 3*radius, hoopX + radius*3/2, hoopY)
  line(hoopX + radius*3/2, hoopY, (hoopX - radius*3/2 + hoopX - radius)/2, hoopY+radius*3/2)
  line(hoopX - radius*3/2, hoopY, (hoopX + radius*3/2 + hoopX + radius)/2, hoopY+radius*3/2)
  line((hoopX - radius*3/2 + hoopX - radius)/2, hoopY+radius*3/2, hoopX +radius, hoopY + 3*radius)
  line((hoopX + radius*3/2 + hoopX + radius)/2, hoopY+radius*3/2, hoopX -radius, hoopY + 3*radius)
  stroke(0)
  strokeWeight(1)
  
  rimX = hoopX-radius*3/2
  rimY = hoopY
  
  boardX = hoopX + radius*3/2
  boardY = hoopY - radius*3
  
  //console.log(x)
  // Standard Form
  // y = a*x^2 + b*x + c
  // y = a*x*x + b*x + c
  
  // Vertex Form
  // y = a*(x-h)*(x-h) + k
  
  if (shoot == 1){
    speedY = speedY - g;
    
    x = x + direction*speedX
  
    y = y + speedY;
  
    if (y > y_start){
      y = y_start;
      speedY = -speedY*0.55;
      if(speedY < -0.5) {
        let b = new Audio("bounce.mp3");
        b.volume = speedY < -10 ? 1 : speedY/(-10)
        b.play()
      }
    }
    
    if (x > 600 - radius){
      let b = new Audio("bounceLoud.mp3");
      b.volume = speed > 30 ? 0.3 : abs(speedX)/70;
      b.play()
      x = 600 - radius;
      speedX = -speedX*0.5;
    }
    
    if (x < 0 + radius){
      let b = new Audio("bounceLoud.mp3");
      b.volume = speed > 30 ? 0.3 : abs(speedX)/70;
      b.play()
      x = radius;
      speedX = -speedX*0.5;
    }
    
  }
  
  if ((rimX-x)*(rimX-x) + (rimY-y)*(rimY-y) <= radius*radius){
    let r = new Audio("rim.mp3");
    r.volume = abs(speedY) > 25 ? 0.4 : abs(speedY)/55;
    r.play();
    speed = sqrt(speedX*speedX + speedY*speedY);
    speedX = -speed*(rimX-x)/radius;
    speedY = -speed*(rimY-y)/radius;
    rims += 1;
  }
  
  
  
  if (hoopY - radius*3 - radius/5 < y & y < hoopY + radius/5){
    if (x > hoopX + radius*3/2 - radius/5 - radius & x < hoopX + radius*3/2 + radius*0.75 - radius/5 & speedX > 0){
      x = hoopX + radius*3/2 - radius/5 - radius
      speedX = -speedX*0.5;
      bricks += 1;
      let back = new Audio('backboard2.mp3');
      back.volume = abs(speedX) > 10 ? 1 : abs(speedX)/10;
      back.play();
    }
    if (x > hoopX + radius*3/2 + radius*0.75 & x < hoopX + radius*3/2 + radius*0.75  +radius - radius/5 & speedX < 0){
      x =hoopX + radius*3/2 + radius*0.75 + radius - radius/5
      speedX = -speedX*0.5;
      let back = new Audio('backboard2.mp3');
      back.volume = abs(speedX) > 10 ? 1 : abs(speedX)/10;
      back.play();
    }
  }
  else if ((boardX-x)*(boardX-x) + (boardY-y)*(boardY-y) <= radius*radius){
    let back = new Audio('backboard2.mp3');
    back.volume = abs(speedX) > 10 ? 1 : abs(speedX)/10;
    back.play();
    speed = sqrt(speedX*speedX + speedY*speedY);
    speedX = -speed*(boardX-x)/radius;
    speedY = -speed*(boardY-y)/radius;
    bricks += 1;
  }
 
  if ((hoopX-x)*(hoopX-x) + (hoopY-y)*(hoopY-y) <= (0.6*radius)*(0.6*radius) & speedY > 0){
    shotMade = 1;
    speedX = 0.3*speedX;
    
  }
  
  if (y < -200){
    skyBall = 1;
  }
  
  if(y > rimY && speedY > 0 && shotMade == 0){
    hotStreak = 0;
  }
  
  if (bricks > 0 & rims == 0 & y > hoopY & shotMade == 0 & textDisplay == 0){
    textSize(64);
    fill(0)
    strokeWeight(3)
    stroke(255, 0, 0)
    textAlign(CENTER)
    text("Brick!", 300, y_start)
    noFill()
  }
  
  if (rims == 1 & bricks == 2 & y > hoopY & shotMade == 0 & textDisplay == 0){
    textSize(64);
    fill(0)
    strokeWeight(3)
    stroke(255, 0, 0)
    textAlign(CENTER)
    text("in-and-out", 300, y_start)
    noFill()
  }
  
  if (rims > 1 & bricks > 1 & y > hoopY & shotMade == 0 & textDisplay == 0){
    textSize(64);
    fill(0)
    strokeWeight(3)
    stroke(255, 0, 0)
    textAlign(CENTER)
    text("robbed...", 300, y_start)
    noFill()
  }
  
  if (rims > 6){
    speedX = speedX +0.1;
  }
  
  if (textDisplay == 0 & bricks == 0 & rims == 0 & speedY > 4 & y < hoopY & y != y_start & shotMade == 0 & x > hoopX +3*radius/2){
    textDisplay = 1
  }
  
  if (rims > 0){
    textDisplay = 0
  }
  if (textDisplay == 1 & y > hoopY & shotMade == 0){
    textSize(64);
    fill(0)
    strokeWeight(3)
    stroke(255, 0, 0)
    textAlign(CENTER)
    text("Air ball!", 300, y_start)
    noFill()
  }
  

  //console.log(y)
  
  // BOUNCING !!!! 
  
  //if(y > 400-diameter){
    //direction=-1
  //}
  
  //if(y < diameter){
    //direction=1
  //}
  
  
  // Draw ball shadow
  let al = 60 * (y_start + y)/y_start < 3 ? 3 : 60 * (y_start + y)/y_start;
  fill(0, 0, 0, al);
  noStroke()
  ellipse(x, y_start + radius, radius*2 + radius * (y_start - y)/y_start, radius/2 + radius / 2 * (y_start - y)/y_start)
  
  // Draw the circle last!!!
  fill(230,105,0)
  stroke(0)
  strokeWeight(1)
  
  circle(x, y, radius*2)  // Draws a circle at (x,y,radius)
  
  if(hotStreak == 3 && fire){
    for (let i = 0; i < 6; i++) {
      let p = new Particle();
      particles.push(p);
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].show();
      if (particles[i].finished()) {
        particles.splice(i, 1);
      }
    }
  }
  
  noFill()
  if (shotMade == 1){
    
    if (scoreCounted == 0){
      score += 1
      scoreCounted = 1
      let s = new Audio('swish.mp3');
      s.volume = speed > 10 ? 1 : speed/10;
      s.play();
      if (rims ==0 & bricks == 0){
        endText = "Swish!"
      }
      if (bricks > 0){
        endText = "Nice Shot!"
      }
      if (rims > 0 & bricks < 2){
        endText = "Draino!"
      }
      if (rims > 0 & bricks >=2){
        endText = "Buckets!"
      }
      if (x_start < 75){
        endText = "Ballin'!"
      }
      if (tries > 10){
        endText = "Buzzer Beater!"
      }
      if (skyBall == 1){
        endText = "Sky Hook!"
      }
      if (tries == 1){
        endText = "First Try!"
        if (hotStreak == 1){
          endText = "Heatin' up!"
        }
        if (hotStreak == 2){
          endText = "On Fire!"
        }
        if (hotStreak == 3){
          endText = "Respect..."
        }
        if (hotStreak == 4){
          endText = "Wet!"
        }
        if (hotStreak == 5){
          endText = "Ok... woah"
        }
        if (hotStreak == 6){
          endText = "LeBron is that you!?"
        }
        if (hotStreak == 7){
          endText = "You're a wizard Harry!"
        }
        if (hotStreak == 8){
          endText = "Can't be stopped!"
        }
        if (hotStreak == 9){
          endText = "STOP. DROP. ROLL."
        }
        if (hotStreak == 10){
          endText = "10!"
        }
        if (hotStreak == 11){
          endText = "WHAT!?"
        }
        if (hotStreak > 11){
          endText = "LEGEND STATUS!"
        }
        if (hotStreak > 12){
          endText = "INSANE!"
        }
        if (hotStreak > 13){
          endText = "SO GOOD!"
        }
        if (hotStreak > 14){
          endText = "ON POINT!"
        }
        if (hotStreak > 15){
          endText = "GOD MODE!"
        }
        hotStreak += 1;
        if(hotStreak >= bestStreak){
          bestStreak = hotStreak;
          document.getElementById("best").innerText = ("High Score: " + bestStreak);
        }
      }
      else {
        hotStreak = 1;
        if(hotStreak >= bestStreak){
          bestStreak = hotStreak;
          document.getElementById("best").innerText = ("High Score: " + bestStreak);
        }
      }
    
    }
    
    stroke(255)
    strokeWeight(4);
    line(hoopX-radius*3/2, hoopY , hoopX-radius, hoopY + 3*radius)
    line(hoopX +radius, hoopY + 3*radius, hoopX + radius*3/2, hoopY)
    line(hoopX + radius*3/2, hoopY, (hoopX - radius*3/2 + hoopX - radius)/2, hoopY+radius*3/2)
    line(hoopX - radius*3/2, hoopY, (hoopX + radius*3/2 + hoopX + radius)/2, hoopY+radius*3/2)
    line((hoopX - radius*3/2 + hoopX - radius)/2, hoopY+radius*3/2, hoopX +radius, hoopY + 3*radius)
    line((hoopX + radius*3/2 + hoopX + radius)/2, hoopY+radius*3/2, hoopX -radius, hoopY + 3*radius)
    stroke(0)
    strokeWeight(1)
    textSize(64);
    fill(0)
    strokeWeight(3)
    stroke(255, 255, 0)
    textAlign(CENTER)
    text(endText, 300, y_start)
    noFill()
  }
  stroke(0);
  strokeWeight(4);
  stroke(255,140,0)
  
  arc(hoopX, hoopY, radius*3, radius/2, 2*PI, PI, OPEN); 
  stroke(0)
  strokeWeight(1)
  
    
  
  if (mouseIsPressed && clickedInCanvas){
    rims = 0
    bricks = 0
    speedY = -9;
    shoot = 0;
    textDisplay = 0;
    skyBall = 0;
    if (mouseJustPressed == 0){
      if (shotMade == 1){
        if (random(0,1) > 0.75){
          x = random(1.5*radius, hoopX - 3*radius/2 - 2*radius)
        }
        else {
          x = random(1.5*radius, hoopX - 3*radius/2 - 4*radius);
        }
        y = random(200, 400 - 2*radius);
        hoopY = random(100,150)
        hoopX = random(500-radius*2, 500)
        mouseJustPressed = 1;
        x_start = x
        y_start = y
        shotMade = 0
        tries = 0
      }
      else {
        mouseJustPressed = 1;
        x = x_start
        y = y_start
      }
    }
    
    line(x_start, y_start, mouseX, mouseY)
  }
}


function mouseReleased() {
  if (mouseJustPressed == 1){
    shoot = 1;
    speedX = -g*5*(mouseX - x_start)/25;
    speedY = -g*5*(mouseY - y_start)/25;
    mouseJustPressed = 0;
    shotMade = 0;
    shots += 1
    scoreCounted = 0
    tries += 1;
    rims = 0
    bricks = 0
  }
  clickedInCanvas = 0;
}

function touchEnded() {
  if (mouseJustPressed == 1){
    shoot = 1;
    speedX = -g*5*(mouseX - x_start)/25;
    speedY = -g*5*(mouseY - y_start)/25;
    mouseJustPressed = 0;
    shotMade = 0;
    shots += 1
    scoreCounted = 0
    tries += 1;
    rims = 0
    bricks = 0
  }
  clickedInCanvas = 0;
  return null;
}

function mousePressed() {
  if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    clickedInCanvas = 1;
    if(hotStreak == 3) {
      fire = 0;
    } else {
      fire =1;
    }
  }
}

function touchStarted() {
  if(mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height){
    clickedInCanvas = 1;
    if(hotStreak == 3) {
      fire = 0;
    } else {
      fire =1;
    }
  }
  return null;
}

function submitScore() {
  if(document.getElementById("name").value){
    // console.log("submit score")
    // console.log(document.getElementById("name").value+ bestStreak)
    if (firebase.auth().currentUser !== null) 
      // console.log("user id: " + firebase.auth().currentUser.uid);
      // console.log("DocID :" + docId)
      // console.log(bestStreak + " vs " + docScore)
      if(bestStreak > docScore){
        db.collection('leaderboard').doc(docId).update({
          name: document.getElementById("name").value.slice(0,10),
          score: bestStreak
        })
      } else {
        db.collection('leaderboard').doc(docId).update({
          name: document.getElementById("name").value.slice(0,10)
        })
      }
    
    db.collection('leaderboard').get().then((snapshot) => {
    // console.log("Snapshot is " + snapshot.docs)
    leaderboard = [];
    snapshot.docs.forEach(doc => {
        let d = doc.data();
        if(d.name != "name"){
          leaderboard.push([d.score, d.name]);
        }
      })
      let leaderArray = order(leaderboard);
      // console.log("Leader array is : " + leaderArray)
      let table = document.getElementById("leader");
      table.innerHTML = "";
      let row = table.insertRow(0)
      row.style = "text-decoration: underline"
      // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
      let cell1 = row.insertCell(0);
      let cell2 = row.insertCell(1);
      let cell3 = row.insertCell(2);

      // Add some text to the new cells:
      cell1.innerHTML = "RANK";
      cell2.innerHTML = "PLAYER";
      cell3.innerHTML = "SCORE";
      for(let i = 0; i < leaderArray.length; i++){
        // console.log(i)
        // console.log(leaderArray[i])
        // Find a <table> element with id="myTable":
        
        
        // Create an empty <tr> element and add it to the 1st position of the table:
        row = table.insertRow(i+1);

        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
        cell1 = row.insertCell(0);
        cell2 = row.insertCell(1);
        cell3 = row.insertCell(2);

        // Add some text to the new cells:
        cell1.innerHTML = i + 1;
        cell2.innerHTML = leaderArray[i][1];
        cell3.innerHTML = leaderArray[i][0];
      }
    });
  }
  
}




function order(a){
  let good = a;
  // console.log("a0 is " + a);
  let l = [];
  let max = -1;
  let maxIndex = 0;
  while(a.length > 0){
    for(let i = 0; i < a.length; i++){
      if(a[i][0] > max){
        max = a[i][0];
        maxIndex = i;
      }
    }
    l.push(a[maxIndex]);
    a.splice(maxIndex, 1);
    max = -1;
  }
  return l;
}

