export const exportToCSV = (data, filename, columns) => {
  if (!data || data.length === 0) {
    alert('Tidak ada data untuk diekspor')
    return
  }

  // Tentukan kolom yang akan diekspor
  const headers = columns || Object.keys(data[0])
  
  // Buat baris header
  let csv = headers.join(',') + '\n'
  
  // Buat baris data
  data.forEach(row => {
    const values = headers.map(header => {
      const value = row[header]
      // Handle nilai yang mengandung koma atau kutip
      if (value === null || value === undefined) return ''
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    })
    csv += values.join(',') + '\n'
  })

  // Buat blob dan unduh
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}