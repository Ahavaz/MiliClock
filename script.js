/* Canvas elements' colors */
var face = '#272B2A';
var border = '#569E92';
var hand = '#526A5D';
var numbers = '#FFFDB6';
var markers = '#9FFE00';
var numbersFont = 'px Cinzel';
var titleFont = 'px Tangerine';
var periodFont = 'px "Expletus Sans"';

var resizeTimeout, x, y;
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

(function() {

  resizeAndDraw();

  window.addEventListener('resize', resizeThrottler, false);

  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if (!resizeTimeout) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        resizeAndDraw();

       // The actualResizeHandler will execute at a rate of 15fps
       }, 66);
    }
  }

  function resizeAndDraw() {
    // handle the resize event
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    x = canvas.width / 2;
    y = canvas.height / 2;
    ctx.translate(x, y);
    radius = 0.90 * Math.min(canvas.width, canvas.height) / 2;
    setInterval(drawClock, 1);
  }

}());

function drawClock() {
  drawFace(ctx, radius);
  drawMarkers(ctx, radius);
  drawNumbers(ctx, radius);
  drawText(ctx, radius);
  drawTime(ctx, radius);
}

function drawFace(ctx, radius) {
  var grad;
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, 2 * Math.PI);
  ctx.fillStyle = face;
  ctx.fill();
  grad = ctx.createRadialGradient(0, 0, radius * 0.97, 0, 0, radius * 1.03);
  grad.addColorStop(0, face);
  grad.addColorStop(0.5, border);
  grad.addColorStop(1, hand);
  ctx.strokeStyle = grad;
  ctx.lineWidth = radius * 0.1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
  ctx.fillStyle = hand;
  ctx.fill();
}

function drawMarkers(ctx, radius) {
  var ang;
  var num = 0;
  while (num++ < 60) {
    ang = num * Math.PI / 30;
    ctx.rotate(ang);
    ctx.translate(0, -radius * 0.94);
    ctx.beginPath();
    if(num % 5) {
      ctx.arc(0, 0, radius * 0.005, 0, 2 * Math.PI);
    } else {
      ctx.arc(0, 0, radius * 0.008, 0, 2 * Math.PI);
    }
    ctx.fillStyle = markers;
    ctx.fill();
    ctx.translate(0, radius * 0.94);
    ctx.rotate(-ang);
  }
}

function drawNumbers(ctx, radius) {
  var ang;
  var num = 1;
  ctx.font = radius * 0.10 + numbersFont;
  ctx.fillStyle = numbers;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  while (num < 13) {
    if(!(num % 3)) {
      ang = num * Math.PI / 6;
      ctx.rotate(ang);
      ctx.translate(0, -radius * 0.85);
      ctx.rotate(-ang);
      ctx.fillText(romanize(num), 0, 0);
      ctx.rotate(ang);
      ctx.translate(0, radius * 0.85);
      ctx.rotate(-ang);
    }
    num++;
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

function drawText(ctx, radius) {
  var now = new Date();
  var hour = now.getHours();
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.fillStyle = numbers;
  ctx.font = radius * 0.12 + titleFont;
  ctx.fillText('MilliClock', 0, -radius / 2.4);
  ctx.font = radius * 0.10 + periodFont;
  // ctx.fillText('©2016', 0, radius / 2.6);
  // ctx.fillText('by Lucas César', 0, radius / 2.2);
  var text = hour < 12 ? 'AM' : 'PM';
  ctx.fillText(text, 0, radius / 2.4);
}

function drawTime(ctx, radius) {
  var now = new Date();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  var millisecond = now.getMilliseconds();

  // Hour
  hour = hour % 12;
  hour = (hour * Math.PI / 6) +
    (minute * Math.PI / (6 * 60)) +
    (second * Math.PI / (6 * 3600)) +
    (millisecond * Math.PI / (6 * 3600000));

  // Minute
  minute = (minute * Math.PI / 30) +
    (second * Math.PI / (30 * 60)) +
    (millisecond * Math.PI / (30 * 60000));

  // Second
  second = (second * Math.PI / 30) +
    (millisecond * Math.PI / (30 * 1000));

  // Millisecond
  millisecond = (millisecond * Math.PI / 500);

  drawHand(ctx, millisecond, radius * 0.06, radius * 0.02);
  drawHand(ctx, hour, radius * 0.5, radius * 0.03);
  drawHand(ctx, minute, radius * 0.7, radius * 0.02);
  drawHand(ctx, second, radius * 0.9, radius * 0.01, markers);
}

function drawHand(ctx, pos, length, width, color) {
  ctx.beginPath();
  ctx.strokeStyle = typeof color !== 'undefined' ? color : hand;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.moveTo(0, 0);
  ctx.rotate(pos);
  ctx.lineTo(0, -length);
  ctx.stroke();
  ctx.rotate(-pos);
}
