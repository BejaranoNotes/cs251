import React, { useEffect, useState } from "react"

interface ThumbnailSidebarProps {
  images: string[]
  onThumbnailClick: (index: number) => void
  currentPage: number
}

const ThumbnailSidebar: React.FC<ThumbnailSidebarProps> = ({
  images,
  onThumbnailClick,
  currentPage,
}) => {
  const [highlightedPage, setHighlightedPage] = useState(currentPage)

  useEffect(() => {
    const timer = setTimeout(() => {
      setHighlightedPage(currentPage)
    }, 75)

    return () => clearTimeout(timer)
  }, [currentPage])

  return (
    <>
      {images.length > 0 ? (
        images.map((src, index) => (
          <div
            key={index}
            className="mb-2 block cursor-pointer"
            onClick={() => onThumbnailClick(index)}
          >
            <div className="relative">
              <img
                src={src}
                alt={`Thumbnail ${index + 1}`}
                className="w-full rounded-lg border-2 border-gray-300"
              />
              <div
                className={`absolute inset-0 rounded-lg border-2 transition-opacity duration-300 ${
                  highlightedPage === index + 1
                    ? "border-blue-500 opacity-100"
                    : "border-blue-500 opacity-0"
                }`}
              />
            </div>
            <p className="mt-2 text-center text-black">page {index + 1}</p>
          </div>
        ))
      ) : (
        <p>No thumbnails available for this date.</p>
      )}
    </>
  )
}

export default ThumbnailSidebar
