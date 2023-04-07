import { fetchSingle, fetchMultiple } from 'utils/helpers';
import { API_WEATHER_URI } from 'constants';

export default class Model {
  constructor(events, geolocation) {
    this.events = events;
    this.geolocation = geolocation;

    this.state = {
      notificationCount: 0,
      favorites: [],
      currentSearch: {
        coords: null,
        currentWeather: null,
        forecast: null,
      },
      history: [],
      hasCurrentLocation: false,
      activeView: 'home',
      formInputValue: '',
    };
  }

  getCoords = async (input = '') => {
    try {
      const url = `${API_WEATHER_URI}geo/1.0/direct?q=${input}&limit=5&appid=${process.env.WEATHER_API_KEY}`;
      const data = await fetchSingle(url);

      const { lat, lon } = data[0];

      this.buffer = { lat, lon };

      return this.buffer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getWeatherReport = async coords => {
    const { lat, lon } = coords;

    const weatherUrls = [
      `${API_WEATHER_URI}data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
      `${API_WEATHER_URI}data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
    ];

    try {
      const data = await fetchMultiple(weatherUrls);

      this.buffer = data;

      return this.buffer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getPositionData = async userPosition => {
    try {
      const { lat, lon } = userPosition;

      const url = `${API_WEATHER_URI}geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${process.env.WEATHER_API_KEY}`;
      const data = await fetchSingle(url);

      const { name, country } = data[0];

      if (!name) throw Error('No weather report for this location. Try another one');

      this.buffer = {
        locality: name,
        country,
      };

      return this.buffer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  getCurrentLocation = async () => {
    try {
      await this.geolocation.checkGelocationPermission();

      const userPosition = await this.geolocation.getUserPosition();

      const { latitude: lat, longitude: lon } = userPosition.coords;
      const currentLocationName = await this.getPositionData({ lat, lon });

      return {
        name: currentLocationName,
        coords: { lat, lon },
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getLastLocationSearch = () => this.state.history.at(-1).currentWeather.name;

  getState = () => ({
    ...this.state,
  });

  getCurrentView = () => this.state.activeView;

  getFavorites = () => this.state.favorites;

  getFavoritesWeatherReport = async favorites => {
    const updatedFavorites = await Promise.all(
      favorites.map(async favorite => {
        const weatherReport = await this.getWeatherReport(favorite.coords);
        return {
          ...favorite,
          weatherReport,
        };
      }),
    );

    return updatedFavorites;
  };

  updateFavWeatherReport = async favorites => {
    const updatedFavorites = await this.getFavoritesWeatherReport(favorites);

    this.state = {
      ...this.state,
      favorites: updatedFavorites,
    };
  };

  updateCurrLocationWeatherReport = async location => {
    const weatherReport = await this.getWeatherReport(location.coords);

    this.state = {
      ...this.state,
      currentLocation: {
        ...this.state.currentLocation,
        weatherReport,
      },
    };
  };

  saveFavorite = () => {
    try {
      if (this.isFavAlready(this.state.history.at(-1).coords))
        throw Error('Location already saved');

      const locationName = this.getLastLocationSearch();

      this.state = {
        ...this.state,
        favorites: [
          ...this.state.favorites,
          {
            tag: `#${locationName}`,
            coords: this.state.history.at(-1).coords,
          },
        ],
      };
    } catch (error) {
      console.log(error);
      throw error;
    }

    return this;
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

  saveCurrentLocation = payload => {
    this.state = {
      ...this.state,
      ...payload,
    };

    return this;
  };

  saveActiveView(view) {
    this.state = {
      ...this.state,
      activeView: view,
    };

    return this;
  }

  saveInputValue(value) {
    this.state = {
      ...this.state,
      formInputValue: value,
    };

    return this;
  }

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
    console.log(this.state);
    return this;
  };

  dispatchState(event) {
    this.events.emit(event, this.state);
  }

  resetNotificationCount() {
    this.state = {
      ...this.state,
      notificationCount: 0,
    };

    return this;
  }

  increaseNotificationCount() {
    this.state = {
      ...this.state,
      notificationCount: this.state.notificationCount + 1,
    };

    return this;
  }

  isFavAlready = coords =>
    this.state.favorites.some(
      fav => fav.coords.lat === coords.lat && fav.coords.lon === coords.lon,
    );
}
