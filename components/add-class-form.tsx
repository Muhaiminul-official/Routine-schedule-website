"use client"

import type React from "react"
import { useState } from "react"
import { useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Save, Shield, AlertCircle } from "lucide-react"
import { addClass } from "@/app/actions/routine-actions"
import { toast } from "@/components/ui/use-toast"

interface AddClassFormProps {
  onAddClass?: (classData: any) => void
}

export function AddClassForm({ onAddClass }: AddClassFormProps) {
  const { user, isLoaded, isSignedIn } = useUser()
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    courseName: "",
    courseCode: "",
    faculty: "",
    room: "",
    day: "",
    startTime: "",
    endTime: "",
    department: "",
    subject: "",
    semester: "",
    batch: "",
    section: "",
    year: "",
  })

  // Wait for user data to load
  if (!isLoaded) {
    return null
  }

  // Check if user is signed in
  if (!isSignedIn) {
    return (
      <Card className="bg-white border-red-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-gray-600">
            <AlertCircle className="h-5 w-5" />
            <p>Please sign in to access admin features.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Check if user is admin
  const isAdmin = user?.publicMetadata?.role === "admin"

  // Show message for non-admin users
  if (!isAdmin) {
    return (
      <Card className="bg-white border-red-100">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-gray-600">
            <Shield className="h-5 w-5" />
            <p>Admin access required to add class schedules.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const timeSlots = [
    { label: "9:00 - 10:20", start: "09:00", end: "10:20" },
    { label: "10:25 - 11:45", start: "10:25", end: "11:45" },
    { label: "11:50 - 1:10", start: "11:50", end: "13:10" },
    { label: "1:30 - 2:50", start: "13:30", end: "14:50" },
    { label: "3:00 - 4:20", start: "15:00", end: "16:20" },
  ]

  const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

  // Generate batch options from 58th to 66th
  const batchOptions = []
  for (let i = 58; i <= 66; i++) {
    batchOptions.push(`${i}th Batch`)
  }

  const handleTimeSlotChange = (timeSlot: string) => {
    const slot = timeSlots.find((s) => s.label === timeSlot)
    if (slot) {
      setFormData((prev) => ({
        ...prev,
        startTime: slot.start,
        endTime: slot.end,
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate required fields
      const requiredFields = ["courseName", "courseCode", "faculty", "room", "day", "department", "batch", "section"]
      const missingFields = requiredFields.filter((field) => !formData[field as keyof typeof formData])

      if (missingFields.length > 0) {
        toast({
          title: "Validation Error",
          description: `Please fill in all required fields: ${missingFields.join(", ")}`,
          variant: "destructive",
        })
        return
      }

      if (!formData.startTime || !formData.endTime) {
        toast({
          title: "Validation Error",
          description: "Please select a time slot",
          variant: "destructive",
        })
        return
      }

      // Create form data for server action
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      // Call server action to add class
      const result = await addClass(formDataObj)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
      } else {
        toast({
          title: "Success",
          description: "Class added successfully",
        })

        // Reset form
        setFormData({
          courseName: "",
          courseCode: "",
          faculty: "",
          room: "",
          day: "",
          startTime: "",
          endTime: "",
          department: "",
          subject: "",
          semester: "",
          batch: "",
          section: "",
          year: "",
        })

        // Close form
        setIsOpen(false)

        // Call callback if provided
        if (onAddClass && result.routine) {
          onAddClass(result.routine)
        }
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to add class. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card className="bg-white border-red-100">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-red-600" />
            Admin: Add Class Schedule
            <span className="text-sm font-normal text-gray-500">({user.emailAddresses[0]?.emailAddress})</span>
          </CardTitle>
          <Button
            onClick={() => setIsOpen(!isOpen)}
            variant={isOpen ? "outline" : "default"}
            className={isOpen ? "" : "bg-red-600 hover:bg-red-700"}
          >
            <Plus className="h-4 w-4 mr-2" />
            {isOpen ? "Cancel" : "Add New Class"}
          </Button>
        </div>
      </CardHeader>

      {isOpen && (
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="courseName">Course Name *</Label>
                <Input
                  id="courseName"
                  value={formData.courseName}
                  onChange={(e) => updateField("courseName", e.target.value)}
                  placeholder="e.g., Data Structures"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="courseCode">Course Code *</Label>
                <Input
                  id="courseCode"
                  value={formData.courseCode}
                  onChange={(e) => updateField("courseCode", e.target.value)}
                  placeholder="e.g., CSE-201"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="faculty">Faculty *</Label>
                <Input
                  id="faculty"
                  value={formData.faculty}
                  onChange={(e) => updateField("faculty", e.target.value)}
                  placeholder="e.g., Dr. John Smith"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="room">Room *</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => updateField("room", e.target.value)}
                  placeholder="e.g., Room 301"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="day">Day *</Label>
                <Select value={formData.day} onValueChange={(value) => updateField("day", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {days.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeSlot">Time Slot *</Label>
                <Select onValueChange={handleTimeSlotChange} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time slot" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.label} value={slot.label}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department *</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => updateField("department", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSE">Computer Science & Engineering</SelectItem>
                    <SelectItem value="EEE">Electrical & Electronics Engineering</SelectItem>
                    <SelectItem value="BBA">Business Administration</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                    <SelectItem value="Chemistry">Chemistry</SelectItem>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Economics">Economics</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="batch">Batch *</Label>
                <Select value={formData.batch} onValueChange={(value) => updateField("batch", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {batchOptions.map((batch) => (
                      <SelectItem key={batch} value={batch}>
                        {batch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="section">Section *</Label>
                <Select value={formData.section} onValueChange={(value) => updateField("section", value)} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Section A">Section A</SelectItem>
                    <SelectItem value="Section B">Section B</SelectItem>
                    <SelectItem value="Section C">Section C</SelectItem>
                    <SelectItem value="Section D">Section D</SelectItem>
                    <SelectItem value="Section E">Section E</SelectItem>
                    <SelectItem value="Section F">Section F</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => updateField("subject", e.target.value)}
                  placeholder="e.g., Programming"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Input
                  id="semester"
                  value={formData.semester}
                  onChange={(e) => updateField("semester", e.target.value)}
                  placeholder="e.g., Spring 2024"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  value={formData.year}
                  onChange={(e) => updateField("year", e.target.value)}
                  placeholder="e.g., 2nd Year"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1 bg-red-600 hover:bg-red-700" disabled={isSubmitting}>
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? "Saving..." : "Save Class"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
