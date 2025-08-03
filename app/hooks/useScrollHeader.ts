import { useState, useEffect } from "react";

export const useScrollHeader = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const heroHeight = window.innerHeight; // Hero section height

      // Show header when:
      // 1. Scrolling up
      // 2. Scrolled past the hero section
      if (currentScrollY < lastScrollY || currentScrollY > heroHeight) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY <= heroHeight) {
        // Hide header immediately when scrolling down within the hero section
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Only apply scroll-based visibility after component is mounted
  const shouldShow = isMounted ? isVisible : true;

  return { isVisible: shouldShow };
};
