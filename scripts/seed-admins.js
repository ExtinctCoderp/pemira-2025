const admins = [
  {
    username: "HanifGanteng",
    password: "hafiz&arif", // bakal di hash
    role: "voter"
  },
  {
    username: "BaghasGanteng", 
    password: "arif&hafiz", 
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

console.log('Please manually create these admin users in your database:')
console.log(JSON.stringify(admins, null, 2))
