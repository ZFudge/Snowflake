const canvas = document.getElementById('canv');
const context = canvas.getContext('2d');
const snow = {
  seedX: canvas.width/3,
  seedY: canvas.height/2,
  tiers: 3,
  dendrites: 6,
  rotation: 0,
  outerAngle: 60,
  bend: 0,
  lateralLength: 0.4,
  apicalLength: 0.6, 
  length: 100,
  width: 10,
  asynchDelay: 30, 
  asynch: false,
  setToDefault: false,
  controlsEnabled: true,
  disableControls: function() {
    snow.inputs.forEach(i => (i.id !== 'asyncDelay-range') ? i.setAttribute('disabled',true) : null);
    ['colorBtn', 'invertBtn'].forEach(b => snow[b].setAttribute('disabled',true));
    snow.controlsEnabled = false;
  },
  enableControls: function() {
    snow.inputs.forEach(i => i.removeAttribute('disabled'));
    ['colorBtn', 'invertBtn'].forEach(b => snow[b].removeAttribute('disabled'));
    snow.controlsEnabled = true;
  },
  colorBtn: document.getElementById('colors'),
  colors: ['#00DEC0','#00DE1E',  '#6000DE','#AF02E8', '#E80288','#E80253'],
  colored: false,
  invertBtn: document.getElementById('invert'),
  inverted: false
};
snow.inputs = Array.from(document.getElementsByTagName('input'));

const controls = {
  text: Array.from(document.getElementsByTagName('span')),
  darkenDisplay: function() {
    controls.text.forEach(t => t.style.backgroundColor = 'rgba(0, 0, 0, 0.5)') // background-color:rgba(250, 250, 250, 0.5)
  },
  lightenDisplay: function() {
    controls.text.forEach(t => t.style.backgroundColor = 'rgba(208, 208, 208, 0.5)') // background-color:rgba(250, 250, 250, 0.5)
  }
}

const controlBox = document.getElementById('controller-box');
controlBox.height = 340;
context.fillStyle = '#FAFAFA';

async function iceSeed() {
  snow.innerAngle = 360 / snow.dendrites;
  snow.colorUnits = (snow.inverted) ? Math.floor(155 / (snow.tiers - 1)) : parseInt(200 / (snow.tiers - 1));
  const startColor = (snow.inverted) ? 100 : 200;
  context.save();
  context.translate(snow.seedX, snow.seedY);
  context.rotate(snow.rotation * Math.PI / 180);
  for(let i = 0; i < snow.dendrites; i++) {
    context.save();
    await dendrites(0, 0, snow.tiers, snow.length, snow.width, startColor, snow.bend);
    context.restore();
    
    context.rotate(snow.innerAngle * Math.PI / 180);
  }
  context.restore();
  if(!snow.controlsEnabled) snow.enableControls();
}

function recreate() {
  //(snow.inverted) ? context.fillStyle = 'black' : context.fillStyle = '#FAFAFA';
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.lineCap = 'round';
  iceSeed();
}

async function dendrites(x, y, tier, len, wid, c, bend) {
  if (tier > 0) {
    if (snow.asynch) {
      await timeout(snow.asynchDelay); 
      if (snow.controlsEnabled) snow.disableControls();
    }
    (snow.colored) ? context.strokeStyle = snow.colors[tier-1] : context.strokeStyle = `rgb(${c},${c},${c})`;
    const nextColor = (snow.inverted) ? c + snow.colorUnits : c - snow.colorUnits;
    context.lineWidth = wid;
    
    context.save();

    context.rotate(snow.outerAngle * Math.PI / 180);
    context.beginPath();
    context.moveTo(0, 0);
    context.quadraticCurveTo(bend, len/2, 0, len);
    context.stroke();
    
    context.translate(0, len);
    context.save();
    
    await dendrites(0, len, tier - 1, len * snow.lateralLength/*0.5*/, wid * 0.6, nextColor, bend * 0.6);
    
    context.restore();
    context.save();
    
    context.rotate(snow.outerAngle * -2 * Math.PI / 180);
    await dendrites(0, len, tier - 1, len * snow.lateralLength, wid * 0.6, nextColor, bend * 0.6);
    
    context.restore();
    context.save();
    
    context.rotate(-snow.outerAngle * Math.PI / 180);
    await dendrites(0, len, tier - 1, len * snow.apicalLength, wid * 0.8, nextColor, bend * 0.6);
    
    context.restore();
    context.restore();
  }
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve,ms));
}
function waiting(fn) {
  return new Promise(resolve => fn());
}

document.addEventListener('keydown',keyPushed);
function keyPushed(btn) {
  if (btn.keyCode === 82) {
    recreate();
  }
}

function setToDefault(textElement, input, type, defaultValue) {
  if (snow.setToDefault) {
    if(textElement.id !== 'rotation-value' && textElement.id !== 'angle-value' && textElement.id !== 'lateral-value' && textElement.id !== 'apical-value') {
      snow[type] = textElement.innerHTML = input.value = defaultValue;
    } else {
      (textElement.id === 'rotation-value' || textElement.id === 'angle-value') ? textElement.innerHTML = parseFloat(defaultValue).toFixed(1) + ' Deg' : textElement.innerHTML = parseFloat(defaultValue * 100).toFixed(1);
      snow[type] = input.value = defaultValue;
    }
    recreate();
  }
}

const tierSlide = document.getElementById('tiers-range');
const tierValue = document.getElementById('tier-value');
const setTierDefault = () => setToDefault(tierValue, tierSlide, 'tiers', 3);
function adjustTier(newTiers) {
  tierValue.innerHTML = snow.tiers = newTiers;
  recreate();
}

