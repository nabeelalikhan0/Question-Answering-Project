"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  Paperclip, 
  X, 
  Bot, 
  User, 
  Upload, 
  FileText, 
  Trash2, 
  Plus, 
  Search, 
  MoreVertical,
  ChevronLeft,
  MessageSquare
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  role: "user" | "ai";
  content: string;
  timestamp: Date;
};

type Session = {
  id: string;
  title: string;
  lastMessage: string;
  date: Date;
};

export default function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSession, setActiveSession] = useState("default");
  const [user, setUser] = useState<any>(null);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);
      fetchSessions(parsedUser.id);
    }
  }, []);

  const fetchSessions = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/api/sessions/?user_id=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data.sessions);
      }
    } catch (error) {
      console.error("Fetch Sessions Error:", error);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !fileRef.current?.files?.[0]) return;
    
    const userMessage = input;
    const file = fileRef.current?.files?.[0];
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: userMessage || (file ? `Uploaded file: ${file.name}` : ""),
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setInput("");
    
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("message", userMessage || "Explain this document.");
      formData.append("session_id", activeSession);
      if (user) formData.append("user_id", user.id);
      
      const response = await fetch("/api/chat", {
        method: "POST",
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: data.content,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      if (fileRef.current) fileRef.current.value = "";
      setIsUploading(false);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        content: "Forgive me, but I encountered an error in my scrolls. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex h-screen bg-background pt-20 overflow-hidden">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 300, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="border-r border-border bg-muted/30 flex flex-col"
          >
            <div className="p-4 border-b border-border">
              <button 
                onClick={() => setMessages([])}
                className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">Recent Chats</div>
              {sessions.map(session => (
                <button
                  key={session.id}
                  onClick={() => setActiveSession(session.id)}
                  className={cn(
                    "w-full text-left p-3 rounded-xl transition-all group relative",
                    activeSession === session.id ? "bg-primary/10 border-primary/20" : "hover:bg-muted"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <MessageSquare className={cn("w-4 h-4", activeSession === session.id ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex-1 overflow-hidden">
                      <div className="font-medium truncate">{session.title}</div>
                      <div className="text-xs text-muted-foreground truncate">{session.lastMessage}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            
            <div className="p-4 border-t border-border flex items-center justify-between">
              <Link href="/profile" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                  {user?.first_name?.[0] || user?.username?.[0] || "U"}
                </div>
                <div className="text-sm font-medium group-hover:text-primary transition-colors">
                  {user?.first_name || user?.username || "Guest User"}
                </div>
              </Link>
              <button className="p-2 hover:bg-muted rounded-lg transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute left-4 top-4 z-10 p-2 glass rounded-lg hover:bg-muted transition-all"
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform", !sidebarOpen && "rotate-180")} />
        </button>

        {/* Chat Content */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 md:p-12 space-y-8 scroll-smooth"
        >
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8"
              >
                <Bot className="w-10 h-10 text-primary" />
              </motion.div>
              <h2 className="text-4xl font-serif font-bold mb-4">How can I assist you today?</h2>
              <p className="text-muted-foreground text-lg mb-8">
                Upload a document (PDF, DOCX, TXT) to provide context, or just start typing to seek wisdom.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <button className="p-6 glass rounded-2xl text-left hover:border-primary/50 transition-all group">
                  <div className="font-bold mb-2 group-hover:text-primary">Ancient Philosophy</div>
                  <div className="text-sm text-muted-foreground">Ask about Stoicism, Epicureanism, or Socratic methods.</div>
                </button>
                <button className="p-6 glass rounded-2xl text-left hover:border-primary/50 transition-all group">
                  <div className="font-bold mb-2 group-hover:text-primary">Document Analysis</div>
                  <div className="text-sm text-muted-foreground">Upload any file and I'll extract the core insights for you.</div>
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex gap-4 max-w-4xl mx-auto",
                  msg.role === "user" ? "flex-row-reverse" : ""
                )}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg",
                  msg.role === "user" ? "bg-primary text-white" : "bg-muted text-foreground"
                )}>
                  {msg.role === "user" ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-6 rounded-2xl shadow-sm text-lg leading-relaxed",
                  msg.role === "user" ? "bg-primary/5 border border-primary/10" : "glass"
                )}>
                  {msg.content}
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-4xl mx-auto">
            {/* File Upload Zone (Collapsible) */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mb-4 overflow-hidden"
                >
                  <div className="border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer relative group">
                    <input 
                      type="file" 
                      ref={fileRef}
                      onChange={() => setInput(input || (fileRef.current?.files?.[0]?.name ? `Analyze ${fileRef.current.files[0].name}` : ""))}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                    <Upload className="w-10 h-10 text-primary mx-auto mb-4 group-hover:scale-110 transition-transform" />
                    <div className="font-bold text-lg mb-1">Click or drag to upload</div>
                    <div className="text-sm text-muted-foreground">Supports PDF, DOCX, TXT up to 10MB</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
                placeholder="Seek wisdom here..."
                className="w-full bg-muted/50 border border-border rounded-3xl py-4 pl-14 pr-32 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[60px] max-h-[200px]"
                rows={1}
              />
              <button
                onClick={() => setIsUploading(!isUploading)}
                className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-all",
                  isUploading ? "bg-primary text-white" : "hover:bg-muted text-muted-foreground"
                )}
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="mt-2 text-center text-xs text-muted-foreground">
              RAS Q&A can make mistakes. Verify important information.
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
