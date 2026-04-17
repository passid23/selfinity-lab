import { useEffect, useState } from 'react'
import axios from 'axios'
import LandingPage from "./components/LandingPage/LandingPage.tsx";

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
      //style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}
    <div >
        {/*style={{ padding: '20px', border: '2px solid #646cff', borderRadius: '10px', display: 'inline-block' }}*/}
      <div >
        <p>Status vom Backend:</p>
        <h2 style={{ color: '#646cff' }}>{message}</h2>
      </div>
        <LandingPage />
    </div>
  )
}

export default App