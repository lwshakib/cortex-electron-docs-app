"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Icon } from "@iconify/react"
import { Button } from "@workspace/ui/components/button"
import { Logo } from "@/components/logo"
import {
  LucideIcon,
  Download,
  Zap,
  ShieldCheck,
  Layers,
  Cpu,
  Apple,
  Monitor,
  Terminal,
  Command,
  LayoutDashboard,
  RefreshCw,
} from "lucide-react"
import {
  MAC_DOWNLOAD_URL,
  WINDOWS_DOWNLOAD_URL,
  LINUX_DOWNLOAD_URL,
} from "@/lib/constants"
import { version } from "../package.json"

export default function Page(): React.ReactElement {
  const [ctaText, setCtaText] = useState("Download Now")

  useEffect(() => {
    const platform = window.navigator.platform.toLowerCase()
    if (platform.includes("mac")) {
      setCtaText("Download for macOS")
    } else if (platform.includes("win")) {
      setCtaText("Download for Windows")
    } else if (platform.includes("linux")) {
      setCtaText("Download for Linux")
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-sans text-foreground selection:bg-foreground selection:text-background">
      {/* Subtle Grain Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 container mx-auto max-w-[1100px] px-6">
        <nav className="flex items-center justify-between py-8">
          <div className="flex items-center gap-2">
            <Logo className="h-8 w-auto text-foreground" />
            <div className="font-mono text-xl font-bold tracking-tighter">
              CORTEX
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/lwshakib/cortex"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <Icon icon="mdi:github" className="h-6 w-6" />
            </a>
            <Link href="/download">
              <Button
                variant="outline"
                size="sm"
                className="h-9 border-border bg-transparent px-4 text-xs text-foreground hover:bg-muted"
              >
                Get App
              </Button>
            </Link>
          </div>
        </nav>

        <section className="relative py-24 text-center sm:py-32">
          {/* Hero Glow */}
          <div className="absolute top-[-10%] left-1/2 -z-10 h-[300px] w-[600px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(255,255,255,0.08)_0%,rgba(10,10,10,0)_70%)]" />

          <h1 className="mb-4 text-5xl font-semibold tracking-[-0.04em] sm:text-7xl">
            Your ideas, organized.
          </h1>
          <p className="mx-auto mb-12 max-w-[600px] text-xl text-muted-foreground">
            The intelligent document management platform designed for thinkers.
            Local-first, distraction-free, and blazing fast.
          </p>

          <Link href="/download">
            <Button
              size="lg"
              className="h-12 rounded-md bg-foreground px-8 font-semibold text-background transition-transform hover:-translate-y-0.5 hover:opacity-90"
            >
              <Download className="mr-2 h-5 w-5" />
              {ctaText}
            </Button>
          </Link>
        </section>

        <div className="mt-20 rounded-xl bg-gradient-to-b from-border to-transparent p-[2px]">
          <div className="group relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-[10px] bg-muted">
            <img
              src="/demos/light_demo.png"
              alt="Cortex App Demo Light"
              className="block h-full w-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-80 dark:hidden"
            />
            <img
              src="/demos/dark_demo.png"
              alt="Cortex App Demo Dark"
              className="hidden h-full w-full object-cover opacity-60 transition-opacity duration-700 group-hover:opacity-80 dark:block"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-40" />
          </div>
        </div>

        <section className="grid grid-cols-1 gap-8 py-24 md:grid-cols-2 lg:grid-cols-3">
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

        <section
          id="download"
          className="border-t border-border py-24 text-center"
        >
          <div className="mb-8 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">
            Current Version: v{version} — Released May 2026
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <DownloadButton
              icon={Apple}
              label="macOS (.dmg)"
              href={MAC_DOWNLOAD_URL}
            />
            <DownloadButton
              icon={Monitor}
              label="Windows (.exe)"
              href={WINDOWS_DOWNLOAD_URL}
            />
            <DownloadButton
              icon={Terminal}
              label="Linux (.AppImage)"
              href={LINUX_DOWNLOAD_URL}
            />
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between border-t border-border py-16 text-sm text-muted-foreground md:flex-row">
          <div className="mb-8 md:mb-0">© 2026 Cortex Labs</div>
          <div className="flex gap-8">
            <a href="#" className="transition-colors hover:text-foreground">
              Docs
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              GitHub
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              Changelog
            </a>
            <a href="#" className="transition-colors hover:text-foreground">
              License
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: any
  title: string
  description: string
}): React.ReactElement {
  return (
    <div className="group rounded-lg border border-border p-8 transition-colors hover:border-foreground/20">
      <Icon className="mb-6 h-6 w-6 text-muted-foreground transition-colors group-hover:text-foreground" />
      <h3 className="mb-3 text-base font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
    </div>
  )
}

function DownloadButton({
  icon: Icon,
  label,
  href,
}: {
  icon: any
  label: string
  href: string
}): React.ReactElement {
  return (
    <a href={href}>
      <Button
        variant="outline"
        className="h-12 cursor-pointer rounded-md border-border bg-transparent px-6 text-foreground hover:bg-muted"
      >
        <Icon className="mr-2 h-5 w-5" />
        {label}
      </Button>
    </a>
  )
}
