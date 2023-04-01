import L from 'leaflet';

export default class HomeLayer {
  #homeLayer;

  #homeMarker;

  #coords;

  createHomeMarker() {
    const greenIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.#homeMarker = L.marker(this.#coords, {
      opacity: 0.8,
      icon: greenIcon,
    })
      .bindPopup(
        L.popup({
          maxWidth: 200,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: 'current-position-popup',
        }),
      )
      .setPopupContent('You are here!')
      .on('click', () => {
        this.#homeMarker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        this.#homeMarker.openPopup();
      })
      .on('mouseout ', () => {
        this.#homeMarker.closePopup();
      })
      .openPopup();

    this.#homeLayer.addLayer(this.#homeMarker);

    this.map.on('click', () => {
      this.#homeMarker.setOpacity(0.4);
      this.#homeMarker.closePopup();
    });
  }

  storeCoords = position => {
    if (position) {
      const { latitude, longitude } = position.coords;
      this.#coords = [latitude, longitude];
    }
    return this;
  };

  #createHomeLayer = () => {
    this.#homeLayer = L.layerGroup();
    this.map.addLayer(this.#homeLayer);
  };

  loadLayer = map => {
    this.map = map;
    this.#createHomeLayer();
  };
}
