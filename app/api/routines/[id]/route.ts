import { NextResponse } from "next/server"
import dbConnect from "@/lib/db/connect"
import { Routine } from "@/lib/db/models/routine"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect()

    const routine = await Routine.findById(params.id).lean()

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 })
    }

    // Convert to plain object
    const serializedRoutine = {
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
    }

    return NextResponse.json({ routine: serializedRoutine })
  } catch (error) {
    console.error("Error fetching routine:", error)
    return NextResponse.json({ error: "Failed to fetch routine" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await request.json()

    await dbConnect()

    // Update routine with new data
    const routine = await Routine.findByIdAndUpdate(
      params.id,
      { ...data, updatedAt: Date.now() },
      { new: true, runValidators: true },
    ).lean()

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 })
    }

    // Convert to plain object
    const serializedRoutine = {
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
    }

    return NextResponse.json({ routine: serializedRoutine })
  } catch (error) {
    console.error("Error updating routine:", error)
    return NextResponse.json({ error: "Failed to update routine" }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const { userId } = auth()

    // Check if user is authenticated
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Delete routine
    const routine = await Routine.findByIdAndDelete(params.id)

    if (!routine) {
      return NextResponse.json({ error: "Routine not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Routine deleted successfully" })
  } catch (error) {
    console.error("Error deleting routine:", error)
    return NextResponse.json({ error: "Failed to delete routine" }, { status: 500 })
  }
}
