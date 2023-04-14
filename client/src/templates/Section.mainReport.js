import WeatherInfoCard from './Card.weatherInfo';
import SunInfoCard from './Card.sunInfo';
import WeatherMetrics from './Section.weatherMetrics';

const MainReport = (location, currentWeather) => {
  const locationName = `${location.locality}, ${location.country}`;
  const weatherReport = {
    currentTime: currentWeather.dt,
    timezone: currentWeather.timezone,
    weather: {
      ...currentWeather.main,
      wind: currentWeather.wind,
      description: currentWeather.weather[0].description,
      icon: currentWeather.weather[0].icon,
    },
  };

  return `
    <div class="h-full w-full flex flex-col items-center justify-center">
      <h1 class="text-slate-200 text-2xl text-center">Weather in <span class="text-amber-600">${locationName}</span></h1>
      <div class="h-full w-full flex flex-col lg:flex-row lg:max-h-80 items-center justify-center gap-5 p-4 ">
          <div class="h-full w-full rounded-lg">
              ${WeatherInfoCard(locationName, weatherReport)}
          </div>
          <div class="flex flex-col items-center gap-2 h-full w-full rounded-lg text-slate-200 font-bold text-lg">
              ${SunInfoCard('sunrise-card', {
                seconds: currentWeather.sys.sunrise,
                timezone: currentWeather.timezone,
              })}
              ${SunInfoCard('sunset-card', {
                seconds: currentWeather.sys.sunset,
                timezone: currentWeather.timezone,
              })}
          </div>
      </div>
      ${WeatherMetrics(weatherReport.weather)}
    </div>
`;
};

export default MainReport;
