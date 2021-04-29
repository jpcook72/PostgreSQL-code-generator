// when user clicks add add table
// when user clicks home back to home page
// when user clicks save api request

import React from 'react'
import { render, screen } from '@testing-library/react'
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

// establish API mocking before all tests
beforeAll(() => server.listen())
// reset any request handlers that are declared as a part of our tests
// (i.e. for testing one-time error scenarios)
afterEach(() => server.resetHandlers())
// clean up once the tests are done
afterAll(() => server.close())

const history = createMemoryHistory()

const match: match<{ schemaId: string }> = {
	isExact: false,
	path: '',
	url: '',
	params: { schemaId: 'ABC123' }
}

const location = createLocation(match.url)

describe('LaunchPage', () => {
	test('"New Schema" link points to visualizer page', async () => {
		render(
			<MemoryRouter>
				<Visualizer match={match} history={history} location={location} />
			</MemoryRouter>
		)

		const initialHeader = screen.getByRole('heading', { name: /Loading.../i })
		expect(initialHeader).toBeInTheDocument()

		const loadedHeader = await screen.findByRole('heading', { name: /ABC123/i })
		expect(loadedHeader).toBeInTheDocument()
	})
})
