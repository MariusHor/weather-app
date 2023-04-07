import { fetchSingle, fetchMultiple } from 'utils/helpers';
import { API_WEATHER_URI, API_GEOCODE_URI } from 'constants';

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
      this.saveCurrentSearch({ coords: { lat, lon } });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getWeatherInfo = async () => {
    const { lat, lon } = this.state.currentSearch.coords;

    const weatherUrls = [
      `${API_WEATHER_URI}data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
      `${API_WEATHER_URI}data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.WEATHER_API_KEY}`,
    ];

    try {
      const data = await fetchMultiple(weatherUrls);

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

  getPositionData = async userPosition => {
    try {
      const { lat, lon } = userPosition;

      const url = `${API_GEOCODE_URI}data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
      const data = await fetchSingle(url);

      const { city, locality, countryCode } = data;

      if (!city || !locality) throw Error('No weather report for this location. Try another one');

      this.positionData = {
        locality: city || locality,
        country: countryCode,
      };
      return this.positionData;
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
