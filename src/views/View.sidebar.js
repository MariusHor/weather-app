import { append, getEl } from '../utils/helpers';
import Forecast from './View.forecast';

export default class Sidebar {
  constructor(root) {
    this.parent = getEl(root, '[data-root="sidebar"]');
  }

  removeLastChild = () => {
    this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };

  render = data => {
    append(this.parent, Forecast(data));
    // if (data) {
    //   append(this.parent, Results());
    // } else append(this.parent, Default());
  };
}
