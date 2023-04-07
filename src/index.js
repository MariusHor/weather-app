import { Model, Geolocation, EventEmitter, Notification, views } from 'core';
import App from './App';

import 'styles/main.scss';
import './index.css';

const root = document.querySelector('.app');

const favNotifications = new Notification();
const events = new EventEmitter();
const geolocation = new Geolocation();
const model = new Model(events, geolocation);

const appViews = {
  header: new views.Header(root, events, favNotifications),
  main: new views.Main(root, events),
  footer: new views.Footer(root, events),
  side: new views.Side(root, events),
  map: new views.Map(events),
};

const app = new App(appViews, model);

app.mount();
