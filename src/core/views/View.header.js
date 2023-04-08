import { getEl } from 'utils/helpers';

export default class Header {
  constructor(root, events, notificationManager) {
    this.parent = getEl(root, '[data-root="header"]');
    this.input = getEl(this.parent, '[data-input="search"]');
    this.form = getEl(this.parent, '[data-form="search"]');
    this.positionBtn = getEl(this.parent, '[data-btn="position"]');
    this.homeBtn = getEl(this.parent, '[data-btn="home-header"]');
    this.errorFeedbackEl = getEl(this.parent, '[data-feedback="error"]');

    this.notificationManager = notificationManager;

    events.on('setMapQuery', this.render);
    events.on('setCurrentLocation', this.render);
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

    if (state.hasCurrentLocation) {
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
    this.homeBtn.addEventListener('click', () => {
      callback();
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

  renderErrorFeedback = message => {
    this.errorFeedbackEl.textContent = message;
    this.errorFeedbackEl.classList.toggle('opacity-0');
    this.errorFeedbackEl.classList.toggle('opacity-100');

    setTimeout(() => {
      this.errorFeedbackEl.textContent = '';
      this.errorFeedbackEl.classList.toggle('opacity-0');
      this.errorFeedbackEl.classList.toggle('opacity-100');
    }, 2000);
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
