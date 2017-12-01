class aSprite {
  constructor(x, y, imageSRC, velx, vely, spType){
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sType = spType;
    this.sImage = new Image();
    this.sImage.src = imageSRC;
  }
  // Getter
  get xPos(){
    return this.x;
  }

  get yPos(){
    return this.y;
  }

  // Setter
  set xPos(newX){
    this.x = newX;
  }

  set yPos(newY){
    this.y = newY;
  }

  // Method
  render(width, height)
  {
    canvasContext.drawImage(this.sImage,this.x, this.y, width, height);
  }
  // Method
  scrollBK(delta, width, height)
  {
    //var xPos = delta * this.vx;

    canvasContext.save();
    canvasContext.translate(-delta, 0);
    canvasContext.drawImage(this.sImage,0, 0, width, height);
    canvasContext.drawImage(this.sImage,this.sImage.width, 0, width, height);
    canvasContext.restore();
  }

  scrollBrick(delta, width, height)
  {
    //var xPos = delta * this.vx;

    canvasContext.save();
    canvasContext.translate(-delta, 0);
    canvasContext.drawImage(this.sImage, 0, canvas.height - height, width, height);
    canvasContext.drawImage(this.sImage, width, canvas.height - height, width, height);
    canvasContext.drawImage(this.sImage, 2 * width, canvas.height - height, width, height);
    canvasContext.drawImage(this.sImage, 3 * width, canvas.height - height, width, height);
    canvasContext.drawImage(this.sImage, 4 * width, canvas.height - height, width, height);
    canvasContext.restore();
  }
  // Method
  sPos(newX,newY){
    this.x = newX;
    this.y = newY;
  }

  // Static Method
  static distance(a, b) {
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.hypot(dx, dy);
  }

  // Method
  spriteType(){
    console.log('I am an instance of aSprite!!!');
  }

}

class Enemy extends aSprite {
  // Method
  spriteType(){
    super.spriteType();
    console.log('I am a ' + this.sType + ' instance of aSprite!!!');
  }
}

var canvas;
var canvasContext;

var travel=0;
var mario;

var lastPt=null;
var elapsed = null;

var screenMode = 0;

var leftIcon;
var rightIcon;

var leftPressed = false;
var rightPressed = false;

var bkgdAudio = new Audio('SuperMarioBros.mp3');
var clickAudio = new Audio('click.wav');
var jumpAudio = new Audio('jump.wav');
var brickSmash = new Audio('brickSmash.wav');
var kickSound = new Audio('kick.wav');

var jumping = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function load()
{
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  init();
}

function init() {

  if (canvas.getContext) {
    //Set Event Listeners for window, mouse and touch
    window.addEventListener('resize', resizeCanvas, false);
    window.addEventListener('orientationchange', resizeCanvas, false);

    canvas.addEventListener("touchstart", touchDown, false);
    canvas.addEventListener("touchmove", touchXY, true);
    canvas.addEventListener("touchend", touchUp, false);

    document.body.addEventListener("touchcancel", touchUp, false);

    resizeCanvas();

    bkgdImage = new aSprite(0,0,"clouds.png", 100, 0, "Generic");
    startImage = new aSprite(0,0,"Menu.png", 0, 0, "Generic");
    endImage = new aSprite(0,0,"clouds.png", 0, 0, "Generic");
    mario = new aSprite(100,0,"mario.png", 0, 0, "Generic");
    left = new aSprite(100, 0, "left.png", 0, 0, "Generic");
    right = new aSprite(100, 0, "right.png", 0, 0, "Generic");
    aButton = new aSprite(100, 0, "Abutton.png", 0, 0, "Generic");
    floor = new aSprite(100, 0, "brick.png", 100, 0, "Generic");
    startButton = new aSprite(0,0,"startButton.png", 0, 0, "Generic");
    exitButton = new aSprite(0,0,"exit.png", 0, 0, "Generic");

    mario.sPos(canvas.width/10, canvas.height - (3*canvas.height/20 + window.innerHeight/15));
    left.sPos(canvas.width/10, 9 * canvas.height/10);
    right.sPos(3*canvas.width/10, 9 * canvas.height/10);
    aButton.sPos(7*canvas.width/10, 9 * canvas.height/10);
    startButton.sPos(canvas.width/2 - canvas.width/20, 5 *canvas.height/10);
    exitButton.sPos(canvas.width/2 - canvas.width/20, 6 *canvas.height/10);
    startImage.sPos(canvas.width/2 - canvas.width/6, 1 *canvas.height/10);

    startTimeMS = Date.now();
    bkgdAudio.loop = true;
    bkgdAudio.play();
    gameLoop();
  }
}

