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

  #handleFormSubmit = async input => {
    try {
      window.history.pushState({}, '', `#${input}`);
      this.main.showLoader();

      const coords = await this.model.getCoords(input);
      const positionName = await this.model.getPositionName(coords);
      const weatherReport = await this.model.getWeatherReport(coords);

      this.model
        .setState(prevState => ({
          ...prevState,
          formInputValue: '',
          activeView: 'report',
          history: [
            ...prevState.history,
            {
              positionName,
              coords,
              currentWeather: weatherReport[0],
              forecast: {
                results: weatherReport[1].list.slice(0, 8),
                timezone: weatherReport[1].city.timezone,
              },
            },
          ],
        }))
        .dispatchState('setReportView');

      this.#removeListeners('main').#bindListeners('main');
    } catch (error) {
      this.#renderErrorFeedback(error.message);
    }
  };

  #handleFavTagBtnClick = async currentTag => {
    window.history.pushState({}, '', `${currentTag}`);

    const { coords, tag } = this.model.getFavorite(currentTag);
    const [locality, country] = tag.slice(1).split(', ');
    const weatherReport = await this.model.getWeatherReport(coords);

    this.main.showLoader();

    this.model
      .setState(prevState => ({
        ...prevState,
        formInputValue: '',
        activeView: 'report',
        history: [
          ...prevState.history,
          {
            positionName: { locality, country },
            coords,
            currentWeather: weatherReport[0],
            forecast: {
              results: weatherReport[1].list.slice(0, 8),
              timezone: weatherReport[1].city.timezone,
            },
          },
        ],
      }))
      .dispatchState('setReportView');

    this.#removeListeners('main').#bindListeners('main');
  };

  #handleHomeBtnClick = async () => {
    try {
      const { activeView } = this.model.getState();
      if (activeView === 'home') return;

      window.history.pushState('', document.title, window.location.pathname);
      this.main.showLoader();

      await this.#updateFavoritesWeatherReport();
      await this.#updateCurrentPositionWeatherReport();

      this.model
        .setState(prevState => ({
          ...prevState,
          activeView: 'home',
          formInputValue: '',
          notificationCount: 0,
        }))
        .dispatchState('setHomeView');

      this.#removeListeners('map', 'side').#bindListeners('map', 'side');
    } catch (error) {
      this.#renderErrorFeedback(error.message);
    }
  };

  #updateFavoritesWeatherReport = async () => {
    const { favorites } = this.model.getState();

    if (favorites.length) {
      const updatedFavorites = await Promise.all(
        favorites.map(async favorite => {
          const weatherReport = await this.model.getWeatherReport(favorite.coords);
          return {
            ...favorite,
            weatherReport,
          };
        }),
      );

      this.model.setState(prevState => ({
        ...prevState,
        favorites: updatedFavorites,
      }));
    }
  };

  #updateCurrentPositionWeatherReport = async () => {
    const { currentPosition, hasCurrentPosition } = this.model.getState();

    if (hasCurrentPosition) {
      const weatherReport = await this.model.getWeatherReport(currentPosition.coords);

      this.model.setState(prevState => ({
        ...prevState,
        currentPosition: {
          ...prevState.currentPosition,
          weatherReport,
        },
      }));
    }
  };

  #handlePositionBtnClick = async () => {
    try {
      const currentPosition = await this.model.getCurrentPosition();
      const weatherReport = await this.model.getWeatherReport(currentPosition.coords);

      this.model
        .setState(prevState => ({
          ...prevState,
          formInputValue: `${currentPosition.name.locality}, ${currentPosition.name.country}`,
          hasCurrentPosition: true,
          currentPosition: {
            ...currentPosition,
            weatherReport,
          },
        }))
        .dispatchState('setCurrentPosition');
    } catch (error) {
      this.#renderErrorFeedback(error.message);
    }
  };

  #handleMapClick = async coords => {
    try {
      const { lat, lng: lon } = coords;
      const positionName = await this.model.getPositionName({ lat, lon });

      this.model
        .setState(prevState => ({
          ...prevState,
          formInputValue: `${positionName.locality}, ${positionName.country}`,
          currentSearch: {
            coords: { lat, lon },
          },
        }))
        .dispatchState('setMapQuery');

      this.map.bindGetReportBtn(this.#handleGetReportBtnClick);
    } catch (error) {
      this.#renderErrorFeedback(error.message);
    }
  };

  #handleFavoriteSubmit = () => {
    try {
      const { favorites, history } = this.model.getState();
      const { positionName, coords } = history.at(-1);

      if (favorites.length >= MAX_FAV_COUNT) throw Error('Maximum saved favorites reached');

      this.model.validateFavorite(coords);

      this.model
        .setState(prevState => ({
          ...prevState,
          notificationCount: prevState.notificationCount + 1,
          favorites: [
            ...prevState.favorites,
            {
              tag: `#${positionName.locality}, ${positionName.country}`,
              coords,
            },
          ],
        }))
        .dispatchState('setFavorites');
    } catch (error) {
      this.#renderErrorFeedback(error.message);
    }
  };

  #handleFocusBtnClick = () => {
    this.header.focusSearchInput();
  };

  #handleGetReportBtnClick = () => {
    this.header.submitForm();
  };

  #handleCopyUrlBtnClick = copyText => {
    navigator.clipboard.writeText(copyText).then(
      () => {
        this.main.showCopyFeedback('success');
      },
      () => {
        this.main.showCopyFeedback('error');
      },
    );
  };

  #renderPageFromHash = async () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      await this.#handleFormSubmit(hash);
    }
  };

  #renderErrorFeedback = message => {
    this.model.setState(prevState => ({
      ...prevState,
      formInputValue: ` `,
      errorMessage: message,
      activeView: 'error',
    }));

    const state = this.model.getState();

    this.header.render(state);
    this.main.render(state).bindHomeButtonClick(this.#handleHomeBtnClick);
    this.side.render(state);

    this.#removeListeners('side').#bindListeners('side');
  };

  #removeListeners = (...views) => {
    views.forEach(view => {
      switch (view) {
        case 'main':
          if (!this.favBtnClickListener) return;
          this.favBtnClickListener.removeListeners();
          if (!this.copyUrlClickListener) return;
          this.copyUrlClickListener.removeListeners();
          break;
        case 'side':
          if (!this.favTagClickListener) return;
          this.favTagClickListener.removeListeners();
          break;
        case 'map':
          if (!this.mapClickListener) return;
          this.mapClickListener.removeListeners();
          break;
        default:
          throw new Error(`Unsupported view: ${view}`);
      }
    });

    return this;
  };

  #bindListeners = (...views) => {
    views.forEach(view => {
      switch (view) {
        case 'main':
          this.favBtnClickListener = this.main.bindFavoriteBtnClick(this.#handleFavoriteSubmit);
          this.copyUrlClickListener = this.main.bindCopyUrlClick(this.#handleCopyUrlBtnClick);
          break;
        case 'side':
          this.favTagClickListener = this.side.bindFavTagClick(this.#handleFavTagBtnClick);
          break;
        case 'map':
          this.mapClickListener = this.map.bindMapClick(this.#handleMapClick);
          break;
        default:
          throw new Error(`Unsupported view: ${view}`);
      }
    });
  };

  #initListeners = activeView => {
    this.header
      .bindPositionBtnClick(this.#handlePositionBtnClick)
      .bindFormSubmit(this.#handleFormSubmit)
      .bindHomeBtnClick(this.#handleHomeBtnClick);

    this.side.bindFocusBtnClick(this.#handleFocusBtnClick);

    if (activeView === 'report') {
      this.main.bindFavoriteBtnClick(this.#handleFavoriteSubmit);
      this.main.bindCopyUrlClick(this.#handleCopyUrlBtnClick);
    }

    if (activeView === 'home') this.map.bindMapClick(this.#handleMapClick);
  };

  mount = async () => {
    await this.#renderPageFromHash();

    const state = this.model.getState();

    this.header.render(state);
    this.main.render(state);
    this.side.render(state);
    this.footer.render(state);

    if (state.activeView === 'home') this.map.render(state);

    this.#initListeners(state.activeView);
  };
}
