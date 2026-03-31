'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Loader2, Sparkles, Trophy, PhoneCall, MessageSquare } from 'lucide-react';
import { useAuth } from '@/components/FirebaseProvider';
import { extractIntent } from '@/lib/ai';
import { calculateLeadScore, calculateScholarship } from '@/lib/scoring';
import { saveLead, saveConversation, saveScholarship } from '@/lib/firestore-utils';
import { triggerWorkflow } from '@/lib/workflow';
import Link from 'next/link';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
  type?: 'text' | 'scholarship' | 'score' | 'call';
  data?: any;
}

export default function ChatPage() {
  const { user, loading: authLoading } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI Admissions Assistant. I can help you find the right course and check your scholarship eligibility. What course are you interested in?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [stage, setStage] = useState('interest'); // interest -> budget -> timeline -> marks -> completed
  const [leadData, setLeadData] = useState<any>({
    interest: null,
    budget: null,
    timeline: null,
    marks: null
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const addMessage = (text: string, sender: 'bot' | 'user', type: Message['type'] = 'text', data?: any) => {
    const newMessage: Message = {
      id: Math.random().toString(36).substring(7),
      text,
      sender,
      timestamp: new Date(),
      type,
      data
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMessage = input.trim();
    setInput('');
    addMessage(userMessage, 'user');
    setIsTyping(true);

    try {
      // AI Intent Extraction
      const intent = await extractIntent(userMessage);
      console.log("Extracted Intent:", intent);

      const updatedLeadData = {
        ...leadData,
        interest: intent?.interest || leadData.interest,
        budget: intent?.budget || leadData.budget,
        timeline: intent?.timeline || leadData.timeline,
        marks: intent?.marks || leadData.marks
      };
      setLeadData(updatedLeadData);

      // Logic based on stage
      let botResponse = "";
      let nextStage = stage;

      if (stage === 'interest') {
        botResponse = "That sounds great! What is your approximate budget for the course?";
        nextStage = 'budget';
      } else if (stage === 'budget') {
        botResponse = "Got it. When are you planning to start? (e.g., Immediate, in 3 months)";
        nextStage = 'timeline';
      } else if (stage === 'timeline') {
        botResponse = "Perfect. Lastly, could you share your previous academic marks (percentage) to check for scholarships?";
        nextStage = 'marks';
      } else if (stage === 'marks') {
        // Final Processing
        const marks = updatedLeadData.marks || parseFloat(userMessage);
        const scholarship = calculateScholarship(marks);
        const { score, category } = calculateLeadScore(
          updatedLeadData.interest,
          updatedLeadData.budget,
          updatedLeadData.timeline
        );

        // Save to Firestore if user is logged in
        if (user) {
          await saveLead({
            userId: user.uid,
            score,
            category,
            status: 'New',
            interest: updatedLeadData.interest,
            budget: updatedLeadData.budget,
            timeline: updatedLeadData.timeline
          });
          await saveScholarship(user.uid, marks, scholarship);
          await saveConversation(user.uid, messages, 'completed');
          await triggerWorkflow(score, category, user.uid);
        }

        addMessage(`Based on your marks (${marks}%), you are eligible for a **${scholarship}% scholarship**!`, 'bot', 'scholarship', { percentage: scholarship });
        addMessage(`Your lead score is **${score}** (${category}).`, 'bot', 'score', { score, category });
        
        if (category === 'Hot') {
          addMessage("You're a high-priority lead! A counselor will call you instantly.", 'bot', 'call');
        } else {
          addMessage("Thank you for sharing the details. Our team will get back to you soon.", 'bot');
        }
        
        botResponse = "Is there anything else I can help you with?";
        nextStage = 'completed';
      } else {
        botResponse = "I've noted your details. You can view your status in the dashboard.";
      }

      setTimeout(() => {
        addMessage(botResponse, 'bot');
        setStage(nextStage);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error("Chat Error:", error);
      addMessage("Sorry, I encountered an error. Please try again.", 'bot');
      setIsTyping(false);
    }
  };

  if (authLoading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-indigo-600" size={48} /></div>;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-10">
        <Link href="/" className="flex items-center gap-2">
          <Bot className="text-indigo-600" size={24} />
          <span className="font-bold text-lg">EdTech AI Assistant</span>
        </Link>
        <div className="flex items-center gap-4">
          {!user && <span className="text-xs text-amber-600 font-medium bg-amber-50 px-2 py-1 rounded">Sign in to save progress</span>}
          <Link href="/dashboard" className="text-sm font-medium text-slate-600 hover:text-indigo-600">Dashboard</Link>
        </div>
      </header>

      {/* Chat Area */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 flex flex-col gap-4 overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-2 space-y-6 scroll-smooth"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-white border border-slate-200 shadow-sm'}`}>
                    {msg.sender === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-indigo-600" />}
                  </div>
                  <div className="space-y-2">
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'
                    }`}>
                      {msg.text}
                    </div>

                    {/* Special Message Types */}
                    {msg.type === 'scholarship' && (
                      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4">
                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                          <Trophy className="text-amber-600" size={20} />
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Scholarship Reward</div>
                          <div className="text-2xl font-bold text-amber-900">{msg.data.percentage}% OFF</div>
                        </div>
                      </div>
                    )}

                    {msg.type === 'score' && (
                      <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <Sparkles className="text-indigo-600" size={20} />
                          </div>
                          <div>
                            <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Lead Category</div>
                            <div className="text-lg font-bold text-indigo-900">{msg.data.category}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Score</div>
                          <div className="text-xl font-bold text-indigo-600">{msg.data.score}</div>
                        </div>
                      </div>
                    )}

                    {msg.type === 'call' && (
                      <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-center gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <PhoneCall className="text-green-600" size={20} />
                        </div>
                        <div className="text-sm font-bold text-green-800">Connecting you to a counselor...</div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <div className="flex justify-start gap-3">
              <div className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center">
                <Bot size={16} className="text-indigo-600" />
              </div>
              <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce [animation-delay:0.4s]"></span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="bg-white border border-slate-200 p-2 rounded-3xl shadow-lg flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-sm"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send size={20} />
          </button>
        </div>
        <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">Powered by Gemini AI</p>
      </main>
    </div>
  );
}
