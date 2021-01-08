const router = require("express").Router()
const { Schema, Table, Field } = require('../db');
const Sequelize = require('sequelize')

router.post('/newSchema', async( req,res,next) => {
    try {
        const schema = await Schema.create({key: Math.random().toString(36).substr(2, 6).toUpperCase()})
        res.send(schema)
    }
    catch(err) {
        next(err)
    }
})

router.put('/schema/:schemaId', async (req, res, next) => {

    try {

        const tables = await Table.findAll({
            where: {
                schemaId: req.params.schemaId
            }
        })

        const fields = await Field.findAll({  
            where: {
                tableId: {
                    [Sequelize.Op.or]: [...tables.map(table => table.id)]
                }
          }
        })

        fields.forEach( async (field) => {
            await field.destroy();
        })

        tables.forEach( async (table) => {
            await table.destroy({ include: { all: true, nested: true }})
        })

        let tableArr = [];
        let fieldArr = [];
          req.body.tables.forEach( table => {
              tableArr.push(Table.create({id: Number(table.id), name: table.name, schemaId: req.params.schemaId, associations: !!table.associations ? Object.keys(table.associations).filter(key => table.associations[key]) : []}))
          })
        await Promise.all([...tableArr])
          req.body.tables.forEach( table => {
            table.fields.forEach( field => {
              fieldArr.push(Field.create({id: Number(field.id), name: field.name, type: field.type, allowNull: field.allowNull, tableId: table.id}))
            })
          })

        await Promise.all(fieldArr)

        const theSchema = await Schema.findByPk(req.params.schemaId, { include: { all: true, nested: true }})
        theSchema.tables.forEach ( (table, ind, arr) => {
            const assocArray = !!table.associations ? [...table.associations] : []
            delete table.associations;
            table.associations = {}
            arr.forEach( (inTable, inInd) => {
                if (ind != inInd) {
                    table.associations[inTable.id] = assocArray.includes(String(inTable.id))
                }
            })
        })
        res.send(theSchema)
    }
    catch(err) {
        next(err)
    }


})

router.get('/schema/:schemaId', async(req,res,next) => {
    try {
        const theSchema = await Schema.findByPk(req.params.schemaId, { include: { all: true, nested: true }})
        theSchema.tables.forEach( (table, ind, arr) => {
            const assocArray = !!table.associations ? [...table.associations] : []
            delete table.associations;
            table.associations = {}
            arr.forEach( (inTable, inInd) => {
                if (ind != inInd) {
                    table.associations[inTable.id] = assocArray.includes(String(inTable.id))
                }
            })
        })
        res.json(theSchema)

    }
    catch(err) {
        next(err)
    }
})

router.use((req, res, next) => {
    const err = new Error('API route not found!')
    err.status = 404
    next(err)
    })


module.exports = router
