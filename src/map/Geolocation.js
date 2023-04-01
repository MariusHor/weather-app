export default class Geolocation {
  #permission;

  async checkGelocationPermission() {
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

  static getUserPosition() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  }
}
