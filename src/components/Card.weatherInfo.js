import { formatTime, round } from '../utils/helpers';
import AddFavForm from './Form.addFav';

const WeatherInfoCard = payload => {
  const weatherIconSrc = `https://openweathermap.org/img/wn/${payload.weather.icon}@2x.png`;

  return `
        <div class="overlay grid flex-col gap-6 w-full h-full shadow-xl rounded-lg text-slate-100 p-5 text-xs">  
            <div class="flex justify-between items-center">
                <div class="flex gap-2 h-fit items-center">
                    <i class="fa-solid fa-location-dot"></i>  
                    <p class="font-bold leading-none">${payload.location}</p>
                </div> 
                <p class="h-fit">
                        Today, ${formatTime(payload.currentTime, payload.timezone)}  
                </p>       
            </div>   
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-8xl">${round(payload.weather.temp)}<span>&#176;</span></h1>
                <div class="flex items-center">
                    <img src=${weatherIconSrc} width="60px" height="60px"/>
                    <p class="text-lg">${payload.weather.description}</p>
                </div>              
            </div>
            ${AddFavForm()}
        </div>
    `;
};

export default WeatherInfoCard;
