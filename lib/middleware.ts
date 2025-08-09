import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './auth'

export function withAuth(handler: Function, allowedRoles?: string[]) {
  return async (request: NextRequest) => {
    try {
      const token = request.headers.get('authorization')?.replace('Bearer ', '')
      
      if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 })
      }

      const decoded = verifyToken(token)
      if (!decoded) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      }

      if (allowedRoles && !allowedRoles.includes(decoded.role)) {
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
      }

      const requestWithUser = request as NextRequest & { user: typeof decoded }
      requestWithUser.user = decoded

      return handler(requestWithUser)
    } catch (error) {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 })
    }
  }
}
