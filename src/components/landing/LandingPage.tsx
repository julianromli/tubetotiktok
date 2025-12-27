"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { Play, Sparkles, Link as LinkIcon, Lock, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { tryForFreeAction } from "@/app/actions/project";
import { BriefCard } from "@/components/dashboard/BriefCard";
import type { AiOutput } from "@/lib/validations/ai-output";

export function LandingPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ videoId: string; scripts: AiOutput } | null>(null);

  const handleTryForFree = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);

    try {
      const res = await tryForFreeAction(url);
      setResult(res);
      // Smooth scroll to results
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-dark text-white font-sans overflow-x-hidden min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full z-50 border-b border-white/5 bg-background-dark/80 backdrop-blur-md sticky top-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-gradient-to-br from-primary to-secondary shadow-[0_0_15px_rgba(242,13,85,0.5)]">
                <Play className="text-white fill-white" size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                TubeTo<span className="text-primary">TikTok</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              {isSignedIn ? (
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex items-center justify-center h-10 px-6 rounded-full bg-primary text-white text-sm font-semibold hover:bg-primary-hover transition-all"
                >
                  Dashboard
                </button>
              ) : (
                <div className="flex gap-4">
                  <SignInButton mode="modal">
                    <button className="text-gray-400 hover:text-white text-sm font-medium transition-colors">
                      Login
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="flex items-center justify-center h-10 px-6 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] pointer-events-none opacity-40"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px] pointer-events-none opacity-30"></div>
          
          <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-secondary"></span>
              </span>
              <span className="text-xs font-medium tracking-wide text-gray-400 uppercase">
                AI-Powered Video Repurposing
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-6 max-w-4xl text-white drop-shadow-xl">
              Turn YouTube Videos into <br className="hidden md:block"/>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-pink-400 to-secondary pb-2">
                10 TikToks
              </span> in Seconds
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl font-normal leading-relaxed">
              Stop editing manually. Paste your link and let our AI extract viral moments, create hooks, and generate scripts for TikTok, Reels, and Shorts instantly.
            </p>

            {/* Try for Free Input */}
            <div className="w-full max-w-2xl relative group mb-8">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500"></div>
              <form 
                onSubmit={handleTryForFree}
                className="relative flex flex-col md:flex-row items-center bg-[#1a1a1a]/80 backdrop-blur-xl rounded-xl p-2 border border-white/10 shadow-2xl"
              >
                <div className="flex-1 flex items-center w-full px-4 h-14">
                  <LinkIcon className="text-gray-400 mr-3" size={20} />
                  <input 
                    type="text" 
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="Paste YouTube Link Here"
                    className="w-full bg-transparent border-none text-white placeholder-gray-500 focus:ring-0 text-base md:text-lg h-full px-0"
                    disabled={loading}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={loading || !url}
                  className="w-full md:w-auto mt-2 md:mt-0 h-14 px-8 rounded-lg bg-gradient-to-r from-primary to-[#e60049] hover:from-[#ff1a66] hover:to-primary text-white font-bold text-lg shadow-[0_0_20px_rgba(255,0,81,0.4)] hover:shadow-[0_0_30px_rgba(255,0,81,0.6)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Sparkles size={20} />
                      Try for Free
                    </>
                  )}
                </button>
              </form>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg mb-8">
                <AlertCircle size={18} />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}

            {/* Social Proof Placeholder */}
            <div className="mt-16 pt-8 border-t border-white/5 flex flex-col items-center w-full max-w-3xl">
              <p className="text-sm font-medium text-gray-500 mb-6 uppercase tracking-wider">
                Trusted by Indonesian Creators
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <div className="flex items-center gap-2 group cursor-pointer">
                  <div className="size-8 rounded-full bg-red-600 flex items-center justify-center">
                    <Play size={16} fill="white" className="ml-0.5" />
                  </div>
                  <span className="font-bold text-xl text-white">YouTube</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        {result && (
          <section id="results" className="py-20 bg-background-dark/50 border-t border-white/5">
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500 ring-1 ring-inset ring-green-500/20">
                      <CheckCircle2 size={14} /> Analysis Complete
                    </span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                    10 Viral Clips Generated
                  </h2>
                  <p className="text-gray-400 mt-2">
                    Video ID: <span className="text-white font-medium">{result.videoId}</span>
                  </p>
                </div>
                
                <SignUpButton mode="modal">
                  <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-bold hover:bg-gray-200 transition-all shadow-xl transform hover:-translate-y-1">
                    Sign up to Save & Unlock All
                  </button>
                </SignUpButton>
              </div>

              <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {result.scripts.map((script, index) => (
                  <BriefCard
                    key={index}
                    id={`free-${index}`}
                    title={`Clip #${index + 1}`}
                    hook={script.hook}
                    script_body={script.script_body}
                    cta={script.cta}
                    visual_cue={script.visual_cue}
                    viralScore={9.0 + (Math.random() * 0.9)} // Random score for demo
                    thumbnailUrl={`https://img.youtube.com/vi/${result.videoId}/maxresdefault.jpg`}
                    isLocked={index > 0}
                    onUnlock={() => {
                      const signupBtn = document.querySelector('[data-clerk-signup-button]');
                      if (signupBtn instanceof HTMLElement) signupBtn.click();
                    }}
                  />
                ))}
              </div>

              <div className="mt-20 p-10 rounded-3xl bg-gradient-to-r from-primary/10 to-secondary/10 border border-white/10 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-10">
                  <Lock size={120} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 relative z-10">
                  Want more? Create unlimited projects.
                </h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto relative z-10">
                  Join 1,000+ Indonesian creators who are saving 10+ hours of editing every week.
                </p>
                <SignUpButton mode="modal">
                  <button className="relative z-10 px-8 py-4 bg-primary text-white rounded-2xl font-black text-lg shadow-neon hover:shadow-neon-hover hover:bg-primary-hover transition-all transform hover:-translate-y-1">
                    Get Started for Free
                  </button>
                </SignUpButton>
              </div>
            </div>
          </section>
        )}

        {/* Features Section - Brief Version */}
        {!result && (
          <section className="py-32 border-t border-white/5">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                <div className="flex flex-col items-center text-center">
                  <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 border border-primary/20">
                    <Sparkles size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">AI-Powered Extraction</h3>
                  <p className="text-gray-400">Our Gemini 3 Flash model identifies the most viral moments automatically.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="size-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-secondary mb-6 border border-secondary/20">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Ready-to-Post Scripts</h3>
                  <p className="text-gray-400">Get complete hooks, scripts, and visual cues tailored for Indonesian audiences.</p>
                </div>
                <div className="flex flex-col items-center text-center">
                  <div className="size-16 rounded-2xl bg-accent-cyan/10 flex items-center justify-center text-accent-cyan mb-6 border border-accent-cyan/20">
                    <Loader2 size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white">Save 10+ Hours/Week</h3>
                  <p className="text-gray-400">Convert one 10-minute video into 10 clips in under 60 seconds.</p>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; 2025 TubeToTikTok. Built with ❤️ in Indonesia.</p>
      </footer>
    </div>
  );
}
