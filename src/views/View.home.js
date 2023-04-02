import { append, getEl, toggleCSSclasses } from '../utils/helpers';
import DefaultHome from '../components/Section.defaultHome';
import Results from '../components/Section.results';

export default class Home {
  constructor(root) {
    this.parent = getEl(root, '[data-root="home"]');
    this.input = getEl(this.parent, '[data-input="search"]');
    this.form = getEl(this.parent, '[data-form="search"]');
    this.positionBtn = getEl(this.parent, '[data-btn="position"]');
    this.homeBtn = getEl(root, '[data-btn="home"]');
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

  revealFavInput = positionData => {
    this.favoriteLabel.textContent = '';
    toggleCSSclasses(this.favoriteInput, 'top-11', 'opacity-0', 'top-0', 'opacity-100');

    this.favoriteInput.value = `#${positionData}`;
    this.favoriteInput.focus();
  };

  hideFavoriteInput = () => {
    toggleCSSclasses(this.favoriteInput, 'top-11', 'opacity-0', 'top-0', 'opacity-100');
  };

  renderSavedFeedback = feedback => {
    if (feedback) {
      this.favoriteLabel.innerHTML = feedback.message;
    } else this.favoriteLabel.innerHTML = 'Favorite location saved!';

    this.favoriteLabel.classList.add('opacity-100');

    setTimeout(() => {
      toggleCSSclasses(this.favoriteLabel, 'opacity-0', 'opacity-100');
    }, 2000);
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
      toggleCSSclasses(this.favoriteLabel, 'opacity-0', 'opacity-100');
    });
    return this;
  };

  bindHomeBtnClick = callback => {
    this.homeBtn.addEventListener('click', () => {
      callback();
    });
    return this;
  };

  bindFavoriteInputSubmit = callback => {
    this.favoriteForm.addEventListener('submit', e => {
      e.preventDefault();
      const favoriteTag = this.favoriteInput.value;

      callback(favoriteTag);
    });

    return this;
  };

  render = (payload, clickCallback, submitCallback) => {
    if (payload) {
      append(this.parent, Results(payload));

      this.favoriteBtn = getEl(this.parent, '[data-btn="favorite"]');
      this.favoriteLabel = getEl(this.parent, '[data-label="favorite"]');
      this.favoriteInput = getEl(this.parent, '[data-input="favorite"]');
      this.favoriteForm = getEl(this.parent, '[data-form="favorite"]');

      return this.bindFavoriteBtnClick(clickCallback).bindFavoriteInputSubmit(submitCallback);
    }
    return append(this.parent, DefaultHome());
  };
}
