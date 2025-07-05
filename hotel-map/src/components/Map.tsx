import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import Supercluster from 'supercluster';
import { hotels } from '../data/hotels';
import type { Hotel } from '../types/hotel';
import MarkerPopup from './MarkerPopup';
import 'mapbox-gl/dist/mapbox-gl.css';
import HotelPin from './HotelPin';
import React from "react";
import ReactDOM from 'react-dom';

// Set your Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';

interface MapProps {
  className?: string;
}

export const Map: React.FC<MapProps> = ({ className = '' }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

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

      // Add cluster layer
      map.current.addLayer({
        id: 'clusters',
        type: 'circle',
        source: 'hotels',
        filter: ['has', 'point_count'],
        paint: {
          'circle-color': [
            'step',
            ['get', 'point_count'],
            '#51bbd6',
            100,
            '#f1f075',
            750,
            '#f28cb1'
          ],
          'circle-radius': [
            'step',
            ['get', 'point_count'],
            20,
            100,
            30,
            750,
            40
          ]
        }
      });

      // Add cluster count layer
      map.current.addLayer({
        id: 'cluster-count',
        type: 'symbol',
        source: 'hotels',
        filter: ['has', 'point_count'],
        layout: {
          'text-field': '{point_count_abbreviated}',
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': 12
        }
      });

      // Add unclustered point layer
      map.current.addLayer({
        id: 'unclustered-point',
        type: 'circle',
        source: 'hotels',
        filter: ['!', ['has', 'point_count']],
        paint: {
          'circle-color': '#11b4da',
          'circle-radius': 8,
          'circle-stroke-width': 1,
          'circle-stroke-color': '#fff'
        }
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

        el.addEventListener('click', () => {
          setSelectedHotel(hotel);
        });
      });
    });

    // Handle cluster clicks
    map.current.on('click', 'clusters', (e) => {
      if (!map.current) return;

      const features = map.current.queryRenderedFeatures(e.point, {
        layers: ['clusters']
      });
      const clusterId = features[0].properties?.cluster_id;
      const source = map.current.getSource('hotels') as mapboxgl.GeoJSONSource;

      source.getClusterExpansionZoom(clusterId, (err, zoom) => {
        if (err) return;

        map.current?.easeTo({
          center: (features[0].geometry as any).coordinates,
          zoom: zoom
        });
      });
    });

    // Handle individual hotel clicks
    map.current.on('click', 'unclustered-point', (e) => {
      if (!map.current || !e.features?.[0]) return;

      const coordinates = (e.features[0].geometry as any).coordinates.slice();
      const hotelData = e.features[0].properties;

      // Find the hotel object
      const hotel = hotels.find(h => h.hotel_id === hotelData.hotel_id);
      if (!hotel) return;

      setSelectedHotel(hotel);

      // Create popup
      if (popup.current) {
        popup.current.remove();
      }

      popup.current = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML('<div id="hotel-popup"></div>')
        .addTo(map.current);

      // Render popup content
      const popupElement = document.getElementById('hotel-popup');
      if (popupElement) {
        // We'll render the popup content using React in the next step
        popupElement.innerHTML = `
          <div class="bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h3 class="text-lg font-semibold text-gray-900">${hotel.name}</h3>
            <p class="text-gray-600 text-sm">${hotel.address}</p>
            <p class="text-lg font-bold text-green-600 mt-2">$${typeof hotel.price_per_night === 'string' ? hotel.price_per_night : hotel.price_per_night.toLocaleString()}</p>
          </div>
        `;
      }
    });

    // Change cursor on hover
    map.current.on('mouseenter', 'clusters', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'clusters', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });

    map.current.on('mouseenter', 'unclustered-point', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'unclustered-point', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
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
      {selectedHotel && (
        <div className="absolute top-4 right-4 z-10">
          <MarkerPopup hotel={selectedHotel} />
        </div>
      )}
    </div>
  );
};

export default Map;