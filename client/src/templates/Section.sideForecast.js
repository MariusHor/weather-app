import ForecastCard from './Card.forecast';

const SideForecast = payload => ` 
        <div class="flex flex-col items-center justify-center gap-6 text-slate-200">
            <div class="flex flex-col items-center">
                <h3 class="text-2xl">Forecast</h3>
                <h5 class="text-slate-500 w-fit text-sm">24 hour</h5>
            </div>
            <div class="w-full flex flex-col items-center justify-center gap-1">
                ${payload.results
                  .map(result => ForecastCard({ result, timezone: payload.timezone }))
                  .join('')}
            </div>
        </div>
    `;

export default SideForecast;
