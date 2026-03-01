import React, { useState } from 'react';
import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

const LocationMarker = ({ setMarkerPosition }) => {
  const [position, setPosition] = useState(null);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setMarkerPosition(e.latlng);
    },
  });

  return position ? (
    <Marker
      position={position}
      icon={L.icon({
        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41]
      })}
    />
  ) : null;
};

export default LocationMarker;
