import Home from './views/View.home';
import Sidebar from './views/View.sidebar';
import Model from './Model';

import './App.scss';

export default class App {
  constructor(root) {
    this.home = new Home(root);
    this.sidebar = new Sidebar(root);

    this.model = new Model();
  }

  handleFormSubmit = async input => {
    try {
      await this.model.getCoords(input);
      await this.model.getWeatherInfo();

      this.home.removeLastChild().render(this.model.state.currentSearch);
      this.sidebar.removeLastChild().render(this.model.state.currentSearch);

      this.model.saveHistory();
    } catch (error) {
      console.log(error);
    }
  };

  initListeners = () => {
    this.home.bindFormSubmit(this.handleFormSubmit);
    this.home.bindFocusBtnClick();
  };

  mount() {
    const { home, sidebar, initListeners } = this;

    home.render();
    sidebar.render();

    initListeners();
  }
}
