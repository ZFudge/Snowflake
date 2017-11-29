const canvas = document.getElementById('canv');
const context = canvas.getContext('2d');
const snow = {
  width: 10,
  length: 100,
  tiers: 5,
  dendrites: 6,
  skew: 0,
  outerAngle: 30,
  asynch: false,
  asyncDelay: 5,
  colors: ['#870c8c', '#5f09c1', '#202ccc', '#2bc4bc', '#33b220', '#f78b32', '#f73347']
};

context.lineCap = 'round';
context.strokeStyle = 'white';

async function iceSeed() {
  snow.centerAngle = 360 / snow.dendrites;
  snow.colorUnits = 200 / snow.dendrites;
  context.save();
  context.translate(canvas.width/2, canvas.height/2);
  context.rotate(snow.skew * Math.PI / 180);
  for(let i = 0; i < snow.dendrites; i++) {
    context.save();
    await dendrites(0, 0, snow.tiers, snow.length, snow.width, 200);
    context.restore();
    
    context.rotate(snow.centerAngle * Math.PI / 180);
  }
  context.restore();
}

async function dendrites(x, y, tier, len, wid, c) {
  if (tier > 0) {
    if (snow.asynch) await timeout(snow.asyncDelay);
    context.strokeStyle = `rgb(${c},${c},${c})`;
    //context.strokeStyle = snow.colors[tier];
    context.lineWidth = wid;
    
    context.save();

    context.rotate(snow.outerAngle * Math.PI / 180);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, len);
    context.stroke();
    
    context.translate(0, len);
    context.save();
    
    await dendrites(0, len, tier - 1, len * 0.5, wid * 0.6, c-snow.colorUnits);
    
    context.restore();
    context.save();
    
    context.rotate(snow.outerAngle * -2 * Math.PI / 180);
    await dendrites(0, len, tier - 1, len * 0.5, wid * 0.6, c-snow.colorUnits);
    
    context.restore();
    context.save();
    
    context.rotate(-snow.outerAngle * Math.PI / 180);
    await dendrites(0, len, tier - 1, len * 0.8, wid * 0.8, c-snow.colorUnits);
    
    context.restore();
    context.restore();
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve,ms));
}

document.addEventListener('keydown',keyPushed);

function keyPushed(btn) {
  if (btn.keyCode === 82) {
    recreate();
  }
}

function recreate() {
  context.fillStyle = 'white';
  context.fillRect(0,0,canvas.width, canvas.height);
  iceSeed();
}

const dendSlide = document.getElementById('dend');
function adjustDendrites(newDend) {
  snow.dendrites = newDend;
  recreate();
}

const tierSlide = document.getElementById('tiers');
function adjustTier(newTiers) {
  snow.tiers = newTiers;
  recreate();
}

const angleSlide = document.getElementById('angle');
function adjustAngle(newAng) {
  snow.outerAngle = newAng;
  recreate();
}

const skewSlide = document.getElementById('skew');
function adjustSkew(newSkew) {
  snow.skew = newSkew;
  recreate();
}

const widthSlide = document.getElementById('width');
function adjustWidth(newWidth) {
  snow.width = newWidth;
  recreate();
}

const lengthSlide = document.getElementById('length');
function adjustLength(newLength) {
  snow.length = newLength;
  recreate();
}

const asyncBtn = document.getElementById('asynch');
function asynchSwitch() {
  snow.asynch = !snow.asynch;
}

iceSeed();