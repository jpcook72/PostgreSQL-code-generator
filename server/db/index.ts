
/* eslint-disable @typescript-eslint/no-var-requires */
import { Sequelize, DataTypes, STRING, ENUM, BOOLEAN, INTEGER, Optional, Model, WhereOptions } from 'sequelize'
import pg from 'pg'

let db: Sequelize
if (process.env.DATABASE_URL) {
	pg.defaults.ssl = true
	db = new Sequelize(process.env.DATABASE_URL, {
		dialect: 'postgres',
		protocol: 'postgres',
		logging: false,
		dialectOptions: {
			ssl: {
				require: true,
				rejectUnauthorized: false
			}
		}
	})
} else {
	db = new Sequelize('postgres://localhost/pg-visualizer', { logging: false })
}

interface SchemaAttributes {
	id: number;
}

type SchemaCreationAttributes = Optional<SchemaAttributes, 'id'>
export interface SchemaInstance extends Model<SchemaAttributes, SchemaCreationAttributes>, SchemaAttributes {}

export const Schema = db.define<SchemaInstance>('schema', {
	id: {
		type: STRING,
		primaryKey: true,
		allowNull: false
	}
})

interface TableAttributes {
	id?: number;
	frontId: number;
	name: string;
}

type TableCreationAttributes = Optional<TableAttributes, 'id'>
interface TableInstance extends Model<TableAttributes, TableCreationAttributes>, TableAttributes {}

export const Table = db.define<TableInstance>('table', {
	frontId: {
		type: DataTypes.INTEGER
	},
	name: {
		type: DataTypes.STRING
	}
})

export const Field = db.define('field', {
	name: {
		type: STRING
	},
	type: {
		type: ENUM({ values: ['string', 'float', 'integer', 'boolean'] })
	},
	allowNull: {
		type: BOOLEAN
	}
})

export const Association = db.define('association', {
	id: {
		type: INTEGER,
		primaryKey: true,
		autoIncrement: true
	}
})
Schema.hasMany(Table, { onDelete: 'cascade', hooks: true })
Table.belongsTo(Schema)

Table.hasMany(Field, { onDelete: 'cascade', hooks: true })
Field.belongsTo(Table)

Table.belongsToMany(Table, { through: Association, as: 'has', foreignKey: 'belongsToId' })
Table.belongsToMany(Table, { through: Association, as: 'belongsTo', foreignKey: 'hasId' })

export default db
