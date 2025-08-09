import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Candidate from '@/models/Candidate'
import Student from '@/models/Student'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {

    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded || decoded.role !== 'operator') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    await dbConnect()
    
    const candidates = await Candidate.find({}).sort({ votes: -1 })
    const totalStudents = await Student.countDocuments()
    const totalVotes = await Student.countDocuments({ hasVoted: true })

    const results = candidates.map(candidate => ({
      id: candidate._id,
      name: candidate.name,
      class: candidate.class,
      votes: candidate.votes,
      percentage: totalVotes > 0 ? ((candidate.votes / totalVotes) * 100).toFixed(1) : 0
    }))

    return NextResponse.json({
      results,
      totalVotes,
      totalStudents,
      turnout: totalStudents > 0 ? ((totalVotes / totalStudents) * 100).toFixed(1) : 0
    })
  } catch (error) {
    console.error('Error fetching results:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
