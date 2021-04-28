/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable node/no-path-concat */
import express, { Request, Response } from 'express'
import path from 'path'
import db from './db'
import router from './routes'

const app = express()

app.use(express.json())

app.use(express.static(path.join(__dirname + '/public')))

app.use('/api', router)

app.use((req: Request, res: Response) => {
	res.status(404).send('Page not found')
})

app.use((err: Error, req: Request, res: Response) => {
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
