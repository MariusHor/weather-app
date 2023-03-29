import Form from '../components/Form';
import Spinner from '../components/Spinner';
import Card from '../components/Card';
import Stats from '../components/Stats';
import { getEl, append, remove, removeLastIf } from '../utils/helpers';

export default class Home {
  connect(parent) {
    append(parent, Home.render());
    this.mount(parent);
  }

  mount(parent) {
    this.home = getEl(parent, "[data-root='home']");

    this.handleSubmit(this.home);
  }

  handleSubmit = root => {
    getEl(root, 'form').addEventListener('submit', e => {
      e.preventDefault();
      const { value } = e.target.elements.search;

      removeLastIf(root, "[data-root='stats']");
      removeLastIf(root, "[data-root='card']");

      append(root, Spinner());

      this.fetchFoodData(value, () => remove(root, "[data-root='spinner']"));
    });
  };

  fetchFoodData = (query, callback) => {
    const urls = [
      {
        link: `https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m`,
        obj: {
          headers: { 'Cache-Control': 'max-age=3600' },
        },
      },
      // {
      //   link: `https://api.calorieninjas.com/v1/nutrition?query=${query}`,
      //   obj: {
      //     method: 'GET',
      //     headers: {
      //       'X-Api-Key': 'plGtqqsdQXlm+dJMFg4AmA==L2wV8kHkAyIepRUa',
      //       'Cache-Control': 'max-age=3600',
      //     },
      //     contentType: 'application/json',
      //   },
      // },
    ];
    const promises = urls.map(url => fetch(url.link, url.obj).then(response => response.json()));

    Promise.all(promises)
      .then(data => {
        console.log(data);
        // callback();

        // const image = data[0].results[0].urls.regular;
        // const nutritionData = data[1].items[0];

        // this.mountMealCard(image, nutritionData);
      })
      .catch(error => {
        callback();
        console.error(error);
      });
  };

  mountMealCard(image, nutritionData) {
    append(this.home, Card(image, nutritionData));
  }

  static render() {
    return `
          <div class='w-full flex flex-col items-center gap-4 h-full' data-root='home'>
            <h1 class="flex flex-col text-2xl text-center mb-4"><span class="text-teal-400 text-5xl font-extrabold">Calorie</span>Counter</h1>
            <div data-root='form-container' class="w-full mb-6">
                ${Form({
                  type: 'text',
                  icon: `<i class="fa-solid fa-magnifying-glass"></i>`,
                  id: 'search',
                  placeholder: 'Search food...',
                })}
            </div>
            ${Stats()}
          </div>
      `;
  }
}
