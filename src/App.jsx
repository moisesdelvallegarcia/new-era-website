import { Route, Routes } from 'react-router-dom'
import Footer from './components/Footer.jsx'
import MobileCallButton from './components/MobileCallButton.jsx'
import Navbar from './components/Navbar.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Gallery from './pages/Gallery.jsx'
import Home from './pages/Home.jsx'
import Reviews from './pages/Reviews.jsx'
import Services from './pages/Services.jsx'

function App() {
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <MobileCallButton />
    </div>
  )
}

export default App
