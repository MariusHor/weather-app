import moment from 'moment';

export const append = (parent, content) => {
  parent.insertAdjacentHTML('beforeend', content);
};

export const getEl = (parent, selector) => parent.querySelector(selector);

export const formatTime = (unixTimestamp, timezoneOffset) =>
  moment.utc(unixTimestamp, 'X').add(timezoneOffset, 'seconds').format('h:mm A');

export const round = number => Math.round(number);

export const fetchMultiple = async urls => {
  try {
    const responses = await Promise.all(urls.map(url => fetch(url)));
    const data = await Promise.all(responses.map(response => response.json()));
    return data;
  } catch (error) {
    console.error(error);
    return { error };
  }
};
