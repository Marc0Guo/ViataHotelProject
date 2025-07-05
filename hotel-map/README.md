# ViataHotelProject

A modern web application for discovering and exploring hotels in Seattle using React, TypeScript, Tailwind CSS, and Mapbox GL JS.

## Features

- 🗺️ Interactive map with hotel locations
- 🏨 Hotel clustering for better performance
- 📍 Detailed hotel information popups
- ⭐ Star ratings and reviews
- 💰 Price information
- 🏊 Amenities display
- 📱 Responsive design

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Mapping**: Mapbox GL JS
- **Clustering**: Supercluster
- **Build Tool**: Vite
- **Data**: Seattle hotel data (13 hotels)

## Project Structure

```
src/
├── components/
│   ├── Map.tsx             # Main map logic, rendering, and clustering
│   └── MarkerPopup.tsx     # Stateless JSX template for marker popup
├── data/
│   └── hotels.ts           # Array of hotel objects, source of truth
├── types/
│   └── hotel.ts            # Hotel TypeScript interface
├── App.tsx                 # Layout, renders <Map />
└── index.tsx               # ReactDOM render
```

## Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
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

   Navigate to `http://localhost:5173` to view the application.

## Usage

- **Zoom and Pan**: Use mouse wheel to zoom, drag to pan
- **Hotel Clusters**: Click on clusters to zoom in and see individual hotels
- **Hotel Details**: Click on individual hotel markers to see detailed information
- **Navigation**: Use the navigation controls in the top-right corner

## Hotel Data

The application uses real Seattle hotel data including:
- Hotel names and addresses
- Coordinates (latitude/longitude)
- Star ratings and user ratings
- Price per night
- Amenities
- Room types
- Review counts

## Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Development

- **TypeScript**: Full type safety with custom interfaces
- **ESLint**: Code linting and formatting
- **Hot Reload**: Automatic browser refresh on file changes
- **Tailwind CSS**: Utility-first CSS framework

## Customization

### Styling
- Modify `tailwind.config.js` for custom design tokens
- Update `src/index.css` for global styles
- Customize components in `src/components/`

### Map Configuration
- Change map style in `src/components/Map.tsx`
- Adjust clustering parameters
- Modify popup content in `src/components/MarkerPopup.tsx`

### Data
- Update hotel data in `src/data/hotels.ts`
- Modify the Hotel interface in `src/types/hotel.ts`

## License

This project is open source and available under the MIT License.
