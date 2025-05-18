
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

const InteractiveMap = ({ foodFlags, onFoodFlagClick }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const routeControlRef = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);

  // Function to calculate the route between two points
  const calculateRoute = (map: L.Map, userLocation: [number, number], destLocation: [number, number]) => {
    try {
      // Clear existing routes
      if (routeControlRef.current) {
        map.removeControl(routeControlRef.current);
      }
      
      // Create routing control using the window.L namespace
      if (map && window.L && window.L.Routing) {
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
        });
        
        routeControlRef.current = routingControl;
        return routingControl.addTo(map);
      }
      return null;
    } catch (error) {
      console.error("Error calculating route:", error);
      setMapError(true);
      return null;
    }
  };
  
  // Initialize map
  const initializeMap = () => {
    try {
      if (!mapRef.current || mapInstanceRef.current) return;

      const newMap = L.map(mapRef.current).setView([19.0760, 72.8777], 13); // Mumbai coordinates

      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(newMap);

      mapInstanceRef.current = newMap;
      
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
        // Skip if latitude or longitude is missing
        if (flag.latitude === undefined || flag.longitude === undefined) {
          console.warn("Skipping food flag with missing coordinates:", flag);
          return;
        }
        
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
    } catch (error) {
      console.error("Error initializing map:", error);
      setMapError(true);
    }
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
    try {
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
    } catch (error) {
      console.error("Error loading map scripts:", error);
      setMapError(true);
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
      try {
        foodFlags.forEach((flag) => {
          const destLocation: [number, number] = [flag.latitude, flag.longitude];
          calculateRoute(mapInstanceRef.current!, userLocation, destLocation);
        });
      } catch (error) {
        console.error("Error calculating routes:", error);
        setMapError(true);
      }
    }
  }, [userLocation, foodFlags, isLoaded]);

  if (mapError) {
    return (
      <div className="map-placeholder bg-transparent-black/30 backdrop-blur-md border border-theme-accent/30 rounded-xl p-6 flex flex-col items-center justify-center h-[500px]">
        <div className="text-theme-blue text-xl mb-4">Map loading error</div>
        <p className="text-theme-blue/80 mb-4 text-center">
          There was an issue loading the interactive map. 
          Please try refreshing the page.
        </p>
        <div className="bg-theme-accent/30 rounded-lg w-full h-[300px] animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="map-container glass-card">
      <div className="map relative h-[500px] rounded-xl overflow-hidden" ref={mapRef}>
        {!isLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-theme-dark/50 backdrop-blur-sm">
            <div className="loading-pulse bg-theme-blue/20 h-20 w-20 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveMap;
