import React, { useEffect, useState } from "react"
import { format, parse } from "date-fns"
import { Link, useParams } from "react-router-dom"

import { formatDate, formatWeek, getFullDate } from "./lib/utils"

const notes: Record<string, () => Promise<unknown>> = import.meta.glob(
  "/public/notes/*/*/*/*"
)

const NavigationSidebar: React.FC = () => {
  const { semester, date } = useParams<{ semester: string; date: string }>()
  const [weeksMap, setWeeksMap] = useState<Map<string, Set<string>>>(new Map())

  useEffect(() => {
    const newWeeksMap = new Map<string, Set<string>>()
    Object.keys(notes).forEach((path) => {
      const match = path.match(
        new RegExp(`/notes/${semester}/([^/]+)/([^/]+)/`)
      )
      if (match) {
        const week = match[1]
        const dateStr = match[2]
        if (!newWeeksMap.has(week)) {
          newWeeksMap.set(week, new Set<string>())
        }
        newWeeksMap.get(week)?.add(dateStr)
      }
    })
    setWeeksMap(newWeeksMap)
  }, [semester])

  return (
    <>
      {Array.from(weeksMap.entries()).map(([week, dates]) => (
        <div key={week} className="mb-4">
          <h3 className="font-medium">{formatWeek(week)}</h3>
          <ul>
            {Array.from(dates).map((dateStr) => {
              const fullDateStr = getFullDate(semester!, dateStr)
              const parsedDate = parse(fullDateStr, "yyyy-M-d", new Date())
              const dayOfWeek = format(parsedDate, "EEEE")
              return (
                <li
                  key={dateStr}
                  className={`mb-2 ${dateStr === date ? "font-bold" : ""}`}
                >
                  <Link
                    to={`/${semester}/${dateStr}`}
                    className="block text-blue-600 hover:underline"
                  >
                    {formatDate(dateStr)} ({dayOfWeek})
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </>
  )
}

export default NavigationSidebar
