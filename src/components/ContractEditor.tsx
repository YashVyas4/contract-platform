import { useMemo } from 'react'
import { useContractStore } from '../state/contractStore'
import type { Blueprint, BlueprintField, Contract, ContractFieldValue } from '../types'

function fieldDisplayValue(
  value: ContractFieldValue['value'],
  field: BlueprintField,
): string | boolean {
  if (field.type === 'Checkbox') {
    return Boolean(value)
  }
  return (value as string) ?? ''
}

export function ContractEditor() {
  const { contracts, blueprints, selectedContractId, dispatch, nextStatuses } =
    useContractStore()

  const contract = useMemo(
    () => contracts.find((c) => c.id === selectedContractId) ?? contracts[0],
    [contracts, selectedContractId],
  )

  const blueprint: Blueprint | undefined = useMemo(
    () => blueprints.find((b) => b.id === contract?.blueprintId),
    [blueprints, contract?.blueprintId],
  )

  if (!contract || !blueprint) {
    return (
      <section className="panel">
        <p className="muted">No contract selected yet.</p>
      </section>
    )
  }

  const locked = contract.status === 'Locked' || contract.status === 'Revoked'
  const editableStatuses = nextStatuses(contract.status)

  function handleChange(fieldId: string, raw: string | boolean) {
    if (locked) return
    dispatch({
      type: 'update-contract-field',
      payload: {
        contractId: contract.id,
        fieldId,
        value: raw,
      },
    })
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{contract.name}</h2>
          <p className="muted small">
            Based on blueprint <strong>{blueprint.name}</strong>
          </p>
        </div>
        <div className="badge-group">
          <span className={`badge status-${contract.status.toLowerCase()}`}>
            {contract.status}
          </span>
        </div>
      </div>

      <p className="muted small">
        Created {new Date(contract.createdAt).toLocaleString()} · Last updated{' '}
        {new Date(contract.updatedAt).toLocaleString()}
      </p>

      <div className="contract-form">
        {blueprint.fields.map((field) => {
          const fv = contract.fieldValues.find((f) => f.fieldId === field.id)
          const value = fieldDisplayValue(fv?.value ?? null, field)

          return (
            <label key={field.id} className="field">
              <span>
                {field.label}{' '}
                <span className="muted small">({field.type})</span>
              </span>
              {field.type === 'Checkbox' ? (
                <input
                  type="checkbox"
                  checked={Boolean(value)}
                  disabled={locked}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                />
              ) : field.type === 'Date' ? (
                <input
                  type="date"
                  value={(value as string) || ''}
                  disabled={locked}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              ) : field.type === 'Signature' ? (
                <input
                  type="text"
                  value={(value as string) || ''}
                  disabled={locked}
                  placeholder="Type signer name"
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              ) : (
                <input
                  type="text"
                  value={(value as string) || ''}
                  disabled={locked}
                  onChange={(e) => handleChange(field.id, e.target.value)}
                />
              )}
            </label>
          )
        })}
      </div>

      <div className="panel-actions">
        {editableStatuses.map((s) => (
          <button
            key={s}
            className="primary"
            onClick={() =>
              dispatch({
                type: 'set-status',
                payload: { contractId: contract.id, status: s },
              })
            }
          >
            {s === 'Revoked' ? 'Revoke contract' : `Mark ${s}`}
          </button>
        ))}
        {editableStatuses.length === 0 && (
          <p className="muted small">
            Contract is {contract.status.toLowerCase()} and can no longer change state
            or be edited.
          </p>
        )}
      </div>
    </section>
  )
}

