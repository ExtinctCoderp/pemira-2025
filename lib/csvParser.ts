export interface StudentData {
  nis: string
  name: string
  class: string
}

export function parseCSV(csvContent: string): StudentData[] {
  const lines = csvContent.trim().split('\n')
  const students: StudentData[] = []
  
  for (let i = 1; i < lines.length; i++) {
    const [nis, name, className] = lines[i].split(',').map(field => field.trim().replace(/"/g, ''))
    
    if (nis && name && className) {
      students.push({
        nis,
        name,
        class: className
      })
    }
  }
  
  return students
}
