import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/', label: 'Browse', icon: 'explore' },
  { path: '/compare', label: 'Compare', icon: 'compare_arrows' },
  { path: '/insights', label: 'Insights', icon: 'insights' },
]

export default function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body-lg selection:bg-primary-fixed selection:text-on-primary-fixed">
      <header className="bg-surface sticky top-0 z-50 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] h-20 w-full border-b border-surface-container-high/50">
        <div className="flex justify-between items-center px-4 sm:px-margin-desktop h-20 w-full max-w-container-max mx-auto">
          <Link to="/" className="flex items-center gap-2 group">
            <span className="material-symbols-outlined text-primary text-3xl fill-icon">analytics</span>
            <h1 className="font-display text-headline-lg text-primary tracking-tighter font-bold">Statlyx</h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map(item => {
              const isActive = location.pathname === item.path
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "font-body-lg text-body-lg transition-colors py-1",
                    isActive
                      ? "text-primary border-b-2 border-primary font-bold"
                      : "text-on-surface-variant hover:text-primary"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <span className="material-symbols-outlined">{mobileOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-surface-container-lowest border-b border-surface-container-high shadow-lg overflow-hidden"
            >
              <nav className="flex flex-col p-4 gap-2">
                {navItems.map(item => {
                  const isActive = location.pathname === item.path
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg font-body-lg text-body-lg transition-colors",
                        isActive
                          ? "bg-primary-container/10 text-primary font-bold"
                          : "text-on-surface-variant hover:bg-surface-container-low"
                      )}
                    >
                      <span className={cn("material-symbols-outlined", isActive && "fill-icon")}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="max-w-container-max w-full mx-auto px-4 sm:px-margin-desktop py-8 flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest h-16 flex items-center justify-around px-4 border-t border-surface-container-high z-[60]">
        {navItems.map(item => {
          const isActive = location.pathname === item.path
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center",
                isActive ? "text-primary font-bold" : "text-on-surface-variant"
              )}
            >
              <span className={cn("material-symbols-outlined", isActive && "fill-icon")}>{item.icon}</span>
              <span className="text-[10px] font-label-caps mt-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
