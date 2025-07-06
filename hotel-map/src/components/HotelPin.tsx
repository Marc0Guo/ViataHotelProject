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
        width: 24,
        height: 24,
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
        borderRadius: 20,
        padding: '4px 10px',
        marginLeft: 4,
        fontWeight: 600,
        fontSize: 10,
        display: 'flex',
        alignItems: 'center',
        maxWidth: 100,
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