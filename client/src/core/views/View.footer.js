import { getEl } from 'utils/helpers';
import { MAX_FAV_COUNT } from 'constants';

export default class Footer {
  constructor(root, events) {
    this.parent = getEl(root, '[data-root="footer"]');
    this.header = getEl(this.parent, '[data-header="footer"]');

    events.on('setFavorites', this.render);
  }

  render = state => {
    const favsLeft = MAX_FAV_COUNT - state.favorites.length;

    switch (state.favorites.length) {
      case 0:
        this.header.innerHTML = `<h1 class="text-center">You can save up to <span class="text-amber-600">${MAX_FAV_COUNT}</span> different locations</h1>`;
        break;
      case MAX_FAV_COUNT:
        this.header.innerHTML = `<h1 class="text-center">You have reached the <span class="text-amber-600">max</span> number of saved locations</h1>`;
        break;
      default:
        this.header.innerHTML = `<h1 class="text-center">You can still save <span class="text-amber-600">${favsLeft}</span> more ${
          favsLeft === 1 ? 'location' : 'different locations'
        }</h1>`;
    }
  };
}
