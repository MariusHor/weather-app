import Home from './views/View.home';
import Sidebar from './views/View.sidebar';
import Footer from './views/View.footer';
import Model from './Model';
import Map from './Map';
import Geolocation from './Geolocation';

import './App.scss';
import { MAX_FAV_COUNT } from './constants/constants';

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
      if (!this.model.state.currentSearch) {
        await this.model.getCoords(input);
        await this.model.getWeatherInfo();
      }

      this.home
        .removeLastChild()
        .render(
          this.model.state.currentSearch.currentWeather,
          this.handleFavoriteBtnClick,
          this.handleFavoriteSubmit,
        );

      const { forecast } = this.model.state.currentSearch;

      this.sidebar.removeLastChild().render({ forecast });
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

      this.map.setCurrentMarker({
        coords: {
          latitude: lat,
          longitude: lng,
        },
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
      this.model.saveCurrentSearch({ coords: { lat, lon } });

      await this.model.getWeatherInfo();
      const positionData = this.model.getPositionData();

      this.map.setHomeMarker(userPosition);
      this.home.disablePositionBtn().setSearchInputValue(positionData).focusSearchInput();
    } catch (error) {
      console.log(error);
    }
  };

  handleFocusBtnClick = () => {
    this.home.focusSearchInput();
  };

  handleFavoriteSubmit = favoriteTag => {
    try {
      let favorites = this.model.getFavorites();
      if (favorites.length >= MAX_FAV_COUNT) throw Error('Maximum saved favorites reached');

      this.model.saveFavorite(favoriteTag);

      this.home.renderSavedFeedback();

      favorites = this.model.getFavorites();
      this.footer.render(favorites.length);
    } catch (error) {
      this.home.renderSavedFeedback(error);
    } finally {
      this.home.hideFavoriteInput();
    }
  };

  handleFavoriteBtnClick = () => {
    const positionData = this.model.getLastLocationSearch();
    this.home.revealFavInput(positionData);
  };

  handleHomeBtnClick = () => {
    const favorites = this.model.getFavorites();

    this.home.removeLastChild().render();
    this.sidebar.removeLastChild().render({ favorites });
    this.map.loadMap().bindMapClick(this.handleMapClick);

    if (this.map.homeCoords) {
      this.map.setHomeMarker();
    }
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
    const { home, sidebar, footer, map, initListeners } = this;

    const favorites = this.model.getFavorites();

    home.render();
    footer.render(favorites.length);
    sidebar.render({ favorites });
    map.loadMap();

    initListeners();
  }
}
