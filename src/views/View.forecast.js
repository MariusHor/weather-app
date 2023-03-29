const ForecastCard = () => `
        <div class="flex h-full w-full rounded bg-blue-200 p-3 shadow-md">
            <div class="h-full w-full rounded bg-blue-200">
                <p class="text-xs">Sunny</p>
                <h2 class="text-lg">22</h2>
            </div>
            <div class="h-full w-full rounded bg-blue-200 text-sm text-slate-700">
                <p>Monday</p>
                <p>07:00</p>
            </div>
        </div>
    `;

const Switch = () => `
            <label for="toggleFour" class="flex cursor-pointer select-none items-center">
                <div class="relative">
                    <input type="checkbox" id="toggleFour" class="sr-only" />
                    <div class="box bg-slate-900 block h-5 w-9 rounded-full"></div>
                    <div
                        class="dot absolute left-1 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-white transition"
                    ></div>
                </div>
            </label>
    `;

const Forecast = () => `
        <div class="flex flex-col items-center justify-center gap-6 p-4">
            <div class="flex gap-4">
                <h3>hourly</h3>
                ${Switch()}
                <h3>7 day</h3>
            </div>
            <div class="w-full flex flex-col items-center justify-center gap-6">
                ${ForecastCard()}
                ${ForecastCard()}
                ${ForecastCard()}
                ${ForecastCard()}
            </div>
        </div>
    `;

export default Forecast;
