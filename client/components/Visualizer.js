/* eslint-disable indent */
/* eslint-disable no-tabs */
import React from 'react'
import Draggable from 'react-draggable'
import { ArcherContainer, ArcherElement } from 'react-archer'
import axios from 'axios'
import { Link } from 'react-router-dom'

export default class Visualizer extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            showArrows: true,
            tables: []
        }
		this.handleStop = this.handleStop.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.addTable = this.addTable.bind(this)
        this.addField = this.addField.bind(this)
        this.saveSchema = this.saveSchema.bind(this)
        this.handleBelongsTo = this.handleBelongsTo.bind(this)
    }

    async componentDidMount () {
		const { schemaId } = this.props.match.params
        const startState = await axios.get(`/api/schema/${schemaId}`)
        const startTables = startState.data.tables.length
            ? startState.data.tables
            : [
                {
                    name: '',
                    fields: [],
					has: [],
                    belongsTo: [],
                    offset: 0
                }
			]

        this.setState({
            tables: startTables
        })
    }

    addTable () {
        const newTable = {
            name: '',
            fields: [],
            has: [],
            belongsTo: [],
            offset: this.state.tables.length * 164
        }
        this.setState({ tables: [...this.state.tables, newTable] })
    }

    addField (selectedTable) {
		const newField = { name: '', type: 'string', allowNull: true }
        const tables = [...this.state.tables.map(table => table === selectedTable ? { ...table, fields: [...table.fields, newField] } : table)]
        this.setState({ tables })
    }

    handleStart (e, data) {
        this.setState({ showArrows: false })
    }

    handleStop (e, data) {
        this.setState({ showArrows: true })
    }

    handleChange (evt, selectedTable) {
        const tables = this.state.tables.map(table => table === selectedTable ? { ...table, [evt.target.name]: evt.target.value } : table)
        this.setState({
            tables
        })
    }

    async saveSchema () {
		const { schemaId } = this.props.match.params
        const savedSchema = await axios.put(`/api/schema/${schemaId}`, this.state)
        this.setState({ tables: savedSchema.data.tables })
    }

    handleFieldChange (evt, selectedTable, selectedField) {
        const value = evt.target.type === 'checkbox' ? evt.target.checked : evt.target.value
        const tables = [...this.state.tables.map(table =>
            table === selectedTable
                ? {
                    ...table,
                    fields: [...table.fields.map(field =>
                        field === selectedField
                            ? { ...field, [evt.target.name]: value }
                            : field)]
                }
                : table)]
        this.setState({
            tables
        })
    }

    handleBelongsTo (evt, selectedTable, otherTable) {
		const tables = [...this.state.tables.map(table => {
			if (table === selectedTable) {
				if (evt.target.checked) {
					table.belongsTo = [...table.belongsTo, otherTable]
				} else {
					table.belongsTo = [...table.belongsTo.filter(table => table !== otherTable)]
				}
			} else if (table === otherTable) {
				if (evt.target.checked) {
					table.has = [...table.has, selectedTable]
				} else {
					table.has = [...table.belongsTo.filter(table => table !== selectedTable)]
				}
            }
			return table
		})
	]

        this.setState({ tables })
    }

    handleSubmit (evt) {
        evt.preventDefault()
        this.setState({ tableName: '' })
    }

	render () {
        return (
            <div className="fullBody">
                <nav>
                    <div className="flexButtonContainer">
                        <button style={{ 'margin-right': '2px' }} onClick={this.saveSchema}><i className="far fa-save"></i></button>
                        <button style={{ 'margin-left': '2px' }}onClick={this.addTable}>+</button>
                    </div>
                    <h3>Test DB</h3>
                    <div><Link to="/"><button ><i className="fas fa-home"></i></button></Link></div>

                </nav>
                <div className="schemaContainer">
                    <ArcherContainer strokeColor='red'>
                        {this.state.tables.map((table, ind, arr) => {
                            const offset = table.offset
                            return (
                                <Draggable className="dragBox" key={table} axis="both" handle=".logInBox" defaultPosition={{ x: -595, y: 0 - offset }} bounds={{ left: -595, top: 0 - offset, right: 595, bottom: 435 - offset }} position={null} grid={[1, 1]} scale={1} onStart={this.handleStart} onDrag={this.handleDrag} onStop={this.handleStop}>
                                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                                        <ArcherElement id={`table${table.name}`} relations={this.state.showArrows
                                            ? table.belongsTo.map(belongsTo => ({ targetId: `table${belongsTo.name}`, targetAnchor: 'top', sourceAnchor: 'bottom' }))
                                            : []}>
                                            <div className="logInBox">
                                                <form onSubmit={this.handleSubmit}>
                                                    <div className="flexButtonContainer"><input className="titleForm" name="name" placeholder="Table Name..." onChange={(e) => this.handleChange(e, table)} value={table.name} /></div>
                                                    <div className="formBody">
                                                        <div className="formRowMain">
                                                            <div style={{ 'margin-right': '13px' }}>Field</div>
                                                            <div style={{ 'margin-left': '13px' }}>Type</div>
                                                        </div>
                                                        {
                                                            table.fields.map(field => {
                                                                return (
                                                                    <div key={field} className="formRowParent">
                                                                        <div className="formRowMain">
                                                                            <div className="halfRow"><input name="name" placeholder="Name..." onChange={(e) => this.handleFieldChange(e, table, field)} value={field.name} /></div>
                                                                            <div className="halfRow">
                                                                                <select name="type" onChange={(e) => this.handleFieldChange(e, table, field)}>
                                                                                    <option value="string">String</option>
                                                                                    <option value="integer">Integer</option>
                                                                                    <option value="float">Float</option>
                                                                                    <option value="boolean">Boolean</option>
                                                                                </select>
                                                                            </div>
                                                                        </div>
                                                                        <div className="hiddenCheck">
                                                                            <label htmlFor = "allowNull">Allow Null</label>
                                                                            <input name = "allowNull" type="checkbox" onChange ={(e) => this.handleFieldChange(e, table, field)} checked={field.allowNull} />
                                                                        </div>
                                                                    </div>)
                                                            })
                                                        }

                                                    </div>
                                                    <button onClick={() => this.addField(table)}>Add Row</button>
                                                    <div className="allCheckParent" id="toCenter">
                                                        <button>Belongs To</button>
                                                        <div className="hiddenCheck">
                                                            {
                                                                arr.map((inTable, inInd) => {
                                                                    if (inTable !== table) {
                                                                        return (
                                                                            <div className="centerChecks">
                                                                                <label htmlFor = "belongsTo">{`${inTable.name}`}</label>
                                                                                <input name = "belongsTo" type="checkbox" onChange ={(e) => this.handleBelongsTo(e, table, inTable)} checked={table.belongsTo.includes(inTable)} />
                                                                            </div>)
																	} else {
																		return (null)
																	}
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </ArcherElement>
                                    </div>
                                </Draggable>
                            )
                        })
                        }
                    </ArcherContainer>
                </div>
            </div>
        )
    }
}
