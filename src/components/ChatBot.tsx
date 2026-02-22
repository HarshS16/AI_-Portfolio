import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
    role: 'user' | 'assistant' | 'system';
    content: string;
}

const RESUME_CONTEXT = `
You are an AI assistant embedded on Harsh Srivastava's portfolio website. Answer questions about Harsh based ONLY on the resume information below. Be concise, friendly, and professional. Use 2-3 sentences max per response unless the user asks for detail. If you don't know the answer from the resume, say so politely.

---
RESUME — Harsh Srivastava
---

Name: Harsh Srivastava
Location: Noida, India
Email: harshme08@gmail.com
LinkedIn: linkedin.com/in/harsh-tsx
GitHub: github.com/harshs16
Twitter/X: @Harsh_jsx
Blog: medium.com/@harsh-jsx

Bio: Computer Science undergraduate at JSS Academy of Technical Education (specializing in Data Science) with hands-on experience building and shipping full-stack applications. Interned at Miracle AI and Vaxalor AI, where he architected production websites, optimized dashboards, and implemented LLM observability pipelines. Passionate about building tools that solve real problems. Recognized as a Reliance Foundation Scholar for academic excellence.

WORK EXPERIENCE:

1. Full Stack Development Intern — Miracle AI (December 2025 – Present, Onsite – Delhi)
   - Architected and shipped a fully responsive production website using Next.js, integrating GPU-accelerated 3D scenes and interactive animations with Three.js.
   - Redesigned the React TypeScript-based dashboard UI, optimizing render paths and interaction flow to reduce perceived latency by 50%.
   - Profiled and optimized critical application paths, collaborating with backend and frontend teams to improve end-to-end performance by 70%.
   - Implemented LLM observability across inference routes, instrumenting latency, token usage, error rates, and per-request cost.

2. Full Stack Developer Intern — Vaxalor AI (September 2025 – October 2025, Hybrid)
   - Owned the end-to-end development of the company's production website using React TypeScript.
   - Integrated Supabase for real-time data sync, authentication, and serverless functions.
   - Delivered multiple full-stack features across the product lifecycle.

3. Software Development Intern — Central Ground Water Board (April 2025 – May 2025, Faridabad, Haryana)
   - Developed a comprehensive data management portal to digitize groundwater records, reducing manual retrieval time by 40%.
   - Implemented automated reporting scripts using Python and SQL.
   - Designed and deployed user-friendly interfaces for field officers.

EDUCATION:
- B.Tech in Computer Science & Engineering (Specialization: Data Science) — JSS Academy of Technical Education (2023 – 2027)

SKILLS:
- Frontend: React, Next.js, TypeScript, Tailwind CSS, Three.js, Framer Motion, GSAP
- Backend: Node.js, Express, PostgreSQL, MongoDB, Supabase, WebSockets, WebRTC
- Languages: JavaScript, TypeScript, Python, C++, SQL, HTML/CSS
- Tools: Git/GitHub, Postman, Vercel, Clerk
- AI: Gemini API, LLM Observability

PROJECTS:

1. SocioX — A LinkedIn-inspired full-stack professional networking platform with real-time messaging, post feeds, CRUD workflows, and user profiles. Tech: React, TypeScript, Node.js, Express, PostgreSQL, Supabase, WebSockets, WebRTC.

2. Rheo — A full-stack event orchestration platform supporting event creation, discovery, and QR-based ticketing with email workflows via Nodemailer and SendGrid. Tech: React, TypeScript, Node.js, Express, PostgreSQL, Supabase.

3. DevElevate — An AI-driven career platform to refine resumes and generate developer portfolios using Gemini API for semantic resume analysis, ATS scoring, and content enhancement. Tech: React, Node.js, MongoDB, Clerk, Gemini API.

4. PostFlow — A full-stack web application for content creators to draft, organize, and schedule social media posts. Tech: React, Next.js, TypeScript, Tailwind CSS, Prisma.

5. Civix — A full-stack web app for reporting, tracking, and resolving local civic issues. Tech: React, Node.js, Express, MongoDB, Tailwind CSS.

6. Chai Culture — A modern, aesthetic landing page for Chai culture with GSAP and Framer Motion animations. Tech: Vite, React, TypeScript, shadcn/ui, Tailwind CSS, Framer Motion, GSAP.

7. CodeInfo — A command-line tool and web interface for analyzing codebases. Tech: HTML, CSS, JavaScript, Python, Flask.

8. GiftHunt — An AI-powered gift discovery platform using Gemini API. Tech: React, Tailwind CSS, Gemini API, Node.js, PostgreSQL.

9. Dreamy Tales — An AI bedtime story generator with audio narration via ElevenLabs. Tech: React, Tailwind CSS, Gemini API, ElevenLabs, Framer Motion.

ACHIEVEMENTS:
- Head Boy — Indirapuram Public School (April 2020 – March 2022)
- Reliance Foundation Undergraduate Scholar (October 2023)
`;

