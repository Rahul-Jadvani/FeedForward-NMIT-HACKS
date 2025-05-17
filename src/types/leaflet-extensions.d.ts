
import L from "leaflet";

declare global {
  interface Window {
    L: typeof L & {
      Control: typeof L.Control & {
        Geocoder: {
          Nominatim: new () => any;
          new(options?: any): any;
        }
      },
      Routing: {
        control: (options: any) => any;
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
  }
  
  namespace Routing {
    function control(options: any): any;
  }
}

export {};
