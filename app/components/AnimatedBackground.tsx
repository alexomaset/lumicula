import React, { useEffect, useState } from 'react';

interface Star {
  id: number;
  left: string;
  top: string;
  scale: number;
}

const AnimatedBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);
  
  useEffect(() => {
    const createStar = (): Star => ({
      id: Math.random(),
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      scale: 0.5 + Math.random(),
    });
    
    setStars(Array.from({ length: 50 }, createStar));
  }, []);
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map(star => (
        <div
          key={star.id}
          className="absolute w-1 h-1 bg-yellow-200 rounded-full animate-ping"
          style={{
            left: star.left,
            top: star.top,
            transform: `scale(${star.scale})`,
            animationDuration: '3s',
            animationDelay: `${Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;