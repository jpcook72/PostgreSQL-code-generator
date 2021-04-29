import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import Visualizer from '../components/Visualizer'
import { MemoryRouter } from 'react-router-dom'
import { createMemoryHistory, createLocation } from 'history'
import { match } from 'react-router'
import { rest } from 'msw'
import { setupServer } from 'msw/node'

// declare which API requests to mock
const server = setupServer(
	rest.get('/api/schema/ABC123', (req, res, ctx) => {
		return res(ctx.json({
			id: 'G2AIZX',
			createdAt: '2021-04-29T02:13:31.568Z',
			updatedAt: '2021-04-29T02:13:31.568Z',
			tables: []
		}))
	})
)

const history = createMemoryHistory()

const match: match<{ schemaId: string }> = {
	isExact: false,
	path: '',
	url: '',
	params: { schemaId: 'ABC123' }
}

const location = createLocation(match.url)

describe('Visualizer Page', () => {
	beforeAll(() => server.listen())
	afterEach(() => server.resetHandlers())
	afterAll(() => server.close())

	describe('Generates a new schema properly', () => {
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
		test('Page has correct default state', () => {
			const initialHeader = screen.getByRole('heading', { name: /Loading.../i })
			expect(initialHeader).toBeInTheDocument()
		})
		test('SchemaId loads properly after GET request', async () => {
			const loadedHeader = await screen.findByRole('heading', { name: /ABC123/i })
			expect(loadedHeader).toBeInTheDocument()
		})
		test('Page can be loaded again with no issues', () => {
			const loadedHeader = screen.getByRole('heading', { name: /Loading.../i })
			expect(loadedHeader).toBeInTheDocument()
		})
	})
})

// when user clicks add add table
// when user clicks home back to home page
// when user clicks save api request
