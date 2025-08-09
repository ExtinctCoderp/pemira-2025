import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  username: string
  password: string
  role: 'voter' | 'operator'
  createdAt: Date
}

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Please provide a username'],
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6
  },
  role: {
    type: String,
    enum: ['voter', 'operator'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
