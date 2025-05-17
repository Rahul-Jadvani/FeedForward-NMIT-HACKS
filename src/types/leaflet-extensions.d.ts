
// Types for Leaflet extensions
import L from "leaflet";

declare global {
  interface Window {
    L: typeof L & {
      Control: typeof L.Control & {
        Geocoder: {
          Nominatim: any;
          new(options?: L.Control.GeocoderOptions): L.Control.Geocoder;
        }
      }
    }
  }
}

declare module "leaflet" {
  namespace Control {
    interface GeocoderOptions {
      geocoder?: any;
      defaultMarkGeocode?: boolean;
    }
    
    class Geocoder extends Control {
      constructor(options?: GeocoderOptions);
      on(type: string, fn: (e: any) => void): this;
      markGeocode(result: any): void;
    }
    
    function geocoder(options?: GeocoderOptions): Geocoder;
  }
}
