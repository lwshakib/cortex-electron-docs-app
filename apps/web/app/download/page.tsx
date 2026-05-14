"use client"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { Logo } from "@/components/logo"
import { ArrowLeft, Download } from "lucide-react"
import { Icon } from "@iconify/react"
import {
  MAC_DOWNLOAD_URL,
  WINDOWS_DOWNLOAD_URL,
  LINUX_DOWNLOAD_URL,
} from "@/lib/constants"
import { version } from "../../package.json"

export default function DownloadPage(): React.ReactElement {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden bg-background font-sans text-foreground selection:bg-foreground selection:text-background">
      {/* Subtle Grain Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 container mx-auto flex max-w-[1100px] flex-1 flex-col px-6">
        <nav className="flex items-center justify-between py-8">
          <Link href="/" className="group flex items-center gap-2">
            <Logo className="h-8 w-auto text-foreground transition-opacity group-hover:opacity-80" />
            <div className="font-mono text-xl font-bold tracking-tighter transition-opacity group-hover:opacity-80">
              CORTEX
            </div>
          </Link>
          <Link href="/">
            <Button
              variant="ghost"
              size="sm"
              className="h-9 px-4 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </nav>

        <main className="flex flex-1 flex-col items-center justify-center py-16">
          <div className="mb-16 text-center">
            <h1 className="mb-4 text-4xl font-semibold tracking-tight md:text-5xl">
              Download Cortex
            </h1>
            <p className="mx-auto max-w-[600px] text-lg text-muted-foreground">
              Choose your platform below to get started.
              <br className="hidden md:block" />
              <span className="mt-4 block font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                Current Version: v{version} — Released May 2026
              </span>
            </p>
          </div>

          <div className="mx-auto grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-3">
            {/* macOS Card */}
            <div className="flex rounded-xl bg-gradient-to-b from-border to-transparent p-[1px]">
              <div className="group flex flex-1 flex-col items-center rounded-[10px] bg-background p-8 text-center transition-colors hover:bg-muted">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted transition-colors group-hover:bg-accent">
                  <Icon icon="mdi:apple" className="h-8 w-8 text-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-medium">macOS</h2>
                <p className="mb-8 flex-1 text-sm text-muted-foreground">
                  Requires macOS 11.0 or later. Universal binary for Intel and
                  Apple Silicon.
                </p>
                <a href={MAC_DOWNLOAD_URL} className="w-full">
                  <Button className="w-full cursor-pointer bg-foreground font-medium text-background hover:opacity-90">
                    <Download className="mr-2 h-4 w-4" />
                    Download .dmg
                  </Button>
                </a>
              </div>
            </div>

            {/* Windows Card */}
            <div className="flex rounded-xl bg-gradient-to-b from-border to-transparent p-[1px]">
              <div className="group flex flex-1 flex-col items-center rounded-[10px] bg-background p-8 text-center transition-colors hover:bg-muted">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted transition-colors group-hover:bg-accent">
                  <Icon
                    icon="mdi:microsoft-windows"
                    className="h-8 w-8 text-foreground"
                  />
                </div>
                <h2 className="mb-2 text-xl font-medium">Windows</h2>
                <p className="mb-8 flex-1 text-sm text-muted-foreground">
                  Requires Windows 10 or later. Optimized for 64-bit systems.
                </p>
                <a href={WINDOWS_DOWNLOAD_URL} className="w-full">
                  <Button className="w-full cursor-pointer bg-foreground font-medium text-background hover:opacity-90">
                    <Download className="mr-2 h-4 w-4" />
                    Download .exe
                  </Button>
                </a>
              </div>
            </div>

            {/* Linux Card */}
            <div className="flex rounded-xl bg-gradient-to-b from-border to-transparent p-[1px]">
              <div className="group flex flex-1 flex-col items-center rounded-[10px] bg-background p-8 text-center transition-colors hover:bg-muted">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted transition-colors group-hover:bg-accent">
                  <Icon icon="mdi:linux" className="h-8 w-8 text-foreground" />
                </div>
                <h2 className="mb-2 text-xl font-medium">Linux</h2>
                <p className="mb-8 flex-1 text-sm text-muted-foreground">
                  Available as an AppImage. Compatible with most major
                  distributions.
                </p>
                <a href={LINUX_DOWNLOAD_URL} className="w-full">
                  <Button className="w-full cursor-pointer bg-foreground font-medium text-background hover:opacity-90">
                    <Download className="mr-2 h-4 w-4" />
                    Download .AppImage
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
          © 2026 Cortex Labs. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
