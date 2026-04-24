"use client";

import { useState } from "react";
import Link from "next/link";
import { MessageSquare, Globe, Mail, FileText } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const response = await fetch("http://localhost:8000/api/subscribe/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("Subscribe Error:", error);
      setStatus("error");
    }
  };
  return (
    <footer className="bg-muted/50 border-t border-border py-12 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="col-span-1 md:col-span-2">
          <Link href="/" className="flex items-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center text-white font-bold">R</div>
            <span className="text-xl font-serif font-bold gold-gradient">RAS Q&A</span>
          </Link>
          <p className="text-muted-foreground max-w-sm">
            Bridging the gap between ancient wisdom and modern intelligence. Get instant, accurate answers powered by state-of-the-art AI.
          </p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4 text-primary">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link href="/chatbot" className="hover:text-primary transition-colors">Chatbot</Link></li>
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-4 text-primary">Connect</h4>
          <div className="flex space-x-4 mb-6">
            <Link href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-all">
              <Globe className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-all">
              <FileText className="w-5 h-5" />
            </Link>
            <Link href="#" className="p-2 bg-muted rounded-full hover:bg-primary hover:text-white transition-all">
              <Mail className="w-5 h-5" />
            </Link>
          </div>
          <h4 className="font-bold mb-4 text-primary">Newsletter</h4>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email" 
              className="bg-background border border-border rounded-lg px-3 py-2 text-xs flex-1 focus:outline-none focus:ring-1 focus:ring-primary/50" 
            />
            <button 
              type="submit"
              disabled={status === "loading"}
              className="bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold hover:scale-105 transition-all"
            >
              {status === "loading" ? "..." : "Join"}
            </button>
          </form>
          {status === "success" && <p className="text-green-500 text-[10px] mt-2">Subscribed!</p>}
          {status === "error" && <p className="text-red-500 text-[10px] mt-2">Error. Try again.</p>}
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-border text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} RAS Q&A. All rights reserved. Built with passion for knowledge.
      </div>
    </footer>
  );
}
