import Home from './views/View.home';
import Sidebar from './views/View.sidebar';
import Footer from './views/View.footer';
import Model from './model/Model';
import Map from './map/Map';
import Geolocation from './map/Geolocation';
import { CURRENT, FAVORITE, HOME, MAX_FAV_COUNT } from './constants/constants';

import './App.scss';

export default class App {
  constructor(root) {
    this.home = new Home(root);
    this.sidebar = new Sidebar(root);
    this.footer = new Footer(root);

    this.model = new Model();
    this.map = new Map();
    this.geolocation = new Geolocation();
  }

  handleFormSubmit = async input => {
    try {
      await this.model.getCoords(input);
      await this.model.getWeatherInfo();

      const { currentWeather, forecast } = this.model.state.currentSearch;

      this.home.removeLastChild().render(currentWeather, this.handleFavoriteSubmit);

      this.sidebar.removeLastChild().render({ forecast });
      this.model.saveHistory();
      this.home.disablePositionBtn();
    } catch (error) {
      console.log(error);
    }
  };

  handleMapClick = async coords => {
    try {
      const { lat, lng: lon } = coords;
      const positionData = await Model.getPositionData({ lat, lon });

      if (!positionData.locality) return; // TODO Display NOT FOUND message
      if (!this.map.currentLayer) this.map.createLayer(CURRENT);

      this.map.setMarker(CURRENT, {
        coords: { lat, lon },
      });

      this.home.setSearchInputValue(positionData).focusSearchInput();
    } catch (error) {
      console.log(error);
    }
  };

  handlePositionBtnClick = async () => {
    try {
      await this.geolocation.checkGelocationPermission();

      const userPosition = await Geolocation.getUserPosition();
      const { latitude: lat, longitude: lon } = userPosition.coords;
      const positionData = await Model.getPositionData({ lat, lon });

      if (!this.map.homeLayer) this.map.createLayer(HOME);
      if (this.map.currentLayer) this.map.resetLayer(CURRENT).resetMarkers(CURRENT);

      this.map.setMarker(HOME, { coords: { lat, lon } });
      this.home.disablePositionBtn().setSearchInputValue(positionData).focusSearchInput();
    } catch (error) {
      console.log(error);
    }
  };

  handleFavoriteSubmit = () => {
    try {
      let favorites = this.model.getFavorites();

      if (favorites.length >= MAX_FAV_COUNT) throw Error('Maximum saved favorites reached');
      if (this.map.favoritesLayer) this.map.resetLayer(FAVORITE).resetMarkers(FAVORITE);
      if (!this.map.favoritesLayer) this.map.createLayer(FAVORITE);

      const positionData = this.model.getLastLocationSearch();
      this.model.saveFavorite(`#${positionData}`);
      favorites = this.model.getFavorites();

      favorites.forEach(favorite => {
        const { coords } = favorite;
        this.map.setMarker(FAVORITE, { coords });
      });

      this.footer.render(favorites.length);
      this.showNotificationCount();
    } catch (error) {
      console.log(error);
    }
  };

  handleFocusBtnClick = () => {
    this.home.focusSearchInput();
  };

  handleHomeBtnClick = () => {
    const favorites = this.model.getFavorites();

    this.home.setSearchInputValue().removeLastChild().render();
    this.sidebar.removeLastChild().render({ favorites });

    if (!this.map.hasHomePosition) this.home.enablePositionBtn();
    if (this.home.notificationElement) this.removeNotificationCount();
    if (this.map.map) this.map.map.remove();

    this.map.createMap().loadLayers().bindMapClick(this.handleMapClick);
  };

  showNotificationCount = () => {
    this.model.increaseNotificationCount();
    const notificationCount = this.model.getNotificationCount();

    if (!this.home.notificationElement) this.home.createNotificationElement();
    this.home.renderNotificationCount(notificationCount);
  };

  removeNotificationCount = () => {
    this.model.resetNotificationCount();
    this.home.removeNotificationCount();
  };

  initListeners = () => {
    this.home
      .bindPositionBtnClick(this.handlePositionBtnClick)
      .bindFormSubmit(this.handleFormSubmit)
      .bindHomeBtnClick(this.handleHomeBtnClick);

    this.sidebar.bindFocusBtnClick(this.handleFocusBtnClick);
    this.map.bindMapClick(this.handleMapClick);
  };

  mount() {
    const { home, sidebar, map, footer, initListeners } = this;
    const favorites = this.model.getFavorites();

    home.render();
    footer.render(favorites.length);
    sidebar.render({ favorites });

    map.createMap();

    initListeners();
  }
}
