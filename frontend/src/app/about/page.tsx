"use client";

import { motion } from "framer-motion";
import { Book, Shield, Zap, Heart, Award, Globe, Code, Cpu, Database, Server } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const team = [
  {
    name: "Nabeel Ali Khan",
    role: "Backend Developer",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400",
  },
  {
    name: "Ayaz",
    role: "Frontend Developer",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400",
  },

];

const features = [
  {
    title: "File Upload Integration",
    desc: "Users can upload documents to provide context for AI answers.",
    icon: Database,
  },
  {
    title: "Contextual AI Responses",
    desc: "Answers are generated based on the uploaded content for precise guidance.",
    icon: Cpu,
  },
  {
    title: "Interactive Chat Interface",
    desc: "Simple, user-friendly chatbot interface powered by Django backend.",
    icon: Zap,
  },
  {
    title: "Dynamic Knowledge Base",
    desc: "Supports continuous learning as users interact with the system.",
    icon: Book,
  },
];

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24 relative"
        >
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 blur-[120px] rounded-full -z-10" />
          <h1 className="text-6xl md:text-7xl font-serif font-bold mb-8 gold-gradient">About Us</h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We create cutting-edge AI solutions with a touch of ancient Greek wisdom —
            blending modern innovation with timeless knowledge.
          </p>
        </motion.div>

        {/* Mission Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="glass p-10 rounded-3xl border-primary/20 relative"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Shield className="w-24 h-24 text-primary" />
            </div>
            <h2 className="text-4xl font-serif font-bold mb-6 gold-gradient">Our Mission</h2>
            <p className="text-lg text-foreground/80 leading-relaxed mb-6">
              Our AI-powered Chatbot platform integrates file upload and intelligent conversational capabilities
              to assist users with contextual answers based on their uploaded documents.
            </p>
            <p className="text-lg text-foreground/80 leading-relaxed">
              Powered by Django and Next.js, we aim for efficiency, productivity, and accessibility in every interaction.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-primary/10"
          >
            <Image
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1000"
              alt="Mission Vision"
              fill
              className="object-cover"
            />
          </motion.div>
        </section>

        {/* Project Overview */}
        <section className="mb-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl font-serif font-bold mb-8 gold-gradient">Project Overview</h2>
            <div className="glass p-10 rounded-3xl border-primary/10">
              <p className="text-xl text-foreground/80 leading-relaxed italic font-light">
                <strong>RAS Q&A</strong> is an intelligent, AI-powered question-answering platform that integrates
                advanced natural language processing with file-based document understanding.
                Users can upload PDFs, DOCX files, or text documents, and the system provides contextual,
                accurate answers to their queries based on the content of these documents.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Key Features */}
        <section className="mb-32">
          <h2 className="text-4xl font-serif font-bold mb-12 text-center gold-gradient">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-2xl border-primary/10 hover:border-primary/40 transition-all group"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-4">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Team Section */}
        <section className="mb-32">
          <h2 className="text-5xl font-serif font-bold mb-16 text-center gold-gradient">Meet the Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group glass rounded-3xl overflow-hidden border-primary/10 hover:border-primary/50 transition-all"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-primary text-sm font-medium tracking-widest uppercase">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Technologies */}
        <section className="mb-32 ancient-scroll p-12 rounded-3xl relative">
          <div className="absolute inset-0 bg-background/60 backdrop-blur-sm rounded-3xl" />
          <div className="relative z-10 text-center">
            <h2 className="text-4xl font-serif font-bold mb-12 gold-gradient">Technologies Used</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="space-y-2">
                <Server className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-bold">Backend</div>
                <div className="text-sm text-muted-foreground">Django, Python</div>
              </div>
              <div className="space-y-2">
                <Code className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-bold">Frontend</div>
                <div className="text-sm text-muted-foreground">Next.js, Tailwind CSS</div>
              </div>
              <div className="space-y-2">
                <Cpu className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-bold">AI & NLP</div>
                <div className="text-sm text-muted-foreground">Gemini, RAG</div>
              </div>
              <div className="space-y-2">
                <Database className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-bold">Database</div>
                <div className="text-sm text-muted-foreground">PostgreSQL, SQLite</div>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="text-center">
          <h2 className="text-5xl font-serif font-bold mb-12 gold-gradient">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-primary/20 -z-10" />
            {[
              { step: 1, title: "Upload", desc: "Upload your document (PDF, DOCX, TXT)." },
              { step: 2, title: "Process", desc: "Our AI analyzes and indexes the content." },
              { step: 3, title: "Ask", desc: "Get instant, accurate, contextual answers." },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass p-8 rounded-full aspect-square flex flex-col items-center justify-center border-primary/20 group hover:border-primary transition-all shadow-xl"
              >
                <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center font-bold mb-4 shadow-lg">{s.step}</div>
                <h3 className="text-xl font-bold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground max-w-[150px]">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Join Our Mission CTA */}
        <section className="mb-24">
          <div className="glass p-12 rounded-[3rem] relative overflow-hidden border-primary/20 text-center">
             <div className="absolute inset-0 bg-primary/5 -z-10" />
             <div className="max-w-2xl mx-auto space-y-6">
               <h2 className="text-4xl font-serif font-bold gold-gradient">Join Our Mission</h2>
               <p className="text-lg text-muted-foreground">
                 Whether you are a student, researcher, or curious mind, RAS Q&A is here to help you unlock the knowledge within your documents.
               </p>
               <Link 
                 href="/signup" 
                 className="inline-block px-10 py-4 bg-primary text-white rounded-full font-bold text-lg shadow-xl hover:scale-105 hover:shadow-primary/20 transition-all"
               >
                 Start Seeking Wisdom
               </Link>
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}
