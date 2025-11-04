export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { message, mode, history } = req.body;

  try {
    // Gemini API integration
    const prompt = `${getNimmoPrompt(mode)}\n\nUser: ${message}`;
    
    const aiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await aiResponse.json();
    const response = data.candidates[0].content.parts[0].text;

    // Check for pronunciation/grammar errors
    const corrections = checkForCorrections(message);

    res.status(200).json({
      response,
      corrections: corrections.length > 0 ? corrections.join('. ') : null
    });

  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      response: "I'm sorry, I'm having technical difficulties. Please try again later." 
    });
  }
}

function getNimmoPrompt(mode) {
  const basePrompt = `You are Nimmo, a professional English speaking bot designed to help users improve their English. You are friendly, encouraging, and patient. Always respond in clear, proper English.`;

  switch (mode) {
    case 'conversation':
      return `${basePrompt} Engage in natural conversation on any topic. Help users practice speaking English fluently. If they make mistakes, gently correct them and explain why.`;
    
    case 'vocabulary':
      return `${basePrompt} Focus on vocabulary building. Introduce new words, explain their meanings, provide examples, and help users remember them through context and usage.`;
    
    case 'writing':
      return `${basePrompt} Help users improve their writing skills. Review their text, suggest improvements, explain grammar rules, and provide writing tips.`;
    
    default:
      return basePrompt;
  }
}

function checkForCorrections(text) {
  const corrections = [];
  
  // Basic grammar checks
  const commonMistakes = [
    { wrong: /\bi am going to went\b/gi, correct: 'I am going to go', explanation: 'Use "go" after "going to"' },
    { wrong: /\bhe don't\b/gi, correct: 'he doesn\'t', explanation: 'Use "doesn\'t" with he/she/it' },
    { wrong: /\bshe don't\b/gi, correct: 'she doesn\'t', explanation: 'Use "doesn\'t" with he/she/it' },
    { wrong: /\bit don't\b/gi, correct: 'it doesn\'t', explanation: 'Use "doesn\'t" with he/she/it' },
    { wrong: /\bi can able to\b/gi, correct: 'I can' or 'I am able to', explanation: 'Don\'t use "can" and "able to" together' }
  ];

  commonMistakes.forEach(mistake => {
    if (mistake.wrong.test(text)) {
      corrections.push(`"${text.match(mistake.wrong)[0]}" should be "${mistake.correct}". ${mistake.explanation}`);
    }
  });

  return corrections;
}