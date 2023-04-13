export default class Model {
  constructor({ events, geolocation, api }) {
    this.events = events;
    this.geolocation = geolocation;
    this.api = api;

    this.state = {
      currentSearch: {
        coords: null,
        currentWeather: null,
        forecast: null,
      },
      currentPosition: [],
      history: [],
      favorites: [],
      activeView: 'home',
      formInputValue: '',
      notificationCount: 0,
      hasCurrentPosition: false,
    };
  }

  get getCoords() {
    return this.api.getCoords;
  }

  get getWeatherReport() {
    return this.api.getWeatherReport;
  }

  get getPositionName() {
    return this.api.getPositionName;
  }

  dispatchState(event) {
    this.events.emit(event, this.state);
  }

  setState = callback => {
    this.state = callback(this.state);

    return this;
  };

  getState = () => ({
    ...this.state,
  });

  getFavorite = tag => {
    const currentFavorite = this.state.favorites.find(favorite => favorite.tag === tag);

    return currentFavorite;
  };

  getCurrentPosition = async () => {
    try {
      const coords = await this.geolocation.getCurrentPositionCoords();
      const currentPositionName = await this.api.getPositionName(coords);

      return {
        name: currentPositionName,
        coords,
      };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  validateFavorite = coords => {
    try {
      const { favorites } = this.state;

      const isFavorite = favorites.some(
        fav => fav.coords.lat === coords.lat && fav.coords.lon === coords.lon,
      );

      if (isFavorite) throw Error('Location already saved');
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
