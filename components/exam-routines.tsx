"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, ChevronRight, FileText, Calendar, Clock, MapPin } from "lucide-react"
import type { ExamEntry } from "@/lib/types"

interface ExamRoutinesProps {
  examData: ExamEntry[]
}

export function ExamRoutines({ examData }: ExamRoutinesProps) {
  const [showMidTerm, setShowMidTerm] = useState(false)
  const [showFinal, setShowFinal] = useState(false)

  const midTermExams = examData.filter((exam) => exam.type === "Mid-term")
  const finalExams = examData.filter((exam) => exam.type === "Final")

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const ExamTable = ({ exams }: { exams: ExamEntry[] }) => (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            <th className="text-left p-3 font-semibold">Course</th>
            <th className="text-left p-3 font-semibold">Code</th>
            <th className="text-left p-3 font-semibold">Date</th>
            <th className="text-left p-3 font-semibold">Time</th>
            <th className="text-left p-3 font-semibold">Room</th>
            <th className="text-left p-3 font-semibold">Department</th>
          </tr>
        </thead>
        <tbody>
          {exams.map((exam, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="p-3 font-medium">{exam.courseName}</td>
              <td className="p-3 text-blue-600 font-medium">{exam.courseCode}</td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-gray-400" />
                  <span className="text-sm">{formatDate(exam.date)}</span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 text-gray-400" />
                  <span className="text-sm">
                    {exam.startTime} - {exam.endTime}
                  </span>
                </div>
              </td>
              <td className="p-3">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-gray-400" />
                  <span className="text-sm">{exam.room}</span>
                </div>
              </td>
              <td className="p-3">
                <Badge variant="outline" className="text-xs">
                  {exam.department}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-red-600" />
          Exam Routines
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Mid-term Exams */}
        <div className="border rounded-lg">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => setShowMidTerm(!showMidTerm)}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="font-semibold">Mid-term Exam Routine</span>
              <Badge variant="secondary">{midTermExams.length} exams</Badge>
            </div>
            {showMidTerm ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {showMidTerm && (
            <div className="border-t p-4">
              {midTermExams.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No mid-term exams scheduled.</p>
              ) : (
                <ExamTable exams={midTermExams} />
              )}
            </div>
          )}
        </div>

        {/* Final Exams */}
        <div className="border rounded-lg">
          <Button
            variant="ghost"
            className="w-full justify-between p-4 h-auto"
            onClick={() => setShowFinal(!showFinal)}
          >
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="font-semibold">Final Exam Routine</span>
              <Badge variant="secondary">{finalExams.length} exams</Badge>
            </div>
            {showFinal ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>

          {showFinal && (
            <div className="border-t p-4">
              {finalExams.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No final exams scheduled.</p>
              ) : (
                <ExamTable exams={finalExams} />
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
