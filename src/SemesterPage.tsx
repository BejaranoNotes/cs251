import React, { useEffect, useState } from "react"
import { format, parse } from "date-fns"
import { Link, useParams } from "react-router-dom"

import {
  formatDate,
  formatWeek,
  getFullDate,
  getSemesterName,
} from "./lib/utils"

interface Metadata {
  topic: string
}

const SemesterPage: React.FC = () => {
  const { semester } = useParams<{ semester: string }>()
  const [weeksMap, setWeeksMap] = useState<Map<string, Map<string, string>>>(
    new Map()
  )

  useEffect(() => {
    const loadMetadata = async () => {
      const newWeeksMap = new Map<string, Map<string, string>>()

      const metadataFiles = import.meta.glob<Metadata>(
        "/public/notes/*/*/*/metadata.json"
      )

      for (const [path, importFn] of Object.entries(metadataFiles)) {
        const match = path.match(
          new RegExp(`/notes/${semester}/([^/]+)/([^/]+)/`)
        )
        if (match) {
          const [, week, date] = match
          if (!newWeeksMap.has(week)) {
            newWeeksMap.set(week, new Map<string, string>())
          }

          try {
            const metadata = await importFn()
            const topic = metadata.topic
            newWeeksMap.get(week)?.set(date, topic)
          } catch (error) {
            console.error(`Error loading metadata for ${path}:`, error)
            newWeeksMap.get(week)?.set(date, "")
          }
        }
      }

      setWeeksMap(newWeeksMap)
    }

    loadMetadata()
  }, [semester])

  return (
    <div className="p-3">
      <h1 className="text-2xl font-medium">
        Professor Bejarano's CS251 Lecture Notes ({getSemesterName(semester!)})
      </h1>
      {Array.from(weeksMap.entries()).map(([week, dates]) => (
        <div key={week}>
          <h2 className="mt-2 text-lg font-semibold">{formatWeek(week)}</h2>
          <ul>
            {Array.from(dates.entries()).map(([date, topic]) => {
              const fullDateStr = getFullDate(semester!, date)
              const parsedDate = parse(fullDateStr, "yyyy-M-d", new Date())
              const dayOfWeek = format(parsedDate, "EEEE")
              return (
                <li key={date}>
                  <Link
                    to={`/${semester}/${date}`}
                    className="text-blue-500 underline"
                  >
                    {formatDate(date)} ({dayOfWeek}) - {topic}
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
