const WeatherMetric = payload => `
        <div class="h-fit">
            <p class="text-slate-400">${payload.title}</p>     
            <p>${payload.stat}</p>        
        </div>
    `;

export default WeatherMetric;
