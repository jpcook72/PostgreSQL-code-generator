/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable node/no-path-concat */
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const { db } = require('./db')
const router = require('./routes')

const app = express()

app.use(morgan('volleyball'))
app.use(express.json())

app.use(express.static(path.join(__dirname + '/public')))

app.use('/api', router)

app.use((req, res) => {
	res.status(404).send('Page not found')
})

app.use((err, req, res) => {
	res.status(500).send('Error:' + err.message)
})

const init = async () => {
	try {
		db.sync({ force: true })
		const port = process.env.PORT || 8080
		app.listen(port, () => console.log(`listening on port ${port}`))
	} catch (ex) {
		console.log(ex)
	}
}

init()
