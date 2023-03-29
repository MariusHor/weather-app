import Home from './views/View.home';
import Model from './Model';
import './App.scss';

export default class App {
  constructor(root) {
    this.home = new Home(root);
    this.model = new Model();
  }

  handleFormSubmit = async input => {
    try {
      await this.model.getCoords(input);
      await this.model.getWeatherInfo();
    } catch (error) {
      console.log(error);
    }
  };

  initListeners = () => {
    this.home.bindFormSubmit(this.handleFormSubmit);
    this.home.bindFocusBtnClick();
  };

  mount() {
    const { home, initListeners } = this;

    home.render();
    initListeners();
  }
}
