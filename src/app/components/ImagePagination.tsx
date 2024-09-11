import { useEffect, useRef, useState } from "react";
import { Image } from "antd";
import { cn } from "../../helpers/mergeFunction";

interface IImagePaginationProps {
  images: string[];
}

export const ImagePagination: React.FC<IImagePaginationProps> = ({
  images,
}) => {
  const containersRef = useRef<HTMLDivElement[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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
              className="flex-shrink-0 w-full lg:w-[730px] h-[360px] lg:h-[730px] flex justify-center items-center"
            >
              <Image
                src={`${baseUrl}/${image}`}
                alt={image}
                className="h-full w-full object-cover"
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
