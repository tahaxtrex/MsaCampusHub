import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader2, Sparkles } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';

const ChatInterface = () => {
    const { authUser } = useAuthStore();
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: `As-salamu alaykum! I am MSAI, your intelligent assistant. I can help you with:
- Islamic knowledge and questions
- Finding prayer times and events
- Navigating the MSA Campus Hub
- General questions about the MSA

How can I assist you today?`
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Use local backend URL if in development
            const backendUrl = import.meta.env.DEV
                ? "http://localhost:8001/api/msai/chat"
                : "/api/msai/chat";

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.map(m => ({ role: m.role, content: m.content })),
                    userId: authUser?.id
                }),
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        } catch (error) {
            console.error('Chat error:', error);
            toast.error('Failed to send message. Please try again.');
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'I apologize, but I encountered an error processing your request. Please try again later.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''
                            }`}
                    >
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${msg.role === 'user'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-blue-100 text-blue-600'
                            }`}>
                            {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                        </div>

                        <div className={`flex flex-col max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'
                            }`}>
                            <div className={`px-4 py-3 rounded-2xl shadow-sm ${msg.role === 'user'
                                ? 'bg-green-600 text-white rounded-tr-none'
                                : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                }`}>
                                <div className={`prose ${msg.role === 'user' ? 'prose-invert' : ''} max-w-none text-sm sm:text-base`}>
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                            <span className="text-xs text-gray-400 mt-1 px-1">
                                {msg.role === 'user' ? 'You' : 'MSAI'}
                            </span>
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Bot size={20} />
                        </div>
                        <div className="bg-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                            <div className="flex items-center gap-2 text-gray-500">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-100 p-4 bg-gray-50">
                <form onSubmit={handleSend} className="flex gap-3 max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask about Islam, events, or prayer times..."
                        className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white shadow-sm"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={!input.trim() || isLoading}
                        className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm flex items-center gap-2 font-medium"
                    >
                        <Send size={20} />
                        <span className="hidden sm:inline">Send</span>
                    </button>
                </form>
                <div className="text-center mt-2">
                    <p className="text-xs text-gray-400 flex items-center justify-center gap-1">
                        <Sparkles size={12} />
                        Powered by Gemini AI • Always verify Islamic knowledge with scholars
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
