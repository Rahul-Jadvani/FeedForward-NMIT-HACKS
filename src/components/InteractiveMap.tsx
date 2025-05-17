"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { Input } from "@/components/ui/input";

interface InteractiveMapProps {
  foodFlags: any[];
  onFoodFlagClick?: (id: string) => void;
}

const InteractiveMap = ({ foodFlags, onFoodFlagClick }: InteractiveMapProps) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [geolocationEnabled, setGeolocationEnabled] = useState(false);
  const [liveAddress, setLiveAddress] = useState("");
  const [selectedFlag, setSelectedFlag] = useState(null);

  const parseCoordinates = (coords) => {
    const [lat, lng] = coords
      .split(",")
      .map((coord) => parseFloat(coord.trim()));
    return L.latLng(lat, lng);
  };

  // Function to fetch coordinates from a place name using Nominatim API
  const getCoordinatesFromPlace = async (place) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${place}&format=json&addressdetails=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return L.latLng(lat, lon);
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Function to reverse geocode coordinates to an address
  const reverseGeocode = (lat, lon) => {
    const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name) {
          setLiveAddress(data.display_name);
        }
      })
      .catch((error) => console.error("Error reversing geocode:", error));
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

    const geoletOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const locateUser = () => {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by this browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          const userMarker = L.marker([latitude, longitude], {
            icon: L.icon({
              iconUrl: "/icons/user-location.svg",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            }),
          }).addTo(newMap);
          userMarker.bindPopup("You are here!").openPopup();

          newMap.setView([latitude, longitude], 15);
          setGeolocationEnabled(true);

          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
        },
        geoletOptions
      );
    };

    const geoButton = L.control({ position: "topright" });
    geoButton.onAdd = () => {
      const btn = L.DomUtil.create(
        "button",
        "leaflet-bar leaflet-control leaflet-control-custom"
      );
      btn.innerText = "📍 Locate Me";
      btn.style.cursor = "pointer";
      btn.style.padding = "8px";
      btn.style.backgroundColor = "#000000";
      btn.style.border = "1px solid #fff";
      btn.style.color = "#fff";
      btn.style.borderRadius = "4px";

      btn.onclick = () => locateUser();

      return btn;
    };

    geoButton.addTo(newMap);

    // Add geocoder control (Autocomplete for search)
    if (L.Control.Geocoder && L.Control.Geocoder.nominatim) {
      const geocoder = L.Control.Geocoder.nominatim();
      L.Control.geocoder({ geocoder }).addTo(newMap);
    }

    // Add markers for food flags
    foodFlags.forEach((flag) => {
      getCoordinatesFromPlace(flag.location).then((coords) => {
        if (coords) {
          const marker = L.marker(coords, {
            icon: L.icon({
              iconUrl: "/icons/food-flag.svg",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            }),
          }).addTo(newMap);

          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold text-lg mb-2">${flag.title}</h3>
              <p class="text-sm mb-2">${flag.description}</p>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm font-medium">Distance:</span>
                <span class="text-sm">${flag.distance}</span>
              </div>
              <div class="flex items-center gap-2 mb-2">
                <span class="text-sm font-medium">Expires in:</span>
                <span class="text-sm">${flag.expiryTime}</span>
              </div>
              <button 
                class="w-full bg-primary text-white py-1 px-2 rounded hover:bg-primary/90 transition-colors"
                onclick="window.dispatchEvent(new CustomEvent('foodFlagClick', {detail: '${flag.id}'}))"
              >
                View Details
              </button>
            </div>
          `;

          marker.bindPopup(popupContent);

          // Add click event listener
          marker.on('click', () => {
            setSelectedFlag(flag);
            if (onFoodFlagClick) {
              onFoodFlagClick(flag.id);
            }
          });
        }
      });
    });
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
        const L = window.L;

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

  // Update markers when foodFlags change
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      // Clear existing markers
      mapInstanceRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapInstanceRef.current.removeLayer(layer);
        }
      });

      // Add new markers
      foodFlags.forEach((flag) => {
        getCoordinatesFromPlace(flag.location).then((coords) => {
          if (coords) {
            const marker = L.marker(coords, {
              icon: L.icon({
                iconUrl: "/icons/food-flag.svg",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              }),
            }).addTo(mapInstanceRef.current);

            const popupContent = `
              <div class="p-2">
                <h3 class="font-bold text-lg mb-2">${flag.title}</h3>
                <p class="text-sm mb-2">${flag.description}</p>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium">Distance:</span>
                  <span class="text-sm">${flag.distance}</span>
                </div>
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium">Expires in:</span>
                  <span class="text-sm">${flag.expiryTime}</span>
                </div>
                <button 
                  class="w-full bg-primary text-white py-1 px-2 rounded hover:bg-primary/90 transition-colors"
                  onclick="window.dispatchEvent(new CustomEvent('foodFlagClick', {detail: '${flag.id}'}))"
                >
                  View Details
                </button>
              </div>
            `;

            marker.bindPopup(popupContent);

            marker.on('click', () => {
              setSelectedFlag(flag);
              if (onFoodFlagClick) {
                onFoodFlagClick(flag.id);
              }
            });
          }
        });
      });
    }
  }, [foodFlags, isLoaded, onFoodFlagClick]);

  return (
    <div>
      <div className="mb-4">
        <label className="text-sm font-medium mb-2 block">Live Location Address</label>
        <Input
          type="text"
          value={liveAddress}
          readOnly
          className="w-full"
        />
      </div>

      <div id="map" ref={mapRef} className="h-[500px] rounded-lg" />
    </div>
  );
};

export default InteractiveMap; 