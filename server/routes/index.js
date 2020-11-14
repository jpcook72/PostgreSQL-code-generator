const router = require("express").Router()
const { Schema, Table, Field } = require('../db');
const Sequelize = require('sequelize')

router.post('/newSchema', async( req,res,next) => {
    try {
        const schemas = await Schema.findAll()
        await Promise.all(schemas.map( schema => schema.destroy()))
        await Schema.create({id: 1, key: '11111'})
        res.send('hey')
    }
    catch(err) {
        next(err)
    }
})

router.post('/schema/:schemaId', async (req, res, next) => {

    try {

        //this is temporary
            const schemas = await Schema.findAll()
            if (!schemas.length) await Schema.create({id: 1, key: '11111'})
        //

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
          }})

        await Promise.all([...tables.map(table => table.destroy()), ...fields.map(field => field.destroy())])

        let tableArr = [];
        let fieldArr = [];
          req.body.tables.forEach( table => {
              tableArr.push(Table.create({id: table.id, name: table.name, schemaId: req.params.schemaId}))
          })

        const tableProm = await Promise.all(tableArr)
        
          req.body.tables.forEach( table => {
            table.fields.forEach( field => {
              fieldArr.push(Field.create({id: field.id, name: field.name, type: field.type, allowNull: field.allowNull, tableId: table.id}))
            })
          })

        await Promise.all(fieldArr)

        const schema = await Schema.findByPk(req.params.schemaId, { include: { all: true, nested: true }})
        res.send(schema)
    }
    catch(err) {
        next(err)
    }


})

router.get('/schema/:schemaId', async(req,res,next) => {
    try {
        res.json(await Schema.findByPk(req.params.schemaId, { include: { all: true, nested: true }}))
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
