import { round } from 'utils/helpers';
import WeatherMetric from './Card.weatherMetric';

const WeatherMetrics = payload => `
        <div class="flex justify-center flex-wrap gap-2">
            ${WeatherMetric({
              title: 'Feels like',
              stat: `${round(payload.feels_like)}<span>&#176;</span>`,
            })}
            ${WeatherMetric({
              title: 'Humidity',
              stat: `${payload.humidity}%`,
            })}
            ${WeatherMetric({
              title: 'Wind speed',
              stat: `${payload.wind.speed} km/h`,
            })}
        </div>      
      `;

export default WeatherMetrics;
