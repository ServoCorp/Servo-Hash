import { Link } from 'react-router-dom'
import { Hash, Shield, Zap, Lock, Globe, Cpu } from 'lucide-react'
import './Home.css'

function Home() {
  const features = [
    {
      icon: <Hash className="feature-icon" />,
      title: "Hash Identification",
      description: "Automatically detect hash types including MD5, SHA1, SHA256, SHA512, bcrypt, and more."
    },
    {
      icon: <Shield className="feature-icon" />,
      title: "Secure Processing",
      description: "All hash operations are performed locally in your browser for maximum security."
    },
    {
      icon: <Zap className="feature-icon" />,
      title: "Lightning Fast",
      description: "Built with modern React and optimized algorithms for instant results."
    },
    {
      icon: <Lock className="feature-icon" />,
      title: "Hash Decryption",
      description: "Attempt to crack hashes using rainbow tables and common password patterns."
    },
    {
      icon: <Globe className="feature-icon" />,
      title: "GitHub Pages Ready",
      description: "Fully static application deployable to GitHub Pages with no server required."
    },
    {
      icon: <Cpu className="feature-icon" />,
      title: "Modern Architecture",
      description: "Built with React, TypeScript, and Vite for the best developer experience."
    }
  ]

  return (
    <div className="home">
      <section className="welcome-section">
        <div className="welcome-content">
          <h2 className="welcome-title">Welcome to Servo Hasher</h2>
          <p className="welcome-description">
            Your comprehensive hash identification and decryption toolkit.
            Whether you're a security researcher, developer, or enthusiast,
            Servo Hasher provides the tools you need to work with cryptographic hashes efficiently.
          </p>

          <div className="cta-buttons">
            <Link to="/identifier" className="cta-button primary">
              <Hash className="cta-icon" />
              Start Identifying
            </Link>
            <Link to="/decrypter" className="cta-button secondary">
              <Shield className="cta-icon" />
              Try Decryption
            </Link>
          </div>
        </div>
      </section>

      <section className="features-section">
        <h3 className="features-title">Features</h3>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              {feature.icon}
              <h4 className="feature-title">{feature.title}</h4>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-number">15+</span>
            <span className="stat-label">Hash Types Supported</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">100%</span>
            <span className="stat-label">Client-Side Processing</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">0ms</span>
            <span className="stat-label">Server Response Time</span>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home
