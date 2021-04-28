import express, { Request, Response, NextFunction } from 'express'
import { Schema, Table, Field, Association, SchemaInstance } from '../db'
import { Model, Optional, WhereOptions } from 'Sequelize'
const router = express.Router()

interface ResponseError extends Error {
    status?: number;
}

router.put('/schema/:schemaId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		// find tables
		const tables = await Table.findAll<Model<WhereOptions, SchemaInstance>>({
			where: {
				schemaId: req.params.schemaId
			}
		})

		// this destroys fields too
		if (tables.length) await Promise.all(tables.map(table => table.destroy()))

		const newTables = [
			...req.body
		]

		// create promise arrays
		const tableAssociationsAndFieldsPromiseArr = []
		for (const table of newTables) {
			table.promise = Table.create({
				frontId: table.frontId,
				name: table.name,
				schemaId: req.params.schemaId
			})
		}

		const resolvedTablePromises = await Promise.all(newTables.map(table => table.promise))
		for (let i = 0; i < newTables.length; i++) {
			newTables[i].sequelizeTable = resolvedTablePromises[i].id
		}

		for (const table of newTables) {
			for (const hasTable of table.belongsTo) {
				const hasTableFull = newTables.find(tbl => tbl.frontId === hasTable)
				tableAssociationsAndFieldsPromiseArr.push(Association.create({
					hasId: hasTableFull.sequelizeTable,
					belongsToId: table.sequelizeTable
				}))
			}

			for (const field of table.fields) {
				tableAssociationsAndFieldsPromiseArr.push(Field.create({
					name: field.name,
					type: field.type,
					allowNull: field.allowNull,
					tableId: table.sequelizeTable
				}))
			}
		}

		await Promise.all(tableAssociationsAndFieldsPromiseArr)

		res.send(await Schema.findByPk(req.params.schemaId, { include: { all: true, nested: true } }))
	} catch (err) {
		next(err)
	}
})

router.get('/schema/:schemaId', async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { schemaId } = req.params
		const schemaFound = await Schema.findByPk(schemaId, { include: { all: true, nested: true } })
		if (schemaFound) {
			for (const table of schemaFound.tables) {
				const belongsToObjects = [...table.belongsTo]
				table.belongsTo = [...belongsToObjects.map(inTable => inTable.frontId)]
			}
			res.send(schemaFound)
		} else {
			await Schema.create({ id: schemaId })
			const newSchema = await Schema.findByPk(schemaId, { include: { all: true, nested: true } })
			res.send(newSchema)
		}
	} catch (err) {
		next(err)
	}
})

router.get('/test', async (req: Request, res: Response, next: NextFunction) => {
	try {
		await Schema.create({ id: 1 })
		const newSchema = await Schema.findByPk(1, { include: { all: true, nested: true } })
		res.send(newSchema)
	} catch (err) {
		next(err)
	}
})

router.use((req: Request, res: Response, next: NextFunction) => {
	const err: ResponseError = new Error('API route not found!')
	err.status = 404
	next(err)
})

export default router
