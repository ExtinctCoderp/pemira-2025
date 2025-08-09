// Script to create initial admin users
// Run this after setting up your MongoDB connection

const admins = [
  {
    username: "voter1",
    password: "password123", // This will be hashed
    role: "voter"
  },
  {
    username: "operator1", 
    password: "password123", // This will be hashed
    role: "operator"
  }
]

async function seedAdmins() {
  try {
    for (const admin of admins) {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(admin)
      })
      
      if (response.ok) {
        console.log(`Admin ${admin.username} created successfully`)
      } else {
        console.log(`Failed to create admin ${admin.username}`)
      }
    }
    
    console.log('Admin seeding completed!')
  } catch (error) {
    console.error('Error seeding admins:', error)
  }
}

// Note: You'll need to create a register endpoint or manually add these to your database
console.log('Please manually create these admin users in your database:')
console.log(JSON.stringify(admins, null, 2))
