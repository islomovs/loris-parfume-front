import { useEffect, useRef, useState } from "react";
import { Image } from "antd";
import { cn } from "../../helpers/mergeFunction";
import { Spinner } from "@chakra-ui/react";

interface IImagePaginationProps {
  images: string[];
}

export const ImagePagination: React.FC<IImagePaginationProps> = ({
  images,
}) => {
  const containersRef = useRef<HTMLDivElement[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(new Set());
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  useEffect(() => {
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setCurrentImageIndex(Number(entry.target.id));
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

  const handleClick = (index: number) => {
    containersRef.current[index].scrollIntoView({ behavior: "smooth" });
  };

  const handleImageLoad = (index: number) => {
    setLoadedIndexes((prev) => new Set(prev).add(index)); // Mark image as loaded
  };

  return (
    <div className="flex flex-col lg:flex-row lg:space-x-8 relative lg:h-full">
      {/* Image Carousel: Desktop and Mobile */}
      <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible snap-x snap-mandatory w-full h-[360px] lg:h-full scrollbar-hide">
        <Image.PreviewGroup>
          {images?.map((image, index) => (
            <div
              key={index}
              id={`${index}`}
              ref={(el) => {
                if (el) containersRef.current[index] = el;
              }}
              className="flex-shrink-0 w-full lg:w-[730px] h-[360px] lg:h-[730px] flex justify-center items-center relative"
            >
              {!loadedIndexes.has(index) && (
                <div className="absolute inset-0 flex justify-center items-center">
                  <Spinner size="lg" color="#87754f" />
                </div>
              )}
              <Image
                src={`${baseUrl}/${image}`}
                alt={`Image ${index + 1}`}
                className={cn(
                  "h-full w-full object-cover transition-all duration-500 ease-in-out",
                  {
                    "blur-lg": !loadedIndexes.has(index), // Apply blur effect until loaded
                    "blur-0": loadedIndexes.has(index), // Remove blur when loaded
                  }
                )}
                onLoad={() => handleImageLoad(index)}
              />
            </div>
          ))}
        </Image.PreviewGroup>
      </div>

      {/* Pagination Dots - Below images on mobile, side on desktop */}
      <div className="flex lg:hidden flex-row justify-center mt-4">
        {images?.map((_, index) => (
          <a
            key={index}
            onClick={() => handleClick(index)}
            className={cn(
              `cursor-pointer mb-0 h-[10px] w-[10px] rounded-full border-[2px] border-[#e3e3e3] bg-transparent mx-1`,
              { "bg-[#454545] border-[#454545]": index === currentImageIndex }
            )}
          ></a>
        ))}
      </div>

      {/* Desktop Pagination Dots */}
      <div className="hidden lg:flex flex-col sticky top-1/2 h-fit items-start mr-8">
        {images?.map((_, index) => (
          <a
            key={index}
            onClick={() => handleClick(index)}
            className={cn(
              `cursor-pointer mb-3 h-[10px] w-[10px] rounded-full border-[2px] border-[#e3e3e3] bg-transparent`,
              { "bg-[#454545] border-[#454545]": index === currentImageIndex }
            )}
          ></a>
        ))}
      </div>
    </div>
  );
};
