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
		this.handleFieldChange = this.handleFieldChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.addTable = this.addTable.bind(this)
		this.addField = this.addField.bind(this)
	}

	componentDidMount() {
		this.setState({
			tables: [
				{
					id: 1,
					name: 'authors',
					fields: [
						{
							id: 1,
							name: 'firstName',
							type: 'string'
						}
					]
				}
			]
		})
	}

	addTable() {
		const tables = [...this.state.tables];
		let maxID = Math.max(...this.state.tables.map( table => table.id));
		let newTable = {id: maxID + 1, name: '', fields: []}
		tables.push(newTable)
		this.setState({tables})
	}

	addField(tableId) {
		const fields = [...this.state.tables.filter( table => table.id === tableId)[0].fields]
		let maxID = Math.max(...this.state.tables.map( table => Math.max(...table.fields.map(field => field.id))))
		const newField = {id: maxID + 1, name: '', type: 'string'}
		fields.push(newField)
		let tables = [...this.state.tables.map( table => table.id === tableId ? {...table, fields}: table )]
		this.setState({tables})
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
	
    handleFieldChange(evt, tableId, fieldId) {
		console.log('in handleFieldChange', evt.target.name, evt.target.value, tableId, fieldId, this.state.tables)
		const tables = [...this.state.tables.map( table => 
			table.id === tableId ? 
				{...table, fields: [...table.fields.map( field => 
					field.id === fieldId ? 
						{...field, [evt.target.name]: evt.target.value} : 
						field)] } :
				table)]
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
					<button onClick={this.addTable}>Add Table</button>
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
													{
														table.fields.map( field => {
															return(<div className="formRowMain">
																<div><input name="name" placeholder="Field Name" onChange={(e) => this.handleFieldChange(e, table.id, field.id)} value={field.name} /></div>
																<div>
																	<select name="type" onChange={(e) => this.handleFieldChange(e, table.id, field.id)}>
																		<option value="string">String</option>
																		<option value="integer">Integer</option>
																		<option value="float">Float</option>
																		<option value="boolean">Boolean</option>
																	</select>
																</div>
															</div>)
														})
													}

												</div>
												<button onClick={() => this.addField(table.id)}>Add Row</button>
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
