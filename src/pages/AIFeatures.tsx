import React, { useState, useRef, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, MessageSquare, Send, BookOpen, ThumbsUp, ThumbsDown, Bookmark, Shield, AlertTriangle, CheckCircle, Info, User, Menu, X, Settings, LogOut, HelpCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/contexts/AuthContext";
import { useLoading } from "@/contexts/LoadingContext";

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

const AIFeatures = () => {
  const { user } = useAuth();
  
  // State for chat functionality
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [savedMessages, setSavedMessages] = useState<Message[]>([]);
  const { showAdvisorLoading, setShowAdvisorLoading } = useLoading();
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
  
  // Generate AI response (mock implementation)
  const generateAIResponse = (question: string) => {
    // This is a mock implementation that would be replaced with actual SLM call
    const responses = [
      {
        content: `Islamic finance prohibits Riba (interest) as it's considered exploitative. Instead, Islamic banking uses profit-sharing arrangements (Mudarabah), partnerships (Musharakah), and cost-plus financing (Murabaha). These alternatives ensure fair transactions while avoiding interest-based systems that are forbidden in the Quran.`,
        references: [
          { title: 'Quran', source: 'Surah Al-Baqarah 2:275-280', link: '#' },
          { title: 'Hadith', source: 'Sahih Muslim, Book 10, Number 3881', link: '#' }
        ],
        confidence: 95
      },
      {
        content: `Zakat is obligatory for Muslims who possess wealth above a threshold (nisab) for one lunar year. For investments, calculate 2.5% of the total value of stocks, mutual funds, and other financial assets. Only include halal investments; profits from non-compliant sources should be given away entirely as charity, not as Zakat.`,
        references: [
          { title: 'Quran', source: 'Surah At-Tawbah 9:60', link: '#' },
          { title: 'Scholarly Opinion', source: 'AAOIFI Shariah Standard No. 35', link: '#' }
        ],
        confidence: 90
      },
      {
        content: `Sukuk (Islamic bonds) are Shariah-compliant financial certificates that represent ownership in an underlying asset, service, or investment. Unlike conventional bonds, sukuk holders share profits and risks of the underlying assets. The structure must avoid interest (riba), excessive uncertainty (gharar), and industries prohibited in Islam.`,
        references: [
          { title: 'Scholarly Opinion', source: 'AAOIFI Shariah Standard No. 17', link: '#' },
          { title: 'Islamic Finance Book', source: 'Introduction to Islamic Finance, M. Taqi Usmani, p.145', link: '#' }
        ],
        confidence: 88
      },
      {
        content: `In Islamic inheritance (Mirath), wealth distribution follows specific Quranic guidelines. Male heirs generally receive twice the share of female heirs in the same relationship category. This is balanced by men's financial responsibilities toward women in the family structure. The system ensures wealth circulation while protecting the rights of all family members.`,
        references: [
          { title: 'Quran', source: 'Surah An-Nisa 4:11-12', link: '#' },
          { title: 'Scholarly Opinion', source: 'Fiqh al-Mawarith, Ibn Rushd', link: '#' }
        ],
        confidence: 93
      }
    ];
    
    // Simple matching based on keywords in the question
    if (question.toLowerCase().includes('riba') || question.toLowerCase().includes('interest')) {
      return responses[0];
    } else if (question.toLowerCase().includes('zakat')) {
      return responses[1];
    } else if (question.toLowerCase().includes('sukuk') || question.toLowerCase().includes('bond')) {
      return responses[2];
    } else if (question.toLowerCase().includes('inherit') || question.toLowerCase().includes('estate')) {
      return responses[3];
    }
    
    // Default response for other questions
    return {
      content: `Islamic finance is based on principles derived from the Quran and Sunnah. The key principles include prohibition of interest (riba), excessive uncertainty (gharar), and gambling (maysir). Islamic finance promotes risk-sharing, asset-backed transactions, and ethical investments that avoid prohibited industries like alcohol, pork, and conventional financial services.`,
      references: [
        { title: 'Quran', source: 'Various verses', link: '#' },
        { title: 'Islamic Finance Book', source: 'Fundamentals of Islamic Finance, M. Ayub, p.75', link: '#' }
      ],
      confidence: 85
    };
  };
  
  // Initialize with a default session on component mount
  useEffect(() => {
    if (chatSessions.length === 0) {
      createNewSession();
    } else if (!currentSessionId && chatSessions.length > 0) {
      // Select the most recent session
      selectSession(chatSessions[0].id);
    }
  }, []);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Send message on Enter (not Shift+Enter)
      if (e.key === 'Enter' && !e.shiftKey && document.activeElement === document.getElementById('chat-input')) {
        e.preventDefault();
        handleSendMessage();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, messages, currentSessionId]);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Hide loading animation after component mount if it was triggered by navigation
  useEffect(() => {
    // If the loading animation is showing (triggered by navbar click)
    if (showAdvisorLoading) {
      // Simulate AI processing time
      setTimeout(() => {
        setShowAdvisorLoading(false);
      }, 3000); // Show for 3 seconds
    }
  }, [showAdvisorLoading, setShowAdvisorLoading]);
  
  // Loading animation component
  const AILoadingAnimation = () => {
    return (
      <div className="ai-loading-overlay">
        <div className="ai-loading-container">
          <div className="ai-loading-circle" style={{ width: '100%', height: '100%', opacity: 0.2 }}></div>
          <div className="ai-loading-circle" style={{ width: '80%', height: '80%', top: '10%', left: '10%', opacity: 0.4 }}></div>
          <div className="ai-loading-circle" style={{ width: '60%', height: '60%', top: '20%', left: '20%', opacity: 0.6 }}></div>
          <div className="ai-loading-ring"></div>
          <div className="ai-loading-ring"></div>
          <div className="ai-loading-ring"></div>
          
          {/* Neural network nodes */}
          <svg width="200" height="200" viewBox="0 0 200 200" className="absolute top-0 left-0">
            <defs>
              <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#9b87f5" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#9b87f5" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#9b87f5" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            
            {/* Nodes */}
            {[...Array(10)].map((_, i) => {
              const angle = (i / 10) * Math.PI * 2;
              const radius = 80;
              const x = 100 + radius * Math.cos(angle);
              const y = 100 + radius * Math.sin(angle);
              return (
                <circle 
                  key={`node-${i}`}
                  cx={x}
                  cy={y}
                  r="3"
                  fill="#9b87f5"
                  style={{ animation: `ai-thinking-pulse 1.5s infinite ${i * 0.2}s` }}
                />
              );
            })}
            
            {/* Connections */}
            {[...Array(15)].map((_, i) => {
              const startAngle = (i / 15) * Math.PI * 2;
              const endAngle = ((i + 5) / 15) * Math.PI * 2;
              const radius = 80;
              const x1 = 100 + radius * Math.cos(startAngle);
              const y1 = 100 + radius * Math.sin(startAngle);
              const x2 = 100 + radius * Math.cos(endAngle);
              const y2 = 100 + radius * Math.sin(endAngle);
              return (
                <line 
                  key={`connection-${i}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="url(#connection-gradient)"
                  strokeWidth="1"
                  strokeDasharray="5,5"
                  style={{ 
                    animation: `ai-data-flow 3s infinite linear ${i * 0.1}s`,
                    opacity: 0.7
                  }}
                />
              );
            })}
          </svg>
        </div>
        <div className="ai-loading-text">Initializing Islamic Finance Advisor</div>
        <div className="ai-loading-subtext">Activating on-device Small Language Models for Shariah-compliant guidance</div>
      </div>
    );
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background" style={{ overscrollBehavior: 'none' }}>
      <Navbar />
      {showAdvisorLoading ? (
        <AILoadingAnimation />
      ) : (
        <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className={`w-80 border-r bg-muted/30 flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-16'}`}>
          {/* Sidebar Header */}
          <div className="p-4 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-lavender" />
              {isSidebarOpen && <h2 className="font-semibold">Financial Mufti</h2>}
            </div>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-1 rounded-md hover:bg-muted"
            >
              {isSidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
          
          {/* New Chat Button */}
          <div className="p-3">
            <Button
              onClick={createNewSession}
              className="w-full bg-lavender hover:bg-lavender/90 justify-start gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              {isSidebarOpen && 'New Chat'}
            </Button>
          </div>
          
          {/* Chat History */}
          {isSidebarOpen && (
            <div className="flex-1 overflow-auto p-3">
              <div className="mb-4">
                <h3 className="text-xs font-medium text-muted-foreground mb-2">Recent Chats</h3>
                <div className="space-y-1">
                  {chatSessions.map(session => (
                    <button
                      key={session.id}
                      onClick={() => selectSession(session.id)}
                      className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center gap-2 ${
                        currentSessionId === session.id ? 'bg-accent' : 'hover:bg-muted'
                      }`}
                    >
                      <MessageSquare className="h-4 w-4 flex-shrink-0" />
                      <span className="truncate">{session.title}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Suggested Topics */}
              <div>
                <h3 className="text-xs font-medium text-muted-foreground mb-2">Suggested Topics</h3>
                <div className="space-y-1">
                  {topics.map(topic => (
                    <button
                      key={topic.id}
                      onClick={() => handleSelectTopic(topic)}
                      className="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted flex items-start gap-2"
                    >
                      <div className="flex-shrink-0 mt-0.5">{topic.icon}</div>
                      <div>
                        <div className="font-medium">{topic.title}</div>
                        <div className="text-xs text-muted-foreground">{topic.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {/* User Info */}
          {isSidebarOpen && (
            <div className="p-3 border-t">
              <div className="flex items-center gap-2 p-2 rounded-md hover:bg-muted cursor-pointer">
                <div className="h-8 w-8 rounded-full bg-lavender/20 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-lavender" />
                </div>
                <div className="flex-1 truncate">
                  <div className="text-sm font-medium truncate">{user?.name || 'Guest User'}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email || 'Sign in for personalized advice'}</div>
                </div>
                <div className="flex gap-1">
                  <button className="p-1 rounded-md hover:bg-accent">
                    <Settings className="h-4 w-4 text-muted-foreground" />
                  </button>
                  <button className="p-1 rounded-md hover:bg-accent">
                    <LogOut className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Chat Header */}
          <div className="border-b p-4 flex items-center justify-between bg-gradient-to-r from-lavender/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <Bot className="h-5 w-5 text-lavender mr-2" />
                <h3 className="font-semibold text-foreground">Financial Mufti</h3>
              </div>
              <div className="h-4 w-px bg-border mx-1"></div>
              <Badge variant="outline" className="bg-lavender/10 text-lavender">
                SLM
              </Badge>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Shield className="h-3 w-3 text-green-500" />
                <span>On-device processing for privacy</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-lavender/10 hover:text-lavender" title="Help">
                <HelpCircle className="h-4 w-4" />
              </Button>
              {!isSidebarOpen && (
                <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)} className="rounded-full hover:bg-lavender/10 hover:text-lavender" title="Open sidebar">
                  <Menu className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
          
          {/* Chat Messages */}
          <div className="flex-1 overflow-auto p-4 chat-container">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="h-16 w-16 rounded-full bg-lavender/20 flex items-center justify-center mb-4">
                  <Bot className="h-8 w-8 text-lavender" />
                </div>
                <h2 className="text-2xl font-semibold mb-2">Welcome to Financial Mufti</h2>
                <p className="text-muted-foreground max-w-md mb-8">
                  Your AI-powered Islamic finance advisor, running on secure Small Language Models for complete privacy.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg">
                  {topics.slice(0, 4).map(topic => (
                    <Button
                      key={topic.id}
                      variant="outline"
                      className="h-auto p-4 flex items-start gap-3 justify-start"
                      onClick={() => handleSelectTopic(topic)}
                    >
                      <div className="flex-shrink-0 mt-0.5">{topic.icon}</div>
                      <div className="text-left">
                        <div className="font-medium">{topic.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{topic.description}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map(message => (
                  <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-3xl rounded-lg p-4 ${
                      message.role === 'user' 
                        ? 'bg-lavender text-white' 
                        : 'bg-muted'
                    }`}>
                      <div className="prose dark:prose-invert">
                        {message.content}
                      </div>
                      
                      {/* References and Confidence for assistant messages */}
                      {message.role === 'assistant' && (
                        <div className="mt-3 pt-3 border-t border-border">
                          {message.references && message.references.length > 0 && (
                            <div className="mb-2">
                              <div className="text-xs font-medium mb-1 flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                References
                              </div>
                              <div className="space-y-1">
                                {message.references.map((ref, index) => (
                                  <div key={index} className="text-xs flex items-start gap-1">
                                    <span>•</span>
                                    <span>
                                      <span className="font-medium">{ref.title}:</span> {ref.source}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="flex items-center justify-between">
                            {message.confidence && (
                              <div className="flex items-center gap-1">
                                <div className="text-xs">Confidence:</div>
                                <div className="h-1.5 w-16 bg-muted-foreground/20 rounded-full overflow-hidden">
                                  <div 
                                    className={`h-full rounded-full ${
                                      message.confidence > 90 ? 'bg-green-500' : 
                                      message.confidence > 75 ? 'bg-yellow-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${message.confidence}%` }}
                                  />
                                </div>
                                <div className="text-xs font-medium">{message.confidence}%</div>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleBookmark(message.id)}
                              >
                                <Bookmark className={`h-3 w-3 ${message.isBookmarked ? 'fill-current' : ''}`} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsUp className="h-3 w-3" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-6 w-6">
                                <ThumbsDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Typing indicator */}
                {isProcessing && (
                  <div className="flex justify-start">
                    <div className="max-w-3xl rounded-lg p-4 bg-muted">
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse"></span>
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse delay-150"></span>
                          <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-pulse delay-300"></span>
                        </div>
                        <span className="text-xs text-muted-foreground">Financial Mufti is thinking...</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* This div is used for scrolling to bottom */}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Input
                  id="chat-input"
                  placeholder="Ask about Islamic finance..."
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  className="pr-10"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground flex items-center gap-1">
                  <Shield className="h-3 w-3" />
                  <span>Private</span>
                </div>
              </div>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isProcessing}
                className="bg-lavender hover:bg-lavender/90"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-2 text-xs text-center text-muted-foreground">
              Financial Mufti provides general guidance based on Islamic principles. For specific financial advice, consult with a qualified expert.
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default AIFeatures;
