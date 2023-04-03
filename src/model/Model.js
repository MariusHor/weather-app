import { MAX_FAV_COUNT, API_WEATHER_URI, API_GEOCODE_URI } from '../constants/constants';
import { fetchMultiple } from '../utils/helpers';

export default class Model {
  constructor() {
    this.state = {
      notifications: 0,
      favorites: [],
      currentSearch: {
        coords: null,
        currentWeather: null,
        forecast: null,
      },
      history: [],
    };
  }

  getLastLocationSearch = () => this.state.history.at(-1).currentWeather.name;

  getCoords = async input => {
    try {
      const response = await fetch(
        `${API_WEATHER_URI}geo/1.0/direct?q=${input}&limit=5&appid=${process.env.WEATHER_API_KEY}`,
      );
      const data = await response.json();

      const { lat, lon } = data[0];

      this.saveCurrentSearch({ coords: { lat, lon } });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getWeatherInfo = async () => {
    const { lat, lon } = this.state.currentSearch.coords;

    const urls = [
      `${API_WEATHER_URI}data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
      `${API_WEATHER_URI}data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
    ];

    try {
      const data = await fetchMultiple(urls);

      this.saveCurrentSearch({
        currentWeather: data[0],
        forecast: {
          results: data[1].list.slice(0, 8),
          timezone: data[1].city.timezone,
        },
      });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  static async getPositionData(userPosition) {
    try {
      const { lat, lon } = userPosition;

      const response = await fetch(
        `${API_GEOCODE_URI}data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`,
      );
      const data = await response.json();

      const { city, locality, countryCode } = data;

      return {
        locality: city || locality,
        country: countryCode,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  getFavorites = () => this.state.favorites;

  getNotificationCount = () => this.state.notifications;

  resetNotificationCount() {
    this.state = {
      ...this.state,
      notifications: 0,
    };
  }

  increaseNotificationCount() {
    this.state = {
      ...this.state,
      notifications: this.state.notifications + 1,
    };

    return this;
  }

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
      currentSearch: {
        coords: null,
        currentWeather: null,
        forecast: null,
      },
    };
  };
}
