import {
  createContext,
  useContext,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react'
import type {
  Blueprint,
  BlueprintField,
  Contract,
  ContractStatus,
  FieldType,
} from '../types'

interface ContractState {
  blueprints: Blueprint[]
  contracts: Contract[]
  selectedContractId?: string
}

type Action =
  | { type: 'create-blueprint'; payload: { name: string; description?: string } }
  | {
      type: 'add-field'
      payload: { blueprintId: string; label: string; fieldType: FieldType }
    }
  | {
      type: 'update-field-position'
      payload: { blueprintId: string; fieldId: string; x: number; y: number }
    }
  | {
      type: 'create-contract-from-blueprint'
      payload: { blueprintId: string; name: string }
    }
  | {
      type: 'update-contract-field'
      payload: { contractId: string; fieldId: string; value: string | boolean }
    }
  | { type: 'set-status'; payload: { contractId: string; status: ContractStatus } }
  | { type: 'select-contract'; payload?: { id?: string } }

const STATUS_FLOW: ContractStatus[] = [
  'Created',
  'Approved',
  'Sent',
  'Signed',
  'Locked',
]

function nowIsoDate() {
  return new Date().toISOString()
}

function canTransition(current: ContractStatus, next: ContractStatus): boolean {
  if (current === 'Locked' || current === 'Revoked') return false
  if (next === 'Revoked') {
    // Revocation allowed from Created or Sent per spec
    return current === 'Created' || current === 'Sent'
  }

  const currentIndex = STATUS_FLOW.indexOf(current)
  const nextIndex = STATUS_FLOW.indexOf(next)
  return currentIndex >= 0 && nextIndex === currentIndex + 1
}

function nextStatuses(current: ContractStatus): ContractStatus[] {
  if (current === 'Locked' || current === 'Revoked') return []
  const options: ContractStatus[] = []
  const currentIndex = STATUS_FLOW.indexOf(current)
  if (currentIndex >= 0 && currentIndex < STATUS_FLOW.length - 1) {
    options.push(STATUS_FLOW[currentIndex + 1])
  }
  if (current === 'Created' || current === 'Sent') {
    options.push('Revoked')
  }
  return options
}

const initialBlueprints: Blueprint[] = [
  {
    id: 'bp-nda',
    name: 'Mutual NDA',
    description: 'Standard mutual non-disclosure agreement',
    createdAt: nowIsoDate(),
    fields: [
      { id: 'f-party-a', label: 'Party A Name', type: 'Text', x: 0.1, y: 0.2 },
      { id: 'f-party-b', label: 'Party B Name', type: 'Text', x: 0.6, y: 0.2 },
      {
        id: 'f-effective-date',
        label: 'Effective Date',
        type: 'Date',
        x: 0.1,
        y: 0.35,
      },
      {
        id: 'f-term',
        label: 'Term (years)',
        type: 'Text',
        x: 0.6,
        y: 0.35,
      },
      {
        id: 'f-confidentiality',
        label: 'Includes employee confidential info',
        type: 'Checkbox',
        x: 0.1,
        y: 0.5,
      },
      {
        id: 'f-signature-a',
        label: 'Signature – Party A',
        type: 'Signature',
        x: 0.1,
        y: 0.8,
      },
      {
        id: 'f-signature-b',
        label: 'Signature – Party B',
        type: 'Signature',
        x: 0.6,
        y: 0.8,
      },
    ],
  },
]

const initialContracts: Contract[] = [
  {
    id: 'c-1',
    name: 'NDA – Northwind',
    blueprintId: 'bp-nda',
    status: 'Created',
    createdAt: nowIsoDate(),
    updatedAt: nowIsoDate(),
    fieldValues: [
      { fieldId: 'f-party-a', value: 'Your Company' },
      { fieldId: 'f-party-b', value: 'Northwind Traders' },
      { fieldId: 'f-effective-date', value: '2025-01-01' },
      { fieldId: 'f-term', value: '2' },
      { fieldId: 'f-confidentiality', value: true },
      { fieldId: 'f-signature-a', value: '' },
      { fieldId: 'f-signature-b', value: '' },
    ],
  },
]

const initialState: ContractState = {
  blueprints: initialBlueprints,
  contracts: initialContracts,
  selectedContractId: initialContracts[0]?.id,
}

function withNewFieldValues(blueprint: Blueprint): Contract['fieldValues'] {
  return blueprint.fields.map((f) => ({
    fieldId: f.id,
    value: f.type === 'Checkbox' ? false : '',
  }))
}

function reducer(state: ContractState, action: Action): ContractState {
  switch (action.type) {
    case 'create-blueprint': {
      const id = `bp-${Date.now()}`
      const bp: Blueprint = {
        id,
        name: action.payload.name,
        description: action.payload.description,
        createdAt: nowIsoDate(),
        fields: [],
      }
      return { ...state, blueprints: [...state.blueprints, bp] }
    }
    case 'add-field': {
      const { blueprintId, label, fieldType } = action.payload
      return {
        ...state,
        blueprints: state.blueprints.map((bp) =>
          bp.id === blueprintId
            ? {
                ...bp,
                fields: [
                  ...bp.fields,
                  {
                    id: `f-${Date.now()}`,
                    label,
                    type: fieldType,
                    x: 0.1,
                    y: 0.1 + bp.fields.length * 0.1,
                  } satisfies BlueprintField,
                ],
              }
            : bp,
        ),
      }
    }
    case 'update-field-position': {
      const { blueprintId, fieldId, x, y } = action.payload
      return {
        ...state,
        blueprints: state.blueprints.map((bp) =>
          bp.id === blueprintId
            ? {
                ...bp,
                fields: bp.fields.map((f) =>
                  f.id === fieldId ? { ...f, x, y } : f,
                ),
              }
            : bp,
        ),
      }
    }
    case 'create-contract-from-blueprint': {
      const { blueprintId, name } = action.payload
      const blueprint = state.blueprints.find((b) => b.id === blueprintId)
      if (!blueprint) return state
      const id = `c-${Date.now()}`
      const contract: Contract = {
        id,
        name,
        blueprintId,
        status: 'Created',
        createdAt: nowIsoDate(),
        updatedAt: nowIsoDate(),
        fieldValues: withNewFieldValues(blueprint),
      }
      return {
        ...state,
        contracts: [contract, ...state.contracts],
        selectedContractId: id,
      }
    }
    case 'update-contract-field': {
      const { contractId, fieldId, value } = action.payload
      return {
        ...state,
        contracts: state.contracts.map((c) =>
          c.id === contractId && c.status !== 'Locked' && c.status !== 'Revoked'
            ? {
                ...c,
                updatedAt: nowIsoDate(),
                fieldValues: c.fieldValues.map((fv) =>
                  fv.fieldId === fieldId ? { ...fv, value } : fv,
                ),
              }
            : c,
        ),
      }
    }
    case 'set-status': {
      const { contractId, status } = action.payload
      return {
        ...state,
        contracts: state.contracts.map((c) => {
          if (c.id !== contractId) return c
          if (!canTransition(c.status, status)) return c
          return { ...c, status, updatedAt: nowIsoDate() }
        }),
      }
    }
    case 'select-contract':
      return { ...state, selectedContractId: action.payload?.id }
    default:
      return state
  }
}

const ContractContext = createContext<
  | (ContractState & {
      dispatch: (action: Action) => void
      nextStatuses: (s: ContractStatus) => ContractStatus[]
    })
  | undefined
>(undefined)

export function ContractProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(
    () => ({
      ...state,
      dispatch,
      nextStatuses,
    }),
    [state],
  )

  return (
    <ContractContext.Provider value={value}>{children}</ContractContext.Provider>
  )
}

export function useContractStore() {
  const ctx = useContext(ContractContext)
  if (!ctx) throw new Error('useContractStore must be used within ContractProvider')
  return ctx
}

