const canvas = document.getElementById('canv');
const context = canvas.getContext('2d');
const snow = {
  width: 10,
  length: 100,
  lateralLength: 0.5,
  apicalLength: 0.8,
  tiers: 5,
  dendrites: 6,
  skew: 0,
  outerAngle: 30,
  asynch: false,
  asynchDelay: 30,
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
    if (snow.asynch) await timeout(snow.asynchDelay);
    context.strokeStyle = `rgb(${c},${c},${c})`;//context.strokeStyle = snow.colors[tier];
    context.lineWidth = wid;
    
    context.save();

    context.rotate(snow.outerAngle * Math.PI / 180);
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(0, len);
    context.stroke();
    
    context.translate(0, len);
    context.save();
    
    await dendrites(0, len, tier - 1, len * snow.lateralLength/*0.5*/, wid * 0.6, c-snow.colorUnits);
    
    context.restore();
    context.save();
    
    context.rotate(snow.outerAngle * -2 * Math.PI / 180);
    await dendrites(0, len, tier - 1, len * snow.lateralLength, wid * 0.6, c-snow.colorUnits);
    
    context.restore();
    context.save();
    
    context.rotate(-snow.outerAngle * Math.PI / 180);
    await dendrites(0, len, tier - 1, len * snow.apicalLength, wid * 0.8, c-snow.colorUnits);
    
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

const tierSlide = document.getElementById('tiers');
const tierValue = document.getElementById('tier-value');
function adjustTier(newTiers) {
  tierValue.innerHTML = newTiers;
  snow.tiers = newTiers;
  recreate();
}

const dendSlide = document.getElementById('dend');
const dendValue = document.getElementById('dendrite-value');
function adjustDendrites(newDend) {
  dendValue.innerHTML = newDend;
  snow.dendrites = newDend;
  recreate();
}

const angleSlide = document.getElementById('angle');
const angleValue = document.getElementById('angle-value');
function adjustAngle(newAng) {
  angleValue.innerHTML = parseFloat(newAng).toFixed(1) + ' Deg';
  snow.outerAngle = newAng;
  recreate();
}

const skewSlide = document.getElementById('skew');
const rotationValue = document.getElementById('rotation-value');
function adjustSkew(newSkew) {
  rotationValue.innerHTML = parseFloat(newSkew).toFixed(1) + ' Deg';
  snow.skew = newSkew;
  recreate();
}

const widthSlide = document.getElementById('width');
const widthValue = document.getElementById('width-value');
function adjustWidth(newWidth) {
  widthValue.innerHTML = newWidth;
  snow.width = newWidth;
  recreate();
}

const lateralLengthSlide = document.getElementById('lateralLength');
const lateralValue = document.getElementById('lateral-value');
function adjustLateralLength(newLatLen) {
  lateralValue.innerHTML = parseFloat(newLatLen * 100).toFixed(1);
  snow.lateralLength = newLatLen;
  recreate();
}

const apicalLengthSlide = document.getElementById('apicalLength');
const apicalValue = document.getElementById('apical-value');
function adjustApicalLength(newApicLen) {
  apicalValue.innerHTML = parseFloat(newApicLen * 100).toFixed(1);
  snow.apicalLength = newApicLen;
  recreate();
}

const lengthSlide = document.getElementById('length');
const lengthValue = document.getElementById('length-value');
function adjustLength(newLen) {
  lengthValue.innerHTML = newLen;
  snow.length = newLen;
  recreate();
}

const asyncBtn = document.getElementById('asynch');
function asynchSwitch() {
  snow.asynch = !snow.asynch;
}

const asyncDelaySlide = document.getElementById('asynchDelay');
const asyncDelayValue = document.getElementById('async-delay-value');
function adjustAsynchDelay(newAsynDel) {
  asyncDelayValue.innerHTML = newAsynDel;
  snow.asynchDelay = newAsynDel;
}

iceSeed();