const canvas = document.querySelector('#game');
const game = canvas.getContext('2d');
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');

let canvasSize;
let elementsSize;
let level = 0;
let lives = 3;


let timeStar;
let timePlayer;
let timeInterval;
const playerPosition = {
  x: undefined, 
  y: undefined,
}

const giftPosition = {
  x: undefined,
  y: undefined,
}

let enemyPositions= [];

window.addEventListener('load', setCanvasSize);
window.addEventListener('resize', setCanvasSize);

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.8;
  } else {
    canvasSize = window.innerHeight * 0.8;
  }
  
  canvas.setAttribute('width', canvasSize);
  canvas.setAttribute('height', canvasSize);
  
  elementsSize = (canvasSize / 10);

  startGame();
}

function startGame() {
  console.log({ canvasSize, elementsSize });

  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

const map = maps[level];

if(!map){
  gameWin();
  return;
}
if(!timeStar){
  timeStar = Date.now();
  timeInterval = setInterval(showTime,100);
}
const mapRows =  map.trim().split('\n');
const mapRowCols = mapRows.map(row => row.trim().split(''))

console.log({map,mapRows,mapRowCols});

showLives();

enemyPositions = []
game.clearRect(0,0,canvasSize,canvasSize);

mapRowCols.forEach((row,rowI) => {
  row.forEach((col,colI) =>{
    const emoji = emojis[col];
    const posX = elementsSize*(colI+1);
    const posY = elementsSize*(rowI+1);
    if(col == 'O'){
      if(!playerPosition.x && !playerPosition.y){
        playerPosition.x = posX;
        playerPosition.y = posY;
        console.log({playerPosition});
      }
    }else if(col=='I'){
      giftPosition.x = posX
      giftPosition.y = posY
    }else if(col=='X'){
      enemyPositions.push({
        x: posX,
        y: posY,
      })    
    }
    
    game.fillText(emoji,posX,posY);
    
  });
});
  movePlayer();
}
function levelwin(){
  console.log('subiste de nivel');
  level++;
  startGame();
}

function levelFail(){
  console.log("FALLASTE");
  lives--;

  

  console.log(lives);
  if(lives<=0){
    level=0;
    lives=3;
    timeStar= undefined;
  }
  playerPosition.x = undefined;
  playerPosition.y = undefined;
    startGame();
  
}

function gameWin() {
  console.log("terminaste");
  clearInterval(timeInterval);
}

function showLives(){
  const heartsArray = Array(lives).fill(emojis['HEART']); 
  
  spanLives.innerHTML="";

  heartsArray.forEach(heart =>{
    spanLives.append(heart);
  }) 
}

function showTime(){
  spanTime.innerHTML = Date.now()-timeStar;
}
function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  

  if (giftCollision) {
    levelwin();
    
  }
  const enemyCollision = enemyPositions.find(enemy =>{
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3)
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3)
    return enemyCollisionX && enemyCollisionY;
  }) ;

  if(enemyCollision){
    levelFail();
  }

  game.fillText(emojis['PLAYER'],playerPosition.x,playerPosition.y)
}


window.addEventListener('keydown',moveByKeys);
btnUp.addEventListener('click',moveUp);
btnLeft.addEventListener('click',moveLeft);
btnRight.addEventListener('click',moveRight);
btnDown.addEventListener('click',moveDown);

function moveByKeys(event){
  if (event.key == 'ArrowUp') moveUp();
  else if(event.key == 'ArrowLeft') moveLeft();
  else if(event.key == 'ArrowRight') moveRight();
  else if(event.key == 'ArrowDown') moveDown();  
}

function moveUp() {
  console.log("Up");
  if((playerPosition.y - elementsSize)<elementsSize){
    
    console.log('OUT');
  }else{  
    playerPosition.y-=elementsSize;  
  startGame();
  

  }  
}

function moveLeft() {
  console.log("Left");
  if ((playerPosition.x - elementsSize)<elementsSize) {
    
    console.log('OUT');
  } else {
    playerPosition.x-=elementsSize;  
    startGame();
    
  }
  
}

function moveRight(){
  console.log("Right");
  
  if ((playerPosition.x + elementsSize)>canvasSize) {
    console.log('OUT');

  } else {
    playerPosition.x+=elementsSize; 
 
  startGame();
  
  }
  
}

function moveDown(){
  console.log("Down");
  if ((playerPosition.y + elementsSize)>canvasSize) {
    
  } else {
    playerPosition.y+=elementsSize;  
    
    startGame();
  
  }  
}

