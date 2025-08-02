import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Identifier from './pages/Identifier'
import Decrypter from './pages/Decrypter'
import './App.css'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/identifier" element={<Identifier />} />
        <Route path="/decrypter" element={<Decrypter />} />
      </Routes>
    </Layout>
  )
}

export default App
