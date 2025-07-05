import React from 'react';

interface ClusterMarkerProps {
  pointCount: number;
  pointCountAbbreviated: string;
}

const ClusterMarker: React.FC<ClusterMarkerProps> = ({ pointCount, pointCountAbbreviated }) => {
  // Cluster Color based on cluster size
    const getClusterColor = (count: number) => {
      if (count >= 10) return 'rgba(67, 56, 202, 0.7)';
      if (count >= 6) return 'rgba(79, 70, 229, 0.7)';
      if (count >= 4) return 'rgba(99, 102, 241, 0.7)';
      return 'rgba(129, 140, 248, 0.7)';
    };

  // Circle Size based on cluster size
  const getClusterRadius = (count: number) => {
    if (count >= 100) return 60;
    if (count >= 50) return 50;
    return 40;
  };

  const color = getClusterColor(pointCount);
  const radius = getClusterRadius(pointCount);

  return (
    <div
      style={{
        width: radius * 2,
        height: radius * 2,
        borderRadius: '50%',
        backgroundColor: color,
        border: '2px solid white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: radius >= 50 ? 18 : 16,
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        cursor: 'pointer'
      }}
    >
      {pointCountAbbreviated}
    </div>
  );
};

export default ClusterMarker;