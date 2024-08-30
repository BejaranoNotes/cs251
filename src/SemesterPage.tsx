import { format, parse } from "date-fns"
import { Link, useParams } from "react-router-dom"

import {
  formatDate,
  formatWeek,
  getFullDate,
  getSemesterName,
} from "./lib/utils"

const notes: Record<string, () => Promise<unknown>> = import.meta.glob(
  "/public/notes/*/*/*/*"
)

const SemesterPage: React.FC = () => {
  const { semester } = useParams<{ semester: string }>()
  const weeksMap = new Map<string, Set<string>>()

  Object.keys(notes).forEach((path) => {
    const match = path.match(new RegExp(`/notes/${semester}/([^/]+)/([^/]+)/`))
    if (match) {
      const week = match[1]
      const date = match[2]
      if (!weeksMap.has(week)) {
        weeksMap.set(week, new Set<string>())
      }
      weeksMap.get(week)?.add(date)
    }
  })

  return (
    <div className="flex min-h-screen flex-col items-center bg-gray-50 p-6">
      <div className="w-full max-w-4xl rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          Professor Bejarano's CS251 Lecture Notes ({getSemesterName(semester!)}
          )
        </h1>
        {Array.from(weeksMap.entries()).map(([week, dates]) => (
          <div key={week} className="mb-6">
            <h2 className="mt-4 text-xl font-semibold text-gray-700">
              {formatWeek(week)}
            </h2>
            <ul className="mt-2 list-inside list-disc space-y-2">
              {Array.from(dates).map((date) => {
                const fullDateStr = getFullDate(semester!, date)
                const parsedDate = parse(fullDateStr, "yyyy-M-d", new Date())
                const dayOfWeek = format(parsedDate, "EEEE")
                return (
                  <li key={date}>
                    <Link
                      to={`/${semester}/${date}`}
                      className="font-medium text-blue-600 hover:text-blue-800"
                    >
                      {formatDate(date)} ({dayOfWeek})
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SemesterPage
