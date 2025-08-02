import CryptoJS from 'crypto-js'

/**
 * Hash decryption and cracking utilities
 */

export interface DecryptionAttempt {
  method: string;
  plaintext: string | null;
  timeMs: number;
  success: boolean;
}

export interface DecryptionResult {
  hash: string;
  attempts: DecryptionAttempt[];
  success: boolean;
  bestMatch: string | null;
  totalTimeMs: number;
}

/**
 * Common passwords and patterns for dictionary attacks
 */
const COMMON_PASSWORDS = [
  // Very common passwords
  'password', '123456', 'password123', 'admin', 'letmein', 'welcome',
  'monkey', '1234567890', 'qwerty', 'abc123', 'Password1', 'password1',
  'admin123', 'root', 'toor', 'pass', '12345', '123456789', 'iloveyou',
  'princess', 'sunshine', 'master', 'hello', 'charlie', 'aa123456',
  'password12', '1234567', '123123', 'football', 'monkey123', 'login',

  // Common patterns
  'hello', 'world', 'test', 'demo', 'sample', 'example', 'user123',
  'user', 'guest', 'public', 'secret', 'private', 'default', 'temp',
  'administrator', 'support', 'service', 'system', 'backup', 'database',

  // Years and dates
  '2023', '2024', '2025', '2022', '2021', '2020', '1990', '2000', '1234', '0000',
  '1995', '1996', '1997', '1998', '1999', '2001', '2002', '2003', '2004', '2005',

  // Simple words
  'love', 'god', 'sex', 'money', 'home', 'work', 'family', 'mother', 'father',
  'friend', 'happy', 'life', 'good', 'bad', 'new', 'old', 'baby', 'angel',
  'freedom', 'success', 'power', 'strong', 'beautiful', 'lovely', 'sweet',

  // Colors
  'red', 'blue', 'green', 'black', 'white', 'yellow', 'orange', 'purple',
  'pink', 'brown', 'gray', 'silver', 'gold',

  // Animals
  'cat', 'dog', 'bird', 'fish', 'lion', 'tiger', 'bear', 'wolf', 'eagle',
  'horse', 'rabbit', 'snake', 'dragon', 'butterfly',

  // Tech terms
  'computer', 'internet', 'windows', 'linux', 'mac', 'apple', 'microsoft',
  'google', 'facebook', 'twitter', 'github', 'stackoverflow', 'android',
  'iphone', 'samsung', 'email', 'website', 'server', 'network',

  // Common names
  'john', 'mike', 'david', 'james', 'robert', 'william', 'richard', 'thomas',
  'mary', 'jennifer', 'linda', 'elizabeth', 'barbara', 'susan', 'jessica',
  'sarah', 'karen', 'nancy', 'lisa', 'betty', 'helen', 'sandra', 'donna',

  // Keyboard patterns
  'qwerty', 'asdf', 'zxcv', 'qwertyuiop', 'asdfgh', 'zxcvbn', '098765',
  'qazwsx', 'wsxedc', 'rfvtgb', 'yhnujm', 'plokij', 'mnbvcx',

  // Common combinations
  'abc', 'xyz', 'aaa', 'aaaa', 'aaaaa', '111', '1111', '11111',
  'abc123', '123abc', 'test123', '123test', 'admin123', '123admin'
]

/**
 * Generate variations of a base password
 */
