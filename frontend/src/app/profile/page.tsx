"use client";

import { motion } from "framer-motion";
import { User, Mail, Shield, Save, LogOut, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    const savedUser = localStorage.getItem("user");
    
    if (!savedUser) {
      setLoading(false);
      return;
    }

    try {
      const { id } = JSON.parse(savedUser);
      const response = await fetch(`http://localhost:8000/api/profile/?user_id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Fetch Profile Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const savedUser = localStorage.getItem("user");
    const { id } = savedUser ? JSON.parse(savedUser) : { id: null };

    const data = {
      user_id: id,
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      email: formData.get("email"),
    };

    try {
      const response = await fetch("http://localhost:8000/api/profile/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const updatedData = await response.json();
        localStorage.setItem("user", JSON.stringify({
          id: id,
          username: user.username,
          email: data.email,
          first_name: data.first_name,
        }));
        alert("Profile updated successfully!");
        fetchProfile();
      }
    } catch (error) {
      console.error("Update Profile Error:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await fetch("http://localhost:8000/api/logout/", { method: "POST" });
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (!user) return (
    <div className="h-screen flex flex-col items-center justify-center space-y-6">
      <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center">
        <User className="w-10 h-10 text-primary" />
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-serif font-bold gold-gradient mb-2">Access Denied</h2>
        <p className="text-muted-foreground">Please sign in to view your profile and ancient scrolls.</p>
      </div>
      <Link 
        href="/login"
        className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all"
      >
        Sign In
      </Link>
    </div>
  );
  return (
    <div className="pt-32 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass p-8 md:p-12 rounded-3xl border-primary/20 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl -z-10 rounded-full" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
            <div className="relative group">
              <div className="w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center border-4 border-primary/30">
                <User className="w-16 h-16 text-primary" />
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-serif font-bold gold-gradient mb-2">
                {user.first_name || user.username}
              </h1>
              <p className="text-muted-foreground">Premium Member Since 2024</p>
            </div>
            <div className="md:ml-auto">
              <button 
                onClick={handleLogout}
                className="flex items-center gap-2 px-6 py-3 glass hover:bg-red-500/10 hover:text-red-500 transition-all rounded-xl font-bold"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">First Name</label>
              <input 
                name="first_name"
                defaultValue={user.first_name}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Last Name</label>
              <input 
                name="last_name"
                defaultValue={user.last_name}
                className="w-full bg-muted/50 border border-border rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  name="email"
                  defaultValue={user.email}
                  className="w-full bg-muted/50 border border-border rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-primary/50 outline-none" 
                />
              </div>
            </div>
            <div className="md:col-span-2">
              <button 
                disabled={saving}
                type="submit"
                className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {saving ? "Saving Changes..." : <><Save className="w-5 h-5" /> Save Changes</>}
              </button>
            </div>
          </form>

          <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
             <Shield className="w-10 h-10 text-primary" />
             <div>
               <h3 className="font-bold">Privacy & Security</h3>
               <p className="text-sm text-muted-foreground">Your data is encrypted and stored securely in our ancient vaults.</p>
             </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
