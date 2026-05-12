"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { Button } from "@workspace/ui/components/button"
import { Logo } from "@/components/logo"
import { LucideIcon, Download, Zap, ShieldCheck, Layers, Cpu, Apple, Monitor, Terminal, Command, LayoutDashboard, RefreshCw } from "lucide-react"

export default function Page(): React.ReactElement {
  const [ctaText, setCtaText] = useState("Download Now")

  useEffect(() => {
    const platform = window.navigator.platform.toLowerCase()
    if (platform.includes('mac')) {
      setCtaText('Download for macOS')
    } else if (platform.includes('win')) {
      setCtaText('Download for Windows')
    } else if (platform.includes('linux')) {
      setCtaText('Download for Linux')
    }
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background relative overflow-x-hidden">
      {/* Subtle Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      <div className="container mx-auto max-w-[1100px] px-6 relative z-10">
        <nav className="flex items-center justify-between py-8">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-foreground" />
            <div className="font-mono text-xl font-bold tracking-tighter">CORTEX</div>
          </div>
          <div className="flex items-center gap-4">
            <a href="https://github.com/lwshakib/cortex" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Icon icon="mdi:github" className="h-6 w-6" />
            </a>
            <Link href="/download">
              <Button variant="outline" size="sm" className="bg-transparent border-border hover:bg-muted text-foreground h-9 px-4 text-xs">
                Get App
              </Button>
            </Link>
          </div>
        </nav>

        <section className="relative py-24 text-center sm:py-32">
          {/* Hero Glow */}
          <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(10,10,10,0)_70%)] -z-10" />
          
          <h1 className="text-5xl font-semibold tracking-[-0.04em] sm:text-7xl mb-4">
            Your ideas, organized.
          </h1>
          <p className="text-muted-foreground text-xl max-w-[600px] mx-auto mb-12">
            The intelligent document management platform designed for thinkers. Local-first, distraction-free, and blazing fast.
          </p>
          
          <Link href="/download">
            <Button size="lg" className="bg-foreground text-background hover:opacity-90 transition-transform hover:-translate-y-0.5 h-12 px-8 font-semibold rounded-md">
              <Download className="mr-2 h-5 w-5" />
              {ctaText}
            </Button>
          </Link>
        </section>

        <div className="mt-20 p-[2px] bg-gradient-to-b from-border to-transparent rounded-xl">
          <div className="aspect-[16/9] w-full bg-muted rounded-[10px] flex items-center justify-center relative overflow-hidden group">
            <img 
              src="/light_demo.png" 
              alt="Cortex App Demo Light" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 dark:hidden block" 
            />
            <img 
              src="/dark_demo.png" 
              alt="Cortex App Demo Dark" 
              className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 hidden dark:block" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
          </div>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-24">
          <FeatureCard 
            icon={Zap} 
            title="BlockNote Editing" 
            description="Experience a fluid, block-based editor. Create rich content with sub-10ms response times." 
          />
          <FeatureCard 
            icon={ShieldCheck} 
            title="Local-First" 
            description="Your data never leaves your machine. Local storage ensures maximum privacy and speed." 
          />
          <FeatureCard 
            icon={Layers} 
            title="Hierarchical Docs" 
            description="Organize your knowledge base with unlimited nested documents and structured folders." 
          />
          <FeatureCard 
            icon={Cpu} 
            title="Instant Search" 
            description="Find any document in milliseconds with full-text search across your entire workspace." 
          />
          <FeatureCard 
            icon={LayoutDashboard} 
            title="Split-Screen UI" 
            description="Seamlessly navigate documents and content side-by-side with our fully resizable, dual-pane architecture." 
          />
          <FeatureCard 
            icon={RefreshCw} 
            title="Auto-Updates" 
            description="Stay on the cutting edge effortlessly. Background updates ensure you always have the latest improvements." 
          />
        </section>

        <section id="download" className="py-24 text-center border-t border-border">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest mb-8">
            Current Version: v1.0.7 — Released May 2026
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <DownloadButton icon={Apple} label="macOS (.dmg)" />
            <DownloadButton icon={Monitor} label="Windows (.exe)" />
            <DownloadButton icon={Terminal} label="Linux (.AppImage)" />
          </div>
        </section>

        <footer className="flex flex-col md:flex-row items-center justify-between py-16 border-t border-border text-muted-foreground text-sm">
          <div className="mb-8 md:mb-0">© 2026 Cortex Labs</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-foreground transition-colors">Docs</a>
            <a href="#" className="hover:text-foreground transition-colors">GitHub</a>
            <a href="#" className="hover:text-foreground transition-colors">Changelog</a>
            <a href="#" className="hover:text-foreground transition-colors">License</a>
          </div>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({ icon: Icon, title, description }: { icon: any, title: string, description: string }): React.ReactElement {
  return (
    <div className="p-8 border border-border rounded-lg hover:border-foreground/20 transition-colors group">
      <Icon className="h-6 w-6 text-muted-foreground mb-6 group-hover:text-foreground transition-colors" />
      <h3 className="text-base font-semibold mb-3">{title}</h3>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </div>
  )
}

function DownloadButton({ icon: Icon, label }: { icon: any, label: string }): React.ReactElement {
  return (
    <Button variant="outline" className="bg-transparent border-border hover:bg-muted text-foreground h-12 px-6 rounded-md">
      <Icon className="mr-2 h-5 w-5" />
      {label}
    </Button>
  )
}
