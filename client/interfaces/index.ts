export enum FieldTypes {
    String = 'string',
    Integer = 'integer',
    Float = 'float',
    Boolean = 'boolean',
  }

export interface schemaField {
    name: string,
    type: FieldTypes,
    allowNull: boolean
}

export interface schemaTable {
    frontId: number,
    name: string,
    fields: schemaField[],
    belongsTo: number[],
    has: number[]
}
