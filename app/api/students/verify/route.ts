import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Student from '@/models/Student'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { nis } = await request.json()

    const student = await Student.findOne({ nis })
    
    if (!student) {
      return NextResponse.json(
        { error: 'NIS not found in database' },
        { status: 404 }
      )
    }

    if (student.hasVoted) {
      return NextResponse.json(
        { error: 'This student has already voted' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      student: {
        nis: student.nis,
        name: student.name,
        class: student.class
      }
    })
  } catch (error) {
    console.error('NIS verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
