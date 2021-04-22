export enum FieldTypes {
    String = 'string',
    Integer = 'integer',
    Float = 'float',
    Boolean = 'boolean',
  }

export interface Field {
    name: string,
    type: FieldTypes,
    allowNull: boolean
}

export interface schemaTable {
    frontId: number,
    name: string,
    fields: Field[],
    belongsTo: number[],
    has: number[]
}
