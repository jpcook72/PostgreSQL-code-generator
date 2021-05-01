/* eslint-disable react/prop-types */
/* eslint-disable indent */
/* eslint-disable no-tabs */
import React, { ChangeEvent, MouseEvent } from 'react'
import SchemaContainer from './SchemaContainer'
import axios from 'axios'
import { Link, RouteComponentProps } from 'react-router-dom'
import { SchemaTable, SchemaField, VisualizerState, FieldTypes } from '../../interfaces'

interface MatchParams {
    schemaId: string;
}

type RouteComponentPropsMatch = RouteComponentProps<MatchParams>

export default class Visualizer extends React.Component<RouteComponentPropsMatch, VisualizerState> {
    constructor (props: RouteComponentPropsMatch) {
        super(props)
        this.state = {
            showArrows: true,
            tables: [],
            schemaId: null,
            maxId: 1
        }
        this.addTable = this.addTable.bind(this)
        this.saveSchema = this.saveSchema.bind(this)
        this.handleStop = this.handleStop.bind(this)
        this.handleStart = this.handleStart.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.addField = this.addField.bind(this)
        this.handleBelongsTo = this.handleBelongsTo.bind(this)
    }

    async componentDidMount (): Promise<void> {
		const { schemaId } = this.props.match.params
        const startState = await axios.get(`/api/schema/${schemaId}`)
        const startTables = startState.data.tables.length
            ? startState.data.tables.map((table: SchemaTable) => {
                const belongsToOut = [...table.belongsTo]
                table.belongsTo = [...table.has.map((inTable: number) => inTable)]
                table.has = [...belongsToOut]
                return table
            })
            : [
                {
                    frontId: 1,
                    name: '',
                    fields: [],
                    belongsTo: [],
                    has: []
                }
            ]

        this.setState({
            tables: startTables,
            maxId: Math.max(...startTables.map((table: SchemaTable) => table.frontId)) + 1,
            schemaId
        })
    }

    componentWillUnmount (): void {
        this.setState = () => {
            return null
        }
    }

    addTable (): void {
        const newTable = {
            frontId: this.state.maxId,
            name: '',
            fields: [],
            belongsTo: [],
            has: []
        }
        this.setState({ tables: [...this.state.tables, newTable], maxId: this.state.maxId + 1 })
    }

    async saveSchema (): Promise<void> {
        const { schemaId } = this.props.match.params
        await axios.put(`/api/schema/${schemaId}`, this.state.tables)
    }

    handleStart (): void {
        this.setState({ showArrows: false })
    }

    handleStop (): void {
        this.setState({ showArrows: true })
    }

    handleChange (evt: ChangeEvent<HTMLInputElement>, selectedTable: SchemaTable): void {
        const tables = this.state.tables.map(table => table === selectedTable ? { ...table, [evt.target.name]: evt.target.value } : table)
        this.setState({
            tables
        })
    }

    addField (evt: MouseEvent, selectedTable: SchemaTable): void {
        const newField: SchemaField = { name: '', type: FieldTypes.String, allowNull: true }
        const tables = [...this.state.tables.map(table => table === selectedTable ? { ...table, fields: [...table.fields, newField] } : table)]
        this.setState({ tables })
    }

    handleFieldChange (evt: ChangeEvent<HTMLSelectElement | HTMLInputElement>, selectedTable: SchemaTable, selectedField: SchemaField): void {
        const value = evt.target.type === 'checkbox' && ('checked' in evt.target) ? evt.target.checked : evt.target.value
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

    handleBelongsTo (evt: ChangeEvent<HTMLInputElement>, selectedTable: SchemaTable, otherTable: SchemaTable): void {
        const tables = [...this.state.tables.map(table => {
            if (table === selectedTable) {
                if (evt.target.checked && !otherTable.belongsTo.includes(selectedTable.frontId)) {
                    table.belongsTo = [...table.belongsTo, otherTable.frontId]
                } else {
                    table.belongsTo = [...table.belongsTo.filter((frontId: number) => frontId !== otherTable.frontId)]
                }
            }
            if (table === otherTable) {
                if (evt.target.checked && !selectedTable.has.includes(otherTable.frontId)) {
                    table.has = [...table.has, selectedTable.frontId]
                } else {
                    table.has = [...table.belongsTo.filter((frontId: number) => frontId !== selectedTable.frontId)]
                }
            }
            return table
        })
        ]

        this.setState({ tables })
    }

	render (): JSX.Element {
        const { schemaId } = this.state
        return (
            <div className="fullBody">
                <nav>
                    <div className="flexButtonContainer">
                        <button className="saveButton" data-testid="saveButton" onClick={this.saveSchema}><i className="far fa-save"></i></button>
                        <button className="addTableButton" onClick={this.addTable}>+</button>
                    </div>
                    <h3>{schemaId || 'Loading...'}</h3>
                    <div><Link to="/"><button data-testid="homeButton"><i className="fas fa-home"></i></button></Link></div>

                </nav>
                <SchemaContainer
                    state={this.state}
                    handleStop={this.handleStop}
                    handleStart={this.handleStart}
                    handleChange={this.handleChange}
                    handleFieldChange={this.handleFieldChange}
                    addField={this.addField}
                    handleBelongsTo={this.handleBelongsTo}
                />
            </div>
        )
    }
}
