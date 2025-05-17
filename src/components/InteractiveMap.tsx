"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";

interface InteractiveMapProps {
  foodFlags: any[];
  onFoodFlagClick?: (id: string) => void;
}

// Make TypeScript understand our global Leaflet extensions
declare global {
  interface Window {
    L: typeof L & {
      Routing: {
        control: (options: any) => any;
      };
      Control: {
        Geocoder: {
          new(options: any): any;
          Nominatim: {
            new(): any;
          };
        };
      };
    };
  }
}

const InteractiveMap = ({ foodFlags, onFoodFlagClick }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeControlRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Function to calculate the route between two points
  const calculateRoute = (map: L.Map, userLocation: [number, number], destLocation: [number, number]) => {
    // Clear existing routes
    if (routeControlRef.current) {
      map.removeControl(routeControlRef.current);
    }
    
    // Clear existing routes
    if (map && window.L && window.L.Routing) {
      // Create routing control using the window.L namespace
      const routingControl = window.L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destLocation[0], destLocation[1])
        ],
        routeWhileDragging: true,
        showAlternatives: true,
        altLineOptions: {
          styles: [
            {color: '#6884CA', opacity: 0.15, weight: 9},
            {color: '#99BDFF', opacity: 0.8, weight: 6},
            {color: '#00CC52', opacity: 0.5, weight: 2}
          ]
        },
        lineOptions: {
          styles: [
            {color: '#6884CA', opacity: 0.15, weight: 9},
            {color: '#99BDFF', opacity: 0.8, weight: 6},
            {color: '#6b5cff', opacity: 0.5, weight: 2}
          ]
        }
      }).addTo(map);
      
      return routingControl;
    }
    return null;
  };
  
  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const newMap = L.map(mapRef.current).setView([19.0760, 72.8777], 13); // Mumbai coordinates

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(newMap);

    mapInstanceRef.current = newMap;
    
    // Add geolocation control
    L.control.locate({
      position: 'bottomright'
    }).addTo(newMap);
    
    // Add custom geolocation button
    const LocationControl = L.Control.extend({
      onAdd: function() {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = '<a href="#" title="Find my location" class="leaflet-control-locate"><span>📍</span></a>';
        div.onclick = function(e) {
          e.preventDefault();
          e.stopPropagation();
          getUserLocation();
          return false;
        };
        return div;
      }
    });
    
    new LocationControl({ position: 'bottomright' }).addTo(newMap);

    // Add food flags as markers
    foodFlags.forEach((flag) => {
      const marker = L.marker([flag.latitude, flag.longitude], {
        icon: L.icon({
          iconUrl: "/icons/food-flag.svg",
          iconSize: [32, 32],
          iconAnchor: [16, 32],
        }),
      }).addTo(newMap);

      marker.on("click", () => {
        onFoodFlagClick?.(flag.id);
      });
    });
  };

  // Get user's location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          mapInstanceRef.current?.setView([latitude, longitude], 15);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const leafletCSS = document.createElement("link");
      leafletCSS.rel = "stylesheet";
      leafletCSS.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(leafletCSS);

      const leafletScript = document.createElement("script");
      leafletScript.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      leafletScript.async = true;
      leafletScript.defer = true;

      leafletScript.onload = () => {
        // Load the Leaflet Routing Machine Plugin
        const routingScript = document.createElement("script");
        routingScript.src =
          "https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js";
        routingScript.onload = () => {
          setIsLoaded(true);
          initializeMap();
        };
        document.body.appendChild(routingScript);
      };

      document.body.appendChild(leafletScript);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && mapInstanceRef.current && userLocation) {
      foodFlags.forEach((flag) => {
        const destLocation: [number, number] = [flag.latitude, flag.longitude];
        calculateRoute(mapInstanceRef.current!, userLocation, destLocation);
      });
    }
  }, [userLocation, foodFlags, isLoaded]);

  return (
    <div className="map-container">
      <div className="map" ref={mapRef} style={{ height: "500px" }} />
    </div>
  );
};

export default InteractiveMap;
