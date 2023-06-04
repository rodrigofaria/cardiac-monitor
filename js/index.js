const LOCAL_STORAGE_KEY = 'CARDIAC_PATIENTS'

const start = () => {
  addKeyToLocalStorage()
  const nextButtonIdList = ['screen_1Btn', 'screen_2Btn', 'screen_3Btn']
  
  nextButtonIdList.forEach(btnId => {
    document.getElementById(btnId).onclick = nextScreen
  })
}

const addKeyToLocalStorage = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEY)) {
    const items = []
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  }
}

const nextScreen = event => {
  const divId = event.target.id.replace('Btn', '')
  if (divId === 'screen_2') {
    if (!savePatientData()) {
      return
    }
  } else if (divId === 'screen_3') {
    loadPatientData()
  }

  loadPatients()
  document.getElementById(divId).className = 'hide'
  let lastChar = divId.substring(divId.length - 1)
  let nextValue = parseInt(lastChar, 10)
  nextValue++

  if (divId === 'screen_1' && document.getElementById('oldPatient').checked) {
    nextValue++
  }

  document.getElementById(divId.replace(lastChar, nextValue)).className = ''
}

const savePatientData = () => {
  let patientName = document.getElementById('name').value.trim()
  if (patientName === '') {
    alert('Preencha o campo "Nome"')
    return false
  }
  let patientAge = document.getElementById('age').value.trim()
  if (patientAge === '') {
    alert('Preencha o campo "Idade"')
    return false
  }

  let patientSex = 'male'
  let fcMax = 226 - parseInt(patientAge, 10)
  if (document.getElementById('male').checked) {
    patientSex = 'male'
    fcMax = 220 - parseInt(patientAge, 10)
  }

  const patient = {
    id: (new Date()).getTime(),
    name: patientName,
    age: patientAge,
    sex: patientSex,
    fcMax: fcMax
  }

  const items = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
  items.push(patient)
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items))
  return true
}

const loadPatients = () => {
  const patientListDiv = document.getElementById('patientList')
  patientListDiv.innerHTML = ''

  const items = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
  items.forEach(patient => {
    const div = document.createElement('div')
    const inputRadio = document.createElement('input')
    inputRadio.type = 'radio'
    inputRadio.name = 'patientSelected'
    inputRadio.id = patient.id
    const label = document.createElement('label')
    label.htmlFor = patient.id
    label.innerHTML = patient.name
    div.appendChild(inputRadio)
    div.appendChild(label)
    patientListDiv.appendChild(div)
  })
}

const loadPatientData = () => {
  const patientList = document.getElementById('patientList').querySelectorAll('input')
  let patientId = null
  patientList.forEach(patient => {
    if (patient.checked) {
      patientId = patient.id
    }
  })

  const items = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY))
  const patient = items.find(item => item.id == patientId)
  document.getElementById('patientName').innerHTML = patient.name.toUpperCase()
  document.getElementById('fcmax').innerHTML = 'FCMax: ' + patient.fcMax + 'bpm' 
}

window.onload = start()