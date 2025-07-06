import { useMemo } from 'react';
import Supercluster from 'supercluster';
import type { Hotel } from '../types/hotel';

interface ClusterPoint {
  type: 'Feature';
  properties: {
    cluster?: boolean;
    cluster_id?: number;
    point_count?: number;
    point_count_abbreviated?: string;
    hotel_id?: string;
    name?: string;
    address?: string;
    star_rating?: number;
    price_per_night?: number | string;
    rating?: number;
    review_count?: number;
    image_url?: string;
    room_type?: string;
    amenities?: string[];
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

interface UseClusteredHotelsProps {
  hotels: Hotel[];
  bounds: [number, number, number, number] | null;
  zoom: number;
}

export const useClusteredHotels = ({ hotels, bounds, zoom }: UseClusteredHotelsProps) => {
  const cluster = useMemo(() => {
    const supercluster = new Supercluster({
      radius: 50, // Slightly larger radius for better clustering
      maxZoom: 18, // Higher max zoom to allow clustering at higher levels
      minPoints: 2
    });

    const points: ClusterPoint[] = hotels.map(hotel => ({
      type: 'Feature',
      properties: {
        hotel_id: hotel.hotel_id.toString(),
        name: hotel.name,
        address: hotel.address,
        star_rating: hotel.star_rating,
        price_per_night: hotel.price_per_night,
        rating: hotel.rating,
        review_count: hotel.review_count,
        image_url: hotel.image_url,
        room_type: hotel.room_type,
        amenities: hotel.amenities,
        cluster: false
      },
      geometry: {
        type: 'Point',
        coordinates: [hotel.longitude, hotel.latitude]
      }
    }));

    supercluster.load(points);
    return supercluster;
  }, [hotels]);

  const clusters = useMemo(() => {
    if (!bounds) return [];

    // Improved zoom level logic
    const maxClusterZoom = 18;
    const effectiveZoom = Math.min(Math.floor(zoom), maxClusterZoom);

    // Get clusters for the current zoom level
    const result = cluster.getClusters(bounds, effectiveZoom);

    console.log(`Zoom: ${zoom}, Effective zoom: ${effectiveZoom}, Clusters: ${result.length}`);

    return result;
  }, [cluster, bounds, zoom]);

  return {
    clusters,
    cluster,
    bounds,
    zoom
  };
};