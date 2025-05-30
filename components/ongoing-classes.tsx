import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, MapPin, User } from "lucide-react"
import type { RoutineEntry } from "@/lib/types"

interface OngoingClassesProps {
  routineData: RoutineEntry[]
  currentTime: Date
}

export function OngoingClasses({ routineData, currentTime }: OngoingClassesProps) {
  const getOngoingClasses = () => {
    const now = currentTime
    const currentDay = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()
    const currentTimeStr = now.toTimeString().slice(0, 5) // HH:MM format

    return routineData.filter((entry) => {
      if (entry.day.toLowerCase() !== currentDay) return false

      const [startHour, startMin] = entry.startTime.split(":").map(Number)
      const [endHour, endMin] = entry.endTime.split(":").map(Number)
      const [currentHour, currentMin] = currentTimeStr.split(":").map(Number)

      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      const currentMinutes = currentHour * 60 + currentMin

      return currentMinutes >= startMinutes && currentMinutes <= endMinutes
    })
  }

  const ongoingClasses = getOngoingClasses()

  const getRemainingTime = (endTime: string) => {
    const [endHour, endMin] = endTime.split(":").map(Number)
    const endMinutes = endHour * 60 + endMin
    const currentMinutes = currentTime.getHours() * 60 + currentTime.getMinutes()
    const remaining = endMinutes - currentMinutes

    if (remaining <= 0) return "Ending soon"

    const hours = Math.floor(remaining / 60)
    const minutes = remaining % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    return `${minutes}m remaining`
  }

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-red-600" />
          Ongoing Classes
          <Badge variant="secondary" className="ml-auto">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {ongoingClasses.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No classes currently running.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {ongoingClasses.map((classItem, index) => (
              <div key={index} className="border rounded-lg p-4 bg-red-50 border-red-200">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-red-900">{classItem.courseName}</h3>
                    <Badge variant="default" className="bg-red-600">
                      Live
                    </Badge>
                  </div>
                  <p className="text-sm text-red-700 font-medium">{classItem.courseCode}</p>
                  <div className="space-y-1 text-sm text-red-600">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>{classItem.faculty}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <span>{classItem.room}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {classItem.startTime} - {classItem.endTime}
                      </span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <Badge variant="outline" className="text-xs border-red-200 text-red-700">
                      {getRemainingTime(classItem.endTime)}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
