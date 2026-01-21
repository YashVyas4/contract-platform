import { useState } from 'react'
import './App.css'
import { ContractProvider } from './state/contractStore'
import { AppShell, type View } from './components/AppShell'
import { BlueprintDesigner } from './components/BlueprintDesigner'
import { ContractDashboard } from './components/ContractDashboard'
import { ContractEditor } from './components/ContractEditor'
import { NewContractForm } from './components/NewContractForm'

function AppInner() {
  const [view, setView] = useState<View>('dashboard')

  return (
    <AppShell currentView={view} onChangeView={setView}>
      {view === 'blueprints' && <BlueprintDesigner />}
      {view === 'new-contract' && (
        <section className="layout-single">
          <NewContractForm />
        </section>
      )}
      {view === 'dashboard' && (
        <section className="layout layout-contracts">
          <ContractDashboard />
          <ContractEditor />
        </section>
      )}
    </AppShell>
  )
}

function App() {
  return (
    <ContractProvider>
      <AppInner />
    </ContractProvider>
  )
}

export default App
