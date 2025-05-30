import { NextResponse } from "next/server"
import dbConnect from "@/lib/db/connect"
import { Routine } from "@/lib/db/models/routine"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const batch = searchParams.get("batch")
    const section = searchParams.get("section")

    await dbConnect()

    // Build query based on provided filters
    const query: any = {}
    if (department && department !== "All Departments") query.department = department
    if (batch && batch !== "All Batches") query.batch = batch
    if (section && section !== "All Sections") query.section = section

    const routines = await Routine.find(query).sort({ day: 1, startTime: 1 }).lean()

    // Convert MongoDB objects to plain objects
    const serializedRoutines = routines.map((routine) => ({
      id: routine._id.toString(),
      courseName: routine.courseName,
      courseCode: routine.courseCode,
      faculty: routine.faculty,
      room: routine.room,
      day: routine.day,
      startTime: routine.startTime,
      endTime: routine.endTime,
      department: routine.department,
      subject: routine.subject,
      semester: routine.semester,
      batch: routine.batch,
      section: routine.section,
      year: routine.year,
      createdAt: routine.createdAt,
      updatedAt: routine.updatedAt,
    }))

    return NextResponse.json({ routines: serializedRoutines })
  } catch (error) {
    console.error("Error fetching routines:", error)
    return NextResponse.json({ error: "Failed to fetch routines" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth()

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    await dbConnect()

    // Create new routine entry
    const routine = new Routine(data)
    const savedRoutine = await routine.save()

    // Convert to plain object
    const serializedRoutine = {
      id: savedRoutine._id.toString(),
      courseName: savedRoutine.courseName,
      courseCode: savedRoutine.courseCode,
      faculty: savedRoutine.faculty,
      room: savedRoutine.room,
      day: savedRoutine.day,
      startTime: savedRoutine.startTime,
      endTime: savedRoutine.endTime,
      department: savedRoutine.department,
      subject: savedRoutine.subject,
      semester: savedRoutine.semester,
      batch: savedRoutine.batch,
      section: savedRoutine.section,
      year: savedRoutine.year,
      createdAt: savedRoutine.createdAt,
      updatedAt: savedRoutine.updatedAt,
    }

    return NextResponse.json({ routine: serializedRoutine }, { status: 201 })
  } catch (error) {
    console.error("Error creating routine:", error)
    return NextResponse.json({ error: "Failed to create routine" }, { status: 500 })
  }
}
