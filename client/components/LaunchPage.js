import React from 'react'
import { Link } from 'react-router-dom'

export default class LaunchPage extends React.Component {
	constructor () {
		super()
		this.state = {
			name: '',
			key: ''
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleChange (evt) {
		this.setState({
			[evt.target.name]: evt.target.value
		})
	}

	handleSubmit (evt) {
		evt.preventDefault()
		this.setState({ name: '', key: '' })
	}

	render () {
		return (
			<div className="flexContainer">
				<h3>Postgres Schema Maker</h3>
				<h5>npm install pg-auto-write for DB set-up code</h5>
				<div className="launchSeparator"/>
				<div className="linkButtonContainer"><Link to={`/schema/${Math.random().toString(36).substr(2, 6).toUpperCase()}`}><button>New Schema</button></Link></div>
				<div className="logInBox">
					<div className="logInTitle"><h4>I have a schema</h4></div>
					<form id="todo-form" onSubmit={this.handleSubmit}>
						<div className="logInBoxInput">
							<input name="key" placeholder="Key..." onChange={this.handleChange} value={this.state.key} />
						</div>
						<div className="submitButtonContainer"><Link to={`/schema/${this.state.key}`}><button type="submit">Log-In</button></Link></div>
					</form>
				</div>

			</div>
		)
	}
}
