import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import { Home } from './Home'
import { About } from './About'
import { Contact } from './Contact'

function App() {
  return (
    <BrowserRouter>
    <div className='container'>
      <header>
        <h1>Kõige ägedamad uudised</h1>
        <nav>
          <Link to="/">Esileht</Link> |{" "}
          <Link to="/about">Firmast</Link> |{" "}
          <Link to="/contact">Kontakt</Link>
        </nav>
      </header>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
    </div>
    </BrowserRouter>
  )
   
}

export default App
