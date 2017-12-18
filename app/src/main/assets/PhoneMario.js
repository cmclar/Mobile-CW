// Sprite Class
class aSprite {
  // Sprite Constructor
  constructor(x, y, imageSRC, velx, vely, spType){
    this.zindex = 0;
    this.x = x;
    this.y = y;
    this.vx = velx;
    this.vy = vely;
    this.sType = spType;
    this.sImage = new Image();
    this.sImage.src = imageSRC;
    this.active = true;
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

  // Sets the x and y coords of the sprite
  sPos(newX,newY){
    this.x = newX;
    this.y = newY;
  }

  // Basic Render Method
  render(width, height)
  {
    if (this.active)
    {
      canvasContext.drawImage(this.sImage,this.x, this.y, width, height);
    }
  }
  // Render Method for rendering the sky/background
  scrollBK(delta, width, height)
  {
    if (this.active)
    {
      canvasContext.save();
      canvasContext.translate(-delta, 0);
      canvasContext.drawImage(this.sImage,0, 0, width, height);
      canvasContext.drawImage(this.sImage,this.sImage.width, 0, width, height);
      canvasContext.drawImage(this.sImage,2*this.sImage.width, 0, width, height);
      canvasContext.drawImage(this.sImage,3*this.sImage.width, 0, width, height);
      canvasContext.restore();
    }
  }

  // Render method for rendering the floor
  scrollBrick(delta, width, height)
  {
    if (this.active)
    {
      canvasContext.save();
      canvasContext.translate(-delta, 0);
      canvasContext.drawImage(this.sImage, 0, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, width, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, 2 * width, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, 3 * width, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, 4 * width, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, 5 * width, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, 6 * width, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, 7 * width, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, 8 * width, canvas.height - height, width, height);
      canvasContext.drawImage(this.sImage, 9 * width, canvas.height - height, width, height);
      canvasContext.restore();
    }
  }


  // another render method
  scrollSB(delta, width, height){
    //this.x -= delta / this.vx;
    if (this.active)
    {
      canvasContext.drawImage(this.sImage,this.x, this.y, width, height);
    }
  }


  //((obj.x + window.innerWidth/20 >= this.x) && (obj.x <= (this.x + window.innerWidth/20))) &&

  // collision detection method, takes in a sprite object as a parameter
  checkCollisions(obj)
  {
    if (this.active)
    {
      if (((obj.x + window.innerWidth/20 >= this.x) && (obj.x <= (this.x + window.innerWidth/20))) &&((obj.y >= (this.y + window.innerHeight/30)) && (obj.y <= (this.y + window.innerHeight/15))))
      {
        jumping = false;
        falling = true;
        this.active = false;
        brickSmash.play();
      }
      //console.log(obj.y, obj.y+window.innerHeight/15, this.y, this.y+innerHeight/45)
      //(obj.y + window.innerHeight/15 <= this.y + window.innerHeight/45)
      if (((obj.x + window.innerWidth/20 >= this.x) && (obj.x <= (this.x + window.innerWidth/20))) && (obj.y + window.innerHeight/15 <= this.y + window.innerHeight/45) && (obj.y + window.innerHeight/15 >= this.y))
      {
        obj.y = this.y-window.innerHeight/15;
        falling = false;
        jumping = false;
      }
    }
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

// Enemy class inheriting from the aSprite class
class Enemy extends aSprite {
  // Method
  spriteType(){
    super.spriteType();
    console.log('I am a ' + this.sType + ' instance of aSprite!!!');
  }

  // collision detection modified for enemy functionality
  checkEnemyCollisions(obj){
    if (this.active)
    {
      if (((obj.x + window.innerWidth/20 >= this.x) && (obj.x <= (this.x + window.innerWidth/20))) && (obj.y >= this.y - (2* window.innerHeight/45)))
      {
        dieSound.play();
        screenMode = 2;
        this.active = false;
      }
      if (((obj.x + window.innerWidth/20 >= this.x) && (obj.x <= (this.x + window.innerWidth/20))) && (obj.y + window.innerHeight/15 <= this.y + window.innerHeight/45) && (obj.y + window.innerHeight/15 >= this.y))
      {
        kickSound.play();
        this.active = false;
      }
    }
  }
}

// coin class inheriting from the aSprite class
class Coin extends aSprite {
  // Method
  spriteType(){
    super.spriteType();
    console.log('I am a ' + this.sType + ' instance of aSprite!!!');
  }

  // collision detection with modified functionality for the coins
  checkCoinCollisions(obj){
    if (this.active)
    {
      if (((obj.x + window.innerWidth/20 >= this.x) && (obj.x <= (this.x + window.innerWidth/20))) && ((obj.y <= this.y + window.innerHeight/15) && (obj.y >= this.y)))
      {
        coinSound.play();
        this.active = false;
        score++;
      }
    }
  }
}

// canvas
var canvas;
var canvasContext;

// mario object and the distance travelled
var travel=0;
var mario;

// touch coords and elapsed time
var lastPt=null;
var elapsed = null;

// scene variable to track scene transitions
var screenMode = 0;

// objects for the left and right arrows
var leftIcon;
var rightIcon;

// bool variables to indicate if left and right have been pressed
var leftPressed = false;
var rightPressed = false;


// audio objects
var bkgdAudio = new Audio('SuperMarioBros.mp3');
var clickAudio = new Audio('click.wav');
var jumpAudio = new Audio('jump.wav');
var brickSmash = new Audio('brickSmash.wav');
var kickSound = new Audio('kick.wav');
var dieSound = new Audio('die.mp3');
var coinSound = new Audio('coin.mp3');

// bools to track the jumping state of the player character
var jumping = false;
var falling = false;

// player characters starting position on the y axis
var marioStartPosY;

// variables for the brick and coin heights
var brickHeight = 13*window.innerHeight/20;
var coinHeight = 11*window.innerHeight/20;

// score variable and a variable to track how many times the level has scrolled
var score = 0;
var counter = 0;

// resizes the canvas to the screen size of the device
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

// load function to iniate the game once called through the html file
function load()
{
  canvas = document.getElementById('gameCanvas');
  canvasContext = canvas.getContext('2d');
  init();
}

// initialises the game states
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

    // assign each sprite object
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
    shroom = new Enemy(0, 0, "goomba.png", 60, 0, "Generic");

    // calculate the starting y position for mario
    marioStartPosY = canvas.height - (3*canvas.height/20 + window.innerHeight/15)

    // set the sprite positions
    mario.sPos(canvas.width/10, marioStartPosY);
    left.sPos(canvas.width/10, 9 * canvas.height/10);
    right.sPos(3*canvas.width/10, 9 * canvas.height/10);
    aButton.sPos(7*canvas.width/10, 9 * canvas.height/10);
    startButton.sPos(canvas.width/2 - canvas.width/20, 5 *canvas.height/10);
    exitButton.sPos(canvas.width/2 - canvas.width/20, 6 *canvas.height/10);
    startImage.sPos(canvas.width/2 - canvas.width/6, 1 *canvas.height/10);
    shroom.sPos(16*canvas.width/15, marioStartPosY);

    // set the brick and coin sprite positions
    initialiseBricks();

    // records the starting time of the application
    startTimeMS = Date.now();

    // loops the background audio and plays it
    bkgdAudio.loop = true;
    bkgdAudio.play();

    // starts the game loop
    gameLoop();
  }
}

// controls the main game loop
function gameLoop(){
  // records the elapsed time of the application
  elapsed = (Date.now() - startTimeMS)/1000;

  // forces mario to always fall unless he is jumping or on solid ground
  if (!jumping)
  {
    falling = true;
  }

  // updates the scene
  update(elapsed);
  // renders the scene
  render(elapsed);

  startTimeMS = Date.now();
  requestAnimationFrame(gameLoop);
}

// function to render the scene
function render(delta) {
  // renders the main menu
  if (screenMode == 0)
  {
    // render each sprite in the menu
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    bkgdImage.scrollBK(travel, bkgdImage.sImage.width, canvas.height);
    floor.scrollBrick(travel, floor.sImage.width/3, 3*canvas.height/20);
    startButton.render(window.innerWidth/10, window.innerHeight/10);
    exitButton.render(window.innerWidth/10, window.innerHeight/10);
    startImage.render(window.innerWidth/3, 3 * window.innerHeight/10);
    left.render(window.innerWidth/10, window.innerHeight/10);
    right.render(window.innerWidth/10, window.innerHeight/10);
    aButton.render(window.innerWidth/10, window.innerHeight/10);
  }
  // renders the main game loop
  if (screenMode == 1)
  {
    // render each sprite in the main game loop
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    bkgdImage.scrollBK(travel, bkgdImage.sImage.width, canvas.height);
    floor.scrollBrick(travel, floor.sImage.width/3, 3*canvas.height/20);
    mario.render(window.innerWidth/15, window.innerHeight/15);
    left.render(window.innerWidth/10, window.innerHeight/10);
    right.render(window.innerWidth/10, window.innerHeight/10);
    aButton.render(window.innerWidth/10, window.innerHeight/10);
    brick1.scrollSB(travel, window.innerWidth/15, window.innerHeight/15);
    brick2.scrollSB(travel, window.innerWidth/15, window.innerHeight/15);
    brick3.scrollSB(travel, window.innerWidth/15, window.innerHeight/15);
    coin1.scrollSB(travel, window.innerWidth/15, window.innerHeight/15);
    coin2.scrollSB(travel, window.innerWidth/15, window.innerHeight/15);
    coin3.scrollSB(travel, window.innerWidth/15, window.innerHeight/15);
    shroom.scrollSB(travel, window.innerWidth/15, window.innerHeight/15);
    styleText('white', '50px Courier New', 'center', 'middle');
    canvasContext.fillText("score: " + score, canvas.width/2, canvas.height/13);
  }
  // renders the end scene
  if (screenMode == 2)
  {
    // render each sprite in the end screen
    canvasContext.clearRect(0,0,canvas.width, canvas.height);
    bkgdImage.scrollBK(travel, bkgdImage.sImage.width, canvas.height);
    floor.scrollBrick(travel, floor.sImage.width/3, 3*canvas.height/20);
    startButton.render(window.innerWidth/10, window.innerHeight/10);
    exitButton.render(window.innerWidth/10, window.innerHeight/10);
    startImage.render(window.innerWidth/3, 3 * window.innerHeight/10);

    // print the score to the screen
    styleText('white', '50px Courier New', 'center', 'middle');
    canvasContext.fillText("score: " + score, canvas.width/2, 9*canvas.height/20);
  }
}

// update the scene
function update(delta) {
  // manage movement within the scene
  movement();
  // perform collision detection
  collision();
}

// collision detection
function collision() {
  // for each object capable of collision check for any collisions with the mario player object
  brick1.checkCollisions(mario);
  brick2.checkCollisions(mario);
  brick3.checkCollisions(mario);
  coin1.checkCoinCollisions(mario);
  coin2.checkCoinCollisions(mario);
  coin3.checkCoinCollisions(mario);
  shroom.checkEnemyCollisions(mario);
}

// perform all movement functions
function movement() {
  // only update for movement if the game is in the main gameLoop
  if (screenMode == 1)
  {
    // move the enemy based on marios location
    if (shroom.x < mario.x)
    {
      shroom.x += elapsed * shroom.vx;
    }
    else if (shroom.x > mario.x) {
      shroom.x -= elapsed * shroom.vx;
    }

    // if the left key is pressed move all the sprites accordingly
    if (leftPressed)
    {
      travel -= elapsed * bkgdImage.vx;
      brick1.x += elapsed * brick1.vx;
      brick2.x += elapsed * brick1.vx;
      brick3.x += elapsed * brick1.vx;
      coin1.x += elapsed * coin1.vx;
      coin2.x += elapsed * coin2.vx;
      coin3.x += elapsed * coin3.vx;
      shroom.x += elapsed * 100;
    }
    // if the right key is pressed move all the sprites accordingly
    if (rightPressed)
    {
      travel += elapsed * bkgdImage.vx;
      brick1.x -= elapsed * brick1.vx;
      brick2.x -= elapsed * brick1.vx;
      brick3.x -= elapsed * brick1.vx;
      coin1.x -= elapsed * coin1.vx;
      coin2.x -= elapsed * coin2.vx;
      coin3.x -= elapsed * coin3.vx;
      shroom.x -= elapsed * 100;
    }
  }

  //loop the game world each time the player progresses one full screen
  if (travel > window.innerWidth * 2)
  {
    if (counter < 5)
    {
      counter++;
      initialiseBricks();
    }
    // if the game has been looped round 5 times move to the end screen
    else {
      screenMode = 2;
    }
  }

  // update the mario sprite when jumping
  if (jumping)
  {
    if (Date.now()/1000 < jumpTime + 1)
    {
      mario.y = mario.y - elapsed * canvas.height/3;
    }
    if (Date.now()/1000 >= jumpTime + 1)
    {
      jumping = false;
      falling = true;
    }
  }
  // update the mario sprite when falling
  if (falling)
  {
    mario.y = mario.y + elapsed * canvas.height/3;
    if (mario.y >= marioStartPosY)
    {
      mario.y = marioStartPosY;
      falling = false;
    }
  }
}

// function to load the bricks
function initialiseBricks() {
  travel = 0;
  brick1 = new aSprite(100 ,0,"singleBrick.png", 100, 0, "Generic");
  brick2 = new aSprite(100, 0, "singleBrick.png", 100, 0, "Generic");
  brick3 = new aSprite(100, 0, "singleBrick.png", 100, 0, "Generic");
  brick1.sPos(16*canvas.width/15, brickHeight);
  brick2.sPos(18*canvas.width/15, brickHeight);
  brick3.sPos(20*canvas.width/15, brickHeight);
  coin1 = new Coin(100, 0, "coin.png", 100, 0, "Generic");
  coin2 = new Coin(100, 0, "coin.png", 100, 0, "Generic");
  coin3 = new Coin(100, 0, "coin.png", 100, 0, "Generic");
  coin1.sPos(16*canvas.width/15, coinHeight);
  coin2.sPos(18*canvas.width/15, coinHeight);
  coin3.sPos(20*canvas.width/15, coinHeight);
  // if the enemy has been destroyed create a new enemy sprite
  if (!shroom.active)
  {
    shroom = new Enemy(100, 0, "goomba.png", 100, 0, "Generic");
    shroom.sPos(20*canvas.width/15, marioStartPosY);
  }
}

// collision detection for the virtual gamepad and menu buttons
function collisionDetection() {
  if (screenMode == 0 || screenMode == 2)
  {
    if ((lastPt.x > startButton.x && lastPt.x < (startButton.x + startButton.sImage.width)) && (lastPt.y > startButton.y && lastPt.y < (startButton.y + startButton.sImage.height)))
    {
      clickAudio.play()
      screenMode = 1;
      initialiseBricks();
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

// functionality for when a touch event ends
function touchUp(evt) {
  evt.preventDefault();
  // Terminate touch path
  lastPt=null;
  leftPressed = false;
  rightPressed = false;
}

// functionality for when a touch event begins
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
