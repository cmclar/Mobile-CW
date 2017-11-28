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
  render()
  {
    canvasContext.drawImage(this.sImage,this.x, this.y);
  }
  // Method
  scrollBK(delta)
  {
    //var xPos = delta * this.vx;

    canvasContext.save();
    canvasContext.translate(-delta, 0);
    canvasContext.drawImage(this.sImage,0, 0);
    canvasContext.drawImage(this.sImage,this.sImage.width, 0);
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
var theCar;
var leftIcon;
var rightIcon;
var lastPt=null;
var gameOverScreen = false;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function resizeCar() {
  theCar.sImage.width = window.innerWidth/5;
  theCar.sImage.height = window.innerHeight/5;
  console.log(theCar.sImage.height*5);
}

function resizeBackground() {
  bkgdImage.sImage.height = window.innerHeight;
  console.log(bkgdImage.sImage.height);
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
    window.addEventListener('orientationchange', resizeCanvas, true);

    canvas.addEventListener("touchstart", touchDown, false);
    canvas.addEventListener("touchmove", touchXY, true);
    canvas.addEventListener("touchend", touchUp, false);

    document.body.addEventListener("touchcancel", touchUp, false);

    resizeCanvas();

    bkgdImage = new aSprite(0,0,"Road.png", 100, 0, "Generic");
    theCar = new aSprite(100,0,"car.png", 0, 0, "Generic");
    left = new aSprite(100, 0, "left.png", 0, 0, "Generic");

    resizeBackground();
    resizeCar();

    theCar.sPos(window.innerWidth/10,3*window.innerHeight/5);
    left.sPos(window.innerWidth/10,4*window.innerHeight/5);
    //console.log(theCar.y);
    startTimeMS = Date.now();
    gameLoop();
  }
}

function gameLoop(){
  //console.log("gameLoop");
  var elapsed = (Date.now() - startTimeMS)/1000;
  travel += elapsed * bkgdImage.vx;
  if (travel > bkgdImage.sImage.width)
  {
    travel = 0;
  }

  update(elapsed);
  render(elapsed);
  startTimeMS = Date.now();
  requestAnimationFrame(gameLoop);
}

function render(delta) {
  canvasContext.clearRect(0,0,canvas.width, canvas.height);
  bkgdImage.scrollBK(travel);
  theCar.render();
  left.render();
}

function update(delta) {
}

function collisionDetection() {
  console.log("x");
  console.log(left.x);
  console.log(lastPt.x);
  console.log("y");
  console.log(left.y);
  console.log(lastPt.x);
  if ((lastPt.x > left.x && lastPt.x < left.sImage.width) && (lastPt.y > left.y && lastPt.y < left.sImage.height))
  {
    travel += elapsed * bkgdImage.vx;
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
}

function touchDown(evt) {
  evt.preventDefault();
  if(gameOverScreen)
  {
    return;
  }
  touchXY(evt);
}

function touchXY(evt) {
  evt.preventDefault();
  if(lastPt!=null) {
    var touchX = evt.touches[0].pageX - canvas.offsetLeft;
    var touchY = evt.touches[0].pageY - canvas.offsetTop;
  }
  lastPt = {x:evt.touches[0].pageX, y:evt.touches[0].pageY};
  collisionDetection(evt);
}
