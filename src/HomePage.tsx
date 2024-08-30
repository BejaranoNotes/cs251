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
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-50 p-6">
      <div className="w-full max-w-2xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Professor Bejarano's CS251 Lecture Notes
        </h1>
        <ul className="space-y-4">
          {semesterLinks.map((semester) => (
            <li key={semester}>
              <Link
                to={`/${semester}`}
                className="block rounded-lg bg-blue-500 px-6 py-3 text-lg font-semibold text-white transition-all duration-300 ease-in-out hover:bg-blue-600 hover:shadow-lg"
              >
                {getSemesterName(semester!)}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default HomePage
