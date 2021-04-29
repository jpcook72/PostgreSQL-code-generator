// when user clicks add add table
// when user clicks home back to home page
// when user clicks save api request

import React from 'react'
import { render, screen } from '@testing-library/react'
import Visualizer from '../components/Visualizer'
import { MemoryRouter } from 'react-router-dom'
import { createMemoryHistory, createLocation } from 'history'
import { match } from 'react-router'

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
	})
})
