"use client";

import { useEffect, useRef, useState } from "react";
import { Image } from "antd";
import { cn } from "../../helpers/mergeFunction";

const images = [
  { id: 0, src: "/detail.webp", alt: "Image 1" },
  { id: 1, src: "/detail.webp", alt: "Image 2" },
  { id: 2, src: "/detail.webp", alt: "Image 2" },
];

const ScrollContainers = () => {
  const containersRef = useRef([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const handleIntersection = (entries: any[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log("Container reached:", entry.target.id);
          setCurrentImageIndex(Number(entry.target.id));
          console.log("Current Image index:", currentImageIndex);
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, {
      threshold: 0.5,
    });

    containersRef.current.forEach((container) => {
      if (container) observer.observe(container);
    });

    return () => {
      containersRef.current.forEach((container) => {
        if (container) observer.unobserve(container);
      });
    };
  }, [currentImageIndex]);

  return (
    <div className="relative flex flex-row">
      <div className="flex flex-col sticky top-1/2 h-fit items-center mr-8">
        {images.map((_, index) => (
          <a
            key={index}
            className={cn(
              `cursor-pointer mb-3 h-[10px] w-[10px] rounded-full border-[2px] border-[#e3e3e3] bg-transparent`,
              { "bg-[#454545] border-[#454545]": index === currentImageIndex }
            )}
          ></a>
        ))}
      </div>
      <div className="flex flex-col">
        {images.map((_, index) => (
          <div
            key={index}
            id={`${index}`}
            ref={(el: never) => {
              containersRef.current[index] = el;
            }}
            className="h-[730px]"
            style={{
              marginBottom: "20px",
            }}
          >
            <Image src={_.src} alt={_.src} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScrollContainers;
