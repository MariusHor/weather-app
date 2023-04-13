import { fetchSingle } from 'utils/helpers';
import { API_SERVER_URI } from 'constants';

export default class Api {
  getCoords = async query => {
    const url = `${API_SERVER_URI}weatherReport/coords/${query}`;

    try {
      this.buffer = await fetchSingle(url);
      return this.buffer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getWeatherReport = async coords => {
    const { lat, lon } = coords;
    const url = `${API_SERVER_URI}weatherReport/report/${lat}&${lon}`;

    try {
      this.buffer = await fetchSingle(url);
      return this.buffer;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getPositionName = async coords => {
    const { lat, lon } = coords;
    const url = `${API_SERVER_URI}weatherReport/positionName/${lat}&${lon}`;

    try {
      this.buffer = await fetchSingle(url);

      return this.buffer;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
}
