export enum FieldTypes {
    String = 'string',
    Integer = 'integer',
    Float = 'float',
    Boolean = 'boolean',
  }

export interface SchemaField {
    name: string,
    type: FieldTypes,
    allowNull: boolean
}

export interface SchemaTable {
    frontId: number,
    name: string,
    fields: SchemaField[],
    belongsTo: number[],
    has: number[]
}

export interface VisualizerState {
    showArrows: boolean,
    tables: SchemaTable[],
    schemaId: number | null,
    maxId: number
}
