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

        // create promise arrays
        const tablePromiseArr = []
        const tableAssociationsAndFieldsPromiseArr = []
        for (const table of req.body.tables) {
            tablePromiseArr.push(Table.create({
                id: Number(table.id),
                name: table.name,
                schemaId: req.params.schemaId
            }))
        }

        await Promise.all(tablePromiseArr)

        for (const table of req.body.tables) {
            for (const association of Object.keys(table.associations)) {
                console.log('this is the association', association)
                tableAssociationsAndFieldsPromiseArr.push(Association.create({
                    hasId: Number(table.id),
                    belongsToId: Number(association)
                }))
            }

            for (const field of table.fields) {
                tableAssociationsAndFieldsPromiseArr.push(Field.create({
                    id: Number(field.id),
                    name: field.name,
                    type: field.type,
                    allowNull: field.allowNull,
                    tableId: table.id
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
            res.send(schemaFound)
        } else {
            await Schema.create({ id: schemaId })
            res.send(await Schema.findByPk(schemaId, { include: { all: true, nested: true } }))
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
