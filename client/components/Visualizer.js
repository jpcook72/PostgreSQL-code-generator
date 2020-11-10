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
			tables: [],
		}
		this.handleStop = this.handleStop.bind(this)
		this.handleStart = this.handleStart.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	componentDidMount() {
		this.setState({
			tables: [
				{
					id: 1,
					name: 'authors',
					fields: [
						{
							name: 'firstName',
							type: 'string'
						}
					]
				}
			]
		})
	}
 
	handleStart(e,data) {
		this.setState({showArrows:false})
	}
 
	handleStop(e, data) {
		this.setState({showArrows: true})
		console.log(e, data)
	}

    handleChange(evt, tableId) {
		const tables = this.state.tables.map( table => table.id === tableId ? {...table, [evt.target.name]: evt.target.value} : table)
        this.setState({
            tables
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
						{this.state.tables.map( table => {
						return (
							<Draggable axis="both" handle=".logInBox" defaultPosition={{x: 120, y: 80}} bounds={{left: 0, top: 0, right: 300, bottom: 300}} position={null} grid={[25, 25]} scale={1} onStart={this.handleStart} onDrag={this.handleDrag} onStop={this.handleStop}>
								<div style={rootStyle}>
									<ArcherElement id="root" relations={this.state.showArrows ? [{ targetId: 'element3', targetAnchor: 'top', sourceAnchor: 'bottom' }] : []}>
										<div className="logInBox">
											<form onSubmit={this.handleSubmit}>
												<div><input name="name" placeholder="Table Name" onChange={(e) => this.handleChange(e, table.id)} value={table.name} /></div>
												<div className="formBody">
													<div className="formRowMain">
														<div>Name</div>
														<div>Type</div>
													</div>
													<div className="formRowMain">
														{/* <div><input name="tableName" placeholder="Table Name" onChange={this.handleChange} value={this.state.tableName} /></div>
														<div><input name="tableName" placeholder="Table Name" onChange={this.handleChange} value={this.state.tableName} /></div> */}
													</div>
												</div>
											</form>
										</div>
									</ArcherElement>
								</div>
							</Draggable>)})
						}
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
