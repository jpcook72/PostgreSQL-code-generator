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
        if (tables.length) await tables.destroy()

        const newTables = [
            ...req.body.tables
        ]

        // create promise arrays
        const tableAssociationsAndFieldsPromiseArr = []
        for (const table of newTables) {
            table.promise = Table.create({
                id: Number(table.id),
                name: table.name,
                schemaId: req.params.schemaId
            })
        }

        const resolvedTablePromises = await Promise.all(newTables.map(table => table.promise))
        for (let i = 0; i < newTables.length; i++) {
            req.body.tables[i].sequelizeTable = resolvedTablePromises[i].id
        }

        for (const table of newTables) {
            for (const hasTable of table.belongsTo) {
                tableAssociationsAndFieldsPromiseArr.push(Association.create({
                    hasId: hasTable.sequelizeTable.id,
                    belongsToId: table.sequelizeTable.id
                }))
            }

            for (const field of table.fields) {
                tableAssociationsAndFieldsPromiseArr.push(Field.create({
                    name: field.name,
                    type: field.type,
                    allowNull: field.allowNull,
                    tableId: table.sequelizeTable.id
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
            console.log('getting in here')
            res.send(schemaFound)
        } else {
            await Schema.create({ id: schemaId })
            const newSchema = await Schema.findByPk(schemaId, { include: { all: true, nested: true } })
            console.log('here', newSchema)
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
