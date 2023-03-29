import LeftPanel from './View.leftPanel';
import RightPanel from './View.rightPanel';
import { getEl, append } from '../utils/helpers';

export default class Dashboard {
  constructor() {
    this.LeftPanel = new LeftPanel();
    this.RightPanel = new RightPanel();
  }

  connect(parent) {
    append(parent, Dashboard.render());
    this.mount(parent);
  }

  mount(parent) {
    const root = getEl(parent, "[data-root='dashboard']");

    this.LeftPanel.connect(root);
    this.RightPanel.connect(root);
  }

  static render() {
    return `
      <div class='grid grid-cols-10 w-full h-full max-w-6xl max-h-192 shadow-xl rounded-lg' data-root='dashboard'>
      </div>
    `;
  }
}
