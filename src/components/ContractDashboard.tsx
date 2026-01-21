import { useMemo, useState } from 'react'
import { useContractStore } from '../state/contractStore'
import type { ContractStatus } from '../types'

type StatusFilter = 'All' | 'Active' | 'Pending' | 'Signed'

function mapToStatusFilter(status: ContractStatus): StatusFilter {
  if (status === 'Signed' || status === 'Locked') return 'Signed'
  if (status === 'Sent') return 'Active'
  if (status === 'Created' || status === 'Approved') return 'Pending'
  return 'All'
}

export function ContractDashboard() {
  const { contracts, blueprints, dispatch, nextStatuses, selectedContractId } =
    useContractStore()
  const [filter, setFilter] = useState<StatusFilter>('All')

  const rows = useMemo(
    () =>
      contracts.filter((c) =>
        filter === 'All' ? true : mapToStatusFilter(c.status) === filter,
      ),
    [contracts, filter],
  )

  const blueprintNameById = useMemo(
    () =>
      Object.fromEntries(blueprints.map((b) => [b.id, b.name] as const)),
    [blueprints],
  )

  function handleTransition(contractId: string, status: ContractStatus) {
    dispatch({ type: 'set-status', payload: { contractId, status } })
  }

  return (
    <section className="panel">
      <div className="panel-header">
        <h2>Contracts</h2>
        <div className="tag-buttons">
          {(['All', 'Pending', 'Active', 'Signed'] as const).map((s) => (
            <button
              key={s}
              className={filter === s ? 'chip selected' : 'chip'}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="table-wrapper">
        <table className="contracts-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Blueprint</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <tr
                key={c.id}
                className={c.id === selectedContractId ? 'row-selected' : undefined}
              >
                <td>{c.name}</td>
                <td className="muted small">
                  {blueprintNameById[c.blueprintId] ?? 'Unknown'}
                </td>
                <td>
                  <span className={`badge status-${c.status.toLowerCase()}`}>
                    {c.status}
                  </span>
                </td>
                <td className="muted small">
                  {new Date(c.createdAt).toLocaleDateString()}
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="ghost"
                      onClick={() =>
                        dispatch({
                          type: 'select-contract',
                          payload: { id: c.id },
                        })
                      }
                    >
                      View
                    </button>
                    {nextStatuses(c.status).map((s) => (
                      <button
                        key={s}
                        className="ghost"
                        onClick={() => handleTransition(c.id, s)}
                      >
                        {s === 'Revoked' ? 'Revoke' : `Mark ${s}`}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="muted small">
                  No contracts in this bucket yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

