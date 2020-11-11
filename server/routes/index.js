const router = require("express").Router()
const { Schema, Table, Field } = require('../db');
const Sequelize = require('sequelize')

router.post('/newSchema', async( req,res,next) => {
    try {
        console.log('in new schema route')
        const schemas = await Schema.findAll()
        await Promise.all(schemas.map( schema => schema.destroy()))
        await Schema.create({id: 1, key: '11111'})
        console.log('made it to bottom')
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
            console.log(schemas)
            if (!schemas.length) await Schema.create({id: 1, key: '11111'})
        //

        console.log('at the top')

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
        const hereTables = await Table.findAll();
        const hereFields = await Field.findAll();

        let tableArr = [];
        let fieldArr = [];
          req.body.tables.forEach( table => {
              tableArr.push(Table.create({id: table.id, name: table.name, schemaId: req.params.schemaId}))
          })

        const tableProm = await Promise.all(tableArr)
        
          req.body.tables.forEach( table => {
            table.fields.forEach( field => {
              fieldArr.push(Field.create({id: field.id, name: field.name, type: field.type, tableId: table.id}))
            })
          })

        await Promise.all(fieldArr)

        const schema = await Schema.findByPk(req.params.schemaId, { include: { all: true, nested: true }})
          console.log('final schema', schema)
        res.send(schema)
    }
    catch(err) {
        next(err)
    }


})

router.get('/schema/:schemaId', async(req,res,next) => {
    try {
        res.send(await Schema.findByPk(req.params.schemaId, { include: { all: true, nested: true }}))
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
