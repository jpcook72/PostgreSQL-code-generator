// user gets to home page, presses new or gets saves schema
// if new, new page
// if saved, old page

import React from 'react'
import { render, screen } from '@testing-library/react'
import App from '../components/App'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'

describe('LaunchPage', () => {
	test('"New Schema" link points to visualizer page', () => {
		render(
			<MemoryRouter>
				<App />
			</MemoryRouter>
		)
		const button = screen.getByRole('button', { name: /New Schema/i })
		userEvent.click(button)

		const initialHeader = screen.getByRole('heading', { name: /Loading.../i })
		expect(initialHeader).toBeInTheDocument()
	})
})