const dendSlide = document.getElementById('dendrite-range');
const dendValue = document.getElementById('dendrite-value');
const setDendriteDefault = () => setToDefault(dendValue, dendSlide, 'dendrites', 6);
function adjustDendrites(newDend) {
  dendValue.innerHTML = snow.dendrites = newDend;
  recreate();
}

const angleSlide = document.getElementById('angle-range');
const angleValue = document.getElementById('angle-value');
const setAngleDefault = () => setToDefault(angleValue, angleSlide, 'outerAngle', 60);
function adjustAngle(newAng) {
  angleValue.innerHTML = parseFloat(newAng).toFixed(1) + ' Deg';
  snow.outerAngle = newAng;
  recreate();
}

const bendSlide = document.getElementById('bend-range');
const bendValue = document.getElementById('bend-value');
const setBendDefault = () => setToDefault(bendValue, bendSlide, 'bend', 0);
function adjustBend(newBend) {
  bendValue.innerHTML = snow.bend = newBend;
  recreate();
}

const rotationSlide = document.getElementById('rotation-range');
const rotationValue = document.getElementById('rotation-value');
const setRotationDefault = () => setToDefault(rotationValue, rotationSlide, 'rotation', 0);
function adjustRotation(newRotation) {
  rotationValue.innerHTML = parseFloat(newRotation).toFixed(1) + ' Deg';
  snow.rotation = newRotation;
  recreate();
}

const widthSlide = document.getElementById('width-range');
const widthValue = document.getElementById('width-value');
const setWidthDefault = () => setToDefault(widthValue, widthSlide, 'width', 10);
function adjustWidth(newWidth) {
  widthValue.innerHTML = snow.width = newWidth;
  recreate();
}

const lateralSlide = document.getElementById('lateral-range');
const lateralValue = document.getElementById('lateral-value');
const setLateralDefault = () => setToDefault(lateralValue, lateralSlide, 'lateralLength', 0.4);
function adjustLateralLength(newLatLen) {
  lateralValue.innerHTML = parseFloat(newLatLen * 100).toFixed(1);
  snow.lateralLength = newLatLen;
  recreate();
}

const apicalSlide = document.getElementById('apical-range');
const apicalValue = document.getElementById('apical-value');
const setApicalDefault = () => setToDefault(apicalValue, apicalSlide, 'apicalLength', 0.6);
function adjustApicalLength(newApicLen) {
  apicalValue.innerHTML = parseFloat(newApicLen * 100).toFixed(1);
  snow.apicalLength = newApicLen;
  recreate();
}

const lengthSlide = document.getElementById('length-range');
const lengthValue = document.getElementById('length-value');
const setLengthDefault = () => setToDefault(lengthValue, lengthSlide, 'length', 100);
function adjustLength(newLen) {
  lengthValue.innerHTML = snow.length = newLen;
  recreate();
}

const asyncDelaySlide = document.getElementById('asynchDelay-range');
const asyncDelayValue = document.getElementById('async-delay-value');
function adjustAsynchDelay(newAsynDel) {
  asyncDelayValue.innerHTML = snow.asynchDelay = newAsynDel;
}

const asyncBtn = document.getElementById('asynch');
function asynchSwitch() {
  snow.asynch = !snow.asynch;
  (snow.asynch) ? (
    asyncBtn.classList.add('selected'), 
    asyncBtn.style.backgroundColor = '#339'
  ) : (
    asyncBtn.classList.remove('selected'),
    asyncBtn.style.backgroundColor = '#557'
  )
}

const colorBtn = document.getElementById('colors');
function colorSwitch() {
  snow.colored = !snow.colored;
  recreate();
}

const invertBtn = document.getElementById('invert');
async function invertSwitch() {
  waiting(() => snow.inverted = !snow.inverted);
  waiting(function() {
    (snow.inverted) ? (
      document.body.style.color = '#FAFAFA',
      document.body.style.backgroundColor = 'black',
      controls.darkenDisplay()
    ) : (
      document.body.style.color = 'black',
      document.body.style.backgroundColor = 'transparent',
      controls.lightenDisplay()
    )
  });
  recreate();
}

document.addEventListener('keydown',keyPressed);
document.addEventListener('keyup',keyReleased);
function keyPressed(btn) {
  if (btn.keyCode === 17) snow.setToDefault = true;
}
function keyReleased(btn) {
  if (btn.keyCode === 17) snow.setToDefault = false;
}

window.addEventListener('resize', screen);
function screen() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight; 
  if (window.innerHeight < window.innerWidth) {
    snow.seedX = (canvas.width - 440) / 2,
    snow.seedY = canvas.height/2,
    controlBox.style.float = 'right';
    controlBox.style.position = 'relative';
    controlBox.style.display = 'inline-block';
    controlBox.style.marginTop = ( window.innerHeight / 2 - ( controlBox.height / 2 ) ) + 'px';  
  } else {
    snow.seedX = canvas.width/2,
    snow.seedY = canvas.height/3,

    controlBox.style.float = 'none';
    controlBox.style.position = 'absolute';
    controlBox.style.display = 'inherit';
    controlBox.style.marginLeft = window.innerWidth / 2 - 250 + 'px';
    controlBox.style.marginTop = ( window.innerHeight - controlBox.height + 40) + 'px';
  }
  recreate();
}

screen();

document.addEventListener('DOMContentLoaded', function(){document.body.style.opacity = 1;})