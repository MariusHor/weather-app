import './App.scss';

export default class App {
  constructor(root) {
    this.root = root;
  }

  mount() {
    console.log(this.root);
  }
}
