import WeatherMetric from './Card.weatherMetric';
import { round } from '../utils/helpers';

const WeatherMetrics = payload => `
        <div class="flex justify-between items-end gap-2">
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
