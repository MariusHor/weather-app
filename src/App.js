import './App.scss';
import { MAX_FAV_COUNT } from 'constants/constants';

export default class App {
  constructor(views, model) {
    this.header = views.header;
    this.main = views.main;
    this.map = views.map;
    this.side = views.side;
    this.footer = views.footer;

    this.model = model;
  }

  handleFormSubmit = async input => {
    try {
      await this.model.getCoords(input);
      await this.model.getWeatherInfo();

      this.model
        .saveActiveView('report')
        .saveInputValue('')
        .saveHistory()
        .dispatchState('setReportView');

      this.main.bindFavoriteBtnClick(this.handleFavoriteSubmit);
    } catch (error) {
      console.log(error);
    }
  };

  handleHomeBtnClick = () => {
    const currentView = this.model.getCurrentView();
    if (currentView === 'home') return;

    this.model
      .saveActiveView('home')
      .saveInputValue('')
      .resetNotificationCount()
      .dispatchState('setHomeView');

    this.map.bindMapClick(this.handleMapClick);
  };

  handlePositionBtnClick = async () => {
    try {
      const currentLocation = await this.model.getCurrentLocation();

      this.model
        .saveCurrentLocation({ hasCurrentLocation: true, currentLocation })
        .saveInputValue(`${currentLocation.name.locality}, ${currentLocation.name.country}`)
        .dispatchState('setCurrentLocation');
    } catch (error) {
      console.log(error);
    }
  };

  handleMapClick = async coords => {
    try {
      const { lat, lng: lon } = coords;
      const locationData = await this.model.getPositionData({ lat, lon });

      this.model
        .saveCurrentSearch({ coords: { lat, lon } })
        .saveInputValue(`${locationData.locality}, ${locationData.country}`)
        .dispatchState('setMapQuery');
    } catch (error) {
      console.log(error);
    }
  };

  handleFavoriteSubmit = () => {
    try {
      const favorites = this.model.getFavorites();

      if (favorites.length >= MAX_FAV_COUNT) throw Error('Maximum saved favorites reached');

      this.model.increaseNotificationCount().saveFavorite().dispatchState('setFavorites');
    } catch (error) {
      console.log(error);
    }
  };

  handleFocusBtnClick = () => {
    this.header.focusSearchInput();
  };

  initListeners = () => {
    this.header
      .bindPositionBtnClick(this.handlePositionBtnClick)
      .bindFormSubmit(this.handleFormSubmit)
      .bindHomeBtnClick(this.handleHomeBtnClick);

    this.side.bindFocusBtnClick(this.handleFocusBtnClick);
    this.map.bindMapClick(this.handleMapClick);
  };

  mount() {
    const state = this.model.getState();

    this.header.render(state);
    this.main.render(state);
    this.map.render(state);
    this.side.render(state);
    this.footer.render(state);

    this.initListeners();
  }
}
