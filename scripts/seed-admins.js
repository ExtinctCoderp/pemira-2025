const admins = [
  {
    username: "AryaGanteng",
    password: "y0urMom69",
    role: "voter"
  },
  {
    username: "HanifGanteng", 
    password: "n1gg4b1ch",
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
}

// Check if running directly
if (require.main === module) {
  createAdmins()
}

module.exports = { createAdmins }
