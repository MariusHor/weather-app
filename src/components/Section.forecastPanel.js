import ForecastCard from './Card.forecast';
import SwitchInput from './Input.switch';

const ForecastPanel = () => ` 
        <div class="flex flex-col items-center justify-center gap-6 p-4 text-slate-200">
            <div class="flex gap-4">
                <h3>hourly</h3>
                ${SwitchInput()}
                <h3>7 day</h3>
            </div>
            <div class="w-full flex flex-col items-center justify-center gap-1">
                ${ForecastCard()}
                ${ForecastCard()}
                ${ForecastCard()}
                ${ForecastCard()}
            </div>
        </div>
    `;

export default ForecastPanel;
