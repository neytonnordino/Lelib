import Image from 'next/image';
import React from 'react';

const heroImages = [
  { image: "/images/hero-images/Hero1.jpg", label: "Hero image 1" },
  { image: "/images/hero-images/Hero2.jpg", label: "Hero image 2" },
  { image: "/images/hero-images/Hero3.jpg", label: "Hero image 3" },
  { image: "/images/hero-images/Hero4.jpg", label: "Hero image 4" },
  { image: "/images/hero-images/Hero5.jpg", label: "Hero image 5" },
  { image: "/images/hero-images/Hero6.jpg", label: "Hero image 6" },
  { image: "/images/hero-images/Hero7.jpg", label: "Hero image 7" },
];

const HeroImages = () => {
  return (
    <div className="flex  w-max animate-scroll">
      {heroImages.map((hero, index) => (
        <div key={index} className="min-w-[400px] h-[400px] mx-2 relative">
          <Image
            src={hero.image}
            alt={hero.label}
            fill
            className="object-cover rounded-lg"
          />
        </div>
      ))}
    </div>
  );
};

export default HeroImages;
