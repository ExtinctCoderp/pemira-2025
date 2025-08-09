import mongoose from 'mongoose'

export interface IVote extends mongoose.Document {
  nis: string
  candidateId: string
  timestamp: Date
  adminUsername: string
}

const VoteSchema = new mongoose.Schema({
  nis: {
    type: String,
    required: true,
    ref: 'Student'
  },
  candidateId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Candidate'
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  adminUsername: {
    type: String,
    required: true
  }
})

export default mongoose.models.Vote || mongoose.model<IVote>('Vote', VoteSchema)
