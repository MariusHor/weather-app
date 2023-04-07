import { append, getEl } from 'utils/helpers';
import { SideDefault, SideForecast } from 'components';

export default class Sidebar {
  constructor(root, events) {
    this.parent = getEl(root, '[data-root="sidebar"]');

    events.on('setHomeView', this.render);
    events.on('setReportView', this.render);
  }

  render = state => {
    this.#removeLastChild();

    if (state.activeView === 'home') {
      append(this.parent, SideDefault(state.favorites));
    }

    if (state.activeView === 'report') {
      append(this.parent, SideForecast(state.history.at(-1).forecast));
    }
  };

  bindFocusBtnClick = callback => {
    this.parent.addEventListener('click', event => {
      const focusBtn = event.target.closest('[data-button="focus"]');
      if (!focusBtn) return;

      callback();
    });
    return this;
  };

  bindFavTagClick = callback => {
    this.parent.addEventListener('click', event => {
      const favTagElement = event.target.closest('[data-btn="favorite-tag"]');
      if (!favTagElement) return;

      const { tag } = favTagElement.dataset;
      callback(tag);
    });
  };

  #removeLastChild = () => {
    if (this.parent.lastElementChild) this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };
}
