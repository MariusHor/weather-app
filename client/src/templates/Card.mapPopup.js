const getTempIconClass = temp => {
  if (temp < 10) {
    return 'text-blue-800 fa-temperature-low';
  }
  if (temp > 20) {
    return 'text-red-600 fa-temperature-high';
  }

  return 'text-yellow-500 fa-temperature-half';
};

const mapPopup = (temp, icon) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  return `
      <div class="w-full flex justify-between items-center">
        <img src=${iconUrl} width="30px" height="30px" />
        <div class="flex items-center gap-1 text-xs rounded-full p-1 bg-slate-200">
          <div>
            <i class="fa-solid ${getTempIconClass(temp)}"></i>
          </div>
          <h1 class="text-slate-800 font-bold">${temp}<span>&#176;</span></h1>
        </div>
      </div>
    `;
};

export default mapPopup;
