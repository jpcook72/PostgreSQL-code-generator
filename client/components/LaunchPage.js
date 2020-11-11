import React from 'react';
import {Link} from 'react-router-dom'
const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = { margin: '200px 0', display: 'flex', justifyContent: 'space-between', }
const boxStyle = { padding: '10px', border: '1px solid black', };
import axios from 'axios';

export default class LaunchPage extends React.Component {

    constructor() {
        super();
        this.state = {
            name: '',
            key: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.newSchema = this.newSchema.bind(this);
    }
    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }
    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({name: '', key: ''})
    }

    async newSchema() {
        await axios.post('/api/newSchema', {})
    }


  	render() {
		return (
            <div className="flexContainer">
                <div className="separator"/>
                <div className="linkButtonContainer"><Link to="/schema"><button onClick={this.newSchema}>New</button></Link></div>
                <div className="logInBox">
                    <div className="logInTitle"><h4>Old</h4></div>
                    <form id="todo-form" onSubmit={this.handleSubmit}>
                        <div>
                            <input name="name" placeholder="Schema Name" onChange={this.handleChange} value={this.state.name} />
                        </div>
                        <div>
                            <input name="key" placeholder="Key" onChange={this.handleChange} value={this.state.key} />
                        </div>
                        <div className="submitButtonContainer"><button type="submit">Create</button></div>
                        </form>
                </div>

            </div>
		);
  	}
}
