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
      radius: 40, // 减少聚类半径，让酒店更容易分离
      maxZoom: 17, // 增加最大聚类缩放级别
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

            // 在高缩放级别时强制显示所有单独的点，不使用聚类
    const maxClusterZoom = 17; // 增加最大聚类缩放级别
    const forceIndividualZoom = 18; // 强制显示单独点的缩放级别
    const effectiveZoom = Math.min(Math.floor(zoom), maxClusterZoom);

    let result;
    if (effectiveZoom >= forceIndividualZoom) {
      // 在缩放级别18及以上时，使用非常高的缩放级别来强制显示所有单独的点
      result = cluster.getClusters(bounds, 20); // 使用非常高的缩放级别
      console.log('Forcing individual points at zoom:', effectiveZoom, 'items:', result.length);
    } else {
      // 在低缩放级别时使用聚类
      result = cluster.getClusters(bounds, effectiveZoom);
      console.log('Using clusters at zoom:', effectiveZoom, 'items:', result.length);
    }

    return result;
  }, [cluster, bounds, zoom]);

  return {
    clusters,
    cluster,
    bounds,
    zoom
  };
};