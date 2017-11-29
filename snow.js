const canvas = document.getElementById('canv');
const context = canvas.getContext('2d');
const snow = {
  width: 10,
  length: 100,
  tiers: 2,
  dendrites: 5,
  skew: 0
};

snow.angle = 360 / snow.dendrites;
context.lineCap = 'round';
context.strokeStyle = 'white';

async function iceSeed() {
  context.save();
  context.translate(canvas.width/2, canvas.height/2);
  context.rotate(snow.skew * Math.PI / 180);
  for(let i = 0; i < snow.dendrites; i++) {
    console.log(`iceSeed: ${i}`);
    
    context.save();
    await dendrites(0, 0, snow.tiers, snow.length, snow.width, 999);
    context.restore();
    
    context.rotate(snow.angle * Math.PI / 180);
  }
  context.restore();
}

async function dendrites(x, y, tier, len, wid, c) {
  //await timeout(400);
  //context.fillStyle = 'black';
  //context.fillRect(-500,-500,canvas.width*2, canvas.height*2);
  if (tier > 0) {
    await timeout(1000);
    context.strokeStyle = '#'+c;
    console.log(tier);
    
    context.lineWidth = wid;
    
    context.save();
    context.rotate(60 * Math.PI / 180);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, len);
    context.stroke();
    
    //context.moveTo(0, len);
    context.translate(0, len);
    
    context.save();
    
    await dendrites(0, len, tier - 1, len * 0.8, wid * 0.8, c-222);
    
    context.restore();
    context.save();
    
    context.rotate(-60 * Math.PI / 180);
    await dendrites(0, len, tier - 1, len * 0.8, wid * 0.8, c-222);
    
    context.restore();
    context.save();
    
    context.rotate(-60 * Math.PI / 180);
    await dendrites(0, len, tier - 1, len * 0.8, wid * 0.8, c-222);
    
    context.restore();
    
    context.restore();
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve,ms));
}

iceSeed();


document.addEventListener('keydown',keyPushed);

function keyPushed(btn) {
  if (btn.keyCode === 82) {
    recreate();
  }
}

function recreate() {
  context.fillStyle = 'black';
  context.fillRect(0,0,canvas.width, canvas.height);
  iceSeed();
}

/////////////////////////////////////////////////////////
canvas.style.backgroundColor = 'darkBlue';
(function() {
  setTimeout(function() {
    canvas.style.backgroundColor = 'black';
  }, 1000);
})();
