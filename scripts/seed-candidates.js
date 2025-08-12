const candidates = [
  {
    name: "Alkayyisa Namira W.",
    class: "11-E", 
    visionMission: "lorem ipsum",
    photo: "/1.svg"
  },
  {
    name: "M. Hasbi Pramudiono",
    class: "11-B",
    visionMission: "lorem ipsum",
    photo: "/2.svg"
  },
  {
    name: "Damar Afandi", 
    class: "11-A",
    visionMission: "lorem ipsum",
    photo: "/3.svg"
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
