const faceColor = '#272B2A',
      borderColor = '#569E92',
      handColor = '#526A5D',
      numbersColor = '#FFFDB6',
      markersColor = '#9FFE00',
      numbersFont = 'px Cinzel',
      titleText = 'MilliClock',
      titleFont = 'px Tangerine',
      textAM = 'AM',
      textPM = 'PM',
      periodFont = 'px "Expletus Sans"',
      canvas = document.getElementById('canvas'),
      ctx = canvas.getContext('2d'),
      fps = 60;
      ms = 1000 / fps;
      circle = 2 * Math.PI,
      piPer6 = Math.PI / 6,
      piPer30 = Math.PI / 30,
      piPer360 = Math.PI / 360,
      piPer500 = Math.PI / 500,
      piPer1800 = Math.PI / 1800,
      piPer21600 = Math.PI / 21600,
      piPer30000 = Math.PI / 30000,
      piPer1800000 = Math.PI / 1800000,
      piPer21600000 = Math.PI / 21600000
      ;

let resizeTimeout = null,
    radius = 0,
    grad = {},
    x = 0,
    y = 0,
    now = {},
    hour = 0,
    minute = 0,
    second = 0,
    millisecond = 0,
    ang = 0;
    text = '',
    gradRadius0 = 0,
    gradRadius1 = 0,
    size01 = 0,
    numTranslate = 0,
    titleSize = 0,
    textTranslate = 0,
    markersTranslate = 0,
    markersSmall = 0,
    markersBig = 0,
    hourSize = 0,
    minuteSize = 0,
    secondSize = 0,
    millisecondSize = 0,
    hourSize2 = 0,
    minuteSize2 = 0,
    secondSize2 = 0,
    millisecondSize2 = 0,
    hourWidth = 0,
    minuteWidth = 0,
    secondWidth = 0,
    millisecondWidth = 0
    ;

(function() {
  resizeAndDraw();
  window.addEventListener('resize', resizeThrottler, false);
}());

function resizeThrottler() {
  if (!resizeTimeout) {
    resizeTimeout = setTimeout(function() {
      resizeTimeout = null;
      resizeAndDraw();
    }, ms);
  }
}

function resizeAndDraw() {
  // handle the resize event
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  radius = 0.9 * Math.min(canvas.width, canvas.height) / 2;
  setSizes(radius);
  x = canvas.width / 2;
  y = canvas.height / 2;
  ctx.translate(x, y);
  grad = ctx.createRadialGradient(0, 0, gradRadius0, 0, 0, gradRadius1);
  grad.addColorStop(0, faceColor);
  grad.addColorStop(0.5, borderColor);
  grad.addColorStop(1, handColor);
  setInterval(drawClock, 1);
}

function setSizes(radius) {
  gradRadius0 = radius * 0.97;
  gradRadius1 = radius * 1.03;
  size01 = radius * 0.1;
  numTranslate = radius * 0.85;
  titleSize = radius * 0.12;
  textTranslate = radius / 2.4;
  markersTranslate = radius * 0.94;
  markersSmall = radius * 0.005;
  markersBig = radius * 0.008;
  hourSize = radius * 0.5;
  minuteSize = radius * 0.7;
  secondSize = radius * 0.9;
  millisecondSize = radius * 0.06;
  hourSize2 = hourSize * 0.1;
  minuteSize2 = minuteSize * 0.1;
  secondSize2 = secondSize * 0.1;
  millisecondSize2 = millisecondSize * 0.1;
  hourWidth = radius * 0.03;
  minuteWidth = radius * 0.02;
  secondWidth = radius * 0.01;
  millisecondWidth = radius * 0.007;
}

function drawClock() {
  now = new Date();
  hour = now.getHours();
  minute = now.getMinutes();
  second = now.getSeconds();
  millisecond = now.getMilliseconds();
  text = hour < 12 ? textAM : textPM;
  drawFace();
  drawMarkers();
  drawNumbers();
  drawText();
  drawTime();
}

function drawFace() {
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, circle);
  ctx.fillStyle = faceColor;
  ctx.fill();
  ctx.strokeStyle = grad;
  ctx.lineWidth = size01;
  ctx.stroke();
}

function drawMarkers() {
  for (let n = 1; n < 61; n++) {
    ang = n * piPer30;
    ctx.rotate(ang);
    ctx.translate(0, -markersTranslate);
    ctx.beginPath();
    if(n % 5) {
      ctx.arc(0, 0, markersSmall, 0, circle);
    } else {
      ctx.arc(0, 0, markersBig, 0, circle);
    }
    ctx.fillStyle = markersColor;
    ctx.fill();
    ctx.translate(0, markersTranslate);
    ctx.rotate(-ang);
  }
}

function drawNumbers() {
  ctx.font = size01 + numbersFont;
  ctx.fillStyle = numbersColor;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  for (let n = 1; n < 13; n++) {
    if(!(n % 3)) {
      ang = n * piPer6;
      ctx.rotate(ang);
      ctx.translate(0, -numTranslate);
      ctx.rotate(-ang);
      ctx.fillText(romanize(n), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, numTranslate);
      ctx.rotate(-ang);
    }
  }
}

function romanize(num) {
  switch(num) {
    case  1: return 'I';
    case  2: return 'II';
    case  3: return 'III';
    case  4: return 'IV';
    case  5: return 'V';
    case  6: return 'VI';
    case  7: return 'VII';
    case  8: return 'VIII';
    case  9: return 'IX';
    case 10: return 'X';
    case 11: return 'XI';
    case 12: return 'XII';
  }
}

function drawText() {
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = numbersColor;
  ctx.font = titleSize + titleFont;
  ctx.fillText(titleText, 0, -textTranslate);
  ctx.font = size01 + periodFont;
  // ctx.fillText('©2016', 0, radius / 2.6);
  // ctx.fillText('by Lucas César', 0, radius / 2.2);
  ctx.fillText(text, 0, textTranslate);
}

function drawTime() {
  // Hour
  hour = hour % 12;
  hour = hour * piPer6 + minute * piPer360 + second * piPer21600 + millisecond * piPer21600000;

  // Minute
  minute = minute * piPer30 + second * piPer1800 + millisecond * piPer1800000;

  // Second
  second = second * piPer30 + millisecond * piPer30000;

  // Millisecond
  millisecond = millisecond * piPer500;

  drawHand(ctx, hour, hourSize, hourSize2, hourWidth);
  drawHand(ctx, minute, minuteSize, minuteSize2, minuteWidth);
  drawHand(ctx, second, secondSize, secondSize2, secondWidth, markersColor);
  drawHand(ctx, millisecond, millisecondSize, millisecondSize2, millisecondWidth, markersColor);
}

function drawHand(ctx, ang, length, length2, width, color) {
  ctx.beginPath();
  ctx.strokeStyle = typeof color !== 'undefined' ? color : handColor;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.moveTo(0, 0);
  ctx.rotate(ang);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.lineTo(0, length2);
  ctx.stroke();
  ctx.rotate(-ang);
}
