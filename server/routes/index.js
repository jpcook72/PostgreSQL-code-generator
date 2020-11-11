const router = require("express").Router()
const { Schema, Table, Field } = require('../db');

// router.put('/', async (req, res, next) => {
//     try {
//         res.send(await Book.findAll({
//             include: [Author, Genre]
//         }));
//     }
//     catch (err) {
//         next(err)
//     }
// })

// router.get('/author/:id', async (req, res, next) => {
//     try {
//         res.send(await Book.findAll({where: { authorId: req.params.id },
//             include: [Author, Genre]}));
//     }
//     catch (err) {
//         next(err)
//     }
// })

router.use((req, res, next) => {
    const err = new Error('API route not found!')
    err.status = 404
    next(err)
    })


module.exports = router
