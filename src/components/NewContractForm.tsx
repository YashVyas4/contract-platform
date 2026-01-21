import { useState } from 'react'
import { useContractStore } from '../state/contractStore'

export function NewContractForm() {
  const { blueprints, dispatch } = useContractStore()
  const [blueprintId, setBlueprintId] = useState(blueprints[0]?.id ?? '')
  const [name, setName] = useState('')

  function handleCreate() {
    if (!blueprints.length || !blueprintId || !name.trim()) return
    dispatch({
      type: 'create-contract-from-blueprint',
      payload: { blueprintId, name: name.trim() },
    })
    setName('')
  }

  return (
    <section className="panel">
      <h2>New contract from blueprint</h2>
      <p className="muted small">
        Choose a blueprint and give this contract a name. It will inherit all fields
        from the selected blueprint.
      </p>
      <label className="field">
        <span>Blueprint</span>
        <select
          value={blueprintId}
          onChange={(e) => setBlueprintId(e.target.value)}
        >
          {blueprints.map((bp) => (
            <option key={bp.id} value={bp.id}>
              {bp.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        <span>Contract name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="NDA – Example Vendor"
        />
      </label>
      <button className="primary" onClick={handleCreate}>
        Create contract
      </button>
    </section>
  )
}

