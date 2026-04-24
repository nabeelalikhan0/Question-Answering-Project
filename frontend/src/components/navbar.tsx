"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { MessageSquare, Home, Info, Mail, User, Menu, X, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

const navItems = [
  { name: "Home", href: "/", icon: Home },
  { name: "Chatbot", href: "/chatbot", icon: MessageSquare },
  { name: "About", href: "/about", icon: Info },
  { name: "Contact", href: "/contact", icon: Mail },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Check for user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 py-4",
        scrolled ? "glass py-3" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <motion.div
            initial={{ rotate: -10 }}
            animate={{ rotate: 0 }}
            className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <span className="text-white font-bold text-xl">R</span>
          </motion.div>
          <span className="text-2xl font-serif font-bold gold-gradient">RAS Q&A</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative text-sm font-medium transition-colors hover:text-primary flex items-center space-x-1",
                pathname === item.href ? "text-primary" : "text-foreground/80"
              )}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.name}</span>
              {pathname === item.href && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full hover:bg-muted transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <Link
            href={user ? "/profile" : "/login"}
            className="hidden md:flex items-center space-x-2 px-6 py-2.5 rounded-full bg-primary/10 border border-primary/50 text-primary hover:bg-primary hover:text-white transition-all font-bold shadow-lg shadow-primary/5 hover:shadow-primary/20 hover:scale-105 active:scale-95"
          >
            <User className="w-4 h-4" />
            <span>{user ? "Profile" : "Login"}</span>
          </Link>
          <button
            className="md:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden glass absolute top-full left-0 right-0 p-6 flex flex-col space-y-4 border-t border-border"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex items-center space-x-3 text-lg font-medium p-2 rounded-lg",
                pathname === item.href ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </Link>
          ))}
          <Link
            href={user ? "/profile" : "/login"}
            onClick={() => setIsOpen(false)}
            className="flex items-center space-x-3 text-lg font-medium p-2 rounded-lg bg-primary text-white"
          >
            <User className="w-5 h-5" />
            <span>{user ? "Profile" : "Login"}</span>
          </Link>
        </motion.div>
      )}
    </nav>
  );
}
