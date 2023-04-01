import L from 'leaflet';

export default class CurrentLayer {
  #coords;

  #currentLocationLayer;

  #currentMarker;

  createCurrentMarker() {
    if (this.#currentMarker) this.#currentLocationLayer.removeLayer(this.#currentMarker);

    const blueIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.#currentMarker = L.marker(this.#coords, {
      opacity: 0.8,
      icon: blueIcon,
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
        this.#currentMarker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        this.#currentMarker.openPopup();
      })
      .on('mouseout ', () => {
        this.#currentMarker.closePopup();
      })
      .openPopup();

    this.#currentLocationLayer.addLayer(this.#currentMarker);
  }

  #createCurrentLocationLayer = () => {
    this.#currentLocationLayer = L.layerGroup();
    this.map.addLayer(this.#currentLocationLayer);
  };

  storeCoords = position => {
    if (position) {
      const { latitude, longitude } = position.coords;
      this.#coords = [latitude, longitude];
    }
    return this;
  };

  loadLayer = map => {
    this.map = map;
    this.#createCurrentLocationLayer();
  };
}
