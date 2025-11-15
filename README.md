# Nimmo - Professional English Speaking Bot

Nimmo is a professional English learning companion that helps users improve their English through conversation, vocabulary building, and writing practice.

## Features

- 🎤 **Voice Recognition**: Speak directly to Nimmo using your microphone
- 🔊 **Text-to-Speech**: Nimmo speaks back to help with pronunciation
- 💬 **Conversation Mode**: Practice natural English conversation on any topic
- 📚 **Vocabulary Mode**: Learn new words with explanations and examples
- ✍️ **Writing Mode**: Improve writing skills with feedback and corrections
- 🔧 **Grammar Correction**: Automatic detection and correction of common mistakes
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Add Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Gemini API
Get your Gemini API key from Google AI Studio and add it to `.env.local`:
```
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 4. Run Development Server
```bash
npm run dev
```

### 5. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

## Gemini API Integration

This bot uses Google's Gemini AI. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey).

### Environment Variables
Create `.env.local` file:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### For Vercel Deployment:
Add environment variable in Vercel dashboard:
- Name: `GEMINI_API_KEY`
- Value: Your actual Gemini API key

## Usage

1. **Conversation Mode**: Chat naturally about any topic
2. **Vocabulary Mode**: Learn new words and their usage
3. **Writing Mode**: Get feedback on your writing
4. **Voice Input**: Click the microphone to speak
5. **Audio Output**: Click the speaker icon to hear responses

## Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Add it to your `.env.local` file

## Customization

- Modify prompts in `getNimmoPrompt()` function
- Add more grammar rules in `checkForCorrections()`
- Customize UI colors in `tailwind.config.js`
- Add new learning modes by extending the mode system

## Browser Compatibility

- Chrome/Edge: Full support including voice recognition
- Firefox: Text-to-speech only (no voice input)
- Safari: Limited voice features

## License

MIT License - Feel free to modify and use for your projects.