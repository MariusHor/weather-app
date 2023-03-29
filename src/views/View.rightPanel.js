import { append } from '../utils/helpers';

export default class RightPanel {
  connect(parent) {
    append(parent, RightPanel.render());

    return this;
  }

  static render() {
    return `
        <div class='col-span-3 m-4 rounded-lg bg-slate-100' data-root='right-panel'></div>
    `;
  }
}
