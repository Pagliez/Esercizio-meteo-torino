const url = 'https://api.open-meteo.com/v1/forecast?latitude=45.0705&longitude=7.6868&hourly=temperature_2m';

fetch(url)
  .then(response => response.json())
  .then(data => {
    const hours = data.hourly.time;
    const temperatures = data.hourly.temperature_2m;

    const now = new Date();
    const currentUtcHour = new Date(Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      now.getUTCHours()
    )).toISOString().slice(0, 13);

    const currentIndex = hours.findIndex(time => time.startsWith(currentUtcHour));

    if (currentIndex === -1 || currentIndex + 24 > hours.length) {
      throw new Error("Non è stato possibile trovare 24 ore successive a partire da ora.");
    }

    const next24Hours = hours.slice(currentIndex, currentIndex + 24);
    const next24Temps = temperatures.slice(currentIndex, currentIndex + 24);

    const labels = next24Hours.map(t => t.slice(11, 16)); 

    const ctx = document.getElementById('temperatureChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Temperatura (°C)',
          data: next24Temps,
          borderColor: 'rgba(51, 73, 73, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: { display: true, text: 'Ora' }
          },
          y: {
            title: { display: true, text: 'Temperatura (°C)' }
          }
        }
      }
    });
  })
  .catch(error => console.error('Errore nel caricamento dei dati meteo:', error));
