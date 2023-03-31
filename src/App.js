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

  handleFormSubmit = async input => {
    try {
      if (!this.model.state.currentSearch) {
        await this.model.getCoords(input);
        await this.model.getWeatherInfo();
      }

      this.home.removeLastChild().render(this.model.state.currentSearch.currentWeather);
      this.sidebar.removeLastChild().render(this.model.state.currentSearch.forecast);

      this.model.saveHistory();

      this.home.disablePositionBtn();
    } catch (error) {
      console.log(error);
    }
  };

  handleMapClick = async coords => {
    const { lat, lng } = coords;

    try {
      this.model.saveCurrentSearch({ coords: { lat, lon: lng } });
      await this.model.getWeatherInfo();

      const positionData = this.model.getPositionData();

      if (!positionData.locality) return; // Display NOT FOUND message

      this.home.setInputValue(positionData).focusInput();
    } catch (error) {
      console.log(error);
    }
  };

  handlePositionBtnClick = async () => {
    try {
      await this.geolocation.checkGelocationPermission();

      const userPosition = await Geolocation.getUserPosition();

      const { latitude: lat, longitude: lon } = userPosition.coords;
      this.model.saveCurrentSearch({ coords: { lat, lon } });

      await this.model.getWeatherInfo();
      const positionData = this.model.getPositionData();

      this.map.loadMap(userPosition);
      this.home.disablePositionBtn().setInputValue(positionData).focusInput();
    } catch (error) {
      console.log(error);
    }
  };

  handleFocusBtnClick = () => {
    this.home.focusInput();
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
