import { append, getEl } from '../utils/helpers';
import DefaultHome from '../components/Section.defaultHome';
import Results from '../components/Section.results';

export default class Home {
  constructor(root) {
    this.parent = getEl(root, '[data-root="home"]');
    this.input = getEl(this.parent, '[data-input="search"]');
    this.form = getEl(this.parent, '[data-form="search"]');
    this.positionBtn = getEl(this.parent, '[data-btn="position"]');
  }

  removeLastChild = () => {
    this.parent.removeChild(this.parent.lastElementChild);
    return this;
  };

  focusInput = () => {
    this.input.focus();

    return this;
  };

  setInputValue = positionData => {
    this.input.value = `${positionData.city || positionData.locality}, ${positionData.countryCode}`;

    return this;
  };

  disablePositionBtn = () => {
    this.positionBtn.setAttribute('disabled', true);
    this.positionBtn.classList.remove('text-slate-700');
    this.positionBtn.classList.add('text-slate-400');

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

  render = payload => {
    if (payload) {
      append(this.parent, Results(payload));
    } else append(this.parent, DefaultHome());
  };
}
