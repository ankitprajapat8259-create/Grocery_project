import { useEffect } from "react";

const usePreloadImages = (imageList = []) => {
  useEffect(() => {
    imageList.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [imageList]);
};

export default usePreloadImages;
