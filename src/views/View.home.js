import { append, getEl } from '../utils/helpers';
import defaultView from './View.default';

export default class Home {
  constructor(root) {
    this.parent = getEl(root, '[data-root="home"]');
    this.input = getEl(this.parent, '[data-input="search"]');
    this.form = getEl(this.parent, '[data-form="search"]');
  }

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
    if (!data) append(this.parent, defaultView());
  };
}