function generatePasswordVariations(base: string): string[] {
  const variations = [base]

  // Add common numbers
  const commonNumbers = ['1', '12', '123', '1234', '01', '02', '03', '2023', '2024', '2025', '2022', '21', '22', '23', '24', '25']
  for (const num of commonNumbers) {
    variations.push(base + num)
    variations.push(num + base)
  }

  // Add common symbols
  const commonSymbols = ['!', '@', '#', '$', '%', '!@#', '!!', '123!', '@123']
  for (const symbol of commonSymbols) {
    variations.push(base + symbol)
    variations.push(symbol + base)
  }

  // Capitalization variations
  variations.push(base.toUpperCase())
  variations.push(base.toLowerCase())
  variations.push(base.charAt(0).toUpperCase() + base.slice(1).toLowerCase())
  if (base.length > 1) {
    variations.push(base.charAt(0).toLowerCase() + base.slice(1).toUpperCase())
  }

  // Common patterns with base
  variations.push(base + base) // duplicate
  variations.push(base.split('').reverse().join('')) // reverse

  // Leet speak substitutions
  const leetMap: Record<string, string> = {
    'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7', 'l': '1', 'g': '9'
  }

  let leetVersion = base.toLowerCase()
  for (const [char, leet] of Object.entries(leetMap)) {
    leetVersion = leetVersion.replace(new RegExp(char, 'g'), leet)
  }
  if (leetVersion !== base.toLowerCase()) {
    variations.push(leetVersion)
    variations.push(leetVersion + '!')
    variations.push(leetVersion + '123')
  }

  // Common password patterns
  if (base.length >= 3) {
    variations.push(base + '123!')
    variations.push(base + '@123')
    variations.push(base + '2024')
    variations.push('123' + base)
    variations.push(base.charAt(0).toUpperCase() + base.slice(1) + '123')
  }

  return [...new Set(variations)] // Remove duplicates
}

/**
 * Hash a plaintext using the specified algorithm
 */
function hashPlaintext(plaintext: string, algorithm: string): string {
  switch (algorithm.toLowerCase()) {
    case 'md5':
      return CryptoJS.MD5(plaintext).toString()
    case 'sha1':
    case 'sha-1':
      return CryptoJS.SHA1(plaintext).toString()
    case 'sha224':
    case 'sha-224':
      return CryptoJS.SHA224(plaintext).toString()
    case 'sha256':
    case 'sha-256':
      return CryptoJS.SHA256(plaintext).toString()
    case 'sha384':
    case 'sha-384':
      return CryptoJS.SHA384(plaintext).toString()
    case 'sha512':
    case 'sha-512':
      return CryptoJS.SHA512(plaintext).toString()
    case 'sha3':
      return CryptoJS.SHA3(plaintext).toString()
    default:
      throw new Error(`Unsupported hash algorithm: ${algorithm}`)
  }
}

/**
 * Attempt dictionary attack
 */
async function dictionaryAttack(
  targetHash: string,
  algorithm: string,
  dictionary: string[]
): Promise<DecryptionAttempt> {
  const startTime = Date.now()

  try {
    for (const word of dictionary) {
      const variations = generatePasswordVariations(word)

      for (const variation of variations) {
        try {
          const hashedVariation = hashPlaintext(variation, algorithm)
          if (hashedVariation.toLowerCase() === targetHash.toLowerCase()) {
            return {
              method: 'Dictionary Attack',
              plaintext: variation,
              timeMs: Date.now() - startTime,
              success: true
            }
          }
        } catch (error) {
          continue // Skip invalid hashing attempts
        }
      }
    }
  } catch (error) {
    console.error('Dictionary attack error:', error)
  }

  return {
    method: 'Dictionary Attack',
    plaintext: null,
    timeMs: Date.now() - startTime,
    success: false
  }
}

/**
 * Attempt brute force attack (improved with smart character sets)
 */
