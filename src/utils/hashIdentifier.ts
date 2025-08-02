/**
 * Hash identification and analysis utilities
 */

export interface HashInfo {
  type: string;
  confidence: number;
  description: string;
  length: number;
  characteristics: string[];
}

/**
 * Identifies the type of hash based on length and patterns
 */
export function identifyHash(hash: string): HashInfo[] {
  const cleanHash = hash.trim();
  const length = cleanHash.length;
  const results: HashInfo[] = [];

  // Check for hexadecimal pattern
  const isHex = /^[a-fA-F0-9]+$/.test(cleanHash);
  const isBase64 = /^[A-Za-z0-9+/]+=*$/.test(cleanHash);

  // MD5 (32 hex characters)
  if (length === 32 && isHex) {
    results.push({
      type: 'MD5',
      confidence: 95,
      description: 'Message-Digest Algorithm 5 - 128-bit hash function',
      length: 32,
      characteristics: ['Hexadecimal', '128-bit output', 'Deprecated for security']
    });
  }

  // SHA-1 (40 hex characters)
  if (length === 40 && isHex) {
    results.push({
      type: 'SHA-1',
      confidence: 95,
      description: 'Secure Hash Algorithm 1 - 160-bit hash function',
      length: 40,
      characteristics: ['Hexadecimal', '160-bit output', 'Deprecated for security']
    });
  }

  // SHA-224 (56 hex characters)
  if (length === 56 && isHex) {
    results.push({
      type: 'SHA-224',
      confidence: 90,
      description: 'Secure Hash Algorithm 224 - 224-bit hash function',
      length: 56,
      characteristics: ['Hexadecimal', '224-bit output', 'SHA-2 family']
    });
  }

  // SHA-256 (64 hex characters)
  if (length === 64 && isHex) {
    results.push({
      type: 'SHA-256',
      confidence: 95,
      description: 'Secure Hash Algorithm 256 - 256-bit hash function',
      length: 64,
      characteristics: ['Hexadecimal', '256-bit output', 'SHA-2 family', 'Widely used']
    });
  }

  // SHA-384 (96 hex characters)
  if (length === 96 && isHex) {
    results.push({
      type: 'SHA-384',
      confidence: 90,
      description: 'Secure Hash Algorithm 384 - 384-bit hash function',
      length: 96,
      characteristics: ['Hexadecimal', '384-bit output', 'SHA-2 family']
    });
  }

  // SHA-512 (128 hex characters)
  if (length === 128 && isHex) {
    results.push({
      type: 'SHA-512',
      confidence: 95,
      description: 'Secure Hash Algorithm 512 - 512-bit hash function',
      length: 128,
      characteristics: ['Hexadecimal', '512-bit output', 'SHA-2 family']
    });
  }

  // bcrypt (usually starts with $2a$, $2b$, $2x$, $2y$)
  if (/^\$2[abxy]\$\d{2}\$/.test(cleanHash)) {
    results.push({
      type: 'bcrypt',
      confidence: 98,
      description: 'bcrypt - Adaptive hash function for passwords',
      length: cleanHash.length,
      characteristics: ['Salt included', 'Adaptive cost', 'Blowfish-based', 'Password hashing']
    });
  }

  // scrypt (usually starts with $scrypt$)
  if (cleanHash.startsWith('$scrypt$')) {
    results.push({
      type: 'scrypt',
      confidence: 98,
      description: 'scrypt - Memory-hard password-based key derivation function',
      length: cleanHash.length,
      characteristics: ['Memory-hard', 'Salt included', 'Password hashing']
    });
  }

  // Argon2 (starts with $argon2i$, $argon2d$, $argon2id$)
  if (/^\$argon2[id]{1,2}\$/.test(cleanHash)) {
    results.push({
      type: 'Argon2',
      confidence: 98,
      description: 'Argon2 - Memory-hard password hashing function',
      length: cleanHash.length,
      characteristics: ['Memory-hard', 'Salt included', 'Modern standard', 'Password hashing']
    });
  }

  // NTLM (32 hex characters, but less common than MD5)
  if (length === 32 && isHex) {
    results.push({
      type: 'NTLM',
      confidence: 70,
      description: 'NT LAN Manager hash - Windows password hash',
      length: 32,
      characteristics: ['Hexadecimal', 'Windows systems', 'No salt', 'Weak security']
    });
  }

  // MySQL PASSWORD() old format (16 hex chars)
  if (length === 16 && isHex) {
    results.push({
      type: 'MySQL (old)',
      confidence: 75,
      description: 'MySQL PASSWORD() function (old format)',
      length: 16,
      characteristics: ['Hexadecimal', 'MySQL specific', 'Deprecated']
    });
  }

  // MySQL PASSWORD() new format (41 chars starting with *)
  if (length === 41 && cleanHash.startsWith('*') && /^[a-fA-F0-9]+$/.test(cleanHash.substring(1))) {
    results.push({
      type: 'MySQL (new)',
      confidence: 95,
      description: 'MySQL PASSWORD() function (new format)',
      length: 41,
      characteristics: ['Starts with *', 'SHA-1 based', 'MySQL specific']
    });
  }

  // Base64 encoded hashes
  if (isBase64 && length % 4 === 0) {
    const decoded = atob(cleanHash);
    if (decoded.length === 16) {
      results.push({
        type: 'MD5 (Base64)',
        confidence: 80,
        description: 'Base64 encoded MD5 hash',
        length: length,
        characteristics: ['Base64 encoded', '128-bit hash', 'Binary representation']
      });
    } else if (decoded.length === 20) {
      results.push({
        type: 'SHA-1 (Base64)',
        confidence: 80,
        description: 'Base64 encoded SHA-1 hash',
        length: length,
        characteristics: ['Base64 encoded', '160-bit hash', 'Binary representation']
      });
    } else if (decoded.length === 32) {
      results.push({
        type: 'SHA-256 (Base64)',
        confidence: 80,
        description: 'Base64 encoded SHA-256 hash',
        length: length,
        characteristics: ['Base64 encoded', '256-bit hash', 'Binary representation']
      });
    }
  }

  // If no matches found
  if (results.length === 0) {
    results.push({
      type: 'Unknown',
      confidence: 0,
      description: 'Hash type could not be determined',
      length: length,
      characteristics: ['Unknown format', 'Possibly custom hash', 'May need manual analysis']
    });
  }

  // Sort by confidence
  return results.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Analyzes hash characteristics
 */
export function analyzeHash(hash: string) {
  const cleanHash = hash.trim();

  return {
    length: cleanHash.length,
    isHexadecimal: /^[a-fA-F0-9]+$/.test(cleanHash),
    isBase64: /^[A-Za-z0-9+/]+=*$/.test(cleanHash),
    hasSpecialChars: /[^a-fA-F0-9]/.test(cleanHash),
    startsWithDollar: cleanHash.startsWith('$'),
    containsColons: cleanHash.includes(':'),
    possibleSalt: cleanHash.includes(':') || cleanHash.startsWith('$')
  };
}

/**
 * Get hash strength assessment
 */
export function getHashStrength(hashType: string): {
  level: 'weak' | 'moderate' | 'strong' | 'very-strong';
  description: string;
  recommendation: string;
} {
  const strengthMap: Record<string, ReturnType<typeof getHashStrength>> = {
    'MD5': {
      level: 'weak',
      description: 'Cryptographically broken, vulnerable to collision attacks',
      recommendation: 'Should not be used for security purposes. Migrate to SHA-256 or better.'
    },
    'SHA-1': {
      level: 'weak',
      description: 'Deprecated due to collision vulnerabilities',
      recommendation: 'Should be replaced with SHA-256 or SHA-3 for new applications.'
    },
    'NTLM': {
      level: 'weak',
      description: 'No salt, vulnerable to rainbow table attacks',
      recommendation: 'Use modern password hashing like bcrypt, scrypt, or Argon2.'
    },
    'SHA-224': {
      level: 'moderate',
      description: 'Secure but less common than SHA-256',
      recommendation: 'Good for non-critical applications, consider SHA-256 for broader compatibility.'
    },
    'SHA-256': {
      level: 'strong',
      description: 'Industry standard, widely adopted and secure',
      recommendation: 'Excellent choice for most applications requiring cryptographic hashing.'
    },
    'SHA-384': {
      level: 'strong',
      description: 'Higher security margin than SHA-256',
      recommendation: 'Good for high-security applications requiring larger hash outputs.'
    },
    'SHA-512': {
      level: 'very-strong',
      description: 'Maximum security of SHA-2 family',
      recommendation: 'Excellent for high-security applications and digital signatures.'
    },
    'bcrypt': {
      level: 'very-strong',
      description: 'Adaptive cost, salt included, designed for passwords',
      recommendation: 'Excellent for password hashing, adjust cost parameter as needed.'
    },
    'scrypt': {
      level: 'very-strong',
      description: 'Memory-hard function, resistant to ASIC attacks',
      recommendation: 'Excellent for password hashing, especially against specialized hardware.'
    },
    'Argon2': {
      level: 'very-strong',
      description: 'Winner of password hashing competition, state-of-the-art',
      recommendation: 'Best choice for new password hashing implementations.'
    }
  };

  return strengthMap[hashType] || {
    level: 'moderate',
    description: 'Hash strength cannot be determined',
    recommendation: 'Research the specific hash algorithm for security recommendations.'
  };
}
