import App from './App';
import '@styles/main.scss';
import './index.css';

const root = document.querySelector('#root');

const app = new App(root);
app.mount();
