import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { hotels } from '../data/hotels';

import { useClusteredHotels } from '../hooks/useClusteredHotels';
import 'mapbox-gl/dist/mapbox-gl.css';
import HotelPin from './HotelPin';
import ClusterMarker from './ClusterMarker';
import React from "react";


// Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapProps {
  className?: string;
}

export const Map: React.FC<MapProps> = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const [zoom, setZoom] = useState(12);

  // Use the clustered hotels hook
  const { clusters, cluster } = useClusteredHotels({ hotels, bounds, zoom });


  // Clear all markers
  const clearMarkers = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];
  }, []);

  // Render clusters and individual hotels
  const renderClusters = useCallback(() => {
    if (!map.current) return;

    clearMarkers();

    console.log('Rendering clusters:', clusters.length, 'clusters');

    clusters.forEach((clusterPoint: any) => {
      const el = document.createElement('div');
      el.style.cursor = 'pointer';

      if (clusterPoint.properties.cluster) {
        // Render cluster marker
        const pointCount = clusterPoint.properties.point_count;
        const pointCountAbbreviated = clusterPoint.properties.point_count_abbreviated;

        import('react-dom/client').then(ReactDOM => {
          const root = ReactDOM.createRoot(el);
          root.render(
            <ClusterMarker
              pointCount={pointCount}
              pointCountAbbreviated={pointCountAbbreviated}
            />
          );
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat(clusterPoint.geometry.coordinates)
          .addTo(map.current!);

        markersRef.current.push(marker);

        // Handle cluster click
        el.addEventListener('click', () => {
          if (!map.current) return;

          const expansionZoom = Math.min(
            cluster.getClusterExpansionZoom(clusterPoint.properties.cluster_id),
            20
          );

          map.current.easeTo({
            center: clusterPoint.geometry.coordinates,
            zoom: expansionZoom,
            duration: 500
          });
        });

      } else {
        // Render individual hotel pin
        const hotel = hotels.find(h => h.hotel_id.toString() === clusterPoint.properties.hotel_id);
        if (!hotel) return;

        import('react-dom/client').then(ReactDOM => {
          const root = ReactDOM.createRoot(el);
          root.render(
            <HotelPin imageUrl={hotel.image_url} name={hotel.name} />
          );
        });

        const marker = new mapboxgl.Marker(el)
          .setLngLat([hotel.longitude, hotel.latitude])
          .addTo(map.current!);

        markersRef.current.push(marker);

        // Pin size is now fixed and won't change with zoom

        // Handle hotel click
        el.addEventListener('click', () => {
          if (popup.current) {
            popup.current.remove();
          }

          popup.current = new mapboxgl.Popup({
            closeButton: true,
            closeOnClick: false,
            offset: 25,
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
      }
    });
  }, [clusters, cluster, hotels, clearMarkers]);

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

            // Handle map events
    const handleMapMove = () => {
      if (!map.current) return;

      const mapBounds = map.current.getBounds();
      if (mapBounds) {
        setBounds([
          mapBounds.getWest(),
          mapBounds.getSouth(),
          mapBounds.getEast(),
          mapBounds.getNorth()
        ]);
      }
      setZoom(map.current.getZoom());
    };

    map.current.on('load', handleMapMove);
    map.current.on('moveend', handleMapMove);
    map.current.on('zoomend', handleMapMove);

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Render clusters when they change
  useEffect(() => {
    renderClusters();
  }, [renderClusters]);

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default Map;