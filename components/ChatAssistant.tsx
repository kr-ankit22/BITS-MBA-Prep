import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { createChatSession, sendMessageStream } from '../services/geminiService';
import { IconSparkles, IconSend, IconX } from './Icons';
import { Chat, GenerateContentResponse } from "@google/genai";

const QUIRKY_QUOTES = [
  "🤖 'I'm not lazy, I'm just in energy-saving mode!' - Your AI Assistant",
  "🧠 'Teaching AI to be smart is like teaching a cat to fetch... we're getting there!'",
  "⚡ 'Currently downloading intelligence... 99% complete (stuck at 99% for 3 years)'",
  "🎓 'I'm still in AI school. Please check back after I graduate!'",
  "🔮 'Magic 8-Ball says: Ask again later (when I'm fully trained)'",
  "🚀 'Houston, we have a problem... I'm still learning to fly!'",
  "☕ 'AI Assistant is on a coffee break. BRB in 2-3 business days.'",
  "🎯 'Accuracy: 60% of the time, it works every time... we're working on it!'",
  "🧪 'Warning: This AI is still in beta. Side effects may include random wisdom.'",
  "🎨 'I'm like a Picasso painting - abstract and still being interpreted!'"
];

const ChatAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showQuirkyQuote, setShowQuirkyQuote] = useState(false);
  const [currentQuote, setCurrentQuote] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'init', role: 'model', text: 'Hi! I am your BITS Placement AI Assistant. Ask me about interview topics, company details, or specific technical concepts.', timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && !chatSessionRef.current) {
      try {
        chatSessionRef.current = createChatSession();
      } catch (e) {
        console.error("Failed to init chat", e);
        setMessages(prev => [...prev, { id: 'err', role: 'model', text: 'Error: API Key missing or invalid.', timestamp: new Date(), isError: true }]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSessionRef.current) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const streamResult = await sendMessageStream(chatSessionRef.current, userMsg.text);

      // Create placeholder for model response
      const modelMsgId = (Date.now() + 1).toString();
      setMessages(prev => [...prev, {
        id: modelMsgId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      let fullText = '';

      for await (const chunk of streamResult) {
        const c = chunk as GenerateContentResponse;
        const textChunk = c.text || '';
        fullText += textChunk;

        setMessages(prev => prev.map(msg =>
          msg.id === modelMsgId ? { ...msg, text: fullText } : msg
        ));
      }

    } catch (error) {
      console.error("Chat error", error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: "I'm sorry, I encountered an error processing your request. Please try again.",
        timestamp: new Date(),
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssistantClick = () => {
    const randomQuote = QUIRKY_QUOTES[Math.floor(Math.random() * QUIRKY_QUOTES.length)];
    setCurrentQuote(randomQuote);
    setShowQuirkyQuote(true);
  };

  return (
    <>
      {/* Trigger Button */}
      {!isOpen && (
        <button
          onClick={handleAssistantClick}
          className="fixed bottom-6 right-6 bg-bits-blue text-white p-4 rounded-full shadow-2xl hover:bg-blue-800 transition-all z-50 flex items-center gap-2"
        >
          <IconSparkles className="w-6 h-6" />
          <span className="font-semibold">AI Assistant</span>
        </button>
      )}

      {/* Quirky Quote Modal */}
      {showQuirkyQuote && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 fade-in duration-300">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <div className="bg-bits-blue bg-opacity-10 p-4 rounded-full">
                  <IconSparkles className="w-12 h-12 text-bits-blue" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">AI Assistant</h3>
                <p className="text-sm text-gray-500 mb-4">Feature Under Development</p>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 border-l-4 border-bits-gold p-5 rounded-lg shadow-sm">
                <p className="text-gray-800 text-base leading-relaxed italic font-medium">
                  {currentQuote}
                </p>
              </div>

              <div className="text-xs text-gray-400">
                🚧 We're working hard to bring you an amazing AI experience!
              </div>

              <button
                onClick={() => setShowQuirkyQuote(false)}
                className="w-full bg-bits-blue text-white py-3 px-6 rounded-xl font-semibold hover:bg-blue-800 transition-colors"
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[90vw] sm:w-[400px] h-[600px] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="bg-bits-blue text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <IconSparkles className="w-5 h-5 text-bits-gold" />
              <h3 className="font-bold">BITS Placement AI</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-bits-gold transition-colors">
              <IconX className="w-6 h-6" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                    ? 'bg-bits-blue text-white rounded-tr-none'
                    : msg.isError
                      ? 'bg-red-100 text-red-800 rounded-tl-none'
                      : 'bg-white text-gray-800 border border-gray-200 shadow-sm rounded-tl-none'
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-200 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex gap-2 relative">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about questions, SQL..."
                className="flex-1 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-bits-blue focus:border-transparent bg-gray-50"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-bits-gold text-bits-blue p-3 rounded-xl hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconSend className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs text-center text-gray-400 mt-2">
              Powered by Gemini 2.5 Flash. Results may vary.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatAssistant;
