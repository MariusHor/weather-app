import { getEl } from '../utils/helpers';
import { MAX_FAV_COUNT } from '../constants/constants';

export default class Footer {
  constructor(root) {
    this.parent = getEl(root, '[data-root="footer"]');
    this.header = getEl(this.parent, '[data-header="footer"]');
  }

  render = favoritesCount => {
    const favsLeft = MAX_FAV_COUNT - favoritesCount;

    switch (favoritesCount) {
      case 0:
        this.header.innerHTML = `<h1>You can save up to <span class="text-amber-600">${MAX_FAV_COUNT}</span> different locations</h1>`;
        break;
      case MAX_FAV_COUNT:
        this.header.innerHTML = `<h1>You have reached the <span class="text-amber-600">max</span> number of saved locations</h1>`;
        break;
      default:
        this.header.innerHTML = `<h1>You can still save <span class="text-amber-600">${favsLeft}</span> more ${
          favsLeft === 1 ? 'location' : 'different locations'
        }</h1>`;
    }
  };
}
