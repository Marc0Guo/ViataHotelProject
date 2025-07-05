import React from "react";

interface HotelPinProps {
  imageUrl: string;
  name: string;
}

const HotelPin: React.FC<HotelPinProps> = ({ imageUrl, name }) => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    {/* Circular Image */}
    <img
      src={imageUrl}
      alt={name}
      style={{
        width: 78,
        height: 78,
        borderRadius: '50%',
        border: '2px solid white',
        objectFit: 'cover',
        boxShadow: '0 0 4px rgba(0,0,0,0.2)',
      }}
    />
    {/* Name Box */}
    <div
      style={{
        background: '#3B5BDB',
        color: 'white',
        borderRadius: 24,
        padding: '6px 20px',
        marginLeft: 10,
        fontWeight: 600,
        fontSize: 16,
        display: 'flex',
        alignItems: 'center',
        maxWidth: 180,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}
    >
      {name}
    </div>
  </div>
);

export default HotelPin;