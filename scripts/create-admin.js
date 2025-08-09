// Script to create admin users via the API
// Run this with: node scripts/create-admin.js

const admins = [
  {
    username: "voter1",
    password: "password123",
    role: "voter"
  },
  {
    username: "operator1", 
    password: "password123",
    role: "operator"
  }
]

async function createAdmins() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  
  console.log('Creating admin users...')
  
  for (const admin of admins) {
    try {
      const response = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(admin)
      })
      
      const data = await response.json()
      
      if (response.ok) {
        console.log(`✅ Admin ${admin.username} (${admin.role}) created successfully`)
      } else {
        console.log(`❌ Failed to create admin ${admin.username}: ${data.error}`)
      }
    } catch (error) {
      console.error(`❌ Error creating admin ${admin.username}:`, error.message)
    }
  }
  
  console.log('\nAdmin creation completed!')
  console.log('\nYou can now login with:')
  console.log('- Username: voter1, Password: password123 (Voter Admin)')
  console.log('- Username: operator1, Password: password123 (Operator Admin)')
}

// Check if running directly
if (require.main === module) {
  createAdmins()
}

module.exports = { createAdmins }
