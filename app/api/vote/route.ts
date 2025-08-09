import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Student from '@/models/Student'
import Candidate from '@/models/Candidate'
import Vote from '@/models/Vote'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || (decoded.role !== 'voter' && decoded.role !== 'operator')) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    await dbConnect()
    
    const { nis, candidateId } = await request.json()

    const student = await Student.findOne({ nis })
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    if (student.hasVoted) {
      return NextResponse.json({ error: 'Student has already voted' }, { status: 400 })
    }

    const candidate = await Candidate.findById(candidateId)
    if (!candidate) {
      return NextResponse.json({ error: 'Candidate not found' }, { status: 404 })
    }

    await Vote.create({
      nis,
      candidateId,
      adminUsername: decoded.username
    })

    await Student.findOneAndUpdate(
      { nis },
      {
        hasVoted: true,
        votedAt: new Date(),
        votedFor: candidate.name
      }
    )

    await Candidate.findByIdAndUpdate(candidateId, {
      $inc: { votes: 1 }
    })

    return NextResponse.json({
      message: 'Vote recorded successfully',
      student: student.name,
      candidate: candidate.name
    })
  } catch (error) {
    console.error('Voting error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
