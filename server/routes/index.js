const router = require('express').Router()
const { Schema, Table, Field, Association } = require('../db')

router.put('/schema/:schemaId', async (req, res, next) => {
    try {
        // find tables
        const tables = await Table.findAll({
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
                schemaId: req.params.schemaId,
                offset: table.offset
            })
        }

        const resolvedTablePromises = await Promise.all(newTables.map(table => table.promise))
        for (let i = 0; i < newTables.length; i++) {
            newTables[i].sequelizeTable = resolvedTablePromises[i].id
        }

        for (const table of newTables) {
            for (const hasTable of table.belongsTo) {
                const hasTableFull = newTables.find(table => table.frontId === hasTable)
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

router.get('/schema/:schemaId', async (req, res, next) => {
    try {
        const { schemaId } = req.params
        const schemaFound = await Schema.findByPk(schemaId, { include: { all: true, nested: true } })
        if (schemaFound) {
            for (const table of schemaFound.tables) {
                table.frontId = parseInt(table.frontId)
                const belongsToObjects = [...table.belongsTo]
                table.belongsTo = [...belongsToObjects.map(inTable => parseInt(inTable.frontId))]
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

router.use((req, res, next) => {
    const err = new Error('API route not found!')
    err.status = 404
    next(err)
})

module.exports = router
