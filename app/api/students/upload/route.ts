import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Student from '@/models/Student'
import { parseCSV } from '@/lib/csvParser'
import { verifyToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
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
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const csvContent = await file.text()
    const students = parseCSV(csvContent)

    await Student.deleteMany({})
    await Student.insertMany(students)

    return NextResponse.json({
      message: `Successfully uploaded ${students.length} students`,
      count: students.length
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload students' },
      { status: 500 }
    )
  }
}
