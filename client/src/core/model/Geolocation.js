export default class Geolocation {
  #permission;

  #position;

  async #checkGelocationPermission() {
    try {
      this.#permission = await navigator.permissions.query({ name: 'geolocation' });
      if (this.#permission.state === 'denied') {
        throw new Error(this.#permission.state);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  async #getUserPosition() {
    try {
      this.#position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      if (!this.#position) throw Error('Could not get current position');

      return this.#position;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  getCurrentPositionCoords = async () => {
    try {
      await this.#checkGelocationPermission();

      const userPosition = await this.#getUserPosition();

      const { latitude: lat, longitude: lon } = userPosition.coords;

      return { lat, lon };
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}
