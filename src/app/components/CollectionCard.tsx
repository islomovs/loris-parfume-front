import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { AnimatedButton } from './AnimatedButton'
import Image from 'next/image'

interface ICollectionCard {
  title: string
  subtitle?: string
  image: string
  link: string
}

export const CollectionCard: React.FC<ICollectionCard> = ({
  title,
  subtitle,
  image,
  link = '/',
}) => {
  const router = useRouter()
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  return (
    <div className="relative w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] overflow-hidden group p-4 sm:p-6 md:p-8 lg:p-10">
      <div
        className={`absolute inset-0 transition-transform duration-[15000ms] ease-in-out group-hover:scale-125`}
      >
        <Image
          src={image}
          alt="collection image"
          className={`object-cover w-full h-full transition-all duration-500 ease-in-out ${
            isImageLoaded ? 'blur-0' : 'blur-lg'
          }`}
          onLoad={() => setIsImageLoaded(true)}
          fill
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-30"></div>
      <div className="relative flex flex-col items-start justify-end w-full h-full">
        {subtitle && (
          <h3 className="text-xs sm:text-sm md:text-base lg:text-lg text-white tracking-[.2em]">
            {subtitle}
          </h3>
        )}
        <h2 className="my-2 sm:my-3 md:my-4 text-lg sm:text-xl md:text-2xl lg:text-[22px] text-white tracking-[.2em]">
          {title}
        </h2>
        <AnimatedButton
          width="w-full sm:w-48 md:w-56"
          variant="lite"
          title="View the collection"
          onClick={() => router.push(link)}
        />
      </div>
    </div>
  )
}
