import React, { useState } from "react"
import { useParams } from "react-router-dom"
import Lightbox from "yet-another-react-lightbox"

import "yet-another-react-lightbox/styles.css"

import { formatDate, getSemesterName } from "./lib/utils"

const notes: Record<string, () => Promise<unknown>> = import.meta.glob(
  "/public/notes/*/*/*/*"
)

const LectureNotes: React.FC = () => {
  const { semester, date } = useParams<{
    semester: string
    date: string
  }>()
  const images: string[] = []

  Object.keys(notes).forEach((path) => {
    const match = path.match(new RegExp(`/notes/${semester}/([^/]+)/${date}/`))
    if (match) {
      images.push(`${import.meta.env.BASE_URL}${path.replace("/public", "")}`)
    }
  })

  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [photoIndex, setPhotoIndex] = useState<number>(0)

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Lecture Notes for {formatDate(date!)} - {getSemesterName(semester!)}
        </h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {images.length > 0 ? (
            images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`Note ${index + 1}`}
                className="h-auto w-full cursor-pointer rounded-lg shadow-sm transition-transform duration-200 hover:scale-105"
                onClick={() => {
                  setIsOpen(true)
                  setPhotoIndex(index)
                }}
              />
            ))
          ) : (
            <p className="text-center text-gray-600">
              No notes available for this date.
            </p>
          )}
        </div>
      </div>

      {isOpen && (
        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          slides={images.map((src) => ({ src }))}
          index={photoIndex}
          onIndexChange={(newIndex) => setPhotoIndex(newIndex)}
        />
      )}
    </div>
  )
}

export default LectureNotes