function gameLoop(){
  elapsed = (Date.now() - startTimeMS)/1000;
  if (leftPressed)
  {
    travel -= elapsed * bkgdImage.vx;
  }
  if (rightPressed)
  {
    travel += elapsed * bkgdImage.vx;
  }

  if (travel > bkgdImage.sImage.width)
  {
    travel = 0;
  }

  if (jumping)
  {
    if (Date.now()/1000 < jumpTime + 1)
    {
      mario.y = mario.y - elapsed * 100;
    }
    if ((Date.now()/1000 >= jumpTime + 1) && (Date.now()/1000 < jumpTime + 2))
    {
      mario.y = mario.y + elapsed * 100;
    }
  }
  update(elapsed);
  render(elapsed);

  startTimeMS = Date.now();
  requestAnimationFrame(gameLoop);
}

function render(delta) {
  if (screenMode == 0)
  {
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    bkgdImage.scrollBK(travel, bkgdImage.sImage.width, canvas.height);
    floor.scrollBrick(travel, floor.sImage.width/3, 3*canvas.height/20);
    startButton.render(window.innerWidth/10, window.innerHeight/10);
    exitButton.render(window.innerWidth/10, window.innerHeight/10);
    startImage.render(window.innerWidth/3, 3 * window.innerHeight/10);
  }
  if (screenMode == 1)
  {
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    bkgdImage.scrollBK(travel, bkgdImage.sImage.width, canvas.height);
    floor.scrollBrick(travel, floor.sImage.width/3, 3*canvas.height/20);
    mario.render(window.innerWidth/15, window.innerHeight/15);
    left.render(window.innerWidth/10, window.innerHeight/10);
    right.render(window.innerWidth/10, window.innerHeight/10);
    aButton.render(window.innerWidth/10, window.innerHeight/10);
  }
}

function update(delta) {
}

function collisionDetection() {
  if (screenMode == 0)
  {
    if ((lastPt.x > startButton.x && lastPt.x < (startButton.x + startButton.sImage.width)) && (lastPt.y > startButton.y && lastPt.y < (startButton.y + startButton.sImage.height)))
    {
      clickAudio.play()
      screenMode = 1;
    }
    if ((lastPt.x > exitButton.x && lastPt.x < (exitButton.x + exitButton.sImage.width)) && (lastPt.y > exitButton.y && lastPt.y < (exitButton.y + exitButton.sImage.height)))
    {
      return;
    }
  }
  if (screenMode == 1)
  {
    if ((lastPt.x > left.x && lastPt.x < (left.x + left.sImage.width)) && (lastPt.y > left.y && lastPt.y < (left.y + left.sImage.height)))
    {
      leftPressed = true;
    }
    if ((lastPt.x > right.x && lastPt.x < (right.x + right.sImage.width)) && (lastPt.y > right.y && lastPt.y < (right.y + right.sImage.height)))
    {
      rightPressed = true;
    }
    if ((lastPt.x > aButton.x && lastPt.x < (aButton.x + aButton.sImage.width)) && (lastPt.y > aButton.y && lastPt.y < (aButton.y + aButton.sImage.height)))
    {
      jumpAudio.play();
      jumping = true;
      jumpTime = Date.now()/1000;
    }
  }
}

function styleText(txtColour, txtFont, txtAlign, txtBaseline)
{
  canvasContext.fillStyle = txtColour;
  canvasContext.font = txtFont;
  canvasContext.textAlign = txtAlign;
  canvasContext.textBaseline = txtBaseline;
}

function touchUp(evt) {
  evt.preventDefault();
  // Terminate touch path
  lastPt=null;
  leftPressed = false;
  rightPressed = false;
}

function touchDown(evt) {
  evt.preventDefault();

  if(lastPt!=null) {
    var touchX = evt.touches[0].pageX - canvas.offsetLeft;
    var touchY = evt.touches[0].pageY - canvas.offsetTop;
  }
  lastPt = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
  collisionDetection(evt);
}

function touchXY(evt) {
  evt.preventDefault();
}
