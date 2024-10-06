import React, { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"

import { formatWeek } from "./lib/utils"

interface Metadata {
  topic: string
}

const metadataFiles = import.meta.glob<Metadata>(
  "/public/notes/*/*/*/metadata.json"
)

const NavigationSidebar: React.FC = () => {
  const { semester, date } = useParams<{ semester: string; date: string }>()
  const [weeksMap, setWeeksMap] = useState<Map<string, Map<string, string>>>(
    new Map()
  )

  useEffect(() => {
    const loadMetadata = async () => {
      const newWeeksMap = new Map<string, Map<string, string>>()

      for (const [path, importFn] of Object.entries(metadataFiles)) {
        const match = path.match(
          new RegExp(`/notes/${semester}/([^/]+)/([^/]+)/`)
        )
        if (match) {
          const [, week, dateStr] = match
          if (!newWeeksMap.has(week)) {
            newWeeksMap.set(week, new Map<string, string>())
          }

          try {
            const metadata = await importFn()
            newWeeksMap.get(week)?.set(dateStr, metadata.topic)
          } catch (error) {
            console.error(`Error loading metadata for ${path}:`, error)
            newWeeksMap.get(week)?.set(dateStr, "Unknown Topic")
          }
        }
      }

      setWeeksMap(newWeeksMap)
    }

    loadMetadata()
  }, [semester])

  return (
    <>
      {Array.from(weeksMap.entries()).map(([week, dates]) => (
        <div key={week} className="mb-4">
          <h3 className="font-medium">{formatWeek(week)}</h3>
          <ul>
            {Array.from(dates.entries()).map(([dateStr, topic]) => (
              <li
                key={dateStr}
                className={`mb-2 ${dateStr === date ? "font-bold" : ""}`}
              >
                <Link
                  to={`/${semester}/${dateStr}`}
                  className="block text-blue-600 hover:underline"
                >
                  {topic}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

export default NavigationSidebar
