export default class Notification {
  #notificationElement = null;

  #createElement(container) {
    this.#notificationElement = document.createElement('span');
    this.#notificationElement.classList.add('notification');
    container.appendChild(this.#notificationElement);
  }

  render(state, container) {
    if (!this.#notificationElement) this.#createElement(container);
    this.#notificationElement.textContent = state.notificationCount;
  }

  remove(container) {
    if (!this.#notificationElement) return;

    container.removeChild(this.#notificationElement);
    this.#notificationElement = null;
  }
}
