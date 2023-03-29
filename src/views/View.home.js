import { append, getEl } from '../utils/helpers';
// import Default from './View.default';
import Results from './View.results';

export default class Home {
  constructor(root) {
    this.parent = getEl(root, '[data-root="home"]');
    this.input = getEl(this.parent, '[data-input="search"]');
    this.form = getEl(this.parent, '[data-form="search"]');
  }

  removeLastChild = () => {
    this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };

  bindFormSubmit = callback => {
    this.form.addEventListener('submit', event => {
      event.preventDefault();

      const input = this.input.value;

      callback(input);
    });
  };

  bindFocusBtnClick = () => {
    this.parent.addEventListener('click', event => {
      const focusBtn = event.target.closest('[data-button="focus"]');
      if (!focusBtn) return;

      this.input.focus();
    });
  };

  render = data => {
    append(this.parent, Results(data));
    // if (data) {
    //   append(this.parent, Results());
    // } else append(this.parent, Default());
  };
}
