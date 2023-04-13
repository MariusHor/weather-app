import { formatTime, round } from 'utils/helpers';
import SharePopup from './Card.sharePopup';

const WeatherInfoCard = (locationName, weatherData) => {
  const weatherIconSrc = `https://openweathermap.org/img/wn/${weatherData.weather.icon}@2x.png`;

  return `
        <div class="overlay grid flex-col gap-6 w-full h-full shadow-xl rounded-lg text-slate-100 p-5 text-xs w-72 overflow-hidden">  
            <div class="flex justify-between items-center">
                <div class="flex gap-1 h-fit items-center">
                    <i class="fa-solid fa-location-dot text-blue-300"></i>  
                    <p class="font-bold leading-none">${locationName}</p>
                </div> 
                <p class="h-fit">
                        Today, ${formatTime(weatherData.currentTime, weatherData.timezone)}  
                </p>       
            </div>   
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-8xl">${round(weatherData.weather.temp)}<span>&#176;</span></h1>
                <div class="flex items-center">
                    <img src=${weatherIconSrc} width="60px" height="60px"/>
                    <p class="text-lg">${weatherData.weather.description}</p>
                </div>              
            </div>
            <div class="flex justify-between">
                <button class="hover:scale-125 active:scale-90 hover:text-red-400 transition duration-250 ease-in-out text-red-600 text-xl leading-none h-fit" type="button" data-btn="favorite">
                    <i class="fa-solid fa-heart"></i>
                </button>
                <div data-container="shareBtn" class="relative">
                    ${SharePopup()}
                    <button class="hover:scale-125 active:scale-90 hover:text-amber-600 transition duration-250 ease-in-out text-slate-200 text-xl leading-none h-fit" type="button" data-btn="share">
                        <i class="fa-solid fa-share"></i>
                </button>
                </div>
            </div>
        </div>
    `;
};

export default WeatherInfoCard;
