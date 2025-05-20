import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Send, BookOpen, Star, Clock, ThumbsUp, ThumbsDown, Bookmark, Shield, AlertTriangle, CheckCircle, Info, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

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

interface Topic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FinancialMuftiProps {
  fullWidth?: boolean;
  className?: string;
}

const FinancialMufti: React.FC<FinancialMuftiProps> = ({ className = "", fullWidth = false }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'topics' | 'saved'>('chat');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [savedQuestions, setSavedQuestions] = useState<Message[]>([]);
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
    if (messagesEndRef.current && activeTab === 'chat') {
      // Only scroll the chat container element, not the page
      const chatContainer = messagesEndRef.current.closest('.scroll-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  };
  
  // Disable automatic scrolling on the page
  useEffect(() => {
    // Save the original styles
    const originalStyle = window.getComputedStyle(document.body).overflow;
    const originalHtmlStyle = window.getComputedStyle(document.documentElement).scrollBehavior;
    
    // Apply styles to prevent automatic scrolling
    document.documentElement.style.scrollBehavior = 'auto';
    
    return () => {
      // Restore original styles when component unmounts
      document.documentElement.style.scrollBehavior = originalHtmlStyle;
    };
  }, []);
  
  // Welcome message on component mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: `Assalamu alaikum${user?.name ? ' ' + user.name : ''}! I'm your Financial Mufti, powered by on-device Small Language Models to protect your privacy. How can I assist you with Islamic finance questions today?`,
          timestamp: new Date(),
        }
      ]);
    }
  }, []);
  
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
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);
    
    // Manually scroll after adding message
    setTimeout(scrollToBottom, 100);
    
    try {
      // Simulate AI processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate AI response (in a real implementation, this would call the SLM)
      const aiResponse = generateAIResponse(inputValue);
      
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        references: aiResponse.references,
        confidence: aiResponse.confidence
      }]);
      
      // Manually scroll after AI response
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error generating response:', error);
      
      // Add error message
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your question. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Handle selecting a predefined topic
  const handleSelectTopic = (topic: Topic) => {
    setInputValue(`Tell me about ${topic.title} in Islamic finance`);
    setActiveTab('chat');
  };
  
  // Handle bookmarking a question
  const handleBookmark = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;
    
    // Toggle bookmark status
    const updatedMessages = messages.map(m => 
      m.id === messageId ? { ...m, isBookmarked: !m.isBookmarked } : m
    );
    
    setMessages(updatedMessages);
    
    // Update saved questions
    const bookmarkedMessage = updatedMessages.find(m => m.id === messageId);
    if (bookmarkedMessage?.isBookmarked) {
      setSavedQuestions(prev => [...prev, bookmarkedMessage]);
    } else {
      setSavedQuestions(prev => prev.filter(q => q.id !== messageId));
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
          { title: "Scholarly Opinion", source: "Contemporary Fatawa on Zakat", link: "#" }
        ],
        confidence: 90,
        keywords: ['zakat', 'calculation', 'investment', 'wealth']
      },
      {
        content: "Sukuk (Islamic bonds) are Shariah-compliant financial certificates that represent proportional ownership in an underlying asset. Unlike conventional bonds, sukuk must be backed by tangible assets, and returns must come from the performance of those assets rather than interest. Common structures include Ijara Sukuk (lease-based), Murabaha Sukuk (sale-based), and Musharaka Sukuk (partnership-based).",
        references: [
          { title: "AAOIFI Standard", source: "Shariah Standard No. 17: Investment Sukuk", link: "#" },
          { title: "Market Report", source: "Global Sukuk Market Overview 2024", link: "#" }
        ],
        confidence: 92,
        keywords: ['sukuk', 'bonds', 'islamic bonds', 'investment']
      },
      {
        content: "Islamic inheritance (Mirath) follows specific rules outlined in the Quran and Sunnah. The distribution of assets is predetermined with fixed shares for different heirs. Before distribution, certain obligations must be fulfilled: funeral expenses, debts, and bequests (up to 1/3 of the estate). The remaining estate is distributed according to the Islamic inheritance law. It's essential to prepare a proper Islamic will (Wasiyyah) to ensure compliance.",
        references: [
          { title: "Quran", source: "Surah An-Nisa 4:11-12", link: "#" },
          { title: "Scholarly Work", source: "The Islamic Law of Inheritance", link: "#" }
        ],
        confidence: 88,
        keywords: ['inheritance', 'mirath', 'wasiyyah', 'will']
      },
      {
        content: "I apologize, but I don't have enough information to provide a specific answer to your question. Could you please provide more details or rephrase your question? I'm here to help with any Islamic finance topics you're interested in.",
        references: [],
        confidence: 50,
        keywords: []
      }
    ];
    
    // Simple keyword matching for demo purposes
    const lowerQuestion = question.toLowerCase();
    let bestMatch = responses[responses.length - 1]; // Default to generic response
    let highestMatchScore = 0;
    
    for (const response of responses.slice(0, -1)) { // Skip the last (default) response
      const matchScore = response.keywords.reduce((score, keyword) => {
        return lowerQuestion.includes(keyword) ? score + 1 : score;
      }, 0);
      
      if (matchScore > highestMatchScore) {
        highestMatchScore = matchScore;
        bestMatch = response;
      }
    }
    
    return bestMatch;
  };
  
  return (
    <Card className={`bg-gradient-to-br from-gray-900 to-black border-white/10 text-white min-h-[700px] ${fullWidth ? 'w-full' : 'max-w-4xl'} mx-auto flex flex-col ${className}`}>
      <CardHeader className="pb-6">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-4">
          <div className="flex items-center">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-lavender to-lavender/70 flex items-center justify-center mr-4 shadow-lg shadow-lavender/20">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">
                Financial Mufti
              </CardTitle>
              <CardDescription className="text-white/80 mt-1 text-base">
                Your personal Shariah-compliant finance advisor
              </CardDescription>
            </div>
          </div>
          
          <Badge variant="outline" className="bg-gradient-to-r from-lavender/20 to-lavender/10 text-lavender border-lavender/20 py-2 px-4 flex items-center shadow-md">
            <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse"></span>
            <Shield className="h-4 w-4 mr-1.5" />
            <span className="font-medium">Privacy-First SLM</span>
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 mx-6 p-1 bg-white/5 rounded-full border border-white/10 mb-2">
            <TabsTrigger value="chat" className="text-sm py-3 rounded-full data-[state=active]:bg-lavender data-[state=active]:text-white">
              <MessageSquare className="h-5 w-5 mr-2" />
              <span className="font-medium">Chat with Mufti</span>
            </TabsTrigger>
            <TabsTrigger value="topics" className="text-sm py-3 rounded-full data-[state=active]:bg-lavender data-[state=active]:text-white">
              <BookOpen className="h-5 w-5 mr-2" />
              <span className="font-medium">Topics</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="text-sm py-3 rounded-full data-[state=active]:bg-lavender data-[state=active]:text-white">
              <Bookmark className="h-5 w-5 mr-2" />
              <span className="font-medium">Saved</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="flex-1 flex flex-col overflow-hidden px-6 pt-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-6 max-h-[400px] scroll-container" style={{ scrollbarWidth: 'thin' }}>
              {messages.map((message) => (
                <div key={message.id} className={`flex items-start ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {message.role === 'assistant' && (
                    <div className="flex-shrink-0 mr-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender to-lavender/70 flex items-center justify-center shadow-md">
                        <Shield className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                  <div className={`max-w-[75%] rounded-2xl p-4 shadow-lg ${
                    message.role === 'user' 
                      ? 'bg-gradient-to-r from-lavender to-lavender/90 text-white' 
                      : 'bg-gradient-to-br from-white/10 to-black/40 text-white/95 border border-white/10 backdrop-blur-sm'
                  }`}>
                    <div className="text-base">{message.content}</div>
                    
                    {message.references && message.references.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-white/20 text-sm">
                        <div className="font-medium mb-2 flex items-center">
                          <BookOpen className="h-4 w-4 mr-2 text-lavender-light" />
                          References:
                        </div>
                        <ul className="space-y-2">
                          {message.references.map((ref, index) => (
                            <li key={index} className="flex items-start">
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-lavender/70 mt-1.5 mr-2"></span>
                              <div>
                                <span className="text-lavender-light font-medium">{ref.title}:</span> {ref.source}
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {message.role === 'assistant' && (
                      <div className="mt-3 flex justify-between items-center text-sm text-white/70">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          
                          {message.confidence && (
                            <span className="ml-3 flex items-center">
                              <Info className="h-4 w-4 mr-1 text-lavender-light" />
                              Confidence: {message.confidence}%
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 rounded-full hover:bg-white/10"
                            onClick={() => handleBookmark(message.id)}
                          >
                            <Bookmark className={`h-4 w-4 ${message.isBookmarked ? 'fill-lavender text-lavender' : 'text-white/60'}`} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                            <ThumbsUp className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-white/10">
                            <ThumbsDown className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="flex-shrink-0 ml-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-lavender-dark to-lavender flex items-center justify-center shadow-md">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
              
              {isProcessing && (
                <div className="flex items-start justify-start">
                  <div className="flex-shrink-0 mr-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lavender to-lavender/70 flex items-center justify-center shadow-md">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                  </div>
                  <div className="max-w-[75%] rounded-2xl p-4 shadow-lg bg-gradient-to-br from-white/10 to-black/40 border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center">
                      <div className="flex space-x-2 mr-3 bg-lavender/10 px-3 py-1 rounded-full">
                        <div className="w-2.5 h-2.5 rounded-full bg-lavender animate-pulse"></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-lavender animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2.5 h-2.5 rounded-full bg-lavender animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                      <span className="text-white/80 text-sm font-medium">Financial Mufti is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="pb-6 px-4">
              <div className="bg-gradient-to-br from-white/5 to-black/40 border border-white/10 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                  <Input
                    placeholder="Ask about Islamic finance..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="bg-black/30 border-white/10 focus-visible:ring-lavender focus-visible:border-lavender text-base py-6 px-5 flex-1 rounded-xl"
                  />
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isProcessing || !inputValue.trim()}
                    className="bg-gradient-to-r from-lavender to-lavender-dark hover:opacity-90 px-6 flex-shrink-0 rounded-xl shadow-md"
                    size="lg"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
                <div className="mt-4 flex items-center justify-center text-sm text-white/60">
                  <div className="flex items-center bg-lavender/10 rounded-full px-3 py-1 border border-lavender/20">
                    <span className="inline-block h-2 w-2 rounded-full bg-green-400 animate-pulse mr-2"></span>
                    <Shield className="h-4 w-4 mr-2 text-lavender/70" />
                    All processing happens on your device for maximum privacy
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="topics" className="flex-1 overflow-hidden px-6 pt-4">
            <div className="grid gap-3 overflow-y-auto max-h-[400px] scroll-container" style={{ scrollbarWidth: 'thin' }}>
              {topics.map((topic) => (
                <div 
                  key={topic.id} 
                  className="p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => handleSelectTopic(topic)}
                >
                  <div className="flex items-start">
                    <div className="mr-3 mt-0.5">
                      {topic.icon}
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{topic.title}</h3>
                      <p className="text-sm text-white/70">{topic.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="saved" className="flex-1 overflow-hidden px-6 pt-4">
            <div className="overflow-y-auto max-h-[400px] scroll-container" style={{ scrollbarWidth: 'thin' }}>
            {savedQuestions.length > 0 ? (
              <div className="space-y-4">
                {savedQuestions.map((question) => (
                  <div key={question.id} className="p-4 rounded-lg border border-white/10 bg-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">
                        {question.content.length > 60 ? question.content.substring(0, 60) + '...' : question.content}
                      </h3>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 rounded-full hover:bg-white/10"
                        onClick={() => handleBookmark(question.id)}
                      >
                        <Bookmark className="h-3 w-3 fill-lavender text-lavender" />
                      </Button>
                    </div>
                    <div className="text-xs text-white/60">
                      Saved on {question.timestamp.toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center p-8 text-white/60">
                <Bookmark className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No saved questions yet</p>
                <p className="text-sm mt-2">Bookmark important questions and answers for quick reference</p>
              </div>
            )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="border-t border-white/10 pt-6 pb-4 bg-gradient-to-b from-transparent to-black/20">
        <div className="w-full">
          <div className="flex items-center justify-center mb-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-lavender to-lavender/70 flex items-center justify-center mr-3 shadow-md">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div className="bg-lavender/10 rounded-full px-4 py-1.5 border border-lavender/20">
              <span className="text-sm font-medium text-white/90">Powered by On-Device Small Language Models</span>
            </div>
          </div>
          <div className="text-center text-sm text-white/70 max-w-xl mx-auto">
            Fine-tuned on Islamic jurisprudence, fatawa collections, and Shariah standards to provide accurate guidance while preserving your privacy
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default FinancialMufti;
