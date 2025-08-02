import { useState } from 'react'
import { Search, Copy, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { identifyHash, analyzeHash, getHashStrength } from '../utils/hashIdentifier'
import type { HashInfo } from '../utils/hashIdentifier'
import './Identifier.css'

function Identifier() {
  const [inputHash, setInputHash] = useState('')
  const [results, setResults] = useState<HashInfo[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleAnalyze = () => {
    if (!inputHash.trim()) return

    setIsAnalyzing(true)
    // Simulate analysis delay for better UX
    setTimeout(() => {
      const hashResults = identifyHash(inputHash.trim())
      setResults(hashResults)
      setIsAnalyzing(false)
    }, 500)
  }

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleClear = () => {
    setInputHash('')
    setResults([])
  }

  const analysis = inputHash.trim() ? analyzeHash(inputHash.trim()) : null

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return '#8aff80'
    if (confidence >= 70) return '#ffcc80'
    return '#ff8080'
  }

  const getStrengthColor = (level: string) => {
    switch (level) {
      case 'very-strong': return '#8aff80'
      case 'strong': return '#80ccff'
      case 'moderate': return '#ffcc80'
      case 'weak': return '#ff8080'
      default: return '#888'
    }
  }

  return (
    <div className="identifier">
      <div className="identifier-header">
        <h1 className="page-title">Hash Identifier</h1>
        <p className="page-description">
          Analyze and identify cryptographic hash types. Simply paste your hash below and get detailed information about its type, characteristics, and security strength.
        </p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="hash-input" className="input-label">
            Enter Hash to Identify
          </label>
          <div className="input-wrapper">
            <textarea
              id="hash-input"
              className="hash-input"
              placeholder="Paste your hash here... (e.g., 5d41402abc4b2a76b9719d911017c592)"
              value={inputHash}
              onChange={(e) => setInputHash(e.target.value)}
              rows={3}
            />
            {inputHash && (
              <button
                className="clear-button"
                onClick={handleClear}
                title="Clear input"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="action-buttons">
          <button
            className="analyze-button"
            onClick={handleAnalyze}
            disabled={!inputHash.trim() || isAnalyzing}
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="button-icon spinning" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="button-icon" />
                Identify Hash
              </>
            )}
          </button>

          {inputHash && (
            <button
              className="copy-button"
              onClick={() => handleCopy(inputHash)}
              title="Copy hash"
            >
              {copied ? (
                <CheckCircle className="button-icon" />
              ) : (
                <Copy className="button-icon" />
              )}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      </div>

      {analysis && (
        <div className="analysis-section">
          <h3 className="section-title">Hash Analysis</h3>
          <div className="analysis-grid">
            <div className="analysis-item">
              <span className="analysis-label">Length:</span>
              <span className="analysis-value">{analysis.length} characters</span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Format:</span>
              <span className="analysis-value">
                {analysis.isHexadecimal ? 'Hexadecimal' :
                 analysis.isBase64 ? 'Base64' : 'Other'}
              </span>
            </div>
            <div className="analysis-item">
              <span className="analysis-label">Salt Detected:</span>
              <span className="analysis-value">
                {analysis.possibleSalt ? 'Possibly' : 'No'}
              </span>
            </div>
          </div>
        </div>
      )}

      {results.length > 0 && (
        <div className="results-section">
          <h3 className="section-title">Identification Results</h3>
          <div className="results-grid">
            {results.map((result, index) => {
              const strength = getHashStrength(result.type)
              return (
                <div key={index} className="result-card">
                  <div className="result-header">
                    <h4 className="result-type">{result.type}</h4>
                    <div
                      className="confidence-badge"
                      style={{ backgroundColor: getConfidenceColor(result.confidence) }}
                    >
                      {result.confidence}% confident
                    </div>
                  </div>

                  <p className="result-description">{result.description}</p>

                  <div className="result-details">
                    <div className="detail-item">
                      <strong>Length:</strong> {result.length} characters
                    </div>

                    <div className="detail-item">
                      <strong>Security Strength:</strong>
                      <span
                        className="strength-badge"
                        style={{ color: getStrengthColor(strength.level) }}
                      >
                        {strength.level.replace('-', ' ').toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="characteristics">
                    <h5 className="characteristics-title">Characteristics:</h5>
                    <div className="characteristics-list">
                      {result.characteristics.map((char, charIndex) => (
                        <span key={charIndex} className="characteristic-tag">
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="security-info">
                    <div className="info-item">
                      <Info className="info-icon" />
                      <div>
                        <strong>Security Assessment:</strong>
                        <p>{strength.description}</p>
                      </div>
                    </div>

                    <div className="recommendation">
                      <AlertCircle className="warning-icon" />
                      <div>
                        <strong>Recommendation:</strong>
                        <p>{strength.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {!results.length && inputHash && !isAnalyzing && (
        <div className="no-results">
          <AlertCircle className="no-results-icon" />
          <h3>Click "Identify Hash" to analyze your input</h3>
          <p>Enter a hash above and click the analyze button to get detailed identification results.</p>
        </div>
      )}
    </div>
  )
}

export default Identifier
