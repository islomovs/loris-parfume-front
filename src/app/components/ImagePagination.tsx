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
      // eslint-disable-next-line react-hooks/exhaustive-deps
      containersRef.current.forEach((container) => {
        if (container) observer.unobserve(container);
      });
    };
  }, [currentImageIndex]);

  const handleClick = (index: number) => {
    containersRef.current[index].scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <div className="flex flex-col sticky top-1/2 h-fit items-center mr-8">
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
      <div className="flex flex-col">
        <Image.PreviewGroup>
          {images?.map((image, index) => (
            <div
              key={index}
              id={`${index}`}
              ref={(el) => {
                if (el) containersRef.current[index] = el;
              }}
              className="product-image flex justify-center items-center h-[730px] w-[730px] mb-5"
            >
              <Image
                src={`${baseUrl}/${image}`}
                alt={image}
                className="h-[730px] w-full object-cover"
              />
            </div>
          ))}
        </Image.PreviewGroup>
      </div>
    </>
  );
};
