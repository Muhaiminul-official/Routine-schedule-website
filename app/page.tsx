"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Header } from "@/components/header"
import { FilterSection } from "@/components/filter-section"
import { OngoingClasses } from "@/components/ongoing-classes"
import { RoutineDisplay } from "@/components/routine-display"
import { ExamRoutines } from "@/components/exam-routines"
import { AddClassForm } from "@/components/add-class-form"
import { Footer } from "@/components/footer"
import { mockRoutineData, mockExamData } from "@/lib/mock-data"
import { getRoutines, getExams, seedInitialData } from "@/app/actions/routine-actions"
import type { FilterState, RoutineEntry, ExamEntry } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function RoutineSchedulePage() {
  const { user, isLoaded } = useUser()
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    department: "All Departments",
    section: "All Sections",
    batch: "All Batches",
    showOngoingOnly: false,
    sortBy: "Time Ascending",
  })

  const [routineData, setRoutineData] = useState<RoutineEntry[]>([])
  const [examData, setExamData] = useState<ExamEntry[]>([])
  const [filteredRoutine, setFilteredRoutine] = useState<RoutineEntry[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [loading, setLoading] = useState(true)

  // Seed initial data and fetch routines on first load
  useEffect(() => {
    const initData = async () => {
      try {
        // Seed initial data if needed
        await seedInitialData(mockRoutineData, mockExamData)

        // Fetch initial data
        const { routines, error: routinesError } = await getRoutines()
        const { exams, error: examsError } = await getExams()

        if (routinesError) {
          console.error("Error fetching routines:", routinesError)
        } else {
          setRoutineData(routines || [])
          setFilteredRoutine(routines || [])
        }

        if (examsError) {
          console.error("Error fetching exams:", examsError)
        } else {
          setExamData(exams || [])
        }
      } catch (error) {
        console.error("Error initializing data:", error)
      } finally {
        setLoading(false)
      }
    }

    initData()
  }, [])

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, [])

  const applyFilters = async () => {
    setLoading(true)
    try {
      // Fetch filtered data from database
      const { routines, error } = await getRoutines({
        department: filters.department,
        batch: filters.batch,
        section: filters.section,
      })

      if (error) {
        console.error("Error fetching filtered routines:", error)
        return
      }

      let filtered = routines || []

      // Apply search filter client-side
      if (filters.search) {
        filtered = filtered.filter(
          (entry) =>
            entry.courseName.toLowerCase().includes(filters.search.toLowerCase()) ||
            entry.courseCode.toLowerCase().includes(filters.search.toLowerCase()) ||
            entry.faculty.toLowerCase().includes(filters.search.toLowerCase()),
        )
      }

      // Apply ongoing classes filter client-side
      if (filters.showOngoingOnly) {
        const now = new Date()
        const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
        const currentTimeStr = now.toTimeString().slice(0, 5) // HH:MM format

        filtered = filtered.filter((entry) => {
          if (entry.day.toLowerCase() !== currentDay.toLowerCase()) return false

          const [startHour, startMin] = entry.startTime.split(":").map(Number)
          const [endHour, endMin] = entry.endTime.split(":").map(Number)
          const [currentHour, currentMin] = currentTimeStr.split(":").map(Number)

          const startMinutes = startHour * 60 + startMin
          const endMinutes = endHour * 60 + endMin
          const currentMinutes = currentHour * 60 + currentMin

          return currentMinutes >= startMinutes && currentMinutes <= endMinutes
        })
      }

      setFilteredRoutine(filtered)
    } catch (error) {
      console.error("Error applying filters:", error)
    } finally {
      setLoading(false)
    }
  }

  const resetFilters = () => {
    setFilters({
      search: "",
      department: "All Departments",
      section: "All Sections",
      batch: "All Batches",
      showOngoingOnly: false,
      sortBy: "Time Ascending",
    })
    setFilteredRoutine(routineData)
  }

  const handleAddClass = async (newClass: RoutineEntry) => {
    // Refresh data after adding a new class
    const { routines } = await getRoutines()
    if (routines) {
      setRoutineData(routines)
      setFilteredRoutine(routines)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 text-red-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading routine data...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-6">
        <FilterSection
          filters={filters}
          setFilters={setFilters}
          onApplyFilters={applyFilters}
          onResetFilters={resetFilters}
        />

        <OngoingClasses routineData={routineData} currentTime={currentTime} />

        <RoutineDisplay routineData={filteredRoutine} currentTime={currentTime} />

        <ExamRoutines examData={examData} />

        {/* Show Add Class Form - it will handle authentication internally */}
        <AddClassForm onAddClass={handleAddClass} />
      </main>

      <Footer />
    </div>
  )
}
