import { Link } from "react-router-dom"

import { getSemesterName } from "./lib/utils"

const semesters: Record<string, () => Promise<unknown>> = import.meta.glob(
  "/public/notes/*/*/*/*"
)

const HomePage: React.FC = () => {
  const semesterSet = new Set<string>()

  Object.keys(semesters).forEach((path) => {
    const match = path.match(/\/notes\/([^/]+)\//)
    if (match) {
      semesterSet.add(match[1])
    }
  })

  const semesterLinks = Array.from(semesterSet)

  return (
    <div className="p-3">
      <h1 className="text-2xl font-medium">
        Professor Bejarano's CS251 Lecture Notes
      </h1>
      <ul>
        {semesterLinks.map((semester) => (
          <li key={semester}>
            <Link to={`/${semester}`} className="text-blue-500 underline">
              {getSemesterName(semester!)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default HomePage
