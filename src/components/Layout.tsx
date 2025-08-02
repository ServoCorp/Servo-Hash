import type { ReactNode } from 'react'
import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Hash, Shield } from 'lucide-react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  const location = useLocation()
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000) // Update every second

    return () => clearInterval(timer) // Cleanup on unmount
  }, [])

  const formatTimeWithSeconds = (date: Date) => {
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }

  const currentDate = currentTime.toLocaleDateString()
  const timeString = formatTimeWithSeconds(currentTime)

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="date-time">
            <span className="date">{currentDate}</span>
            <span className="time">{timeString}</span>
          </div>
        </div>
      </header>

      <div className="hero-section">
        <div className="hero-content">
          <Link to="/" className="logo-link">
            <h1 className="logo">
              <Hash className="logo-icon" />
              Servo Hasher
            </h1>
          </Link>
          <p className="tagline">Identifying and Cracking Hashes since 2023</p>

          <nav className="main-nav">
            <Link
              to="/identifier"
              className={`nav-button ${location.pathname === '/identifier' ? 'active' : ''}`}
            >
              <Shield className="nav-icon" />
              Identifier
            </Link>
            <Link
              to="/decrypter"
              className={`nav-button ${location.pathname === '/decrypter' ? 'active' : ''}`}
            >
              <Hash className="nav-icon" />
              Decrypter
            </Link>
          </nav>
        </div>
      </div>

      <main className="main-content">
        {children}
      </main>

      <footer className="footer">
        <p>&copy; 2025 Servo Corp. Built with React & TypeScript</p>
      </footer>
    </div>
  )
}

export default Layout
