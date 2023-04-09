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
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const fetchMultiple = async urls => {
  try {
    const responses = await Promise.all(
      urls.map(url =>
        fetch(url, {
          cache: 'force-cache',
          headers: {
            'Cache-Control': 'public, max-age=600',
          },
        }),
      ),
    );
    const data = await Promise.all(responses.map(response => response.json()));
    return data;
  } catch (error) {
    console.error(error);
    return { error };
  }
};