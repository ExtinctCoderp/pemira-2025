import mongoose from 'mongoose'

export interface IStudent extends mongoose.Document {
  nis: string
  name: string
  class: string
  hasVoted: boolean
  votedAt?: Date
  votedFor?: string
}

const StudentSchema = new mongoose.Schema({
  nis: {
    type: String,
    required: [true, 'NIS is required'],
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Class is required'],
    trim: true
  },
  hasVoted: {
    type: Boolean,
    default: false
  },
  votedAt: {
    type: Date,
    default: null
  },
  votedFor: {
    type: String,
    default: null
  }
})

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema)
