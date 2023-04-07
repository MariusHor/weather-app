import L from 'leaflet';
import { MARKER_ICON_PARAMS, MARKER_ICON_URI, MARKER_SHADOW_URL } from 'constants';

import ClusterLayer from './ClusterClayer';

export default class FavoritesLayerBuilder extends ClusterLayer {
  createMarker = coords => {
    const { lat, lon } = coords;

    const redIcon = new L.Icon({
      iconUrl: `${MARKER_ICON_URI}marker-icon-2x-red.png`,
      shadowUrl: MARKER_SHADOW_URL,
      ...MARKER_ICON_PARAMS,
    });

    this.marker = L.marker([lat, lon], {
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
      .setPopupContent('Favorite!')
      .on('click', () => {
        this.marker.setOpacity(0.8);
      })
      .on('mouseover ', () => {
        this.marker.openPopup();
      })
      .on('mouseout ', () => {
        this.marker.closePopup();
      })
      .openPopup();

    return this.marker;
  };
}

// mountFav(map) {
//   this.map = map;

//   console.log('mounted');

//   if (!this.layer) {
//     this.createClusterLayer();
//     this.map.addLayer(this.layer);
//   }

//   const marker = this.createMarker();
//   this.layer.addLayer(marker);
// }
