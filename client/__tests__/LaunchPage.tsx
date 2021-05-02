import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SchemaTable, SchemaField, FieldTypes } from '../interfaces'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { MemoryRouter, Route } from 'react-router-dom'
import Visualizer from '../components/Visualizer'
import LaunchPage from '../components/LaunchPage'

// mock API endpoints for loading a saved schema
const server = setupServer(
	// this mock GET endpoint sends a mock table schema with 2 tables
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

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('LaunchPage', () => {
	beforeEach(() => {
		render(
			<MemoryRouter initialEntries={['/']}>
				<Route path="/" exact component = {LaunchPage}/>
				<Route path="/schema/:schemaId" exact component = {Visualizer}/>
			</MemoryRouter>
		)
	})
	afterEach(() => {
		cleanup()
	})
	test('"New Schema" link points to visualizer page', () => {
		const button = screen.getByRole('button', { name: /New Schema/i })
		userEvent.click(button)

		const initialHeader = screen.getByRole('heading', { name: /Loading.../i })
		expect(initialHeader).toBeInTheDocument()
	})
	test('Loading a saved schema points to visualizer page with saved schema', async () => {
		try {
			const inputField = screen.getByRole('textbox')
			userEvent.type(inputField, 'ABC123')
			const logInButton = screen.getByRole('button', { name: /Log-In/i })
			userEvent.click(logInButton)

			// Check that there are 2 schema tables
			const addRowButtons = await screen.findAllByRole('button', { name: /Add Row/i })
			expect(addRowButtons.length).toBe(2)

			// Check name of second Schema Table
			const tableName = screen.getByText(/Test2/i)
			expect(tableName).toBeInTheDocument()
		} catch (err) {
			console.log(err)
		}
	})
})
