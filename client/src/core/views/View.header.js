import { getEl } from 'utils/helpers';

export default class Header {
  constructor(root, events, notificationManager) {
    this.parent = getEl(root, '[data-root="header"]');
    this.input = getEl(this.parent, '[data-input="search"]');
    this.form = getEl(this.parent, '[data-form="search"]');
    this.positionBtn = getEl(this.parent, '[data-btn="position"]');
    this.homeBtn = getEl(this.parent, '[data-btn="home-header"]');

    this.notificationManager = notificationManager;

    events.on('setMapQuery', this.render);
    events.on('setCurrentPosition', this.render);
    events.on('setReportView', this.render);
    events.on('setHomeView', this.render);
    events.on('setFavorites', this.#renderNotificationCount);
  }

  render = state => {
    this.input.value = state.formInputValue;
    this.focusSearchInput();

    if (state.activeView === 'home') {
      this.notificationManager.remove(this.homeBtn);
    }

    if (state.hasCurrentPosition) {
      this.#disablePositionBtn();
    }

    return this;
  };

  bindPositionBtnClick(callback) {
    this.positionBtn.addEventListener('click', async () => {
      await callback();
    });

    return this;
  }

  bindHomeBtnClick = callback => {
    this.homeBtn.addEventListener('click', async () => {
      await callback();
    });

    return this;
  };

  bindFormSubmit = callback => {
    this.form.addEventListener('submit', event => {
      event.preventDefault();
      callback(this.input.value);
    });

    return this;
  };

  submitForm = () => {
    this.form.dispatchEvent(new Event('submit'));
  };

  focusSearchInput = () => {
    this.input.focus();
  };

  #renderNotificationCount = state => {
    this.notificationManager.render(state, this.homeBtn);
  };

  #disablePositionBtn = () => {
    this.positionBtn.setAttribute('disabled', true);
    this.positionBtn.classList.remove('text-slate-300');
    this.positionBtn.classList.add('text-slate-700');

    return this;
  };
}
