import { append, getEl } from 'utils/helpers';
import { MainDefault, MainReport } from 'components';

export default class Main {
  constructor(root, events) {
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
      this.favoriteBtn = getEl(this.parent, '[data-btn="favorite"]');
    }
  };

  bindFavoriteBtnClick = callback => {
    this.favoriteBtn.addEventListener('click', callback);
    return this;
  };

  #removeLastChild = () => {
    if (this.parent.lastElementChild) this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };
}