async function bruteForceAttack(
  targetHash: string,
  algorithm: string,
  maxLength: number = 5
): Promise<DecryptionAttempt> {
  const startTime = Date.now()

  // Smart character set selection based on hash analysis
  const charset = {
    numeric: '0123456789',
    lowercase: 'abcdefghijklmnopqrstuvwxyz',
    uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    symbols: '!@#$%^&*'
  }

  // Start with most common character sets
  const characterSets = [
    charset.numeric, // Numbers first (fastest)
    charset.lowercase, // Then lowercase
    charset.numeric + charset.lowercase, // Common combination
    charset.lowercase + charset.uppercase, // Mixed case
  ]

  try {
    for (const chars of characterSets) {
      // Try single characters first
      for (let i = 0; i < chars.length && i < 36; i++) { // Limit to prevent long execution
        const char = chars[i]
        try {
          const hashedChar = hashPlaintext(char, algorithm)
          if (hashedChar.toLowerCase() === targetHash.toLowerCase()) {
            return {
              method: 'Brute Force (Single Char)',
              plaintext: char,
              timeMs: Date.now() - startTime,
              success: true
            }
          }
        } catch (error) {
          continue
        }
      }

      // Try two-character combinations (limited scope)
      if (maxLength >= 2) {
        const limit = Math.min(chars.length, 12) // Limit for performance
        for (let i = 0; i < limit; i++) {
          for (let j = 0; j < limit; j++) {
            const combo = chars[i] + chars[j]
            try {
              const hashedCombo = hashPlaintext(combo, algorithm)
              if (hashedCombo.toLowerCase() === targetHash.toLowerCase()) {
                return {
                  method: 'Brute Force (2 Chars)',
                  plaintext: combo,
                  timeMs: Date.now() - startTime,
                  success: true
                }
              }
            } catch (error) {
              continue
            }
          }
        }
      }

      // Try three-character combinations (very limited)
      if (maxLength >= 3 && chars === charset.numeric) {
        // Only try numeric 3-char combinations to avoid timeout
        for (let i = 0; i < 10; i++) {
          for (let j = 0; j < 10; j++) {
            for (let k = 0; k < 10; k++) {
              const combo = chars[i] + chars[j] + chars[k]
              try {
                const hashedCombo = hashPlaintext(combo, algorithm)
                if (hashedCombo.toLowerCase() === targetHash.toLowerCase()) {
                  return {
                    method: 'Brute Force (3 Chars)',
                    plaintext: combo,
                    timeMs: Date.now() - startTime,
                    success: true
                  }
                }
              } catch (error) {
                continue
              }
            }
          }
        }
      }

      // Timeout check to prevent browser freezing
      if (Date.now() - startTime > 3000) {
        break
      }
    }

  } catch (error) {
    console.error('Brute force attack error:', error)
  }

  return {
    method: 'Brute Force',
    plaintext: null,
    timeMs: Date.now() - startTime,
    success: false
  }
}/**
 * Attempt common hash lookup
 */
async function lookupAttack(targetHash: string): Promise<DecryptionAttempt> {
  const startTime = Date.now()

  // Simulate rainbow table lookup with some known hashes
  const knownHashes: Record<string, string> = {
    // MD5 hashes
    '1a79a4d60de6718e8e5b326e338ae533': 'example',
    '5d41402abc4b2a76b9719d911017c592': 'hello',
    'e10adc3949ba59abbe56e057f20f883e': '123456',
    '25d55ad283aa400af464c76d713c07ad': 'password',
    '098f6bcd4621d373cade4e832627b4f6': 'test',
    '827ccb0eea8a706c4c34a16891f84e7b': '12345',
    '202cb962ac59075b964b07152d234b70': '123',
    '21232f297a57a5a743894a0e4a801fc3': 'admin',
    '1f3870be274f6c49b3e31a0c6728957f': 'apple',
    '0cc175b9c0f1b6a831c399e269772661': 'a',
    '92eb5ffee6ae2fec3ad71c777531578f': 'b',
    '4a8a08f09d37b73795649038408b5f33': 'c',
    'f25a2fc72690b780b2a14e140ef6a9e0': 'love',

    // SHA1 hashes
    'aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d': 'hello',
    '7c4a8d09ca3762af61e59520943dc26494f8941b': '123456',
    '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8': 'password',
    'a94a8fe5ccb19ba61c4c0873d391e987982fbbd3': 'test',
    '8cb2237d0679ca88db6464eac60da96345513964': '12345',
    '356a192b7913b04c54574d18c28d46e6395428ab': '1',
    'da4b9237bacccdf19c0760cab7aec4a8359010b0': '2',
    '77de68daecd823babbb58edb1c8e14d7106e83bb': '3',
    '1b6453892473a467d07372d45eb05abc2031647a': 'hello',
    'd033e22ae348aeb5660fc2140aec35850c4da997': 'admin',

    // SHA256 hashes
    '2cf24dba4f21d4288094c0b6b99f27b8d57c40b9bf6b944bf4f0e8fef5e66da6': 'hello',
    '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92': '123456',
    '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8': 'password',
    '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08': 'test',
    '5994471abb01112afcc18159f6cc74b4f511b99806da59b3caf5a9c173cacfc5': '12345',
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855': '',
    '6b86b273ff34fce19d6b804eff5a3f5747ada4eaa22f1d49c01e52ddb7875b4b': '1',
    'd4735e3a265e16eee03f59718b9b5d03019c07d8b6c51f90da3a666eec13ab35': '2',
    '4e07408562bedb8b60ce05c1decfe3ad16b72230967de01f640b7e4729b49fce': '3',
    'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d': 'hello',
    '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918': 'admin'
  }

  const result = knownHashes[targetHash.toLowerCase()]

  return {
    method: 'Rainbow Table Lookup',
    plaintext: result || null,
    timeMs: Date.now() - startTime,
    success: !!result
  }
}

