// Script to create initial candidates
// Run this after setting up your MongoDB connection

const candidates = [
  {
    name: "Ahmad Rizki",
    class: "XII IPA 1", 
    visionMission: "Visi: Mewujudkan OSIS yang inovatif dan responsif terhadap kebutuhan siswa. Misi: Meningkatkan fasilitas sekolah, mengadakan program pengembangan bakat, dan memperkuat komunikasi antar siswa.",
    photo: "/candidate-ahmad-rizki.png"
  },
  {
    name: "Sari Dewi",
    class: "XII IPS 2",
    visionMission: "Visi: Membangun sekolah yang inklusif dan berprestasi. Misi: Mengoptimalkan kegiatan ekstrakurikuler, meningkatkan prestasi akademik dan non-akademik, serta menciptakan lingkungan sekolah yang nyaman.",
    photo: "/candidate-sari-dewi.png"
  },
  {
    name: "Budi Santoso", 
    class: "XII IPA 3",
    visionMission: "Visi: OSIS yang transparan dan berorientasi pada kemajuan siswa. Misi: Digitalisasi sistem informasi sekolah, peningkatan program beasiswa, dan penguatan karakter siswa melalui berbagai kegiatan positif.",
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

// Note: You'll need to manually add these to your database
console.log('Please manually create these candidates in your database:')
console.log(JSON.stringify(candidates, null, 2))
