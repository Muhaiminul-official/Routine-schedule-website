import { NextResponse } from "next/server"
import dbConnect from "@/lib/db/connect"
import { Exam } from "@/lib/db/models/routine"
import { auth } from "@clerk/nextjs/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const department = searchParams.get("department")
    const type = searchParams.get("type")

    await dbConnect()

    // Build query based on provided filters
    const query: any = {}
    if (department && department !== "All Departments") query.department = department
    if (type) query.type = type

    const exams = await Exam.find(query).sort({ date: 1, startTime: 1 })

    return NextResponse.json({ exams })
  } catch (error) {
    console.error("Error fetching exams:", error)
    return NextResponse.json({ error: "Failed to fetch exams" }, { status: 500 })
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

    // Create new exam entry
    const exam = new Exam(data)
    await exam.save()

    return NextResponse.json({ exam }, { status: 201 })
  } catch (error) {
    console.error("Error creating exam:", error)
    return NextResponse.json({ error: "Failed to create exam" }, { status: 500 })
  }
}
