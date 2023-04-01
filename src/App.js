import Home from './views/View.home';
import Sidebar from './views/View.sidebar';
import Footer from './views/View.footer';
import Model from './model/Model';
import Map from './map/Map';
import Geolocation from './map/Geolocation';
import { MAX_FAV_COUNT } from './constants/constants';

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
      const { currentSearch } = this.model.state;
      const { forecast } = currentSearch;

      if (!currentSearch) {
        await this.model.getCoords(input);
        await this.model.getWeatherInfo();
      }

      this.home
        .removeLastChild()
        .render(
          currentSearch.currentWeather,
          this.handleFavoriteBtnClick,
          this.handleFavoriteSubmit,
        );

      this.sidebar.removeLastChild().render({ forecast });
      this.model.saveHistory();
      this.home.disablePositionBtn();
    } catch (error) {
      console.log(error);
    }
  };

  handleMapClick = async coords => {
    try {
      const { lat, lng } = coords;

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

  handleFocusBtnClick = () => {
    this.home.focusSearchInput();
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

    if (this.map.isHomeSaved) {
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
    const { home, sidebar, map, footer, initListeners } = this;
    const favorites = this.model.getFavorites();

    home.render();
    footer.render(favorites.length);
    sidebar.render({ favorites });

    map.loadMap();

    initListeners();
  }
}
