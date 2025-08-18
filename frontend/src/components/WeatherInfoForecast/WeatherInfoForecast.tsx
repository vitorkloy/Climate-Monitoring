import type { WeatherDataForecast } from "../../types/WeatherDatas";
import "./WeatherInfoForecast.css";

function WeatherInfoForecast({ weatherForecast }: { weatherForecast: WeatherDataForecast }) {
  const dailyMap: Record<string, WeatherDataForecast["list"]> = {};

  weatherForecast.list.forEach((item) => {
    const day = item.dt_txt.split(" ")[0];
    if (!dailyMap[day]) dailyMap[day] = [];
    dailyMap[day].push(item);
  });

  const dailyForecasts = Object.keys(dailyMap)
    .slice(0, 7)
    .map((day, index) => {
      const dayData = dailyMap[day];
      const minTemp = Math.min(...dayData.map((d) => d.main.temp_min));
      const maxTemp = Math.max(...dayData.map((d) => d.main.temp_max));

      const date = new Date(day);
      const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

      let label;
      if (index === 0) {
        label = "Hoje";
      } else if (index === 1) {
        label = "Amanhã";
      } else {
        label = daysOfWeek[date.getDay()];
      }

      return {
        date: `${date.getMonth() + 1}/${date.getDate()}`,
        label,
        minTemp,
        maxTemp,
        weather: dayData[0].weather[0],
      };
    });

  return (
    <div className="forecast-list">
      <h3>Previsão de 5 dias</h3>
      {dailyForecasts.map((day, i) => (
        <div key={i} className="forecast-item">
          <span className="forecast-date">{day.date} {day.label}</span>
          <img
            src={`https://openweathermap.org/img/wn/${day.weather.icon}.png`}
            alt={day.weather.description}
          />
          <span className="forecast-temp">
            {Math.round(day.minTemp)}° / {Math.round(day.maxTemp)}°
          </span>
        </div>
      ))}
    </div>
  );
}

export default WeatherInfoForecast;