const SYSTEM_MESSAGE: Message = {
    role: 'system',
    content: RESUME_CONTEXT,
};

const INITIAL_MESSAGES: Message[] = [
    {
        role: 'assistant',
        content: "Hi there! 👋 I'm Harsh's AI assistant. Ask me anything about his projects, skills, experience, or education!"
    }
];

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isTyping, isOpen]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMessage = input.trim();
        setInput('');

        const newUserMsg: Message = { role: 'user', content: userMessage };
        setMessages(prev => [...prev, newUserMsg]);
        setIsTyping(true);

        try {
            const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
            if (!apiKey || apiKey === 'your_openrouter_api_key_here') {
                throw new Error('API key not configured');
            }

            // Build conversation history for context (last 10 messages to stay within token limits)
            const recentMessages = [...messages, newUserMsg]
                .filter(m => m.role !== 'system')
                .slice(-10);

            const apiMessages = [
                SYSTEM_MESSAGE,
                ...recentMessages,
            ];

            // Fallback models in case one is rate-limited
            const FREE_MODELS = [
                'meta-llama/llama-3.3-70b-instruct:free',
                'mistralai/mistral-small-3.1-24b-instruct:free',
                'google/gemma-3-27b-it:free',
                'qwen/qwen3-4b:free',
                'deepseek/deepseek-r1-0528:free',
            ];

            let lastError = '';
            for (const model of FREE_MODELS) {
                const response = await fetch(OPENROUTER_API_URL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                        'HTTP-Referer': window.location.origin,
                        'X-Title': 'Harsh Srivastava Portfolio',
                    },
                    body: JSON.stringify({
                        model,
                        messages: apiMessages,
                        max_tokens: 500,
                        temperature: 0.7,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const assistantContent = data.choices?.[0]?.message?.content?.trim()
                        || "Sorry, I couldn't generate a response. Please try again!";
                    setMessages(prev => [...prev, { role: 'assistant', content: assistantContent }]);
                    setIsTyping(false);
                    return; // success, exit early
                }

                // If rate-limited (429), try next model
                if (response.status === 429) {
                    console.warn(`Model ${model} rate-limited, trying next...`);
                    continue;
                }

                // For other errors, log and break
                const errorText = await response.text();
                console.error(`OpenRouter Error (${model}):`, errorText);
                lastError = `API error: ${response.status}`;
                break;
            }

            throw new Error(lastError || 'All models are currently rate-limited. Please try again in a moment!');
        } catch (error: any) {
            console.error('OpenRouter API error:', error);
            const errorMessage = error.message === 'API key not configured'
                ? "The AI assistant isn't configured yet. Please reach out to Harsh directly at harshme08@gmail.com!"
                : error.message.includes('rate-limited')
                    ? "All AI models are busy right now. Please try again in a few seconds! 🙏"
                    : "Oops, something went wrong. Try again or reach out to Harsh at harshme08@gmail.com!";
            setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
        } finally {
            setIsTyping(false);
        }
    };

    // Filter out system messages for display
    const displayMessages = messages.filter(m => m.role !== 'system');

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
                            {displayMessages.map((msg, i) => (
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
