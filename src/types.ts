export type FieldType = 'Text' | 'Date' | 'Signature' | 'Checkbox'

export interface BlueprintField {
  id: string
  label: string
  type: FieldType
  x: number // 0 - 1 normalized horizontal position
  y: number // 0 - 1 normalized vertical position
}

export interface Blueprint {
  id: string
  name: string
  description?: string
  createdAt: string
  fields: BlueprintField[]
}

export type ContractStatus =
  | 'Created'
  | 'Approved'
  | 'Sent'
  | 'Signed'
  | 'Locked'
  | 'Revoked'

export interface ContractFieldValue {
  fieldId: string
  value: string | boolean | null
}

export interface Contract {
  id: string
  name: string
  blueprintId: string
  status: ContractStatus
  createdAt: string
  updatedAt: string
  fieldValues: ContractFieldValue[]
}
