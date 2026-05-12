"use client"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Logo } from "@/components/logo"
import { ArrowLeft, Download } from "lucide-react"
import { Icon } from "@iconify/react"

export default function DownloadPage(): React.ReactElement {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background relative overflow-x-hidden flex flex-col">
      {/* Subtle Grain Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9999] opacity-[0.03]" 
        style={{ 
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
        }} 
      />

      <div className="container mx-auto max-w-[1100px] px-6 relative z-10 flex-1 flex flex-col">
        <nav className="flex items-center justify-between py-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Logo className="h-8 w-auto text-foreground group-hover:opacity-80 transition-opacity" />
            <div className="font-mono text-xl font-bold tracking-tighter group-hover:opacity-80 transition-opacity">CORTEX</div>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="sm" className="hover:bg-muted text-muted-foreground hover:text-foreground h-9 px-4 text-xs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </nav>

        <main className="flex-1 flex flex-col items-center justify-center py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-4">
              Download Cortex
            </h1>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              Choose your platform below to get started. 
              <br className="hidden md:block" />
              <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-widest mt-4 block">
                Current Version: v1.0.9 — Released May 2026
              </span>
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto">
            {/* macOS Card */}
            <div className="p-[1px] bg-gradient-to-b from-border to-transparent rounded-xl flex">
              <div className="flex-1 bg-background rounded-[10px] p-8 flex flex-col items-center text-center hover:bg-muted transition-colors group">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:bg-accent transition-colors border border-border">
                  <Icon icon="mdi:apple" className="h-8 w-8 text-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">macOS</h2>
                <p className="text-muted-foreground text-sm mb-8 flex-1">
                  Requires macOS 11.0 or later. Universal binary for Intel and Apple Silicon.
                </p>
                <Button className="w-full bg-foreground text-background hover:opacity-90 font-medium">
                  <Download className="mr-2 h-4 w-4" />
                  Download .dmg
                </Button>
              </div>
            </div>

            {/* Windows Card */}
            <div className="p-[1px] bg-gradient-to-b from-border to-transparent rounded-xl flex">
              <div className="flex-1 bg-background rounded-[10px] p-8 flex flex-col items-center text-center hover:bg-muted transition-colors group">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:bg-accent transition-colors border border-border">
                  <Icon icon="mdi:microsoft-windows" className="h-8 w-8 text-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">Windows</h2>
                <p className="text-muted-foreground text-sm mb-8 flex-1">
                  Requires Windows 10 or later. Optimized for 64-bit systems.
                </p>
                <Button className="w-full bg-foreground text-background hover:opacity-90 font-medium">
                  <Download className="mr-2 h-4 w-4" />
                  Download .exe
                </Button>
              </div>
            </div>

            {/* Linux Card */}
            <div className="p-[1px] bg-gradient-to-b from-border to-transparent rounded-xl flex">
              <div className="flex-1 bg-background rounded-[10px] p-8 flex flex-col items-center text-center hover:bg-muted transition-colors group">
                <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-6 group-hover:bg-accent transition-colors border border-border">
                  <Icon icon="mdi:linux" className="h-8 w-8 text-foreground" />
                </div>
                <h2 className="text-xl font-medium mb-2">Linux</h2>
                <p className="text-muted-foreground text-sm mb-8 flex-1">
                  Available as an AppImage. Compatible with most major distributions.
                </p>
                <Button className="w-full bg-foreground text-background hover:opacity-90 font-medium">
                  <Download className="mr-2 h-4 w-4" />
                  Download .AppImage
                </Button>
              </div>
            </div>
          </div>
        </main>

        <footer className="py-8 border-t border-border text-muted-foreground text-xs text-center">
          © 2026 Cortex Labs. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
