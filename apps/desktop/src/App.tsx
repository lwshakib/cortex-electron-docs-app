import { useState } from 'react'
import { Button } from "@workspace/ui/components/button"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8 text-foreground">
      <div className="space-y-2 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Cortex Desktop</h1>
        <p className="text-muted-foreground">
          Powered by Vite, Electron, and Shadcn UI
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <Button 
          size="lg" 
          onClick={() => setCount((count) => count + 1)}
          className="min-w-[200px]"
        >
          Count is {count}
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Edit <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">src/App.tsx</code> to start building
        </p>
      </div>
    </div>
  )
}

export default App
