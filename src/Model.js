import WEATHER_API_URL from './constants/constants';

export default class Model {
  constructor() {
    this.state = {
      currentSearch: {},
      history: [],
    };
  }

  getCoords = async input => {
    const response = await fetch(
      `${WEATHER_API_URL}geo/1.0/direct?q=${input}&limit=5&appid=${process.env.WEATHER_API_KEY}`,
    );
    const data = await response.json();
    const { lat, lon } = data[0];

    this.saveCurrentSearch({ coords: { lat, lon } });
  };

  getWeatherInfo = async () => {
    const { lat, lon } = this.state.currentSearch.coords;

    const response = await fetch(
      `${WEATHER_API_URL}data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`,
    );
    const data = await response.json();

    this.saveCurrentSearch({ data }).saveHistory();
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
