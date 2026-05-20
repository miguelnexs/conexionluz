import { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { TitleBar } from '../components/TitleBar'
import { Sidebar } from '../components/Sidebar'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps): JSX.Element {
  const location = useLocation()

  if (location.pathname === '/' || location.pathname === '/login') {
    return <div className="h-screen w-full bg-background overflow-auto text-foreground font-sans flex flex-col">{children}</div>
  }

  return (
    <div className="h-screen bg-background text-foreground flex flex-col font-sans overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar className="hidden md:flex border-r shrink-0" />
        <main className="relative flex-1 min-w-0 overflow-y-auto overflow-x-hidden p-6 animate-in fade-in duration-500">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
            <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl opacity-80" />
            <div className="absolute bottom-0 -right-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl opacity-80" />
          </div>
          <div className="relative mx-auto w-full max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
