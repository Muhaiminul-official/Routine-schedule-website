"use server"

import dbConnect from "@/lib/db/connect"
import { Routine, Exam } from "@/lib/db/models/routine"
import { currentUser } from "@clerk/nextjs/server"
import { revalidatePath } from "next/cache"

// Helper function to serialize MongoDB objects
function serializeObject(obj: any): any {
  if (obj === null || obj === undefined) return obj
  if (typeof obj !== "object") return obj
  if (obj instanceof Date) return obj.toISOString()
  if (Array.isArray(obj)) return obj.map(serializeObject)

  const serialized: any = {}
  for (const key in obj) {
    if (obj.hasOwnProperty(key) && key !== "__v") {
      if (key === "_id") {
        serialized.id = obj[key].toString()
      } else {
        serialized[key] = serializeObject(obj[key])
      }
    }
  }
  return serialized
}

// Seed initial data from mock data
export async function seedInitialData(routineData: any[], examData: any[]) {
  try {
    await dbConnect()

    // Check if data already exists
    const routineCount = await Routine.countDocuments()
    const examCount = await Exam.countDocuments()

    if (routineCount === 0) {
      await Routine.insertMany(routineData)
      console.log("Routine data seeded successfully")
    }

    if (examCount === 0) {
      await Exam.insertMany(examData)
      console.log("Exam data seeded successfully")
    }

    return { success: true }
  } catch (error) {
    console.error("Error seeding data:", error)
    return { success: false, error: "Failed to seed data" }
  }
}

// Get all routines with optional filters
export async function getRoutines(filters: any = {}) {
  try {
    await dbConnect()

    const query: any = {}
    if (filters.department && filters.department !== "All Departments") query.department = filters.department
    if (filters.batch && filters.batch !== "All Batches") query.batch = filters.batch
    if (filters.section && filters.section !== "All Sections") query.section = filters.section

    const routines = await Routine.find(query).sort({ day: 1, startTime: 1 }).lean()

    // Serialize the data to remove MongoDB-specific methods
    const serializedRoutines = routines.map(serializeObject)

    return { routines: serializedRoutines }
  } catch (error) {
    console.error("Error fetching routines:", error)
    return { error: "Failed to fetch routines" }
  }
}

// Get all exams with optional filters
export async function getExams(filters: any = {}) {
  try {
    await dbConnect()

    const query: any = {}
    if (filters.department && filters.department !== "All Departments") query.department = filters.department
    if (filters.type) query.type = filters.type

    const exams = await Exam.find(query).sort({ date: 1, startTime: 1 }).lean()

    // Serialize the data to remove MongoDB-specific methods
    const serializedExams = exams.map(serializeObject)

    return { exams: serializedExams }
  } catch (error) {
    console.error("Error fetching exams:", error)
    return { error: "Failed to fetch exams" }
  }
}

// Add a new class routine
export async function addClass(formData: FormData) {
  try {
    // Get the current user with full details
    const user = await currentUser()

    // Check if user is authenticated
    if (!user) {
      return { error: "Please sign in to add classes." }
    }

    // Check if user has admin role
    const isAdmin = user.publicMetadata?.role === "admin"
    if (!isAdmin) {
      return { error: "Admin access required to add classes." }
    }

    await dbConnect()

    const newClass = {
      courseName: formData.get("courseName"),
      courseCode: formData.get("courseCode"),
      faculty: formData.get("faculty"),
      room: formData.get("room"),
      day: formData.get("day"),
      startTime: formData.get("startTime"),
      endTime: formData.get("endTime"),
      department: formData.get("department"),
      subject: formData.get("subject"),
      semester: formData.get("semester"),
      batch: formData.get("batch"),
      section: formData.get("section"),
      year: formData.get("year"),
    }

    const routine = new Routine(newClass)
    const savedRoutine = await routine.save()

    // Serialize the saved routine
    const serializedRoutine = serializeObject(savedRoutine.toObject())

    revalidatePath("/")
    return { success: true, routine: serializedRoutine }
  } catch (error) {
    console.error("Error adding class:", error)
    return { error: "Failed to add class. Please try again." }
  }
}

// Delete a class routine
export async function deleteClass(id: string) {
  try {
    // Get the current user with full details
    const user = await currentUser()

    // Check if user is authenticated
    if (!user) {
      return { error: "Please sign in to delete classes." }
    }

    // Check if user has admin role
    const isAdmin = user.publicMetadata?.role === "admin"
    if (!isAdmin) {
      return { error: "Admin access required to delete classes." }
    }

    await dbConnect()

    await Routine.findByIdAndDelete(id)

    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Error deleting class:", error)
    return { error: "Failed to delete class" }
  }
}
