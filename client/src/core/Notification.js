export default class Notification {
  #notificationElement = null;

  #createElement(container) {
    this.#notificationElement = document.createElement('span');
    this.#notificationElement.classList.add(
      'notification',
      'absolute',
      'top-0',
      'right-0',
      'text-slate-200',
      'bg-red-600',
      'text-sm',
      'p-1.5',
      'rounded-full',
    );
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
