export interface FilterState {
  search: string
  department: string
  section: string
  batch: string
  showOngoingOnly: boolean
  sortBy: string
}

export interface RoutineEntry {
  id: string
  courseName: string
  courseCode: string
  faculty: string
  room: string
  day: string
  startTime: string
  endTime: string
  department: string
  subject: string
  semester: string
  batch: string
  section: string
  year: string
}

export interface ExamEntry {
  id: string
  courseName: string
  courseCode: string
  date: string
  startTime: string
  endTime: string
  room: string
  department: string
  type: "Mid-term" | "Final"
}
