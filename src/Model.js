import { MAX_FAV_COUNT, WEATHER_API_URI } from './constants/constants';
import { fetchMultiple } from './utils/helpers';

export default class Model {
  constructor() {
    this.state = {
      favorites: [],
      currentSearch: null,
      history: [],
    };
  }

  getLastLocationSearch = () => this.state.history.at(-1).currentWeather.name;

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
      this.saveCurrentSearch({
        currentWeather: data[0],
        forecast: {
          results: data[1].list.slice(0, 8),
          timezone: data[1].city.timezone,
        },
      });
    });
  };

  getPositionData = () => ({
    locality: this.state.currentSearch.currentWeather.name,
    country: this.state.currentSearch.currentWeather.sys.country,
  });

  getFavorites = () => this.state.favorites;

  isFavAlready = coords =>
    this.state.favorites.some(
      fav => fav.coords.lat === coords.lat && fav.coords.lon === coords.lon,
    );

  saveFavorite = tag => {
    if (this.state.favorites.length >= MAX_FAV_COUNT) return;

    try {
      if (this.isFavAlready(this.state.history.at(-1).coords))
        throw Error('Location already saved');
      this.state = {
        ...this.state,
        favorites: [
          ...this.state.favorites,
          {
            tag,
            coords: this.state.history.at(-1).coords,
          },
        ],
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
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
      currentSearch: null,
    };
  };
}
