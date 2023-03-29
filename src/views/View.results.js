const smallCard = (className, time) => `
        <div class="${className} h-full w-full rounded-lg bg-slate-200">
            <div class="overlay flex items-end justify-start gap-2 h-full w-full p-2">
                <div class="p-2 rounded-lg">
                    <h2>${time}</h2>
                </div>
            </div>
        </div>
    `;

const infoCard = () => `
        <div class="grid flex-col h-full w-full shadow-xl rounded-lg bg-white p-5 text-xs">  
            <div class="flex justify-between">
                <div class="flex gap-1 h-fit items-center">
                    <i class="fa-solid fa-location-dot"></i>  
                    <p class="font-bold">Gotham</p>
                </div> 
                <p class="h-fit">
                        Today, 12:07PM  
                </p>       
            </div>   
            <div class="flex flex-col items-center justify-center">
                <h1 class="text-6xl">14</h1>        
                <p>Mostly clear</p>       
            </div> 
            <div class="flex justify-between items-end">
                <div class="h-fit">     
                    <p>720hps</p>        
                </div>
                <div class="h-fit">     
                    <p>32%</p>                  
                </div>   
                <div class="h-fit">     
                    <p>12km/h</p>                   
                </div>                 
            </div>      
        </div>
    `;

const Results = () => `
        <div class="h-full flex items-center justify-center gap-10 p-4">
            <div class="h-full w-full rounded-lg bg-white">
                ${infoCard()}
            </div>
            <div class="flex flex-col  gap-2 h-full w-full rounded-lg text-slate-200 font-bold text-lg">
                ${smallCard('sunrise', '06:50 AM')}
                ${smallCard('sunset', '07:50 PM')}
            </div>
        </div>
        <div class="h-full flex flex-col items-center justify-center gap-10 p-4">
        </div>
    `;

export default Results;
