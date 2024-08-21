import { Route, BrowserRouter as Router, Routes } from "react-router-dom"

import HomePage from "./HomePage"
import LectureNotes from "./LectureNotes"
import SemesterPage from "./SemesterPage"

const App: React.FC = () => {
  return (
    <Router basename={import.meta.env.BASE_URL || "/cs251"}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:semester" element={<SemesterPage />} />
        <Route path="/:semester/:date" element={<LectureNotes />} />
      </Routes>
    </Router>
  )
}

export default App
