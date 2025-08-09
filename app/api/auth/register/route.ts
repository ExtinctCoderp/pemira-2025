import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import { hashPassword, generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await dbConnect()
    
    const { username, password, role = 'voter' } = await request.json()

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      )
    }

    if (!['voter', 'operator'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be voter or operator' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await hashPassword(password)

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
      role
    })

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      username: user.username,
      role: user.role
    })

    return NextResponse.json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
