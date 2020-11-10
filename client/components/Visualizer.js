import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { ArcherContainer, ArcherElement } from 'react-archer';

const rootStyle = { display: 'flex', justifyContent: 'center' };
const rowStyle = { margin: '200px 0', display: 'flex', justifyContent: 'space-between', }
const boxStyle = { padding: '10px', border: '1px solid black', };

export default class Visualizer extends React.Component {

	constructor() {
		super()
		this.state = {
			showArrows: true,
			tableName: '',
		}
		this.handleStop = this.handleStop.bind(this)
		this.handleStart = this.handleStart.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}
 
	handleStart(e,data) {
		this.setState({showArrows:false})
	}
 
	handleStop(e, data) {
		this.setState({showArrows: true})
		console.log(e, data)
	}

    handleChange(evt) {
        this.setState({
            [evt.target.name]: evt.target.value
        })
    }
    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({tableName: ''})
    }

  	render() {
		return (
			<div className="fullBody">
				<nav>
					hey
				</nav>
				<div className="separator"/>
				<div className="schemaContainer">
				<ArcherContainer strokeColor='red' >
						<Draggable
						axis="both"
						handle=".logInBox"
						defaultPosition={{x: 120, y: 80}}
						bounds={{left: 0, top: 0, right: 300, bottom: 300}}
						position={null}
						grid={[25, 25]}
						scale={1}
						onStart={this.handleStart}
						onDrag={this.handleDrag}
						onStop={this.handleStop}>
							<div style={rootStyle}>
								<ArcherElement
								id="root"
								relations={this.state.showArrows ?
									[{
								targetId: 'element3',
								targetAnchor: 'top',
								sourceAnchor: 'bottom',
								}]
								:
								[]}>
									<div className="logInBox">
										<form onSubmit={this.handleSubmit}>
											<div><input name="tableName" placeholder="Table Name" onChange={this.handleChange} value={this.state.tableName} /></div>
											<div className="handle">handle</div>
										</form>
									</div>
								</ArcherElement>
							</div>
						</Draggable>
						<Draggable
						axis="both"
						handle=".handle"
						defaultPosition={{x: 120, y: 40}}
						position={null}
						grid={[25, 25]}
						scale={1}
						onStart={this.handleStart}
						onDrag={this.handleDrag}
						onStop={this.handleStop}>
							<div className="handle" style={rowStyle}>
								<ArcherElement id="element3">
									<div style={boxStyle}>Element 3</div>
								</ArcherElement>
							</div>
						</Draggable>
					</ArcherContainer>	
				</div>

			

			</div>


		);
  	}
}
