// Recupera pacientes salvos e atualiza os selects
function updatePatientSelectors() {
    const savedPatients = JSON.parse(localStorage.getItem("patients")) || [];
    document.querySelectorAll(".patient-selector").forEach(select => {
        select.innerHTML = '<option value="">-- Selecione --</option>';
        savedPatients.forEach((p, index) => {
            const opt = document.createElement("option");
            opt.value = index;
            opt.textContent = `${p.name} (${p.age} anos)`;
            select.appendChild(opt);
        });
    });
}

// Exibe os dados no card selecionado
function displayPatientData(cardId, patientIndex) {
    const patient = JSON.parse(localStorage.getItem("patients"))[patientIndex];
    const container = document.querySelector(`#patient${cardId} .patient-info`);
    const patientTitle = document.querySelector(`#patient${cardId} h2`);

    const freqMax = 220 - patient.age;
    const rangeMin = Math.round(freqMax * 0.55);
    const rangeMax = Math.round(freqMax * 0.85);

    container.innerHTML = `
      <p><strong>FC Max:</strong> ${freqMax} bpm</p>
      <p><strong>FC Alvo:</strong> ${rangeMin} - ${rangeMax} bpm</p>
      <p><strong>FC Cardíaca:</strong> </p>
    `;
    patientTitle.innerHTML = patient.name;
}

function heartSpan() {
    return '<span> &#x2764;</span>'
}

function handleHeartRateMeasurement(heartRateMeasurement, cardId) {
    heartRateMeasurement.addEventListener('characteristicvaluechanged', event => {
      let heartRateMeasurement = heartRateSensor.parseHeartRate(event.target.value)
      const container = document.querySelector(`#patient${cardId} .patient-info`);
      let bpmDiv = container.querySelector('.heart-rate-display .bpm-value')
      if (!bpmDiv) {
        let div = document.createElement('div')
        div.className = 'heart-rate-display'
        
        let div2 = document.createElement('div')
        div2.className = 'bpm-value'
        div.appendChild(div2)
        container.appendChild(div)

        bpmDiv = div2
      }
      
      bpmDiv.innerHTML = heartRateMeasurement.heartRate + heartSpan()
    })
}

function connectHeartSensor(cardId) {
    heartRateSensor.connect()
        .then(() => heartRateSensor.startNotificationsHeartRateMeasurement()
            .then(event => handleHeartRateMeasurement(event, cardId)))
        .catch(error => {
            alert('Erro de comunicação bluetooth! Por favor, tente novamente!')
        })
}


// Lidar com a escolha de pacientes
document.querySelectorAll(".patient-selector").forEach(select => {
    select.addEventListener("change", (e) => {
        const index = e.target.value;
        const card = e.target.dataset.card;
        if (index !== "") {
            displayPatientData(card, index);
            connectHeartSensor(card)
        } else {
            document.querySelector(`#patient${card} .patient-info`).innerHTML = "";
        }
    });
});

// Abrir e fechar sidebar
document.getElementById("openSidebar").addEventListener("click", () => {
    document.getElementById("sidebarForm").classList.add("visible");
});

document.getElementById("closeSidebar").addEventListener("click", () => {
    document.getElementById("sidebarForm").classList.remove("visible");
});

// Submeter novo paciente
document.getElementById("newPatientForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const form = e.target;
    const newPatient = {
        name: form.name.value,
        age: parseInt(form.age.value),
        sex: form.sex.value
    };

    const patients = JSON.parse(localStorage.getItem("patients")) || [];
    patients.push(newPatient);
    localStorage.setItem("patients", JSON.stringify(patients));

    form.reset();
    updatePatientSelectors();
    document.getElementById("sidebarForm").classList.remove("visible");
});

// Inicialização
updatePatientSelectors();


document.addEventListener('DOMContentLoaded', () => {
    const expandBtn = document.getElementById('expandPatient2');
    const patient2 = document.getElementById('patient2');
    const info2 = document.getElementsByClassName('internal')[0];
  
    expandBtn.addEventListener('click', function() {
      if (patient2.classList.contains('minimized')) {
        // Expandir
        patient2.classList.remove('minimized');
        info2.style.display = 'flex';
        expandBtn.textContent = '-';
      } else {
        // Minimizar
        patient2.classList.add('minimized');
        info2.style.display = 'none';
        expandBtn.textContent = '+';
      }
    });
  });
  