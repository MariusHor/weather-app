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
      this.main.showLoader();

      const coords = await this.model.getCoords(input);
      const weatherReport = await this.model.getWeatherReport(coords);

      this.model
        .saveCurrentSearch({
          coords,
          currentWeather: weatherReport[0],
          forecast: {
            results: weatherReport[1].list.slice(0, 8),
            timezone: weatherReport[1].city.timezone,
          },
        })
        .saveActiveView('report')
        .saveInputValue('')
        .saveHistory()
        .dispatchState('setReportView');

      this.main
        .bindFavoriteBtnClick(this.handleFavoriteSubmit)
        .bindCopyUrlClick(this.handleCopyUrlClick);

      window.history.pushState({}, '', `#${input}`);
    } catch (error) {
      this.renderErrorFeedback(error.message);
    }
  };

  handleHomeBtnClick = async () => {
    try {
      const currentView = this.model.getCurrentView();
      if (currentView === 'home') return;

      this.main.showLoader();

      const { currentLocation, hasCurrentLocation, favorites } = this.model.state;

      if (favorites.length) await this.model.updateFavWeatherReport(favorites);
      if (hasCurrentLocation) await this.model.updateCurrLocationWeatherReport(currentLocation);

      this.model
        .saveActiveView('home')
        .saveInputValue('')
        .resetNotificationCount()
        .dispatchState('setHomeView');

      this.map.bindMapClick(this.handleMapClick);
      this.side.bindFavTagClick(this.handleFavTagClick);

      window.history.pushState('', document.title, window.location.pathname);
    } catch (error) {
      this.renderErrorFeedback(error.message);
    }
  };

  handlePositionBtnClick = async () => {
    try {
      const currentLocation = await this.model.getCurrentLocation();
      const weatherReport = await this.model.getWeatherReport(currentLocation.coords);

      this.model
        .saveCurrentLocation({
          hasCurrentLocation: true,
          currentLocation: {
            ...currentLocation,
            weatherReport,
          },
        })
        .saveInputValue(`${currentLocation.name.locality}, ${currentLocation.name.country}`)
        .dispatchState('setCurrentLocation');
    } catch (error) {
      this.renderErrorFeedback(error.message);
    }
  };

  handleMapClick = async coords => {
    try {
      const { lat, lng: lon } = coords;
      const locationName = await this.model.getPositionName({ lat, lon });

      this.model
        .saveCurrentSearch({ coords: { lat, lon } })
        .saveInputValue(`${locationName.locality}, ${locationName.country}`)
        .dispatchState('setMapQuery');

      this.map.bindMapQueryGetReport(this.handleMapQueryGetReport);
    } catch (error) {
      this.renderErrorFeedback(error.message);
    }
  };

  handleFavoriteSubmit = () => {
    try {
      const favorites = this.model.getFavorites();

      if (favorites.length >= MAX_FAV_COUNT) throw Error('Maximum saved favorites reached');

      this.model.increaseNotificationCount().saveFavorite().dispatchState('setFavorites');
    } catch (error) {
      this.renderErrorFeedback(error.message);
    }
  };

  handleFavTagClick = tag => {
    const queryInput = tag.slice(1);
    this.handleFormSubmit(queryInput);
  };

  handleFocusBtnClick = () => {
    this.header.focusSearchInput();
  };

  handleMapQueryGetReport = () => {
    this.header.submitForm();
  };

  handleCopyUrlClick = copyText => {
    navigator.clipboard.writeText(copyText).then(
      () => {
        this.main.showCopyFeedback('success');
      },
      () => {
        this.main.showCopyFeedback('error');
      },
    );
  };

  renderPageFromHash = async () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      await this.handleFormSubmit(hash);
    }
  };

  renderErrorFeedback = message => {
    this.model.saveActiveView('error').saveErrorMessage(message);
    const state = this.model.getState();

    this.main.render(state).bindHomeButtonClick(this.handleHomeBtnClick);
  };

  initListeners = activeView => {
    this.header
      .bindPositionBtnClick(this.handlePositionBtnClick)
      .bindFormSubmit(this.handleFormSubmit)
      .bindHomeBtnClick(this.handleHomeBtnClick);

    this.side.bindFocusBtnClick(this.handleFocusBtnClick);

    if (activeView === 'report') {
      this.main
        .bindFavoriteBtnClick(this.handleFavoriteSubmit)
        .bindCopyUrlClick(this.handleCopyUrlClick);
    }

    if (activeView === 'home') this.map.bindMapClick(this.handleMapClick);
  };

  mount = async () => {
    await this.renderPageFromHash();

    const state = this.model.getState();

    this.header.render(state);
    this.main.render(state);
    this.side.render(state);
    this.footer.render(state);

    if (state.activeView === 'home') this.map.render(state);

    this.initListeners(state.activeView);
  };
}
