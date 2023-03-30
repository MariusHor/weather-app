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

  render = data => {
    console.log(data);
    if (data) {
      append(this.parent, ForecastPanel(data));
    } else append(this.parent, DefaultSidebar());
  };
}
