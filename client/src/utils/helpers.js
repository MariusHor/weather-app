import moment from 'moment';

export const getEl = (parent, selector) => parent.querySelector(selector);

export const append = (parent, content) => {
  parent.insertAdjacentHTML('beforeend', content);
};

export const formatTime = (unixTimestamp, timezoneOffset = 0, timeFormat = 'h:mm A') =>
  moment.utc(unixTimestamp, 'X').add(timezoneOffset, 'seconds').format(timeFormat);

export const round = number => Math.round(number);

export const fetchSingle = async url => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) throw new Error(data.message);

    return data;
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};
