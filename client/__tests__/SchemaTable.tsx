import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import Visualizer from '../components/Visualizer'
import { createMemoryHistory, createLocation } from 'history'
import { match } from 'react-router'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { SchemaTable, SchemaField, FieldTypes } from '../interfaces'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

// mock API endpoints for getting initial schema and saving it
const server = setupServer(
	// this mock GET endpoint sends an empty table schema
	rest.get('/api/schema/ABC123', (req, res, ctx) => {
		const testField: SchemaField = {
			name: 'Test1',
			type: FieldTypes.String,
			allowNull: true
		}

		const testTable1: SchemaTable = {
			frontId: 1,
			name: 'Test1',
			fields: [testField],
			belongsTo: [],
			has: [2]
		}

		const testTable2: SchemaTable = {
			frontId: 2,
			name: 'Test2',
			fields: [],
			belongsTo: [1],
			has: []
		}

		return res(ctx.json({
			id: 'ABC123',
			createdAt: '2021-04-29T02:13:31.568Z',
			updatedAt: '2021-04-29T02:13:31.568Z',
			tables: [testTable1, testTable2]
		}))
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

beforeAll(() => server.listen())
afterAll(() => server.close())

describe('SchemaTable adds and displays fields properly', () => {
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
	test('Starts with no fields/field columns', async () => {
		// only one table has fields, so the query should return 1 table
		const tablesByFieldRow = await screen.findAllByText(/Field/i)
		expect(tablesByFieldRow).toHaveLength(1)
	})
	test('Adds field row on add row', async () => {
		const addRowButtons = await screen.findAllByRole('button', { name: /Add Row/i })
		userEvent.click(addRowButtons[1])

		// now both tables have field rows, so the query should return 2 tables
		const tablesByFieldRow = screen.getAllByText(/Field/i)
		expect(tablesByFieldRow).toHaveLength(2)

		const inputFields = screen.getAllByRole('textbox')
		expect(inputFields).toHaveLength(4)
	})
	test('Field row contains check for allow null', async () => {
		const addRowButtons = await screen.findAllByRole('button', { name: /Add Row/i })
		userEvent.click(addRowButtons[1])

		const checkboxes = screen.getAllByRole('checkbox')
		expect(checkboxes.length).toBe(4)
	})
})
