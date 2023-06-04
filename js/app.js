let canvas = document.querySelector('canvas');
let startComunication = document.querySelector('#startComunication');

startComunication.addEventListener('click', function() {
  //statusText.textContent = 'Breathe...';
  heartRates = [];
  heartRateSensor.connect()
  .then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
  .catch(error => {
    //statusText.textContent = error;
    //RODRIGO arrumar aqui
  });
});

function handleHeartRateMeasurement(heartRateMeasurement) {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    let heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value);
    document.querySelector('#statusText').innerHTML = heartRateMeasurement.heartRate + ' &#x2764;';
    heartRates.push(heartRateMeasurement.heartRate);
    //drawWaves();
  });
}

let heartRates = [];
let mode = 'line';

canvas.addEventListener('click', event => {
  mode = mode === 'bar' ? 'line' : 'line';//'bar';
  //drawWaves();
});

function drawWaves() {
  requestAnimationFrame(() => {
    canvas.width = parseInt(getComputedStyle(canvas).width.slice(0, -2)) * devicePixelRatio;
    canvas.height = parseInt(getComputedStyle(canvas).height.slice(0, -2)) * devicePixelRatio;

    let context = canvas.getContext('2d');
    let margin = 2;
    let max = Math.max(0, Math.round(canvas.width / 11));
    let offset = Math.max(0, heartRates.length - max);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = '#00796B';
    if (mode === 'bar') {
      for (let i = 0; i < Math.max(heartRates.length, max); i++) {
        let barHeight = Math.round(heartRates[i + offset ] * canvas.height / 200);
        context.rect(11 * i + margin, canvas.height - barHeight, margin, Math.max(0, barHeight - margin));
        context.stroke();
      }
    } else if (mode === 'line') {
      context.beginPath();
      context.lineWidth = 6;
      context.lineJoin = 'round';
      context.shadowBlur = '1';
      context.shadowColor = '#333';
      context.shadowOffsetY = '1';
      for (let i = 0; i < Math.max(heartRates.length, max); i++) {
        let lineHeight = Math.round(heartRates[i + offset ] * canvas.height / 200);
        if (i === 0) {
          context.moveTo(11 * i, canvas.height - lineHeight);
        } else {
          context.lineTo(11 * i, canvas.height - lineHeight);
        }
        context.stroke();
      }
    }
  });
}

window.onresize = drawWaves;

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) {
    drawWaves();
  }
});