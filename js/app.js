let startComunication = document.querySelector('#startComunication')

startComunication.addEventListener('click', function() {
  heartRates = []
  heartRateSensor.connect()
  .then(() => heartRateSensor.startNotificationsHeartRateMeasurement().then(handleHeartRateMeasurement))
  .catch(error => {
    alert('Erro de comunicação bluetooth! Por favor, tente novamente!')
  })
})

const handleHeartRateMeasurement = heartRateMeasurement => {
  startComunication.style.display = 'none'
  heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
    let heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value)
    document.querySelector('#statusText').innerHTML = heartRateMeasurement.heartRate + heartSpan()
  })
}

const heartSpan = () => {
  return '<span> &#x2764;</span>'
}