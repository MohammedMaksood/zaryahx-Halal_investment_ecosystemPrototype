import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  options?: string[];
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Assalamu alaikum! I'm the Islamic Finance Oasis customer support assistant. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
      options: [
        "I need help with navigation",
        "I can't find a product",
        "Issue with my cart",
        "Investment questions",
        "Account problems"
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enhanced knowledge base with more specific question patterns
  const knowledgeBase = [
    // Customer Support & Site Navigation
    {
      keywords: ['navigation', 'navigate', 'find', 'where', 'how to', 'menu', 'page'],
      response: "Our site has several main sections: Home, Groceries, Stocks, Analysis, and Account. You can navigate between these using the main menu at the top of the page. Is there a specific section you're looking for?",
      options: ["How to find groceries", "Where are my investments", "How to analyze stocks", "Account settings"]
    },
    {
      keywords: ['login', 'signin', 'sign in', 'account', 'register', 'signup', 'password', 'forgot'],
      response: "You can sign in or create an account by clicking the 'Sign In' button in the top right corner of the page. If you've forgotten your password, there's a 'Forgot Password' option on the sign-in page. Would you like more specific instructions?",
      options: ["Can't log in", "Create new account", "Reset password"]
    },
    {
      keywords: ['cart', 'shopping', 'checkout', 'purchase', 'buy', 'order', 'payment'],
      response: "Your cart is accessible from the Groceries page. Items added to your cart will persist even if you refresh the page or navigate to other sections. To checkout, click the 'View Cart' button and then 'Proceed to Checkout'. Are you experiencing any specific issues with your cart?",
      options: ["Items disappearing", "Can't add to cart", "Payment issues", "View my orders"]
    },
    {
      keywords: ['product', 'item', 'grocery', 'groceries', 'food', 'search', 'filter', 'category'],
      response: "You can browse our grocery products by category or use the search bar to find specific items. Each product has a detailed view with nutritional information and halal certification details. Is there a specific product you're looking for?",
      options: ["How to filter products", "Product not available", "Product quality issues"]
    },
    {
      keywords: ['invest', 'investment', 'stock', 'stocks', 'portfolio', 'analysis', 'analyze'],
      response: "Our platform offers halal investment opportunities in stocks that pass our Islamic screening criteria. You can analyze stocks on the Analysis page and invest directly from there. Your investments will be tracked in your portfolio. What specific investment help do you need?",
      options: ["How to invest", "Stock screening process", "Track my investments", "Investment limits"]
    },
    {
      keywords: ['error', 'problem', 'issue', 'bug', 'not working', 'broken', 'fail', 'failed'],
      response: "I'm sorry you're experiencing an issue. Could you please provide more details about what's not working correctly? This will help me assist you better or direct you to our technical support team if necessary.",
      options: ["Page not loading", "Features not working", "Payment failed", "Account access issues"]
    },
    {
      keywords: ['contact', 'support', 'help', 'service', 'customer service', 'phone', 'email', 'chat'],
      response: "Our customer support team is available Monday to Friday, 9 AM to 6 PM. You can reach us via email at support@islamicfinanceoasis.com or call us at +1-800-HALAL-INVEST. For urgent matters, you can also use this chat feature for immediate assistance.",
      options: ["Email support", "Phone support", "Live chat hours"]
    },
    
    // Islamic Finance Knowledge
    {
      keywords: ['halal', 'haram', 'permissible', 'forbidden', 'allowed'],
      response: "In Islamic finance, investments must comply with Shariah principles. This means avoiding businesses involved in haram (forbidden) activities such as alcohol, pork, gambling, conventional interest-based financial services, and adult entertainment. Investments should also pass financial ratio screens related to debt, interest income, and liquidity.",
      options: ["What makes a stock halal?", "Forbidden industries", "Financial ratio screening"]
    },
    {
      keywords: ['sukuk', 'islamic bond', 'bonds'],
      response: "Sukuk are Islamic financial certificates similar to conventional bonds but structured to comply with Islamic law. Unlike conventional bonds that represent debt obligations, sukuk represent partial ownership in an asset, with returns derived from the performance of that asset rather than interest payments.",
      options: ["How to invest in sukuk", "Sukuk vs conventional bonds", "Sukuk risks"]
    },
    {
      keywords: ['zakat', 'charity', 'donation', 'purification'],
      response: "Zakat is one of the five pillars of Islam and refers to the obligation to give a portion of wealth to those in need. For investments, Muslims typically pay 2.5% of their investment holdings annually as zakat. Our platform can help calculate the zakat due on your investments.",
      options: ["Calculate my zakat", "Zakat on investments", "Purification process"]
    },
    {
      keywords: ['riba', 'interest', 'usury'],
      response: "Riba (interest) is prohibited in Islamic finance. This prohibition is based on the principle that money itself has no intrinsic value and should not generate more money without being linked to a productive activity. Islamic financial instruments are structured to avoid riba while still providing returns on investment.",
      options: ["How to avoid riba", "Interest-free alternatives", "Riba in modern banking"]
    },
    {
      keywords: ['halal food', 'meat', 'certification', 'ingredients'],
      response: "All grocery products on our platform are certified halal. We ensure that meat products come from animals slaughtered according to Islamic requirements, and all ingredients in our food products are permissible under Islamic dietary laws. We regularly verify certification with our suppliers.",
      options: ["Certification process", "Meat sources", "Ingredient verification"]
    },
    
    // Technical Issues
    {
      keywords: ['refresh', 'reload', 'lost', 'disappear', 'empty', 'clear'],
      response: "Your cart items are now saved automatically and should persist even when you refresh the page or navigate to different sections of the site. If your items are still disappearing, please try clearing your browser cache or using a different browser. If the problem persists, please contact our support team.",
      options: ["Items still disappearing", "Clear browser cache", "Contact support"]
    },
    {
      keywords: ['image', 'picture', 'photo', 'wrong', 'incorrect', 'mismatch'],
      response: "We've recently updated our product images to better match their descriptions. If you're still seeing incorrect images, please provide the specific product name and we'll fix it right away. You can also refresh your browser cache to see the latest images.",
      options: ["Report wrong image", "Refresh cache", "Product looks different"]
    },
    {
      keywords: ['slow', 'loading', 'performance', 'lag', 'freeze', 'stuck'],
      response: "If you're experiencing slow performance, try refreshing the page or clearing your browser cache. Our site works best on the latest versions of Chrome, Firefox, Safari, or Edge. If problems persist, check your internet connection or try accessing the site later.",
      options: ["Still loading slowly", "Browser compatibility", "Report performance issue"]
    }
  ];

  const handleSendMessage = () => {
    if (inputValue.trim() === '') return;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Generate bot response after a delay
    setTimeout(() => {
      const response = generateResponse(inputValue);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        options: response.options
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };
  
  const handleOptionClick = (option: string) => {
    // Add user message with the selected option
    const userMessage: Message = {
      id: messages.length + 1,
      text: option,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate bot typing
    setIsTyping(true);
    
    // Generate bot response after a delay
    setTimeout(() => {
      const response = generateResponse(option);
      const botMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        options: response.options
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const generateResponse = (query: string): { text: string; options?: string[] } => {
    // Convert query to lowercase for case-insensitive matching
    const lowercaseQuery = query.toLowerCase();
    
    // Check for greetings
    if (/^(hi|hello|assalamu|salam|hey)/.test(lowercaseQuery)) {
      return {
        text: "Wa alaikum salam! How can I assist you with Islamic Finance Oasis today?",
        options: ["I need help with navigation", "I have a question about products", "I'm having issues with my cart", "I need help with investments"]
      };
    }
    
    // Check for thanks
    if (/thank|thanks|jazak/.test(lowercaseQuery)) {
      return {
        text: "You're welcome! Is there anything else I can help you with today?",
        options: ["Yes, I have another question", "No, that's all for now"]
      };
    }
    
    // More specific question patterns
    if (/how (do|can) I (invest|buy stocks|purchase shares)/.test(lowercaseQuery)) {
      return {
        text: "To invest in stocks on our platform, go to the Stocks section, search for a company, and click on the 'Invest' button. You'll need to be signed in to complete the transaction. Would you like more details on any specific part of this process?",
        options: ["How to find halal stocks", "Investment limits", "Payment methods", "View my portfolio"]
      };
    }
    
    if (/where (is|are) my (cart|items|products|groceries)/.test(lowercaseQuery)) {
      return {
        text: "Your cart items can be viewed by clicking the shopping cart icon in the top right corner of the Groceries page. Your items will persist even if you refresh the page or navigate to other sections of the site.",
        options: ["Items missing from cart", "How to checkout", "Remove items", "Save for later"]
      };
    }
    
    if (/(forgot|reset|change) (my )?(password|login)/.test(lowercaseQuery)) {
      return {
        text: "To reset your password, click on the 'Sign In' button, then select 'Forgot Password'. You'll receive an email with instructions to create a new password. If you don't receive the email, please check your spam folder.",
        options: ["Email not received", "Create new account", "Contact support"]
      };
    }
    
    if (/(halal|permissible|islamic) (certification|certified|compliance)/.test(lowercaseQuery)) {
      return {
        text: "All products on Islamic Finance Oasis are halal certified. Our groceries are sourced from trusted suppliers with valid halal certifications, and our investment options are screened according to Islamic principles to ensure they are Shariah-compliant.",
        options: ["Certification process", "Meat sources", "Investment screening"]
      };
    }
    
    // Check knowledge base for relevant responses using a more sophisticated matching system
    let bestMatch = null;
    let highestMatchScore = 0;
    
    for (const item of knowledgeBase) {
      // Calculate how many keywords match
      const matchingKeywords = item.keywords.filter(keyword => lowercaseQuery.includes(keyword));
      const matchScore = matchingKeywords.length;
      
      // If this item has more matching keywords than our current best match, use it instead
      if (matchScore > highestMatchScore) {
        highestMatchScore = matchScore;
        bestMatch = item;
      }
    }
    
    // If we found a match with at least one keyword, use it
    if (bestMatch && highestMatchScore > 0) {
      return {
        text: bestMatch.response,
        options: bestMatch.options
      };
    }
    
    // Generate a more specific default response based on query content
    if (lowercaseQuery.includes('stock') || lowercaseQuery.includes('invest')) {
      return {
        text: "I notice you're asking about investments. Could you please be more specific about what you'd like to know about our halal investment options?",
        options: [
          "How to invest",
          "Stock screening process",
          "Investment limits",
          "View my portfolio"
        ]
      };
    } else if (lowercaseQuery.includes('grocery') || lowercaseQuery.includes('food') || lowercaseQuery.includes('product')) {
      return {
        text: "I see you're asking about our grocery products. Could you please specify what information you're looking for?",
        options: [
          "Browse categories",
          "Product availability",
          "Halal certification",
          "Delivery options"
        ]
      };
    } else if (lowercaseQuery.includes('account') || lowercaseQuery.includes('login') || lowercaseQuery.includes('sign')) {
      return {
        text: "I notice you're asking about account-related matters. How can I help you with your account?",
        options: [
          "Sign in problems",
          "Create account",
          "Update profile",
          "Payment methods"
        ]
      };
    } else {
      // Generic fallback response
      return {
        text: "I'm not sure I understand your question. Could you please select one of the options below or rephrase your question? I'm here to help with any issues you're experiencing on our site.",
        options: [
          "Site navigation help",
          "Account issues",
          "Shopping cart problems",
          "Investment questions",
          "Contact human support"
        ]
      };
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className={`h-14 w-14 rounded-full shadow-lg ${isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-lavender hover:bg-lavender-dark'}`}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </Button>
      </div>
      
      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 h-[500px] bg-background border border-white/10 rounded-xl shadow-xl flex flex-col z-40 overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-white/10 bg-lavender/20 backdrop-blur-sm">
            <div className="flex items-center">
              <div className="h-10 w-10 rounded-full bg-lavender flex items-center justify-center mr-3">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium">Customer Support</h3>
                <p className="text-xs text-white/60">Islamic Finance Oasis</p>
              </div>
              <Badge className="ml-auto bg-green-600">Online</Badge>
            </div>
          </div>
          
          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.map((message) => (
              <div 
                key={message.id} 
                className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user' 
                      ? 'bg-lavender text-white rounded-tr-none' 
                      : 'bg-white/10 rounded-tl-none'
                  }`}
                >
                  <p>{message.text}</p>
                  <p className="text-xs opacity-70 mt-1 text-right">
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                  
                  {/* Quick reply options */}
                  {message.sender === 'bot' && message.options && message.options.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full text-white/80 transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start mb-4">
                <div className="bg-white/10 p-3 rounded-lg rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="h-2 w-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="h-2 w-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input */}
          <div className="p-3 border-t border-white/10 bg-white/5">
            <div className="flex">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask a question..."
                className="flex-1 bg-white/10 border-white/10 focus-visible:ring-lavender"
              />
              <Button 
                onClick={handleSendMessage}
                className="ml-2 bg-lavender hover:bg-lavender-dark"
                disabled={inputValue.trim() === ''}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default ChatBot;
