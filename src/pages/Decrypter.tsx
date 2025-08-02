import { useState } from 'react'
import { Unlock, RefreshCw, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react'
import { identifyHash } from '../utils/hashIdentifier'
import { attemptDecryption, getCrackingDifficulty } from '../utils/hashDecrypter'
import type { DecryptionResult } from '../utils/hashDecrypter'
import './Decrypter.css'

function Decrypter() {
  const [inputHash, setInputHash] = useState('')
  const [results, setResults] = useState<DecryptionResult | null>(null)
  const [isDecrypting, setIsDecrypting] = useState(false)
  const [selectedMethods, setSelectedMethods] = useState<string[]>(['md5', 'sha1', 'sha256'])

  const handleDecrypt = async () => {
    if (!inputHash.trim()) return

    setIsDecrypting(true)
    setResults(null)

    try {
      // First identify the hash to get likely types
      const hashInfo = identifyHash(inputHash.trim())
      const likelyTypes = hashInfo
        .filter(info => info.confidence > 70)
        .map(info => info.type.toLowerCase().replace(/[^a-z0-9]/g, ''))
        .slice(0, 3) // Top 3 most likely

      // Use selected methods or fall back to identified types
      const methodsToTry = likelyTypes.length > 0 ? likelyTypes : selectedMethods

      const result = await attemptDecryption(inputHash.trim(), methodsToTry)
      setResults(result)
    } catch (error) {
      console.error('Decryption error:', error)
      setResults({
        hash: inputHash.trim(),
        attempts: [],
        success: false,
        bestMatch: null,
        totalTimeMs: 0
      })
    } finally {
      setIsDecrypting(false)
    }
  }

  const handleMethodToggle = (method: string) => {
    setSelectedMethods(prev =>
      prev.includes(method)
        ? prev.filter(m => m !== method)
        : [...prev, method]
    )
  }

  const handleClear = () => {
    setInputHash('')
    setResults(null)
  }

  const formatTime = (ms: number) => {
    if (ms < 1000) return `${ms}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}min`
  }

  const getMethodColor = (success: boolean) => success ? '#8aff80' : '#ff8080'

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'trivial': return '#8aff80'
      case 'easy': return '#80ccff'
      case 'moderate': return '#ffcc80'
      case 'hard': return '#ff8080'
      case 'very-hard': return '#ff6060'
      case 'impossible': return '#ff4040'
      default: return '#888'
    }
  }

  // Get hash info for difficulty assessment
  const hashInfo = inputHash.trim() ? identifyHash(inputHash.trim())[0] : null
  const difficulty = hashInfo ? getCrackingDifficulty(hashInfo.type) : null

  return (
    <div className="decrypter">
      <div className="decrypter-header">
        <h1 className="page-title">Hash Decrypter</h1>
        <p className="page-description">
          Attempt to crack hashes using dictionary attacks, rainbow tables, and limited brute force.
          This tool demonstrates common hash cracking techniques for educational purposes.
        </p>
      </div>

      <div className="input-section">
        <div className="input-group">
          <label htmlFor="hash-input" className="input-label">
            Enter Hash to Decrypt
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

        <div className="methods-section">
          <h3 className="methods-title">Hash Types to Try:</h3>
          <div className="methods-grid">
            {['md5', 'sha1', 'sha224', 'sha256', 'sha384', 'sha512'].map(method => (
              <label key={method} className="method-checkbox">
                <input
                  type="checkbox"
                  checked={selectedMethods.includes(method)}
                  onChange={() => handleMethodToggle(method)}
                />
                <span className="method-label">{method.toUpperCase()}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="action-section">
          <button
            className="decrypt-button"
            onClick={handleDecrypt}
            disabled={!inputHash.trim() || isDecrypting}
          >
            {isDecrypting ? (
              <>
                <RefreshCw className="button-icon spinning" />
                Cracking...
              </>
            ) : (
              <>
                <Unlock className="button-icon" />
                Start Cracking
              </>
            )}
          </button>
        </div>
      </div>

      {difficulty && (
        <div className="difficulty-section">
          <h3 className="section-title">Cracking Difficulty Assessment</h3>
          <div className="difficulty-card">
            <div className="difficulty-header">
              <span
                className="difficulty-level"
                style={{ color: getDifficultyColor(difficulty.level) }}
              >
                {difficulty.level.replace('-', ' ').toUpperCase()}
              </span>
              <span className="hash-type">{hashInfo?.type}</span>
            </div>
            <p className="difficulty-description">{difficulty.description}</p>
            <div className="difficulty-time">
              <Clock className="time-icon" />
              <span>Estimated Time: {difficulty.estimatedTime}</span>
            </div>
          </div>
        </div>
      )}

      {results && (
        <div className="results-section">
          <h3 className="section-title">Decryption Results</h3>

          {results.success ? (
            <div className="success-card">
              <div className="success-header">
                <CheckCircle className="success-icon" />
                <h4>Hash Successfully Cracked!</h4>
              </div>
              <div className="success-content">
                <div className="result-item">
                  <strong>Original Hash:</strong>
                  <code className="hash-display">{results.hash}</code>
                </div>
                <div className="result-item">
                  <strong>Plaintext:</strong>
                  <code className="plaintext-display">{results.bestMatch}</code>
                </div>
                <div className="result-item">
                  <strong>Total Time:</strong>
                  <span>{formatTime(results.totalTimeMs)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="failure-card">
              <div className="failure-header">
                <AlertTriangle className="failure-icon" />
                <h4>Hash Could Not Be Cracked</h4>
              </div>
              <p className="failure-message">
                The hash could not be cracked using available methods. This could mean:
              </p>
              <ul className="failure-reasons">
                <li>The password is not in our dictionary</li>
                <li>The password is too complex for brute force</li>
                <li>The hash type is not supported</li>
                <li>The hash includes a salt</li>
              </ul>
            </div>
          )}

          <div className="attempts-section">
            <h4 className="attempts-title">Attack Methods Tried:</h4>
            <div className="attempts-grid">
              {results.attempts.map((attempt, index) => (
                <div key={index} className="attempt-card">
                  <div className="attempt-header">
                    <span className="attempt-method">{attempt.method}</span>
                    <div className="attempt-status">
                      {attempt.success ? (
                        <CheckCircle
                          className="status-icon success"
                          style={{ color: getMethodColor(true) }}
                        />
                      ) : (
                        <AlertTriangle
                          className="status-icon failure"
                          style={{ color: getMethodColor(false) }}
                        />
                      )}
                      <span style={{ color: getMethodColor(attempt.success) }}>
                        {attempt.success ? 'Success' : 'Failed'}
                      </span>
                    </div>
                  </div>

                  <div className="attempt-details">
                    <div className="attempt-time">
                      <Clock className="detail-icon" />
                      <span>{formatTime(attempt.timeMs)}</span>
                    </div>

                    {attempt.plaintext && (
                      <div className="attempt-result">
                        <Zap className="detail-icon" />
                        <code>{attempt.plaintext}</code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="disclaimer-section">
        <div className="disclaimer-card">
          <AlertTriangle className="disclaimer-icon" />
          <div className="disclaimer-content">
            <h4>Educational Purpose Disclaimer</h4>
            <p>
              This tool is for educational and security research purposes only.
              Only attempt to crack hashes that you own or have explicit permission to test.
              Unauthorized hash cracking may violate laws and terms of service.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Decrypter
