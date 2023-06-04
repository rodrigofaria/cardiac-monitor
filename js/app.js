let startComunication = document.querySelector('#startComunication')

startComunication.addEventListener('click', function() {
  //statusText.textContent = 'Breathe...';
  heartRates = []
  heartRateSensor.connect()
  .then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
  .catch(error => {
    //statusText.textContent = error;
    //RODRIGO arrumar aqui
  })
})

const handleHeartRateMeasurement = heartRateMeasurement => {
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    let heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value)
    document.querySelector('#statusText').innerHTML = heartRateMeasurement.heartRate + heartSpan()
    heartRates.push(heartRateMeasurement.heartRate)
  })
}

const heartSpan = () => {
  return '<span> &#x2764;</span>'
}

let heartRates = [];