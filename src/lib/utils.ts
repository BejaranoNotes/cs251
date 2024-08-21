export const getFullDate = (semester: string, date: string) => {
  const year = semester.slice(1)
  return `${year}-${date}`
}

export const formatWeek = (week: string) => {
  const weekNumber = parseInt(week.replace("week", ""))
  return `Week ${weekNumber}`
}

export const formatDate = (date: string) => {
  const [month, day] = date.split("-")
  return `${month}/${day}`
}

export const getSemesterName = (semesterCode: string) => {
  const year = semesterCode.slice(1)
  if (semesterCode.startsWith("F")) {
    return `Fall ${year}`
  } else if (semesterCode.startsWith("S")) {
    return `Spring ${year}`
  } else {
    return semesterCode
  }
}
