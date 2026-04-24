"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, BookOpen, UserCheck, ArrowRight, BrainCircuit, ShieldCheck, History } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Instant Answers",
    description: "Get responses in a flash, like a message from the Oracle. Optimized for speed and precision.",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
  },
  {
    title: "Vast Knowledge",
    description: "Like the Library of Alexandria, but in your pocket. Access a universe of information instantly.",
    icon: BookOpen,
    color: "from-green-400 to-emerald-600",
  },
  {
    title: "Easy to Use",
    description: "Clean, simple, and built for philosophers and thinkers alike. No steep learning curve.",
    icon: UserCheck,
    color: "from-purple-400 to-indigo-600",
  },
];

const highlights = [
  {
    category: "Did You Know?",
    content: "The famous Peaky Blinders gang actually existed in Birmingham, England, in the late 19th century.",
    icon: History,
    color: "border-red-500",
  },
  {
    category: "Fun Fact",
    content: "Honey never spoils! Archaeologists have found edible honey in ancient Egyptian tombs.",
    icon: Sparkles,
    color: "border-blue-500",
  },
  {
    category: "Science Bite",
    content: "Octopuses have three hearts and blue blood! Two hearts pump to the gills, one to the body.",
    icon: BrainCircuit,
    color: "border-green-500",
  },
];

export default function Home() {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-32">
        <div className="absolute inset-0 bg-animate-gradient bg-[length:400%_400%] opacity-20 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--primary)_0%,_transparent_50%)] opacity-10 -z-10" />
        
        <div className="container px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-8xl font-serif font-extrabold mb-6 leading-tight">
              Welcome to <span className="gold-gradient">RAS Q&A</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Your intelligent resource for clear, concise answers — inspired by the 
              <span className="text-primary font-medium italic"> wisdom of the ancients</span> and powered by modern AI.
            </p>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-4">
              <Link
                href="/chatbot"
                className="group relative px-8 py-4 bg-primary text-white rounded-full font-bold text-lg overflow-hidden shadow-xl hover:shadow-primary/30 transition-all active:scale-95"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative flex items-center gap-2">
                  <Zap className="w-5 h-5 fill-current" />
                  Ask a Question Now
                </span>
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 glass rounded-full font-bold text-lg hover:bg-muted transition-all active:scale-95 flex items-center gap-2"
              >
                Learn More
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>

          {/* Decorative Elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="mt-20 relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50" />
            <div className="glass rounded-2xl p-4 overflow-hidden border-primary/20">
              <div className="h-[400px] md:h-[500px] relative rounded-xl overflow-hidden group">
                 <Image 
                   src="https://images.unsplash.com/photo-1543269664-56d93c1b41a6?auto=format&fit=crop&q=80&w=2000" 
                   alt="Ancient Wisdom AI" 
                   fill 
                   className="object-cover group-hover:scale-105 transition-transform duration-700"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                 <div className="absolute bottom-8 left-8 text-left">
                    <div className="text-white/60 text-sm uppercase tracking-widest mb-2">Modern Innovation</div>
                    <div className="text-white text-3xl font-serif">Classical Intelligence</div>
                 </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container px-6 mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gold-gradient">Why Choose RAS Q&A?</h2>
            <p className="text-muted-foreground italic text-lg">Wisdom worth its weight in gold.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 glass rounded-2xl hover:scale-105 transition-all duration-300 border-primary/10 hover:border-primary/50"
              >
                <div className={cn("w-14 h-14 rounded-xl mb-6 flex items-center justify-center bg-gradient-to-br shadow-lg text-white", feature.color)}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-24 ancient-scroll relative">
        <div className="absolute inset-0 bg-white/60 dark:bg-black/60 backdrop-blur-[2px]" />
        <div className="container px-6 mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4 gold-gradient">Daily Highlights</h2>
            <p className="text-foreground/80 italic text-lg">Curiosities to spark your mind.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {highlights.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={cn("p-6 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border-l-8 hover:scale-105 transition-transform", item.color)}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-muted text-primary">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-primary tracking-wide uppercase text-sm">{item.category}</span>
                </div>
                <p className="text-lg leading-relaxed">{item.content}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container px-6 mx-auto">
          <div className="glass p-12 rounded-3xl relative overflow-hidden text-center border-primary/30 flex flex-col items-center justify-center min-h-[500px]">
            <div className="absolute inset-0 -z-20">
               <Image 
                 src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=2000" 
                 alt="Ancient Library" 
                 fill 
                 className="object-cover opacity-20"
               />
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 blur-[100px] -z-10" />
            
            <h2 className="text-4xl md:text-6xl font-serif font-bold mb-6 gold-gradient">Ready to seek wisdom?</h2>
            <p className="text-xl text-foreground mb-10 max-w-2xl mx-auto font-medium">
              Join thousands of philosophers, students, and curious minds. Start your journey into intelligence today.
            </p>
            <Link
              href="/chatbot"
              className="inline-flex items-center gap-2 px-10 py-5 bg-primary text-white rounded-full font-bold text-xl shadow-2xl hover:scale-110 hover:shadow-primary/40 transition-all active:scale-95"
            >
              Get Started
              <ArrowRight className="w-6 h-6" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
