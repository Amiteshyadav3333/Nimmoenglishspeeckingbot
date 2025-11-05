import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Volume2, BookOpen, PenTool } from 'lucide-react';

export default function NimmoBot() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: "Hello! I'm Nimmo, your English speaking companion. Let's practice English together! 🌟" }
  ]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [currentMode, setCurrentMode] = useState('conversation');
  const [voiceOnlyMode, setVoiceOnlyMode] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      recognitionRef.current = new window.webkitSpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        setIsListening(false);
        
        // Auto-send in voice-only mode
        if (voiceOnlyMode) {
          setTimeout(() => {
            sendMessage();
          }, 500);
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, [voiceOnlyMode]);

  // Auto-start listening when voice-only mode is enabled
  useEffect(() => {
    if (voiceOnlyMode && !isListening) {
      setTimeout(() => {
        startListening();
      }, 1000);
    }
  }, [voiceOnlyMode]);

  const startListening = () => {
    if (recognitionRef.current) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.8;
    speechSynthesis.speak(utterance);
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage = { type: 'user', text: inputText };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: inputText, 
          mode: currentMode,
          history: messages 
        })
      });

      const data = await response.json();
      const botMessage = { type: 'bot', text: data.response };
      setMessages(prev => [...prev, botMessage]);
      
      if (data.corrections) {
        const correctionMessage = { 
          type: 'correction', 
          text: data.corrections,
          original: inputText 
        };
        setMessages(prev => [...prev, correctionMessage]);
      }

      speakText(data.response);
      
      // Auto-listen after bot speaks in voice-only mode
      if (voiceOnlyMode) {
        setTimeout(() => {
          startListening();
        }, 2000);
      }
    } catch (error) {
      const errorMessage = { type: 'bot', text: "Sorry, I'm having trouble right now. Please try again!" };
      setMessages(prev => [...prev, errorMessage]);
    }

    setInputText('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-center">Nimmo - English Speaking Bot</h1>
                <p className="text-center mt-2 opacity-90">Your Professional English Learning Companion</p>
              </div>
              <button
                onClick={() => setVoiceOnlyMode(!voiceOnlyMode)}
                className={`px-4 py-2 rounded-lg border-2 transition-colors ${
                  voiceOnlyMode 
                    ? 'bg-white text-blue-600 border-white' 
                    : 'bg-transparent text-white border-white hover:bg-white hover:text-blue-600'
                }`}
              >
                🎤 Voice Only
              </button>
            </div>
          </div>

          <div className="p-4 bg-gray-50 border-b">
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setCurrentMode('conversation')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentMode === 'conversation' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
              >
                <Volume2 size={16} />
                <span>Conversation</span>
              </button>
              <button
                onClick={() => setCurrentMode('vocabulary')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentMode === 'vocabulary' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
              >
                <BookOpen size={16} />
                <span>Vocabulary</span>
              </button>
              <button
                onClick={() => setCurrentMode('writing')}
                className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
                  currentMode === 'writing' ? 'bg-blue-500 text-white' : 'bg-white text-gray-700'
                }`}
              >
                <PenTool size={16} />
                <span>Writing</span>
              </button>
            </div>
          </div>

          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.type === 'correction'
                    ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {message.type === 'correction' && (
                    <div className="text-sm font-semibold mb-1">Correction:</div>
                  )}
                  <p className="text-sm">{message.text}</p>
                  {message.type === 'bot' && (
                    <button
                      onClick={() => speakText(message.text)}
                      className="mt-2 text-blue-500 hover:text-blue-700"
                    >
                      <Volume2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50 border-t">
            {voiceOnlyMode ? (
              <div className="flex justify-center">
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-8 py-4 rounded-full text-white text-lg font-semibold transition-all ${
                    isListening 
                      ? 'bg-red-500 animate-pulse shadow-lg' 
                      : 'bg-blue-500 hover:bg-blue-600 shadow-md'
                  }`}
                >
                  {isListening ? (
                    <div className="flex items-center space-x-2">
                      <MicOff size={24} />
                      <span>Listening...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mic size={24} />
                      <span>Tap to Speak</span>
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message or use voice..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={isListening ? stopListening : startListening}
                  className={`px-4 py-2 rounded-lg ${
                    isListening ? 'bg-red-500 text-white' : 'bg-blue-500 text-white'
                  } hover:opacity-80`}
                >
                  {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                </button>
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <Send size={20} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}