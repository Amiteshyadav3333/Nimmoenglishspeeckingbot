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

### 3. Configure AI API
Edit `pages/api/chat.js` and replace:
- `YOUR_AI_API_ENDPOINT` with your AI service endpoint (OpenAI, Claude, etc.)
- `YOUR_API_KEY` with your actual API key

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

## API Integration

The bot supports multiple AI providers. Update the API endpoint in `pages/api/chat.js`:

### OpenAI Example:
```javascript
const aiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
  },
  body: JSON.stringify({
    model: 'gpt-3.5-turbo',
    messages: messages
  })
});
```

### Environment Variables
Create `.env.local` file:
```
OPENAI_API_KEY=your_api_key_here
```

## Usage

1. **Conversation Mode**: Chat naturally about any topic
2. **Vocabulary Mode**: Learn new words and their usage
3. **Writing Mode**: Get feedback on your writing
4. **Voice Input**: Click the microphone to speak
5. **Audio Output**: Click the speaker icon to hear responses

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