const btn = document.getElementById("btn");

btn.addEventListener("click", async () => {
  const cityName = document.getElementById("search").value;
  if (!cityName) return alert("Введи город");

  const coords = await getCoords(cityName);
  if (!coords) return alert("Город не найден");

  const data = await getWeather(coords.lat, coords.lon);

  renderTitle(cityName);
  renderWeek(data.daily);
  drawChart(data.daily);
});

// 🌍 1. Геокодинг (город → координаты)
async function getCoords(city) {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1`;

  const res = await fetch(url);
  const data = await res.json();

  if (!data.results) return null;

  return {
    lat: data.results[0].latitude,
    lon: data.results[0].longitude,
  };
}

// 🌦 2. Погода
async function getWeather(lat, lon) {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  const res = await fetch(url);
  return await res.json();
}

// 🏷 Заголовок
function renderTitle(city) {
  document.querySelector(".main_body__title h2").innerHTML =
    `ПРОГНОЗ: ${city.toUpperCase()}`;
}

// 🌤 иконки
function getIcon(code) {
  if (code === 0) return "☀️";
  if (code <= 3) return "🌤";
  if (code <= 48) return "🌫";
  if (code <= 67) return "🌧";
  if (code <= 77) return "❄️";
  if (code <= 82) return "🌧";
  return "⛈";
}

// 📅 формат даты
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// 📦 неделя
function renderWeek(daily) {
  const blocks = document.querySelectorAll(".main_body__week_days");

  for (let i = 0; i < 7; i++) {
    blocks[i].innerHTML = `
      <div class="card">
        <div class="date">${formatDate(daily.time[i])}</div>
        <div class="icon">${getIcon(daily.weathercode[i])}</div>
        <div>🔥 ${daily.temperature_2m_max[i]}°</div>
        <div>❄️ ${daily.temperature_2m_min[i]}°</div>
      </div>
    `;
  }
}
