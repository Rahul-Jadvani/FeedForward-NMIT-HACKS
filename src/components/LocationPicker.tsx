"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import { Input } from "@/components/ui/input";
import { FormControl } from "@/components/ui/form";

interface LocationPickerProps {
  value?: string;
  onChange?: (address: string) => void;
}

const LocationPicker = ({ value, onChange }: LocationPickerProps) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [address, setAddress] = useState(value || "");

  // Function to fetch coordinates from a place name using Nominatim API
  const getCoordinatesFromPlace = async (place: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${place}&format=json&addressdetails=1`
      );
      const data = await response.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        return L.latLng(parseFloat(lat), parseFloat(lon));
      }
      return null;
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return null;
    }
  };

  // Function to reverse geocode coordinates to an address
  const reverseGeocode = async (lat: number, lon: number) => {
    try {
      const geocodeUrl = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&addressdetails=1`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
        onChange?.(data.display_name);
      }
    } catch (error) {
      console.error("Error reversing geocode:", error);
    }
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

    // Add click handler to map
    newMap.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      
      // Update marker position
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], {
          icon: L.icon({
            iconUrl: "/icons/food-flag.svg",
            iconSize: [32, 32],
            iconAnchor: [16, 32],
          }),
          draggable: true,
        }).addTo(newMap);

        // Add drag end handler
        markerRef.current.on('dragend', async (e) => {
          const marker = e.target;
          const position = marker.getLatLng();
          await reverseGeocode(position.lat, position.lng);
        });
      }

      // Update address
      await reverseGeocode(lat, lng);
    });

    // Add geocoder control (Autocomplete for search)
    if (L.Control.Geocoder && L.Control.Geocoder.nominatim) {
      const geocoder = L.Control.Geocoder.nominatim();
      L.Control.geocoder({
        geocoder,
        defaultMarkGeocode: false,
      })
      .on('markgeocode', async (e) => {
        const { center, name } = e.geocode;
        newMap.setView(center, 16);
        
        // Update marker position
        if (markerRef.current) {
          markerRef.current.setLatLng(center);
        } else {
          markerRef.current = L.marker(center, {
            icon: L.icon({
              iconUrl: "/icons/food-flag.svg",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            }),
            draggable: true,
          }).addTo(newMap);

          // Add drag end handler
          markerRef.current.on('dragend', async (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            await reverseGeocode(position.lat, position.lng);
          });
        }

        setAddress(name);
        onChange?.(name);
      })
      .addTo(newMap);
    }

    // If we have an initial address, set the marker
    if (value) {
      getCoordinatesFromPlace(value).then((coords) => {
        if (coords) {
          newMap.setView(coords, 16);
          markerRef.current = L.marker(coords, {
            icon: L.icon({
              iconUrl: "/icons/food-flag.svg",
              iconSize: [32, 32],
              iconAnchor: [16, 32],
            }),
            draggable: true,
          }).addTo(newMap);

          // Add drag end handler
          markerRef.current.on('dragend', async (e) => {
            const marker = e.target;
            const position = marker.getLatLng();
            await reverseGeocode(position.lat, position.lng);
          });
        }
      });
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

  // Update marker when value changes externally
  useEffect(() => {
    if (mapInstanceRef.current && value !== address) {
      setAddress(value || "");
      if (value) {
        getCoordinatesFromPlace(value).then((coords) => {
          if (coords) {
            mapInstanceRef.current.setView(coords, 16);
            if (markerRef.current) {
              markerRef.current.setLatLng(coords);
            } else {
              markerRef.current = L.marker(coords, {
                icon: L.icon({
                  iconUrl: "/icons/food-flag.svg",
                  iconSize: [32, 32],
                  iconAnchor: [16, 32],
                }),
                draggable: true,
              }).addTo(mapInstanceRef.current);

              // Add drag end handler
              markerRef.current.on('dragend', async (e) => {
                const marker = e.target;
                const position = marker.getLatLng();
                await reverseGeocode(position.lat, position.lng);
              });
            }
          }
        });
      }
    }
  }, [value]);

  return (
    <div className="space-y-4">
      <FormControl>
        <Input
          type="text"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            onChange?.(e.target.value);
          }}
          placeholder="Search for address..."
          className="w-full"
        />
      </FormControl>

      <div className="h-[300px] rounded-lg border" ref={mapRef} />
    </div>
  );
};

export default LocationPicker; 