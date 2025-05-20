import React, { useState, useRef, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, MessageSquare, Send, BookOpen, Star, Clock, ThumbsUp, ThumbsDown, Bookmark, Shield, AlertTriangle, CheckCircle, Info, User, Menu, X, Settings, LogOut, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAuth } from "@/contexts/AuthContext";

// Define interfaces for our chat functionality
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  references?: {
    title: string;
    source: string;
    link?: string;
  }[];
  confidence?: number; // 0-100
  isBookmarked?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FinancialMuftiPage = () => {
  const { user } = useAuth();
  
  // State for chat functionality
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Predefined topics for Islamic finance questions
  const topics: Topic[] = [
    {
      id: '1',
      title: 'Riba (Interest)',
      description: 'Understanding interest-free finance and alternatives to conventional banking',
      icon: <AlertTriangle className="h-5 w-5 text-red-400" />
    },
    {
      id: '2',
      title: 'Zakat Calculation',
      description: 'How to calculate zakat on different types of assets and investments',
      icon: <Shield className="h-5 w-5 text-green-400" />
    },
    {
      id: '3',
      title: 'Halal Investments',
      description: 'Guidance on Shariah-compliant investment opportunities',
      icon: <CheckCircle className="h-5 w-5 text-lavender" />
    },
    {
      id: '4',
      title: 'Sukuk (Islamic Bonds)',
      description: 'Understanding structure and compliance of Islamic bonds',
      icon: <BookOpen className="h-5 w-5 text-blue-400" />
    },
    {
      id: '5',
      title: 'Inheritance Planning',
      description: 'Islamic guidelines for wealth distribution and estate planning',
      icon: <Info className="h-5 w-5 text-yellow-400" />
    },
  ];
  
  // Manual scroll control - disabled automatic scrolling to prevent page issues
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      // Only scroll the chat container element, not the page
      const chatContainer = messagesEndRef.current.closest('.chat-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  };
  
  // Create a new chat session
  const createNewSession = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setChatSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSession.id);
    setMessages([]);
    setInputValue('');
    
    // Add welcome message
    setTimeout(() => {
      const welcomeMessage: Message = {
        id: 'welcome-' + newSession.id,
        role: 'assistant',
        content: `Assalamu alaikum${user?.name ? ' ' + user.name : ''}! I'm your Financial Mufti, powered by on-device Small Language Models to protect your privacy. How can I assist you with Islamic finance questions today?`,
        timestamp: new Date(),
      };
      setMessages([welcomeMessage]);
    }, 100);
  };
  
  // Select an existing chat session
  const selectSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setCurrentSessionId(sessionId);
      setMessages(session.messages);
      setInputValue('');
    }
  };
  
  // Handle sending a new message
  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputValue('');
    setIsProcessing(true);
    
    // Update current session
    if (currentSessionId) {
      const updatedSessions = chatSessions.map(session => {
        if (session.id === currentSessionId) {
          // Update session title based on first user message if it's still the default
          const title = session.title === 'New Chat' && session.messages.length === 0 
            ? userMessage.content.substring(0, 30) + (userMessage.content.length > 30 ? '...' : '')
            : session.title;
            
          return {
            ...session,
            title,
            messages: updatedMessages,
            updatedAt: new Date()
          };
        }
        return session;
      });
      setChatSessions(updatedSessions);
    } else {
      // Create new session if none exists
      createNewSession();
    }
    
    // Manually scroll after adding message
    setTimeout(scrollToBottom, 100);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate AI response (in a real implementation, this would call the SLM)
      const aiResponse = generateAIResponse(inputValue);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        references: aiResponse.references,
        confidence: aiResponse.confidence
      };
      
      const newMessages = [...updatedMessages, assistantMessage];
      setMessages(newMessages);
      
      // Update session with AI response
      if (currentSessionId) {
        const updatedSessions = chatSessions.map(session => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages: newMessages,
              updatedAt: new Date()
            };
          }
          return session;
        });
        setChatSessions(updatedSessions);
      }
      
      // Manually scroll after AI response
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your question. Please try again.',
        timestamp: new Date(),
      };
      
      const newMessages = [...updatedMessages, errorMessage];
      setMessages(newMessages);
      
      // Update session with error message
      if (currentSessionId) {
        const updatedSessions = chatSessions.map(session => {
          if (session.id === currentSessionId) {
            return {
              ...session,
              messages: newMessages,
              updatedAt: new Date()
            };
          }
          return session;
        });
        setChatSessions(updatedSessions);
      }
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle selecting a predefined topic
  const handleSelectTopic = (topic: Topic) => {
    setInputValue(`Tell me about ${topic.title} in Islamic finance`);
  };
  
  // Handle bookmarking a message
  const handleBookmark = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    // Toggle bookmark status
    const updatedMessages = messages.map(m => 
      m.id === messageId ? { ...m, isBookmarked: !m.isBookmarked } : m
    );
    
    setMessages(updatedMessages);
    
    // Update saved messages
    const bookmarkedMessage = updatedMessages.find(m => m.id === messageId);
    if (bookmarkedMessage?.isBookmarked) {
      setSavedMessages(prev => [...prev, bookmarkedMessage]);
    } else {
      setSavedMessages(prev => prev.filter(q => q.id !== messageId));
    }
    
    // Update session with bookmarked message
    if (currentSessionId) {
      const updatedSessions = chatSessions.map(session => {
        if (session.id === currentSessionId) {
          return {
            ...session,
            messages: updatedMessages,
            updatedAt: new Date()
          };
        }
        return session;
      });
      setChatSessions(updatedSessions);
    }
  };
  
  // Mock function to generate AI responses
  const generateAIResponse = (question: string): { content: string; references?: Message['references']; confidence: number } => {
    // This is a simplified mock implementation
    // In a real app, this would call the on-device SLM
    
    const responses = [
      {
        content: "In Islamic finance, interest (riba) is strictly prohibited. This prohibition extends to both giving and receiving interest. Instead, Islamic finance promotes profit-and-loss sharing arrangements and asset-backed transactions. Common alternatives to interest-based loans include Murabaha (cost-plus financing), Ijara (leasing), and Musharaka (partnership financing).",
        references: [
          { title: "Quran", source: "Surah Al-Baqarah 2:275-280", link: "#" },
          { title: "AAOIFI Shariah Standard", source: "No. 21: Financial Paper", link: "#" }
        ],
        confidence: 95,
        keywords: ['riba', 'interest', 'prohibition', 'haram']
      },
      {
        content: "Zakat on investments is typically calculated at 2.5% of the total value of your investment assets that have been held for a full lunar year (hawl). This includes stocks, mutual funds, ETFs, and sukuk. For investments with mixed income sources, purification may be required before calculating zakat. It's important to consult with a qualified scholar for your specific situation.",
        references: [
          { title: "Accounting Standard", source: "AAOIFI Shariah Standard No. 35: Zakat", link: "#" },
          { title: "Scholarly Opinion", source: "Dr. Monzer Kahf on Investment Zakat", link: "#" }
        ],
        confidence: 90,
        keywords: ['zakat', 'calculation', 'investment', 'hawl']
      },
      {
        content: "Islamic inheritance (mirath) follows specific rules outlined in the Quran and Sunnah. The distribution of assets is predetermined with fixed shares for different heirs. Before distribution, funeral expenses, debts, and bequests (up to 1/3 of the estate) must be settled. It's advisable to consult with an Islamic scholar familiar with inheritance laws to ensure compliance with Shariah principles.",
        references: [
          { title: "Quran", source: "Surah An-Nisa 4:11-12", link: "#" },
          { title: "Scholarly Work", source: "Al-Mawaris fil-Shariah al-Islamiyyah", link: "#" }
        ],
        confidence: 92,
        keywords: ['inheritance', 'mirath', 'estate planning', 'wasiyah']
      }
    ];
    
    // Simple keyword matching to select a response
    const lowerQuestion = question.toLowerCase();
    for (const response of responses) {
      if (response.keywords?.some(keyword => lowerQuestion.includes(keyword))) {
        return {
          content: response.content,
          references: response.references,
          confidence: response.confidence
        };
      }
    }
    
    // Default response if no keywords match
    return {
      content: "Thank you for your question about Islamic finance. While I'm trained on Islamic jurisprudence and financial principles, I'd need more specific details to provide a precise answer. Could you please elaborate on your question? I'm here to help with topics like halal investments, riba (interest), zakat, inheritance planning, and other aspects of Shariah-compliant finance.",
      confidence: 75
    };
  };
  
  // Initialize with a new chat session on component mount
  useEffect(() => {
    if (chatSessions.length === 0) {
      createNewSession();
    }
  }, []);
  
  // Disable automatic scrolling on the page
  useEffect(() => {
    // Save the original styles
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalHtmlStyle = window.getComputedStyle(document.documentElement).scrollBehavior;
    
    // Apply styles to prevent automatic scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    document.body.style.overscrollBehavior = 'none';
    
    return () => {
      // Restore original styles when component unmounts
      document.documentElement.style.scrollBehavior = originalHtmlStyle;
      document.body.style.overscrollBehavior = 'auto';
    };
  }, []);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    setTimeout(scrollToBottom, 100);
  }, [messages]);
  
  return (
    <div className="min-h-screen flex flex-col bg-background" style={{ overscrollBehavior: 'none' }}>
      <Navbar />
      
      {/* Main Chat Interface */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`bg-black/20 backdrop-blur-sm border-r border-white/10 flex flex-col transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
          {isSidebarOpen && (
            <>
              <div className="p-4 border-b border-white/10">
                <Button 
                  onClick={createNewSession} 
                  className="w-full bg-lavender hover:bg-lavender/90 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  New Chat
                </Button>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                  <h3 className="text-xs uppercase text-white/50 font-medium px-2 py-1">Recent Chats</h3>
                  <div className="space-y-1 mt-1">
                    {chatSessions.map(session => (
                      <div 
                        key={session.id} 
                        className={`flex items-center p-2 rounded-lg cursor-pointer hover:bg-white/5 ${currentSessionId === session.id ? 'bg-white/10' : ''}`}
                        onClick={() => selectSession(session.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-2 text-white/70" />
                        <div className="flex-1 truncate text-sm">{session.title}</div>
                        <div className="text-xs text-white/50">
                          {new Date(session.updatedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="p-2 mt-4">
                  <h3 className="text-xs uppercase text-white/50 font-medium px-2 py-1">Suggested Topics</h3>
                  <div className="space-y-1 mt-1">
                    {topics.map(topic => (
                      <div 
                        key={topic.id} 
                        className="flex items-start p-2 rounded-lg cursor-pointer hover:bg-white/5"
                        onClick={() => handleSelectTopic(topic)}
                      >
                        <div className="mr-2 mt-0.5">
                          {topic.icon}
                        </div>
                        <div>
                          <div className="text-sm font-medium">{topic.title}</div>
                          <div className="text-xs text-white/50 mt-0.5">{topic.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-lavender" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{user?.name || 'User'}</div>
                    <div className="text-xs text-white/50">ZaryahX Member</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                    <Settings className="h-4 w-4 text-white/70" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 rounded-full hover:bg-white/10 mr-2"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
              <div>
                <h2 className="text-lg font-medium">Financial Mufti</h2>
                <div className="flex items-center">
                  <Badge className="bg-lavender/20 text-lavender border-none px-2 py-0.5 text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    On-Device SLM
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                <HelpCircle className="h-4 w-4 text-white/70" />
              </Button>
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 chat-container">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full py-20">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-lavender to-lavender/70 flex items-center justify-center mb-6 shadow-lg">
                    <Shield className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Welcome to Financial Mufti</h3>
                  <p className="text-white/70 text-center max-w-md mb-6">
                    Your personal Shariah-compliant finance advisor powered by on-device Small Language Models
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                    {topics.slice(0, 4).map(topic => (
                      <Button 
                        key={topic.id}
                        variant="outline" 
                        className="border-white/10 hover:bg-white/5 justify-start"
                        onClick={() => handleSelectTopic(topic)}
                      >
                        <div className="mr-2">
                          {topic.icon}
                        </div>
                        <span>{topic.title}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div key={message.id} className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      {message.role === 'assistant' && (
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lavender to-lavender/70 flex items-center justify-center mr-3 mt-1 shadow-md">
                          <Shield className="h-4 w-4 text-white" />
                        </div>
                      )}
                      
                      <div className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === 'user' 
                          ? 'bg-lavender/20 text-white' 
                          : 'bg-white/10 border border-white/10'
                      }`}>
                        <div className="prose prose-invert">
                          <p>{message.content}</p>
                        </div>
                        
                        {message.references && message.references.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <div className="text-xs text-white/50 mb-1">References:</div>
                            <div className="space-y-1">
                              {message.references.map((ref, index) => (
                                <div key={index} className="text-xs flex items-start">
                                  <BookOpen className="h-3 w-3 mr-1 mt-0.5 text-lavender/70" />
                                  <span>
                                    <span className="text-lavender/80">{ref.title}:</span> {ref.source}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {message.confidence && (
                          <div className="mt-2 flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-1.5 w-16 bg-white/10 rounded-full overflow-hidden mr-2">
                                <div 
                                  className="h-full bg-gradient-to-r from-green-400 to-lavender" 
                                  style={{ width: `${message.confidence}%` }}
                                ></div>
                              </div>
                              <span className="text-xs text-white/50">{message.confidence}% confidence</span>
                            </div>
                            
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-6 w-6 rounded-full hover:bg-white/10"
                              onClick={() => handleBookmark(message.id)}
                            >
                              <Bookmark className={`h-3 w-3 ${message.isBookmarked ? 'fill-lavender text-lavender' : 'text-white/50'}`} />
                            </Button>
                          </div>
                        )}
                      </div>
                      
                      {message.role === 'user' && (
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center ml-3 mt-1">
                          <User className="h-4 w-4 text-white/70" />
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {isProcessing && (
                    <div className="flex items-start">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-lavender to-lavender/70 flex items-center justify-center mr-3 mt-1 shadow-md">
                        <Shield className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-white/10 border border-white/10 rounded-lg px-4 py-3">
                        <div className="flex items-center space-x-1">
                          <div className="w-2 h-2 rounded-full bg-lavender/70 animate-pulse"></div>
                          <div className="w-2 h-2 rounded-full bg-lavender/70 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 rounded-full bg-lavender/70 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>
          </div>
          
          {/* Input Area */}
          <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
            <div className="max-w-3xl mx-auto">
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center space-x-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask about Islamic finance..."
                  className="flex-1 bg-white/5 border-white/10 focus:border-lavender/50 focus:ring-lavender/20"
                  disabled={isProcessing}
                />
                <Button 
                  type="submit" 
                  size="icon"
                  className="bg-lavender hover:bg-lavender/90 text-white"
                  disabled={!inputValue.trim() || isProcessing}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </form>
              <div className="flex items-center justify-center mt-2">
                <div className="flex items-center text-xs text-white/50">
                  <Shield className="h-3 w-3 mr-1 text-lavender/70" />
                  All processing happens on your device for maximum privacy
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FinancialMuftiPage;
