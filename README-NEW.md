# Servo Hasher Modern

A modern, React-based hash identification and decryption tool. Built with TypeScript, Vite, and deployed on GitHub Pages.

## 🚀 Features

- **Hash Identification**: Automatically detect hash types (MD5, SHA-1, SHA-256, SHA-512, bcrypt, and more)
- **Hash Decryption**: Attempt to crack hashes using dictionary attacks and rainbow tables
- **Modern UI**: Beautiful, responsive interface with dark theme
- **TypeScript**: Fully typed for better developer experience
- **GitHub Pages Ready**: Static deployment without server requirements
- **Educational Tool**: Perfect for security research and learning

## 🛠 Technology Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Crypto-JS** - Cryptographic functions
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with animations

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YourUsername/servo-hash-modern.git
cd servo-hash-modern

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173/servo-hash-modern/` to see the application.

### Building for Production

```bash
# Build the project
npm run build

# Preview the production build
npm run preview
```

## 🚀 Deployment to GitHub Pages

1. **Update the base URL** in `vite.config.ts`:
   ```typescript
   base: '/your-repository-name/'
   ```

2. **Deploy to GitHub Pages**:
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages** in your repository settings:
   - Go to Settings → Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch
   - Select "/ (root)" folder

## 📖 Usage

### Hash Identification

1. Navigate to the **Identifier** page
2. Paste your hash in the input field
3. Click "Identify Hash" to analyze
4. View detailed results including:
   - Hash type and confidence level
   - Security strength assessment
   - Characteristics and recommendations

### Hash Decryption

1. Navigate to the **Decrypter** page
2. Paste the hash you want to crack
3. Select hash types to attempt
4. Click "Start Cracking" to begin
5. View results showing:
   - Attack methods used
   - Success/failure status
   - Execution time
   - Cracked plaintext (if successful)

## 🔧 Supported Hash Types

### Identification
- MD5 (32 hex characters)
- SHA-1 (40 hex characters)
- SHA-224 (56 hex characters)
- SHA-256 (64 hex characters)
- SHA-384 (96 hex characters)
- SHA-512 (128 hex characters)
- bcrypt (starts with $2a$, $2b$, etc.)
- scrypt (starts with $scrypt$)
- Argon2 (starts with $argon2)
- NTLM (32 hex characters)
- MySQL passwords (old and new format)
- Base64 encoded hashes

### Decryption
- MD5
- SHA-1
- SHA-224
- SHA-256
- SHA-384
- SHA-512

## ⚠️ Disclaimer

This tool is for **educational and security research purposes only**. Only attempt to crack hashes that you own or have explicit permission to test. Unauthorized hash cracking may violate laws and terms of service.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Crypto-JS](https://github.com/brix/crypto-js) for cryptographic functions
- [Lucide](https://lucide.dev/) for beautiful icons
- [React](https://reactjs.org/) team for the amazing framework
- [Vite](https://vitejs.dev/) for the fast build tool

## 🔗 Links

- [Live Demo](https://yourusername.github.io/servo-hash-modern/)
- [Original Ember.js Version](https://github.com/ServoCorp/Servo-Hash)
- [Report Issues](https://github.com/YourUsername/servo-hash-modern/issues)

---

**Built with ❤️ by Servo Corp**
