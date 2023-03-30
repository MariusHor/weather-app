import WEATHER_API_URI from './constants/constants';
import { fetchMultiple } from './utils/helpers';

export default class Model {
  constructor() {
    this.state = {
      currentSearch: {},
      history: [],
    };
  }

  getCoords = async input => {
    const response = await fetch(
      `${WEATHER_API_URI}geo/1.0/direct?q=${input}&limit=5&appid=${process.env.WEATHER_API_KEY}`,
    );
    const data = await response.json();
    const { lat, lon } = data[0];

    this.saveCurrentSearch({ coords: { lat, lon } });
  };

  getWeatherInfo = async () => {
    const { lat, lon } = this.state.currentSearch.coords;

    const urls = [
      `${WEATHER_API_URI}data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
      `${WEATHER_API_URI}data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
    ];

    await fetchMultiple(urls).then(data => {
      this.saveCurrentSearch({ currentWeather: data[0], forecast: data[1].list.slice(0, 8) });
    });
  };

  saveCurrentSearch = payload => {
    this.state = {
      ...this.state,
      currentSearch: {
        ...this.state.currentSearch,
        ...payload,
      },
    };

    return this;
  };

  saveHistory = () => {
    this.state = {
      ...this.state,
      history: [...this.state.history, this.state.currentSearch],
      currentSearch: {},
    };
  };
}
