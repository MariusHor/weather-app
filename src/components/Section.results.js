import WeatherInfoCard from './Card.weatherInfo';
import SunInfoCard from './Card.sunInfo';
import WeatherMetrics from './Section.weatherMetrics';

const Results = payload => {
  const weatherData = {
    currentTime: payload.dt,
    timezone: payload.timezone,
    location: `${payload.name}, ${payload.sys.country}`,
    weather: {
      ...payload.main,
      wind: payload.wind,
      description: payload.weather[0].description,
      icon: payload.weather[0].icon,
    },
  };

  return `
    <div class="h-full w-full flex flex-col items-center justify-center">
      <div class="h-full w-full flex items-center justify-center gap-5 p-4 max-h-80">
          <div class="h-full w-full rounded-lg">
              ${WeatherInfoCard(weatherData)}
          </div>
          <div class="flex flex-col gap-2 h-full w-full rounded-lg text-slate-200 font-bold text-lg">
              ${SunInfoCard('sunrise', {
                seconds: payload.sys.sunrise,
                timezone: payload.timezone,
              })}
              ${SunInfoCard('sunset', {
                seconds: payload.sys.sunset,
                timezone: payload.timezone,
              })}
          </div>
      </div>
      ${WeatherMetrics(weatherData.weather)}
    </div>
`;
};

export default Results;
