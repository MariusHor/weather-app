import { formatTime, round } from 'utils/helpers';

const ForecastCard = payload => {
  const time = formatTime(payload.result.dt, payload.timezone, 'dddd h:mm A');
  const [day, ...rest] = time.split(' ');
  const hours = rest.join(',').replace(',', ' ');

  const iconUrl = `https://openweathermap.org/img/wn/${payload.result.weather[0].icon}@2x.png`;

  return `
    <div class="overlay grid grid-cols-3 justify-items-center items-center h-full w-full max-w-xs p-3 shadow-md">
        <img src=${iconUrl} width="45px" height="45px" />
        <h2 class="text-2xl">${round(payload.result.main.temp)}<span>&#176;</span></h2>
        <div class="text-end h-fit w-full text-xs">
            <p class="text-slate-500">${day}</p>
            <p>${hours}</p>
        </div>
    </div>
`;
};

export default ForecastCard;
