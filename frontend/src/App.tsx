import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('Lade Daten vom Backend...')

  useEffect(() => {
    // Hier rufen wir unser Backend auf Port 5000 ab
    axios.get('http://localhost:5000/')
      .then(response => {
        setMessage(response.data) // Die Nachricht vom Server speichern
      })
      .catch(error => {
        console.error("Fehler!", error)
        setMessage("Backend nicht erreichbar! ❌")
      })
  }, [])

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1>Selfinity-Lab Test</h1>
      <div style={{ padding: '20px', border: '2px solid #646cff', borderRadius: '10px', display: 'inline-block' }}>
        <p>Status vom Backend:</p>
        <h2 style={{ color: '#646cff' }}>{message}</h2>
      </div>
    </div>
  )
}

export default App