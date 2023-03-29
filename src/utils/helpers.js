export const append = (parent, content) => {
  parent.insertAdjacentHTML('beforeend', content);
};

export const getEl = (parent, selector) => parent.querySelector(selector);
