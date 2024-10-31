import { useEffect, useState } from "react";

export const useImageLoader = (tinySrc: string, originalSrc: string) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [image, setImage] = useState(tinySrc);
  useEffect(() => {
    const tinyImg = new Image();
    tinyImg.src = tinySrc;
    setImage(tinySrc);
    tinyImg.onload = () => {
      const originalImg = new Image();
      originalImg.src = originalSrc;
      originalImg.onload = () => {
        setLoaded(true);
        setImage(originalSrc);
      };
      originalImg.onerror = () => {
        setError(true);
      };
    };
    tinyImg.onerror = () => {
      setError(true);
    };
    return () => {
      tinyImg.onload = null;
      tinyImg.onerror = null;
    };
  }, [tinySrc, originalSrc]);
  return { loaded, error, image };
};
