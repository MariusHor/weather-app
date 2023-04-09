import { append, getEl } from 'utils/helpers';
import { MainDefault, MainReport, MainError, Loader } from 'components';

export default class Main {
  constructor(root, events) {
    this.root = root;
    this.parent = getEl(root, '[data-root="home"]');

    events.on('setHomeView', this.render);
    events.on('setReportView', this.render);
  }

  render = payload => {
    this.#removeLastChild();

    if (payload.activeView === 'home') {
      append(this.parent, MainDefault());
    }

    if (payload.activeView === 'report') {
      append(this.parent, MainReport(payload.history.at(-1).currentWeather));
      this.#getElements();
      this.#handleShareButtonClick();
    }

    if (payload.activeView === 'error') {
      append(this.parent, MainError(payload.errorMessage));
      this.homeBtn = getEl(this.parent, '[data-btn="home-main"]');
    }

    return this;
  };

  bindHomeButtonClick = callback => {
    this.homeBtn.addEventListener('click', callback);
    return this;
  };

  bindFavoriteBtnClick = callback => {
    this.favoriteBtn.addEventListener('click', callback);
    return this;
  };

  bindCopyUrlClick = callback => {
    this.copyUrlBtn.addEventListener('click', () => {
      callback(this.urlInput.value);
    });
    return this;
  };

  showCopyFeedback = feedback => {
    if (feedback === 'success') {
      this.urlInput.value = 'URL copied!';
      setTimeout(() => {
        this.urlInput.value = window.location.href;
      }, 2500);
    }

    if (feedback === 'error') {
      this.urlInput.value = 'Please try again!';
      setTimeout(() => {
        this.urlInput.value = window.location.href;
      }, 2500);
    }
  };

  showLoader = () => {
    this.#removeLastChild();
    append(this.parent, Loader());
  };

  #handleShareButtonClick = () => {
    this.shareBtn.addEventListener('click', () => {
      this.urlInput.value = window.location.href;
      this.popupContainer.classList.toggle('active');
    });

    document.addEventListener('click', event => {
      if (event.target.closest('[data-container="shareBtn"]')) return;
      this.popupContainer.classList.remove('active');
    });
    return this;
  };

  #removeLastChild = () => {
    if (this.parent.lastElementChild) this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };

  #getElements = () => {
    this.favoriteBtn = getEl(this.parent, '[data-btn="favorite"]');
    this.shareBtn = getEl(this.parent, '[data-btn="share"]');
    this.shareBtnContainer = getEl(this.parent, '[data-container="shareBtn"]');
    this.popupContainer = getEl(this.shareBtnContainer, '[data-container="popup"]');
    this.urlInput = getEl(this.shareBtnContainer, '[data-input="popup"]');
    this.copyUrlBtn = getEl(this.shareBtnContainer, '[data-btn="copyUrl"]');
  };
}
