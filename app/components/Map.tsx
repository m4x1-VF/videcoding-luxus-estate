"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix for default Leaflet marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface MapProps {
  location: string;
}

export default function Map({ location }: MapProps) {
  const [coordinates, setCoordinates] = useState<[number, number]>([37.4419, -122.1430]); // Default to Palo Alto

  useEffect(() => {
    // In a real application, you would use a geocoding service here to convert the location string to coordinates.
    // We are simulating a default coordinate for the Map here.
    if (location.toLowerCase().includes("palo alto")) {
        setCoordinates([37.4419, -122.1430]);
    } else if (location.toLowerCase().includes("beverly hills")) {
        setCoordinates([34.0736, -118.4004]);
    } else if (location.toLowerCase().includes("miami")) {
        setCoordinates([25.7617, -80.1918]);
    } else {
        // Fallback random-isn but deterministic logic based on string length to roughly center somewhere else
        // This is just a mock for UI purposes.
        setCoordinates([35 + location.length % 10, -110 + location.length % 15]);
    }
  }, [location]);

  return (
    <div className="w-full h-full min-h-[300px] z-0">
      <MapContainer 
        center={coordinates} 
        zoom={13} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%", borderRadius: "0.5rem" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={coordinates}>
          <Popup>
            {location}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
