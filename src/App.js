import Home from './views/View.home';
import Sidebar from './views/View.sidebar';
import Model from './Model';
import Map from './Map';
import Geolocation from './Geolocation';

import './App.scss';

export default class App {
  constructor(root) {
    this.home = new Home(root);
    this.sidebar = new Sidebar(root);

    this.model = new Model();
    this.map = new Map();
    this.geolocation = new Geolocation();
  }

  static async getPositionData(coords) {
    const { latitude, longitude } = coords;

    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
    );
    const positionData = await response.json();
    return positionData;
  }

  handleFormSubmit = async input => {
    try {
      await this.model.getCoords(input);
      await this.model.getWeatherInfo();

      this.home.removeLastChild().render(this.model.state.currentSearch.currentWeather);
      this.sidebar.removeLastChild().render(this.model.state.currentSearch.forecast);

      this.model.saveHistory();

      this.home.disablePositionBtn();
    } catch (error) {
      console.log(error);
    }
  };

  handleFocusBtnClick = () => {
    this.home.focusInput();
  };

  handlePositionBtnClick = async () => {
    try {
      await this.geolocation.checkGelocationPermission();

      const userPosition = await Geolocation.getUserPosition();
      const positionData = await App.getPositionData(userPosition.coords);

      this.map.loadMap(userPosition);
      this.home.disablePositionBtn().setInputValue(positionData).focusInput();
    } catch (error) {
      console.log(error);
    }
  };

  handleMapClick = async coords => {
    const { lat, lng } = coords;

    try {
      const positionData = await App.getPositionData({ latitude: lat, longitude: lng });
      this.home.disablePositionBtn().setInputValue(positionData).focusInput();
    } catch (error) {
      console.log(error);
    }
  };

  initListeners = () => {
    this.home
      .bindPositionBtnClick(this.handlePositionBtnClick)
      .bindFormSubmit(this.handleFormSubmit);

    this.sidebar.bindFocusBtnClick(this.handleFocusBtnClick);
    this.map.bindMapClick(this.handleMapClick);
  };

  mount() {
    const { home, sidebar, map, initListeners } = this;

    home.render();
    sidebar.render();
    map.loadMap();

    initListeners();
  }
}
