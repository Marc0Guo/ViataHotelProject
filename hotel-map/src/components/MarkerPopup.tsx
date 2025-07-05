import type { Hotel } from '../types/hotel';

interface MarkerPopupProps {
  hotel: Hotel;
}

export const MarkerPopup: React.FC<MarkerPopupProps> = ({ hotel }) => {
  const formatPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `$${numPrice.toLocaleString()}`;
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
      <div className="flex items-start space-x-3">
        {hotel.image_url && (
          <img
            src={hotel.image_url}
            alt={hotel.name}
            className="w-16 h-16 object-cover rounded-md flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">
            {hotel.name}
          </h3>
          <div className="flex items-center space-x-2 mt-1">
            <span className="text-yellow-500 text-sm">{renderStars(hotel.star_rating)}</span>
            <span className="text-gray-600 text-sm">({hotel.rating}/10)</span>
          </div>
          <p className="text-gray-600 text-sm mt-1 truncate">{hotel.address}</p>
          <p className="text-gray-600 text-sm truncate">{hotel.room_type}</p>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(hotel.price_per_night)}
          </span>
          <span className="text-gray-500 text-sm">per night</span>
        </div>

        <div className="mt-2">
          <p className="text-gray-600 text-sm">
            {hotel.review_count.toLocaleString()} reviews
          </p>
        </div>

        {hotel.amenities.length > 0 && (
          <div className="mt-3">
            <p className="text-gray-700 text-sm font-medium mb-1">Amenities:</p>
            <div className="flex flex-wrap gap-1">
              {hotel.amenities.slice(0, 4).map((amenity, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                >
                  {amenity}
                </span>
              ))}
              {hotel.amenities.length > 4 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                  +{hotel.amenities.length - 4} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarkerPopup;