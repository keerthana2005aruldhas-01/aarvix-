/** Maps a vehicle id to a photo in /public/images */
const IMAGES: Record<string, string> = {
  three_wheeler_500: '/images/mini.jpeg',
  pickup_8ft: '/images/pickup-truck.jpeg',
  mini_truck_1t: '/images/mini-truck.jpeg',
  tata_407: '/images/tata407.jpeg',
  eicher_14ft: '/images/14-foot.jpeg',
  eicher_17ft: '/images/17-foot.jpeg',
  multi_axle_32ft: '/images/32-feet.jpeg',
  heavy_trailer_28t: '/images/28ton.jpeg',
};

export const vehicleImage = (id: string): string => IMAGES[id] ?? '/images/truck-heavy.jpg';
