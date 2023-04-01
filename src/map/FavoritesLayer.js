import L from 'leaflet';

export default class FavoritesLayer {
  #favLocationsLayer;

  #favMarker;

  #coords;

  createFavMarker = () => {
    const redIcon = new L.Icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    });

    this.#favMarker = L.marker(this.#coords, {
      opacity: 0.8,
      icon: redIcon,
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
        this.#favMarker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        this.#favMarker.openPopup();
      })
      .on('mouseout ', () => {
        this.#favMarker.closePopup();
      })
      .openPopup()
      .addTo(this.map);
  };

  #createFavLocationsLayer() {
    this.#favLocationsLayer = L.markerClusterGroup();
    this.map.addLayer(this.#favLocationsLayer);
  }

  storeCoords = position => {
    if (position) {
      const { latitude, longitude } = position.coords;
      this.#coords = [latitude, longitude];
    }
    return this;
  };

  loadLayer = map => {
    this.map = map;
    this.#createFavLocationsLayer();
  };
}