/**
 * Hybrid attack combining multiple methods
 */
async function hybridAttack(
  targetHash: string,
  algorithm: string
): Promise<DecryptionAttempt> {
  const startTime = Date.now()

  // Common short patterns that might not be in dictionary
  const patterns = [
    // Years
    '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017',
    // Common sequences
    '123', '1234', '12345', '123456', '1234567', '12345678',
    'abc', 'abcd', 'abcde', 'abcdef',
    // Repeated characters
    'aa', 'aaa', 'aaaa', '11', '111', '1111', '00', '000', '0000',
    // Keyboard patterns
    'qwe', 'asd', 'zxc', 'qwer', 'asdf', 'zxcv',
    // Common short words
    'ok', 'no', 'yes', 'hi', 'me', 'go', 'up', 'it', 'is', 'on', 'at', 'to'
  ]

  try {
    for (const pattern of patterns) {
      const hashedPattern = hashPlaintext(pattern, algorithm)
      if (hashedPattern.toLowerCase() === targetHash.toLowerCase()) {
        return {
          method: 'Hybrid Attack (Pattern)',
          plaintext: pattern,
          timeMs: Date.now() - startTime,
          success: true
        }
      }

      // Try with common variations
      const variations = [
        pattern.toUpperCase(),
        pattern + '!',
        pattern + '123',
        '123' + pattern,
        pattern + pattern
      ]

      for (const variation of variations) {
        try {
          const hashedVar = hashPlaintext(variation, algorithm)
          if (hashedVar.toLowerCase() === targetHash.toLowerCase()) {
            return {
              method: 'Hybrid Attack (Variation)',
              plaintext: variation,
              timeMs: Date.now() - startTime,
              success: true
            }
          }
        } catch (error) {
          continue
        }
      }
    }
  } catch (error) {
    console.error('Hybrid attack error:', error)
  }

  return {
    method: 'Hybrid Attack',
    plaintext: null,
    timeMs: Date.now() - startTime,
    success: false
  }
}

/**
 * Main decryption function
 */
