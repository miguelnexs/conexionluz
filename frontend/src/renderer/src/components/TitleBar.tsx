import { useState, useEffect } from 'react'
import { Minus, Square, X, Copy } from 'lucide-react'
import { isElectron, safeIpc } from '../utils/platform'
import logo from '../assets/logo.png'

export function TitleBar(): JSX.Element {
  const [isMaximized, setIsMaximized] = useState(false)

  useEffect(() => {
    if (!isElectron()) return
    // Optimistic check or event listener could go here
  }, [])

  const handleMaximize = () => {
    safeIpc.send('window-maximize', null)
    setIsMaximized(!isMaximized)
  }

  if (!isElectron()) return <></>

  return (
    <div className="h-9 bg-background flex items-center justify-between select-none border-b drag z-50">
      <div className="flex items-center gap-2 px-3 no-drag">
        <img src={logo} alt="icon" className="w-4 h-4" />
        <span className="text-xs font-medium text-muted-foreground">Conexión Luz</span>
      </div>
      
      <div className="flex h-full no-drag">
        <button 
          onClick={() => safeIpc.send('window-minimize', null)}
          className="h-full w-12 flex items-center justify-center hover:bg-muted transition-colors focus:outline-none"
        >
          <Minus className="w-4 h-4 text-foreground" />
        </button>
        <button 
          onClick={handleMaximize}
          className="h-full w-12 flex items-center justify-center hover:bg-muted transition-colors focus:outline-none"
        >
          {isMaximized ? (
            <Copy className="w-3.5 h-3.5 text-foreground rotate-180" />
          ) : (
            <Square className="w-3.5 h-3.5 text-foreground" />
          )}
        </button>
        <button 
          onClick={() => safeIpc.send('window-close', null)}
          className="h-full w-12 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors focus:outline-none"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
