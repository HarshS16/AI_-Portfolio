import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

const INITIAL_MESSAGES: Message[] = [
    {
        role: 'assistant',
        content: "Hi there! 👋 I'm Harsh's AI assistant. Ask me anything about his projects, skills, experience, or education!"
    }
];

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

// Generate or retrieve a persistent session ID
function getSessionId(): string {
    let sessionId = localStorage.getItem('chat_session_id');
    if (!sessionId) {
        sessionId = crypto.randomUUID();
        localStorage.setItem('chat_session_id', sessionId);
    }
    return sessionId;
}

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [sessionId] = useState(getSessionId);
    const [historyLoaded, setHistoryLoaded] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Load chat history when the window opens for the first time
    useEffect(() => {
        if (isOpen && !historyLoaded) {
            loadChatHistory();
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const loadChatHistory = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chat/history?session_id=${sessionId}`);
            if (response.ok) {
                const history = await response.json();
                if (history.length > 0) {
                    const restored: Message[] = history.map((msg: any) => ({
                        role: msg.role as 'user' | 'assistant',
                        content: msg.content,
                    }));
                    setMessages([...INITIAL_MESSAGES, ...restored]);
                }
            }
        } catch (error) {
            console.warn('Could not load chat history:', error);
        } finally {
            setHistoryLoaded(true);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsTyping(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    session_id: sessionId,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Backend error:', errorText);
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
        } catch (error: any) {
            console.error('Chat API error:', error);
            setMessages(prev => [
                ...prev,
                {
                    role: 'assistant',
                    content: "Oops, I'm having trouble connecting to the server. Please try again or reach out to Harsh at harshme08@gmail.com!",
                },
            ]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
            {/* Chat Window */}
            {isOpen && (
                <Card className="mb-4 w-[320px] sm:w-[380px] h-[450px] flex flex-col overflow-hidden neural-border bg-card/95 backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-300">
                    {/* Header */}
                    <div className="p-4 border-b border-border bg-primary/10 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-2 text-foreground">
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold">Harsh's Assistant</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Online</span>
                                </div>
                            </div>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-8 w-8 rounded-full hover:bg-primary/20 transition-colors">
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
                        <div className="space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={cn("flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300", msg.role === 'user' ? "items-end" : "items-start")}>
                                    <div className={cn(
                                        "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                                        msg.role === 'user'
                                            ? "bg-primary text-primary-foreground rounded-tr-none shadow-md shadow-primary/20"
                                            : "bg-muted text-foreground rounded-tl-none border border-border/50 shadow-sm"
                                    )}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex items-start animate-in fade-in duration-200">
                                    <div className="bg-muted text-foreground rounded-2xl rounded-tl-none border border-border/50 px-4 py-2 text-sm flex gap-1 items-center">
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-duration:0.6s]" />
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]" />
                                        <span className="w-1.5 h-1.5 bg-foreground/50 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.4s]" />
                                    </div>
                                </div>
                            )}
                            <div ref={scrollRef} />
                        </div>
                    </div>

                    {/* Footer Input */}
                    <div className="p-4 border-t border-border bg-muted/30">
                        <form
                            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                            className="flex gap-2"
                        >
                            <Input
                                placeholder="Ask about Harsh..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="bg-background border-border focus:ring-primary h-9 text-sm"
                            />
                            <Button type="submit" size="icon" disabled={!input.trim() || isTyping} className="h-9 w-9 shrink-0">
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                        <p className="text-[10px] text-center text-muted-foreground mt-2">
                            Powered by AI · Answers based on Harsh's resume
                        </p>
                    </div>
                </Card>
            )}

            {/* Toggle Button */}
            <Button
                onClick={() => setIsOpen(!isOpen)}
                size="icon"
                className={cn(
                    "w-14 h-14 rounded-full shadow-2xl transition-all duration-300 neural-glow",
                    isOpen ? "bg-destructive hover:bg-destructive/90 rotate-90" : "bg-primary hover:bg-primary/90 hover:scale-110"
                )}
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </Button>
        </div>
    );
};

export default ChatBot;
