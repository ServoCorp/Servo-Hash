# Servo Hash - Modern Hash Analysis Tool

Hey there! 👋 Welcome to the completely revamped version of Servo Hash. I decided to give this project a total makeover, moving from the old Ember.js version to a shiny new React + TypeScript setup. Why? Because sometimes you just gotta modernize, and honestly, the old version was showing its age.

## What This Thing Does

So basically, this tool helps you identify and crack hashes. You know, those cryptic strings that look like someone smashed their keyboard but are actually important for security stuff. Here's what you can do:

- **Figure out what type of hash you're looking at** - Is it MD5? SHA-256? Something else entirely? This tool will tell you.
- **Try to crack the hash** - Using dictionary attacks, rainbow tables, and some good old-fashioned brute force (within reason).
- **Learn about hash security** - See how strong different hashes are and get recommendations.

Perfect if you're into cybersecurity, doing CTF challenges, or just curious about how this stuff works.

## The Tech Behind It

I went with modern tools because life's too short for outdated frameworks:

- **React 19** with hooks (because who writes class components anymore?)
- **TypeScript** (type safety is your friend, trust me)
- **Vite** (blazing fast builds, seriously)
- **React Router** for navigation
- **Crypto-JS** for the actual hash calculations
- **Lucide React** for those crisp icons

## Getting Started

Alright, let's get you up and running. First, make sure you've got Node.js installed (v18 or newer - anything older and we're not friends).

```bash
# Grab the code
git clone https://github.com/ServoCorp/Servo-Hash.git
cd Servo-Hash

# Install the dependencies (grab a coffee, this might take a minute)
npm install

# Fire it up!
npm run dev
```

Then just open your browser and go to `http://localhost:5173/Servo-Hash/`. You should see the app running locally.

## How to Use This Thing

### Hash Identification
1. Click on "Identifier" in the nav
2. Paste your mysterious hash into the box
3. Hit "Identify Hash" and watch the magic happen
4. You'll get info about what type it is, how secure it is, and some nerdy details

### Hash Cracking
1. Jump over to the "Decrypter" section
2. Drop in the hash you want to crack
3. Click "Attempt Decryption"
4. Cross your fingers and hope it's something simple like "password123"

The cracking uses multiple methods - it'll try rainbow tables first (super fast), then dictionary attacks with common passwords, and finally some limited brute force if you're lucky.

## What Hashes Work?

### For Identification (I can spot these):
- MD5, SHA-1, SHA-224, SHA-256, SHA-384, SHA-512
- bcrypt, scrypt, Argon2
- NTLM hashes
- MySQL password hashes
- Base64 encoded stuff
- And a bunch more

### For Cracking (I can attempt these):
- MD5, SHA-1, SHA-256 family
- Basically the common ones that people actually use

## Important Legal Stuff

Look, I gotta say this: **Only use this on hashes you own or have permission to test**. Don't be that person who goes around trying to crack random hashes they found online. That's not cool and could get you in trouble. This is meant for learning, security research, and legitimate testing.

## Want to Contribute?

Found a bug? Have a cool idea? Want to add support for more hash types? Awesome! Feel free to:

1. Fork this repo
2. Make your changes
3. Send me a pull request
4. I'll take a look and probably merge it (unless you did something weird)

## Building for Production

If you want to build this yourself:

```bash
npm run build
```

The built files end up in the `dist` folder. You can deploy these anywhere that serves static files.

## Deployment

I've got this set up to deploy to GitHub Pages automatically. Every time I push to the main branch, GitHub Actions builds and deploys it. Pretty neat, right?

You can check out the live version at: **https://servocorp.github.io/Servo-Hash/**

## Credits and Thanks

Shoutout to the awesome libraries that made this possible:
- Crypto-JS for doing the heavy cryptographic lifting
- The React team for making web development fun again
- Lucide for the beautiful icons
- Vite for making builds actually fast

## A Quick Note

This project started as a simple Ember.js hash tool back in 2023. But technology moves fast, and so do I. This React version is faster, prettier, and way more capable than the original. Sometimes you just gotta tear it all down and build it back up better.

---

Built with genuine enthusiasm (and probably too much coffee) by **Servo Corp** ☕✨

*P.S. - If you find any bugs, please don't judge me too harshly. I'm only human.*
