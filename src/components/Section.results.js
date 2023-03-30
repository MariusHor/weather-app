import WeatherInfoCard from './Card.weatherInfo';
import SunInfoCard from './Card.sunInfo';

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
    <div>
        <div class="h-full flex items-center justify-center gap-10 p-4">
            <div class="h-full w-full rounded-lg">
                ${WeatherInfoCard(weatherData)}
            </div>
            <div class="flex flex-col  gap-2 h-full w-full rounded-lg text-slate-200 font-bold text-lg">
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
        <div class="h-full flex flex-col items-center justify-center gap-10 p-4">
        </div>
    </div>
`;
};

export default Results;
