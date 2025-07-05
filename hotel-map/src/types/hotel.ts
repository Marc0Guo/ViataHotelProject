export interface Hotel {
  hotel_id: number;
  name: string;
  latitude: number;
  longitude: number;
  address: string;
  star_rating: number;
  price_per_night: number | string;
  currency: string;
  rating: number;
  review_count: number;
  image_url: string;
  room_type: string;
  amenities: string[];
}

export default Hotel;