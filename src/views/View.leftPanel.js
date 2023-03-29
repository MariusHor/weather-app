import Button from '../components/Button.primary';
import { getEl, append, toggleClasses, setList } from '../utils/helpers';
import SIDEBAR_ICONS from '../constants/constants';
import Home from './View.home';

export default class LeftPanel {
  constructor() {
    this.sideButtons = setList(SIDEBAR_ICONS, Button, {
      test: 'home',
      opt: {
        active: true,
      },
    });

    this.Home = new Home();
  }

  connect(parent) {
    append(parent, this.render());
    this.mount(parent);
  }

  mount(parent) {
    const sidebar = getEl(parent, "[data-root='sidebar']");
    this.main = getEl(parent, "[data-root='main']");

    this.Home.connect(this.main);

    this.handleBtnClicks(sidebar);
  }

  handleBtnClicks(root) {
    root.addEventListener('click', event => {
      const el = event.target.closest('.btn');
      if (!el) return;

      this.connectComponent(el.dataset.comp);

      toggleClasses('.btn', el, ['bg-white', 'text-teal-400'], ['text-white']);
    });
  }

  connectComponent(comp) {
    if (this.main.lastElementChild) {
      this.main.removeChild(this.main.lastElementChild);
    }

    if (comp === 'home') {
      this.Home.connect(this.main);
    }
  }

  render() {
    return `
          <div class='flex gap-8 col-span-7 m-4' data-root='left-panel'>
            <div class='h-full flex-col w-16 flex justify-center'>
                <div class='flex flex-col justify-center gap-6 text-lg rounded-xl bg-teal-400 h-1/2 shadow-xl text-white' data-root='sidebar'>
                  ${this.sideButtons}
                </div>
            </div>
            <div class='w-full' data-root='main'>
            </div>
          </div>
      `;
  }
}
