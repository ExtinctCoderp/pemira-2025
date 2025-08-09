import mongoose from 'mongoose'

export interface ICandidate extends mongoose.Document {
  name: string
  class: string
  visionMission: string
  photo: string
  votes: number
  createdAt: Date
}

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Candidate name is required'],
    trim: true
  },
  class: {
    type: String,
    required: [true, 'Candidate class is required'],
    trim: true
  },
  visionMission: {
    type: String,
    required: [true, 'Vision and mission is required'],
    maxlength: 1000
  },
  photo: {
    type: String,
    required: [true, 'Photo URL is required']
  },
  votes: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.Candidate || mongoose.model<ICandidate>('Candidate', CandidateSchema)
