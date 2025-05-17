
import L from 'leaflet';

declare global {
  interface Window {
    L: typeof L & {
      Routing: {
        control: (options: any) => any;
      };
      Control: typeof L.Control & {
        Geocoder: {
          new(options: any): any;
          Nominatim: {
            new(): any;
          };
        };
        locate: (options?: any) => any;
      };
    };
  }
}

// This file is for type augmentation only and doesn't export anything
export {};
