import { append, getEl } from 'utils/helpers';
import { SideDefault, SideForecast } from 'templates';

export default class Sidebar {
  constructor(root, events) {
    this.parent = getEl(root, '[data-root="sidebar"]');

    events.on('setHomeView', this.render);
    events.on('setReportView', this.render);
  }

  render = state => {
    this.#removeLastChild();

    if (state.activeView !== 'report') {
      append(this.parent, SideDefault(state.favorites));
    }

    if (state.activeView === 'report') {
      append(this.parent, SideForecast(state.history.at(-1).forecast));
    }
  };

  bindFocusBtnClick = callback => {
    const handlefocusBtnCallback = event => {
      this.parent.removeEventListener('click', handlefocusBtnCallback);

      const focusBtn = event.target.closest('[data-button="focus"]');

      if (!focusBtn) return;

      callback();
    };

    this.parent.addEventListener('click', handlefocusBtnCallback);

    return this;
  };

  bindFavTagClick = callback => {
    const handleFavoriteTagCallback = event => {
      const favTagElement = event.target.closest('[data-btn="favorite-tag"]');
      if (!favTagElement) return;

      const { tag } = favTagElement.dataset;
      callback(tag);
    };

    this.parent.addEventListener('click', handleFavoriteTagCallback);

    return {
      removeListeners: () => {
        this.parent.removeEventListener('click', handleFavoriteTagCallback);
      },
    };
  };

  #removeLastChild = () => {
    if (this.parent.lastElementChild) this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };
}
