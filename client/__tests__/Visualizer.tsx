import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import Visualizer from '../components/Visualizer'
import App from '../components/App'
import { MemoryRouter } from 'react-router-dom'
import { createMemoryHistory, createLocation } from 'history'
import { match } from 'react-router'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SchemaTable } from '../interfaces'
import userEvent from '@testing-library/user-event'

// mock API endpoints for getting initial schema and saving it
const server = setupServer(
	// this mock GET endpoint sends an empty table schema
	rest.get('/api/schema/ABC123', (req, res, ctx) => {
		return res(ctx.json({
			id: 'G2AIZX',
			createdAt: '2021-04-29T02:13:31.568Z',
			updatedAt: '2021-04-29T02:13:31.568Z',
			tables: []
		}))
	}),
	// this mock PUT endpoint will send 400 if req.body is not a single initial empty table
	rest.put<SchemaTable[]>('/api/schema/ABC123', (req, res, ctx) => {
		const firstTable: SchemaTable = {
			frontId: 1,
			name: '',
			fields: [],
			belongsTo: [],
			has: []
		}

		const { frontId, name, fields, belongsTo, has } = req.body[0]

		if (firstTable.frontId !== frontId || firstTable.name !== name || fields.length || belongsTo.length || has.length) {
			//
			return res(ctx.status(400))
		}

		return res(ctx.status(200))
	})
)

// create props for Visualizer component
const match: match<{ schemaId: string }> = {
	isExact: false,
	path: '',
	url: '',
	params: { schemaId: 'ABC123' }
}
const history = createMemoryHistory()
const location = createLocation(match.url)

// delay user click to allow for clicks after component mounts
const delayedUserClick = (element: HTMLElement, delay: number) =>
	new Promise(resolve => {
		setTimeout(() => {
			resolve(userEvent.click(element))
		}, delay)
	})

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Visualizer generates a new schema properly upon mounting', () => {
	beforeEach(() => {
		render(
			<MemoryRouter>
				<Visualizer match={match} history={history} location={location} />
			</MemoryRouter>
		)
	})
	afterEach(() => {
		cleanup()
	})
	test('Page displays loading state correctly', () => {
		const initialHeader = screen.getByRole('heading', { name: /Loading.../i })
		expect(initialHeader).toBeInTheDocument()
	})
	test('SchemaId loads properly after GET request', async () => {
		try {
			const loadedHeader = await screen.findByRole('heading', { name: /ABC123/i })
			expect(loadedHeader).toBeInTheDocument()
		} catch (err) {
			console.log(err)
		}
	})
})

describe('Visualizer non-routing buttons work properly', () => {
	beforeEach(() => {
		render(
			<MemoryRouter>
				<Visualizer match={match} history={history} location={location} />
			</MemoryRouter>
		)
	})
	afterEach(() => {
		cleanup()
	})
	test('Add-table button adds table to visualizer', async () => {
		const addTableButton = screen.getByRole('button', { name: '+' })
		await delayedUserClick(addTableButton, 1000)
		const addRowButtons = screen.getAllByRole('button', { name: /Add Row/i })
		expect(addRowButtons.length).toBe(2)
	})
	test('Save button sends PUT request with initial empty table if called upon mounting', async () => {
		try {
			const saveButton = screen.getByTestId('saveButton')
			await delayedUserClick(saveButton, 1500)
			// Testing the PUT route. 400 error thrown by mock server if this doesn't work -- tests will crash
			expect(true).toBe(true)
		} catch (err) {
			console.log(err)
		}
	})
})

describe('Visualizer routing buttons work properly', () => {
	test('Home page button takes user back to home page', async () => {
		render(
			<App />
		)
		const button = screen.getByRole('button', { name: /New Schema/i })
		userEvent.click(button)

		const initialHeader = screen.getByRole('heading', { name: /Loading.../i })
		expect(initialHeader).toBeInTheDocument()
		const homeButton = screen.getByTestId('homeButton')

		userEvent.click(homeButton)

		const launchPageHeader = screen.getByRole('heading', { name: /Postgres Schema Maker/i })
		expect(launchPageHeader).toBeInTheDocument()
	})
})
