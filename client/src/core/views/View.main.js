import { append, getEl } from 'utils/helpers';
import { MainDefault, MainReport, MainError, Loader } from 'templates';

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
      const { positionName, currentWeather } = payload.history.at(-1);

      append(this.parent, MainReport(positionName, currentWeather));
      this.#getElements();

      if (this.shareBtnListeners) this.shareBtnListeners.removeListeners();
      this.shareBtnListeners = this.#handleShareButtonClick();
    }

    if (payload.activeView === 'error') {
      append(this.parent, MainError(payload.errorMessage));
      this.homeBtn = getEl(this.parent, '[data-btn="home-main"]');
    }

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

  bindHomeButtonClick = callback => {
    this.homeBtn.addEventListener('click', callback);
    return this;
  };

  bindFavoriteBtnClick = callback => {
    const handleFavBtnCallback = () => {
      callback();
    };

    this.favoriteBtn.addEventListener('click', handleFavBtnCallback);

    return {
      removeListeners: () => {
        this.favoriteBtn.removeEventListener('click', handleFavBtnCallback);
      },
    };
  };

  bindCopyUrlClick = callback => {
    const handleCopyUrlCallback = () => {
      callback(this.urlInput.value);
    };

    this.copyUrlBtn.addEventListener('click', handleCopyUrlCallback);

    return {
      removeListeners: () => {
        this.copyUrlBtn.removeEventListener('click', handleCopyUrlCallback);
      },
    };
  };

  #handleShareButtonClick = () => {
    const handleShareBtnCallback = () => {
      this.urlInput.value = window.location.href;
      this.popupContainer.classList.toggle('active');
    };

    const documentClickCallback = event => {
      if (event.target.closest('[data-container="shareBtn"]')) return;
      this.popupContainer.classList.remove('active');
    };

    this.shareBtn.addEventListener('click', handleShareBtnCallback);
    document.addEventListener('click', documentClickCallback);

    return {
      removeListeners: () => {
        this.shareBtn.removeEventListener('click', handleShareBtnCallback);
        document.removeEventListener('click', documentClickCallback);
      },
    };
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
