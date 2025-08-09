"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserPlus, Database } from 'lucide-react'

export default function SetupPage() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'voter'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Admin user ${formData.username} created successfully!`)
        setFormData({ username: '', password: '', role: 'voter' })
      } else {
        setError(data.error || 'Failed to create user')
      }
    } catch (error: any) {
      setError(error.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const createDefaultAdmins = async () => {
    setLoading(true)
    setError('')
    setMessage('')

    const defaultAdmins = [
      { username: 'voter1', password: 'password123', role: 'voter' },
      { username: 'operator1', password: 'password123', role: 'operator' }
    ]

    let successCount = 0
    let errors = []

    for (const admin of defaultAdmins) {
      try {
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(admin)
        })

        const data = await response.json()

        if (response.ok) {
          successCount++
        } else {
          errors.push(`${admin.username}: ${data.error}`)
        }
      } catch (error: any) {
        errors.push(`${admin.username}: ${error.message}`)
      }
    }

    if (successCount > 0) {
      setMessage(`Created ${successCount} admin users successfully!`)
    }
    if (errors.length > 0) {
      setError(`Errors: ${errors.join(', ')}`)
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <Database className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">System Setup</h1>
          <p className="text-gray-600 mt-2">Create admin users for the voting system</p>
        </div>

        {/* Quick Setup */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Setup</CardTitle>
            <CardDescription>
              Create default admin users (voter1 & operator1)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={createDefaultAdmins}
              disabled={loading}
              className="w-full"
            >
              {loading ? 'Creating...' : 'Create Default Admins'}
            </Button>
          </CardContent>
        </Card>

        {/* Manual Setup */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5" />
              <span>Create Admin User</span>
            </CardTitle>
            <CardDescription>
              Manually create a new admin user
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="voter">Voter Admin</SelectItem>
                    <SelectItem value="operator">Operator Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Creating...' : 'Create Admin'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Messages */}
        {message && (
          <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {message}
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="text-center">
          <a href="/" className="text-blue-600 hover:underline">
            ← Back to Homepage
          </a>
        </div>
      </div>
    </div>
  )
}
