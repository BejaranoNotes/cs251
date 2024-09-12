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
    <div>
      <h1 className="text-2xl font-medium">
        Professor Bejarano's CS251 Lecture Notes ({getSemesterName(semester!)})
      </h1>
      {Array.from(weeksMap.entries()).map(([week, dates]) => (
        <div key={week}>
          <h2 className="mt-2 text-lg font-semibold">{formatWeek(week)}</h2>
          <ul>
            {Array.from(dates)
              .sort((a, b) => {
                const dateA = new Date(getFullDate(semester!, a))
                const dateB = new Date(getFullDate(semester!, b))
                return dateA.getTime() - dateB.getTime()
              })
              .map((date) => {
                const fullDateStr = getFullDate(semester!, date)
                const parsedDate = parse(fullDateStr, "yyyy-M-d", new Date())
                const dayOfWeek = format(parsedDate, "EEEE")
                return (
                  <li key={date}>
                    <Link
                      to={`/${semester}/${date}`}
                      className="text-blue-500 underline"
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
  )
}

export default SemesterPage
