import type { ReactNode } from 'react'

type View = 'dashboard' | 'blueprints' | 'new-contract'

interface AppShellProps {
  currentView: View
  onChangeView: (view: View) => void
  children: ReactNode
}

export type { View }

export function AppShell({ currentView, onChangeView, children }: AppShellProps) {
  return (
    <div className="page">
      <header className="topbar">
        <div>
          <p className="eyebrow">Contract Platform</p>
          <h1>Contract Management Workspace</h1>
          <p className="muted">
            Design blueprints, generate contracts, and control contract lifecycle.
          </p>
        </div>
        <nav className="topbar-actions">
          <button
            className={currentView === 'dashboard' ? 'chip selected' : 'chip'}
            onClick={() => onChangeView('dashboard')}
          >
            Contracts
          </button>
          <button
            className={currentView === 'new-contract' ? 'chip selected' : 'chip'}
            onClick={() => onChangeView('new-contract')}
          >
            New Contract
          </button>
          <button
            className={currentView === 'blueprints' ? 'chip selected' : 'chip'}
            onClick={() => onChangeView('blueprints')}
          >
            Blueprints
          </button>
        </nav>
      </header>
      {children}
    </div>
  )
}

