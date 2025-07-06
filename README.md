# ViataHotelProject

A modern web application for discovering and exploring hotels in Seattle using React, TypeScript, Tailwind CSS, and Mapbox GL JS.

## Features

- 🗺️ Interactive map with hotel locations
- 🏨 Hotel clustering for better performance
- 📍 Detailed hotel information popups
- ⭐ Star ratings and reviews
- 💰 Price information
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS
- **Clustering**: Supercluster
- **Build Tool**: Vite
- **Data**: Seattle hotel data (13 hotels)

## Project Architecture

```
src/
├── components/
│ ├── Map.tsx # Main map component with clustering and rendering logic
│ ├── HotelPin.tsx # Individual hotel marker component
│ ├── ClusterMarker.tsx # Clustered markers component
│ └── MarkerPopup.tsx # Hotel information popup template
├── hooks/
│ └── useClusteredHotels.ts # Custom hook for hotel clustering logic
├── data/
│ └── hotels.ts # Hotel data source and exports
├── types/
│ └── hotel.ts # TypeScript interfaces and type definitions
├── App.tsx # Main application component and layout
└── index.tsx # Application entry point and ReactDOM render
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <https://github.com/Marc0Guo/ViataHotelProject.git>
   cd hotel-map
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Mapbox access token**

   Create a `.env` file in the project root and add your Mapbox access token:
   ```env
   VITE_MAPBOX_TOKEN=your_mapbox_access_token_here
   ```

   To get a Mapbox access token:
   - Sign up at [mapbox.com](https://mapbox.com)
   - Go to your account dashboard
   - Create a new token or use the default public token

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**

   Use the link to view the application.

## Usage

- **Zoom and Pan**: Use mouse wheel to zoom, drag to pan
- **Hotel Clusters**: Click on clusters to zoom in and see individual hotels
- **Hotel Details**: Click on individual hotel markers to see detailed information
- **Navigation**: Use the navigation controls in the top-right corner


## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Customization

### Map Configuration
- Change map style in `src/components/Map.tsx`
- Adjust clustering parameters
- Modify popup content in `src/components/MarkerPopup.tsx`

### Data
- Update hotel data in `src/data/hotels.ts`
- Modify the Hotel interface in `src/types/hotel.ts`