export async function attemptDecryption(
  hash: string,
  possibleTypes: string[] = ['md5', 'sha1', 'sha256']
): Promise<DecryptionResult> {
  const startTime = Date.now()
  const attempts: DecryptionAttempt[] = []
  let bestMatch: string | null = null

  // First, try rainbow table lookup (fastest)
  const lookupResult = await lookupAttack(hash)
  attempts.push(lookupResult)
  if (lookupResult.success) {
    bestMatch = lookupResult.plaintext
  }

  // If lookup failed, try hybrid attack for common patterns
  if (!bestMatch) {
    for (const hashType of possibleTypes.slice(0, 1)) { // Try first type only for performance
      try {
        const hybridResult = await hybridAttack(hash, hashType)
        attempts.push(hybridResult)
        if (hybridResult.success) {
          bestMatch = hybridResult.plaintext
          break
        }
      } catch (error) {
        attempts.push({
          method: `Hybrid Attack (${hashType})`,
          plaintext: null,
          timeMs: 0,
          success: false
        })
      }
    }
  }

  // If still no match, try dictionary attacks for each possible hash type
  if (!bestMatch) {
    for (const hashType of possibleTypes) {
      try {
        const dictResult = await dictionaryAttack(hash, hashType, COMMON_PASSWORDS)
        attempts.push(dictResult)
        if (dictResult.success) {
          bestMatch = dictResult.plaintext
          break // Found a match, no need to continue
        }
      } catch (error) {
        attempts.push({
          method: `Dictionary Attack (${hashType})`,
          plaintext: null,
          timeMs: 0,
          success: false
        })
      }
    }
  }

  // If still no match and hash is short enough, try improved brute force
  if (!bestMatch && hash.length <= 64) { // Only for shorter hashes
    for (const hashType of possibleTypes.slice(0, 1)) { // Only try first type to avoid timeout
      try {
        const bruteResult = await bruteForceAttack(hash, hashType, 4)
        attempts.push(bruteResult)
        if (bruteResult.success) {
          bestMatch = bruteResult.plaintext
          break
        }
      } catch (error) {
        attempts.push({
          method: `Brute Force (${hashType})`,
          plaintext: null,
          timeMs: 3000,
          success: false
        })
      }
    }
  }

  return {
    hash,
    attempts,
    success: !!bestMatch,
    bestMatch,
    totalTimeMs: Date.now() - startTime
  }
}

/**
 * Get cracking difficulty assessment
 */
export function getCrackingDifficulty(hashType: string): {
  level: 'trivial' | 'easy' | 'moderate' | 'hard' | 'very-hard' | 'impossible';
  description: string;
  estimatedTime: string;
} {
  const difficulty: Record<string, {
    level: 'trivial' | 'easy' | 'moderate' | 'hard' | 'very-hard' | 'impossible';
    description: string;
    estimatedTime: string;
  }> = {
    'md5': {
      level: 'easy',
      description: 'MD5 is fast to compute and vulnerable to rainbow table attacks',
      estimatedTime: 'Seconds to hours for common passwords'
    },
    'sha1': {
      level: 'easy',
      description: 'SHA-1 is fast to compute, rainbow tables widely available',
      estimatedTime: 'Seconds to hours for common passwords'
    },
    'sha256': {
      level: 'moderate',
      description: 'SHA-256 is slower but still crackable with sufficient resources',
      estimatedTime: 'Minutes to days for common passwords'
    },
    'sha512': {
      level: 'moderate',
      description: 'SHA-512 is computationally expensive but still vulnerable',
      estimatedTime: 'Hours to weeks for common passwords'
    },
    'bcrypt': {
      level: 'very-hard',
      description: 'bcrypt includes salt and adaptive cost, very resistant to cracking',
      estimatedTime: 'Years to decades even for simple passwords'
    },
    'scrypt': {
      level: 'very-hard',
      description: 'scrypt is memory-hard, extremely resistant to specialized hardware',
      estimatedTime: 'Years to decades even for simple passwords'
    },
    'argon2': {
      level: 'impossible',
      description: 'Argon2 with proper parameters is virtually uncrackable',
      estimatedTime: 'Centuries with current technology'
    }
  }

  return difficulty[hashType.toLowerCase()] || {
    level: 'moderate',
    description: 'Cracking difficulty depends on the specific algorithm',
    estimatedTime: 'Unknown - depends on implementation'
  }
}
