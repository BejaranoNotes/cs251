import { useParams } from "react-router-dom"

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

  return (
    <div>
      <h1>
        Lecture Notes for {formatDate(date!)} {getSemesterName(semester!)}
      </h1>
      <div>
        {images.length > 0 ? (
          images.map((src, index) => (
            <img key={index} src={src} alt={`Note ${index + 1}`} />
          ))
        ) : (
          <p>No notes available for this date.</p>
        )}
      </div>
    </div>
  )
}

export default LectureNotes
