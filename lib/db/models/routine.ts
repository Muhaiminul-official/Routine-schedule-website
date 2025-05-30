import mongoose, { Schema } from "mongoose"

// Define the schema for routine entries
const routineSchema = new Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true },
  faculty: { type: String, required: true },
  room: { type: String, required: true },
  day: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  department: { type: String, required: true },
  subject: { type: String, required: false },
  semester: { type: String, required: false },
  batch: { type: String, required: true },
  section: { type: String, required: true },
  year: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Define the schema for exam entries
const examSchema = new Schema({
  courseName: { type: String, required: true },
  courseCode: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  room: { type: String, required: true },
  department: { type: String, required: true },
  type: { type: String, required: true, enum: ["Mid-term", "Final"] },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Create models or get existing ones
export const Routine = mongoose.models.Routine || mongoose.model("Routine", routineSchema)
export const Exam = mongoose.models.Exam || mongoose.model("Exam", examSchema)
