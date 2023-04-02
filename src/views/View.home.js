import { append, getEl } from '../utils/helpers';
import DefaultHome from '../components/Section.defaultHome';
import Results from '../components/Section.results';

export default class Home {
  constructor(root) {
    this.parent = getEl(root, '[data-root="home"]');
    this.input = getEl(this.parent, '[data-input="search"]');
    this.form = getEl(this.parent, '[data-form="search"]');
    this.positionBtn = getEl(this.parent, '[data-btn="position"]');
    this.homeBtn = getEl(root, '[data-btn="home"]');
    this.containerHomeBtn = getEl(root, '[data-container="home-btn"]');
  }

  removeLastChild = () => {
    this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };

  focusSearchInput = () => {
    this.input.focus();

    return this;
  };

  setSearchInputValue = positionData => {
    if (positionData) {
      this.input.value = `${positionData.locality}, ${positionData.country}`;
    } else this.input.value = '';

    return this;
  };

  disablePositionBtn = () => {
    this.positionBtn.setAttribute('disabled', true);
    this.positionBtn.classList.remove('text-slate-700');
    this.positionBtn.classList.add('text-slate-400');

    return this;
  };

  enablePositionBtn = () => {
    this.positionBtn.removeAttribute('disabled');
    this.positionBtn.classList.add('text-slate-700');
    this.positionBtn.classList.remove('text-slate-400');

    return this;
  };

  bindFormSubmit = callback => {
    this.form.addEventListener('submit', event => {
      event.preventDefault();

      const input = this.input.value;
      this.input.value = '';

      callback(input);
    });
    return this;
  };

  bindPositionBtnClick(callback) {
    this.positionBtn.addEventListener('click', async () => {
      await callback();
    });
    return this;
  }

  bindFavoriteBtnClick = callback => {
    this.favoriteBtn.addEventListener('click', () => {
      callback();
    });
    return this;
  };

  bindHomeBtnClick = callback => {
    this.homeBtn.addEventListener('click', () => {
      callback();
    });
    return this;
  };

  createNotificationElement() {
    this.notificationElement = document.createElement('span');
    this.notificationElement.classList.add('notification');
    this.containerHomeBtn.appendChild(this.notificationElement);
  }

  renderNotificationCount(notificationCount) {
    this.notificationElement.textContent = notificationCount;
  }

  removeNotificationCount() {
    if (!this.notificationElement) return;

    this.notificationElement = null;
    this.containerHomeBtn.removeChild(this.containerHomeBtn.lastElementChild);
  }

  render = (payload, favCallback) => {
    if (payload) {
      append(this.parent, Results(payload));

      this.favoriteBtn = getEl(this.parent, '[data-btn="favorite"]');

      return this.bindFavoriteBtnClick(favCallback);
    }
    return append(this.parent, DefaultHome());
  };
}
