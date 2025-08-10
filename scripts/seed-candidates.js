const candidates = [
  {
    name: "Ahmad Rizki",
    class: "XII IPA 1", 
    visionMission: "lorem ipsum",
    photo: "/candidate-ahmad-rizki.png"
  },
  {
    name: "Sari Dewi",
    class: "XII IPS 2",
    visionMission: "lorem ipsum",
    photo: "/candidate-sari-dewi.png"
  },
  {
    name: "Budi Santoso", 
    class: "XII IPA 3",
    visionMission: "lorem ipsum",
    photo: "/candidate-budi-santoso.png"
  }
]

async function seedCandidates() {
  try {
    for (const candidate of candidates) {
      const response = await fetch('/api/candidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(candidate)
      })
      
      if (response.ok) {
        console.log(`Candidate ${candidate.name} created successfully`)
      } else {
        console.log(`Failed to create candidate ${candidate.name}`)
      }
    }
    
    console.log('Candidate seeding completed!')
  } catch (error) {
    console.error('Error seeding candidates:', error)
  }
}

console.log('Please manually create these candidates in your database:')
console.log(JSON.stringify(candidates, null, 2))
