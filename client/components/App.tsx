import React, { FunctionComponent } from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import Visualizer from './Visualizer'
import LaunchPage from './LaunchPage'

const App: FunctionComponent<Record<string, never>> = () => {
	return (
		<Router>
			<main>
				<Route path="/" exact component = {LaunchPage}/>
				<Route path="/schema/:schemaId" exact component = {Visualizer}/>
			</main>
		</Router>

	)
}

export default App
