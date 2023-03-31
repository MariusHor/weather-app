import { append, getEl } from '../utils/helpers';
import ForecastPanel from '../components/Section.forecastPanel';
import DefaultSidebar from '../components/Section.defaultSidebar';

export default class Sidebar {
  constructor(root) {
    this.parent = getEl(root, '[data-root="sidebar"]');
  }

  removeLastChild = () => {
    this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };

  bindFocusBtnClick = callback => {
    this.parent.addEventListener('click', event => {
      const focusBtn = event.target.closest('[data-button="focus"]');
      if (!focusBtn) return;

      callback();
    });
    return this;
  };

  render = data => {
    if (data?.forecast) {
      append(this.parent, ForecastPanel(data.forecast));
    } else append(this.parent, DefaultSidebar(data.favorites));
  };
}
