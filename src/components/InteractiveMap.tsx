
"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import "../types/leaflet-extensions";

interface FoodFlag {
  id: string;
  title: string;
  coordinates: [number, number];
  [key: string]: any;
}

interface InteractiveMapProps {
  foodFlags: any[];
  onFoodFlagClick?: (id: string) => void;
}

const InteractiveMap = ({ foodFlags, onFoodFlagClick }: InteractiveMapProps) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userLocationRef = useRef<L.Marker | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);

  // Function to get user's geolocation
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 15);
            
            // Update or create user location marker
            if (userLocationRef.current) {
              userLocationRef.current.setLatLng([latitude, longitude]);
            } else {
              userLocationRef.current = L.marker([latitude, longitude], {
                icon: L.icon({
                  iconUrl: "/icons/user-location.svg",
                  iconSize: [32, 32],
                  iconAnchor: [16, 16],
                }),
                zIndexOffset: 1000,
              }).addTo(mapInstanceRef.current);
            }
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };
  
  // Add food flag markers to the map
  const addFoodFlagMarkers = (map: L.Map) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.remove();
    });
    markersRef.current = [];
    
    foodFlags.forEach((flag) => {
      // If flag has predefined coordinates
      if (flag.coordinates) {
        const [lat, lng] = flag.coordinates;
        const marker = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: "/icons/food-flag.svg",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
        }).addTo(map);
        
        // Add popup with information
        marker.bindPopup(`
          <div class="font-medium">${flag.title}</div>
          <div class="text-xs mt-1">${flag.foodType}</div>
          <div class="text-xs text-muted-foreground mt-1">${flag.expiryTime}</div>
        `);
        
        // Add click handler for marker
        marker.on('click', () => {
          if (onFoodFlagClick) {
            onFoodFlagClick(flag.id);
          }
        });
        
        markersRef.current.push(marker);
      }
      // If flag has address but no coordinates, we could geocode it here
    });
  };
  
  // Function to create a route between user location and a food flag
  const createRoute = (map: L.Map, destination: [number, number]) => {
    if (!userLocation) return;
    
    // Clear existing routes
    if (map && window.L && window.L.Routing) {
      // Create routing control
      const routingControl = window.L.Routing.control({
        waypoints: [
          L.latLng(userLocation[0], userLocation[1]),
          L.latLng(destination[0], destination[1])
        ],
        routeWhileDragging: true,
        showAlternatives: true,
        altLineOptions: {
          styles: [
            { color: '#6b5cff', opacity: 0.4 }
          ]
        },
        lineOptions: {
          styles: [
            { color: '#00cc52', opacity: 0.8, weight: 5 }
          ]
        },
        createMarker: function() { return null; } // Don't create default markers
      });
      
      routingControl.addTo(map);
      return routingControl;
    }
  };
  
  // Initialize map
  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const newMap = L.map(mapRef.current, {
      center: [19.0760, 72.8777], // Mumbai coordinates as default
      zoom: 13,
      layers: [
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })
      ],
      zoomControl: false
    });
    
    // Add zoom control in a custom position
    L.control.zoom({
      position: 'bottomright'
    }).addTo(newMap);
    
    // Add custom geolocation button
    const geoButton = L.control({ position: 'bottomright' });
    geoButton.onAdd = function() {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
      div.innerHTML = `<a href="#" title="My location" role="button" aria-label="My location" class="bg-white hover:bg-gray-100 flex items-center justify-center w-[30px] h-[30px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#00cc52" stroke-width="2">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="4" />
        </svg>
      </a>`;
      
      div.onclick = function(e) {
        e.preventDefault();
        getUserLocation();
      };
      
      return div;
    };
    geoButton.addTo(newMap);

    // Add geocoder control (Autocomplete for search)
    if (window.L && window.L.Control && window.L.Control.Geocoder) {
      const geocoder = new window.L.Control.Geocoder.Nominatim();
      new window.L.Control.Geocoder({
        geocoder: geocoder,
        defaultMarkGeocode: false,
      })
      .on('markgeocode', (e) => {
        const { center, name } = e.geocode;
        newMap.setView(center, 16);
      })
      .addTo(newMap);
    }

    // Add markers for food flags
    addFoodFlagMarkers(newMap);
    
    // Try to get user location and add to map
    getUserLocation();
    
    mapInstanceRef.current = newMap;
  };

  // Hook for loading Leaflet from CDN
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
        const L = window.L;

        // Load the Leaflet Routing Machine Plugin
        const routingScript = document.createElement("script");
        routingScript.src =
          "https://unpkg.com/leaflet-routing-machine/dist/leaflet-routing-machine.js";
        routingScript.onload = () => {
          // Load Leaflet Geocoder
          const geocoderScript = document.createElement("script");
          geocoderScript.src =
            "https://unpkg.com/leaflet-control-geocoder/dist/Control.Geocoder.js";
          geocoderScript.onload = () => {
            setIsLoaded(true);
            initializeMap();
          };
          document.body.appendChild(geocoderScript);
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

  // Update markers when foodFlags change
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      addFoodFlagMarkers(mapInstanceRef.current);
    }
  }, [foodFlags, isLoaded]);

  // When routing to a specific flag
  const routeToFlag = (flagId: string) => {
    const flag = foodFlags.find(f => f.id === flagId);
    if (!flag || !flag.coordinates || !mapInstanceRef.current) return;
    
    createRoute(mapInstanceRef.current, flag.coordinates);
  };

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full relative border border-border rounded-lg overflow-hidden"
      style={{ 
        minHeight: "300px",
        borderColor: "#e5e7eb", 
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)" 
      }}
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default InteractiveMap;
