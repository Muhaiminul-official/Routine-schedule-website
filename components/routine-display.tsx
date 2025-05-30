import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, User } from "lucide-react"
import type { RoutineEntry } from "@/lib/types"

interface RoutineDisplayProps {
  routineData: RoutineEntry[]
  currentTime: Date
}

export function RoutineDisplay({ routineData, currentTime }: RoutineDisplayProps) {
  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  // Define specific time slots
  const timeSlots = [
    { label: "9:00 - 10:20", start: "09:00", end: "10:20", isBreak: false },
    { label: "10:25 - 11:45", start: "10:25", end: "11:45", isBreak: false },
    { label: "11:50 - 1:10", start: "11:50", end: "13:10", isBreak: false },
    { label: "1:10 - 1:30", start: "13:10", end: "13:30", isBreak: true },
    { label: "1:30 - 2:50", start: "13:30", end: "14:50", isBreak: false },
    { label: "3:00 - 4:20", start: "15:00", end: "16:20", isBreak: false },
  ]

  // Group classes by day
  const groupedByDay = days.reduce(
    (acc, day) => {
      acc[day] = routineData.filter((entry) => entry.day.toLowerCase() === day.toLowerCase())
      return acc
    },
    {} as Record<string, RoutineEntry[]>,
  )

  const isCurrentClass = (entry: RoutineEntry) => {
    const now = currentTime
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" })
    const currentTimeStr = now.toTimeString().slice(0, 5)

    if (entry.day !== currentDay) return false

    const [startHour, startMin] = entry.startTime.split(":").map(Number)
    const [endHour, endMin] = entry.endTime.split(":").map(Number)
    const [currentHour, currentMin] = currentTimeStr.split(":").map(Number)

    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    const currentMinutes = currentHour * 60 + currentMin

    return currentMinutes >= startMinutes && currentMinutes <= endMinutes
  }

  // Find which time slot a class belongs to
  const getTimeSlotIndex = (classStartTime: string, classEndTime: string) => {
    return timeSlots.findIndex((slot) => {
      const slotStart = slot.start
      const slotEnd = slot.end

      // Check if class time overlaps with slot time
      return classStartTime >= slotStart && classEndTime <= slotEnd
    })
  }

  // Get classes for a specific day and time slot
  const getClassForSlot = (day: string, slotIndex: number) => {
    const dayClasses = groupedByDay[day] || []
    return dayClasses.find((classItem) => {
      const classSlotIndex = getTimeSlotIndex(classItem.startTime, classItem.endTime)
      return classSlotIndex === slotIndex
    })
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-red-600" />
          Weekly Routine
        </CardTitle>
      </CardHeader>
      <CardContent>
        {routineData.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No routine found for the selected criteria.</p>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[1000px]">
              {/* Header with time column and day columns */}
              <div className="grid grid-cols-8 gap-2 mb-2">
                <div className="bg-gray-50 p-3 text-center font-semibold text-gray-700 rounded-md">Time</div>
                {days.map((day) => (
                  <div key={day} className="bg-red-50 p-3 text-center font-semibold text-red-700 rounded-md">
                    {day}
                  </div>
                ))}
              </div>

              {/* Time slots and classes grid */}
              <div className="space-y-2">
                {timeSlots.map((timeSlot, slotIndex) => (
                  <div key={slotIndex} className="grid grid-cols-8 gap-2">
                    {/* Time slot label */}
                    <div
                      className={`p-3 text-center text-sm font-medium rounded-md ${
                        timeSlot.isBreak
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-200"
                          : "bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {timeSlot.label}
                      {timeSlot.isBreak && <div className="text-xs text-yellow-600 mt-1">Lunch Break</div>}
                    </div>

                    {/* Classes for each day in this time slot */}
                    {days.map((day) => {
                      const classItem = getClassForSlot(day, slotIndex)

                      return (
                        <div key={`${day}-${slotIndex}`} className="min-h-[80px] border border-gray-200 rounded-md">
                          {classItem ? (
                            <div
                              className={`h-full p-2 rounded-md transition-all ${
                                isCurrentClass(classItem)
                                  ? "bg-red-50 border-red-300 shadow-md"
                                  : "bg-white hover:shadow-md hover:border-red-200"
                              }`}
                            >
                              <div className="h-full flex flex-col justify-between text-xs overflow-hidden">
                                <div className="space-y-1">
                                  <div className="font-semibold text-gray-900 truncate text-sm leading-tight">
                                    {classItem.courseName}
                                  </div>
                                  <div className="text-red-600 font-medium truncate">{classItem.courseCode}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <User className="h-2 w-2 flex-shrink-0" />
                                    <span className="truncate text-[10px]">{classItem.faculty}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <MapPin className="h-2 w-2 flex-shrink-0" />
                                    <span className="truncate text-[10px]">{classItem.room}</span>
                                  </div>
                                  {isCurrentClass(classItem) && (
                                    <Badge className="bg-red-600 text-[8px] py-0 px-1 h-3 w-fit">Current</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          ) : timeSlot.isBreak ? (
                            <div className="h-full bg-yellow-50 rounded-md flex items-center justify-center">
                              <span className="text-yellow-600 text-xs">Break</span>
                            </div>
                          ) : (
                            <div className="h-full bg-gray-50 rounded-md flex items-center justify-center">
                              <span className="text-gray-400 text-xs">Free</span>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
