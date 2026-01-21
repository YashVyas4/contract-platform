import { useState } from 'react'
import type { FieldType } from '../types'
import { useContractStore } from '../state/contractStore'

const FIELD_TYPES: FieldType[] = ['Text', 'Date', 'Signature', 'Checkbox']

export function BlueprintDesigner() {
  const { blueprints, dispatch } = useContractStore()
  const [selectedId, setSelectedId] = useState<string | undefined>(
    blueprints[0]?.id,
  )
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldType, setNewFieldType] = useState<FieldType>('Text')

  const selected = blueprints.find((b) => b.id === selectedId) ?? blueprints[0]

  function handleCreateBlueprint() {
    if (!newName.trim()) return
    dispatch({
      type: 'create-blueprint',
      payload: { name: newName.trim(), description: newDescription.trim() || undefined },
    })
    setNewName('')
    setNewDescription('')
  }

  function handleAddField() {
    if (!selected || !newFieldLabel.trim()) return
    dispatch({
      type: 'add-field',
      payload: {
        blueprintId: selected.id,
        label: newFieldLabel.trim(),
        fieldType: newFieldType,
      },
    })
    setNewFieldLabel('')
    setNewFieldType('Text')
  }

  return (
    <section className="layout layout-blueprints">
      <div className="panel">
        <h2>Create blueprint</h2>
        <label className="field">
          <span>Name</span>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Mutual NDA"
          />
        </label>
        <label className="field">
          <span>Description</span>
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Reusable NDA template for vendors and partners"
          />
        </label>
        <button className="primary" onClick={handleCreateBlueprint}>
          Save blueprint
        </button>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h2>Blueprints</h2>
        </div>
        <div className="field">
          <span>Choose blueprint</span>
          <select
            value={selected?.id ?? ''}
            onChange={(e) => setSelectedId(e.target.value)}
          >
            {blueprints.map((bp) => (
              <option key={bp.id} value={bp.id}>
                {bp.name}
              </option>
            ))}
          </select>
        </div>
        {selected && (
          <>
            <p className="muted small">
              {selected.fields.length} fields · Created{' '}
              {new Date(selected.createdAt).toLocaleDateString()}
            </p>

            <div className="blueprint-grid">
              <div className="blueprint-canvas">
                {selected.fields.map((f) => (
                  <div
                    key={f.id}
                    className="blueprint-field"
                    style={{
                      left: `${f.x * 100}%`,
                      top: `${f.y * 100}%`,
                    }}
                  >
                    <span className="eyebrow">{f.type}</span>
                    <span>{f.label}</span>
                  </div>
                ))}
              </div>
              <div className="blueprint-fields-list">
                <h3>Fields</h3>
                {selected.fields.length === 0 && (
                  <p className="muted small">No fields yet. Add your first field.</p>
                )}
                <ul>
                  {selected.fields.map((f) => (
                    <li key={f.id}>
                      <div>
                        <p>{f.label}</p>
                        <span className="muted small">{f.type}</span>
                      </div>
                      <span className="muted small">
                        x: {f.x.toFixed(2)} · y: {f.y.toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="field field-inline">
                  <input
                    value={newFieldLabel}
                    onChange={(e) => setNewFieldLabel(e.target.value)}
                    placeholder="Field label"
                  />
                  <select
                    value={newFieldType}
                    onChange={(e) =>
                      setNewFieldType(e.target.value as FieldType)
                    }
                  >
                    {FIELD_TYPES.map((ft) => (
                      <option key={ft} value={ft}>
                        {ft}
                      </option>
                    ))}
                  </select>
                  <button className="ghost" onClick={handleAddField}>
                    Add field
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

