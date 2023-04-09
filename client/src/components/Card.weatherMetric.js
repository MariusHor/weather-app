const WeatherMetric = payload => `
        <div class="h-fit shadow-xl rounded-lg text-slate-100 p-10 text-xs overlay text-center">
            <p class="text-slate-400">${payload.title}</p>     
            <p class="text-xl">${payload.stat}</p>        
        </div>
    `;

export default WeatherMetric;
