
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { MessageCircle, Send, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { TravelPlan } from '@/services/geminiService';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

interface TravelChatProps {
  apiKey: string;
  travelPlan: TravelPlan;
}

const TravelChat: React.FC<TravelChatProps> = ({ apiKey, travelPlan }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      type: 'ai',
      content: "Hi there! I'm your travel assistant. Feel free to ask me any questions about your itinerary!",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Send message to Gemini API
      const response = await askGemini(inputMessage);
      
      // Add AI response
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error sending message to Gemini:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const askGemini = async (question: string): Promise<string> => {
    try {
      // Format the trip summary for context
      const tripContext = `
Destination: ${travelPlan.days[0]?.activities?.[0]?.location?.split(',').pop()?.trim() || 'the destination'}
Trip duration: ${travelPlan.days.length} days
Budget: ${travelPlan.totalEstimatedCost}
`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful travel assistant. The user has received a travel itinerary with the following details:
${tripContext}

The full itinerary details:
${JSON.stringify(travelPlan, null, 2)}

The user has the following question about their trip:
"${question}"

Please provide a helpful, concise response. Focus on being practical and specific. If you don't know something, it's okay to say so.`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error calling Gemini API');
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error in askGemini:", error);
      throw error;
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="border-travel-primary/20 bg-white shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-travel-primary">
          <MessageCircle className="h-5 w-5" />
          Travel Assistant Chat
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[400px] overflow-y-auto mb-4 pr-2">
          <div className="space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.type === 'user'
                      ? 'bg-travel-primary text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
                    {msg.type === 'user' ? (
                      <>
                        <span>You</span>
                        <User className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        <MessageCircle className="h-3 w-3" />
                        <span>Travel Assistant</span>
                      </>
                    )}
                    <span>{formatTime(msg.timestamp)}</span>
                  </div>
                  <div className="text-sm whitespace-pre-wrap">{msg.content}</div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        <Separator className="my-2" />
        
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            placeholder="Ask me about your trip..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            type="submit" 
            size="icon"
            disabled={isLoading}
            className="bg-travel-primary"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default TravelChat;
