import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Supercluster from 'supercluster';
import { hotels } from '../data/hotels';
import type { Hotel } from '../types/hotel';

import 'mapbox-gl/dist/mapbox-gl.css';
import HotelPin from './HotelPin';
import React from "react";
import ReactDOM from 'react-dom';

// Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapProps {
  className?: string;
}

export const Map: React.FC<MapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);


  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-122.335167, 47.608013], // Seattle center
      zoom: 12
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl());

    // Create supercluster instance
    const cluster = new Supercluster({
      radius: 40,
      maxZoom: 16
    });

    // Convert hotels to GeoJSON points
    const points: GeoJSON.Feature<GeoJSON.Point>[] = hotels.map(hotel => ({
      type: 'Feature',
      properties: {
        hotel_id: hotel.hotel_id,
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

    // Load points into cluster
    cluster.load(points);

    // Add source and layers
    map.current.on('load', () => {
      if (!map.current) return;

      // Add cluster source
      map.current.addSource('hotels', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        },
        cluster: true,
        clusterMaxZoom: 16,
        clusterRadius: 40
      });



      // Update source data
      const source = map.current.getSource('hotels') as mapboxgl.GeoJSONSource;
      source.setData({
        type: 'FeatureCollection',
        features: points
      });

      // After map is loaded, for each hotel:
      hotels.forEach(hotel => {
        const el = document.createElement('div');
        el.style.cursor = 'pointer';

        // Dynamically import ReactDOM to render the HotelPin
        import('react-dom/client').then(ReactDOM => {
          const root = ReactDOM.createRoot(el);
          root.render(
            <HotelPin imageUrl={hotel.image_url} name={hotel.name} />
          );
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([hotel.longitude, hotel.latitude])
          .addTo(map.current!);

        // Add zoom level compensation to keep pin size fixed
        const updateMarkerSize = () => {
          if (map.current) {
            const zoom = map.current.getZoom();
            // Use a more gradual scaling factor
            let scale = 1 / Math.pow(1.5, zoom - 16);

            // Set minimum and maximum scale to prevent pins from becoming too small or too large
            const minScale = 0.6;
            const maxScale = 0.8;
            scale = Math.max(scale, minScale);
            scale = Math.min(scale, maxScale);

            // Apply scale to the inner content
            const innerContent = el.querySelector('div');
            if (innerContent) {
              innerContent.style.transform = `scale(${scale})`;
              innerContent.style.transformOrigin = 'center center';
            }
          }
        };

        // Update size on zoom
        map.current.on('zoom', updateMarkerSize);

        // Initial size update
        updateMarkerSize();

        el.addEventListener('click', () => {
          // Remove existing popup if any
          if (popup.current) {
            popup.current.remove();
          }

          // Create new popup above the pin
          popup.current = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            offset: 25, // Offset to position above the pin
            className: 'hotel-popup'
          })
            .setLngLat([hotel.longitude, hotel.latitude])
            .setHTML(`
              <div class="bg-white rounded-lg shadow-lg p-4 max-w-sm">
                <h3 class="text-lg font-bold text-gray-900 mb-2">${hotel.name}</h3>
                <div class="flex items-center space-x-2 mb-2">
                  <span class="text-yellow-500 text-sm">${'★'.repeat(hotel.star_rating)}${'☆'.repeat(5 - hotel.star_rating)}</span>
                  <span class="text-gray-600 text-sm">·</span>
                  <span class="text-gray-600 text-sm">${hotel.review_count.toLocaleString()} reviews</span>
                </div>
                <p class="text-lg font-bold text-green-600 mb-3">$${typeof hotel.price_per_night === 'string' ? hotel.price_per_night : hotel.price_per_night.toLocaleString()}</p>
                <img src="${hotel.image_url}" alt="${hotel.name}" class="w-full h-32 object-cover rounded-md">
              </div>
            `)
            .addTo(map.current!);
        });
      });
    });



    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Map;