import React, { FunctionComponent, ChangeEvent, MouseEvent } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { ArcherContainer, ArcherElement } from 'react-archer'
import TableBody from './TableBody'
import TableAssociations from './TableAssociations'
import { SchemaTable, SchemaField, VisualizerState } from '../../interfaces'

interface SchemaContainerProps {
	state: VisualizerState,
	handleStop: DraggableEventHandler,
	handleStart: DraggableEventHandler,
	handleChange: (evt: ChangeEvent<HTMLInputElement>, table: SchemaTable) => void,
    handleFieldChange: (evt: ChangeEvent<HTMLSelectElement | HTMLInputElement>, selectedTable: SchemaTable, selectedField: SchemaField) => void
	addField: (evt: MouseEvent, table: SchemaTable) => void,
	handleBelongsTo: (evt: ChangeEvent<HTMLInputElement>, selectedTable: SchemaTable, otherTable: SchemaTable) => void
}

const SchemaContainer: FunctionComponent<SchemaContainerProps> = (props: SchemaContainerProps) => {
	const { state, handleStop, handleStart, handleChange, handleFieldChange, addField, handleBelongsTo } = props
	return (
		<div className="schemaContainer">
			<ArcherContainer strokeColor='red'>
				<div className="dragBoxContainerRow">
					{state.tables.map((table: SchemaTable, ind: number, arr: SchemaTable[]) => {
						return (
							<div className="dragBoxContainer" key={ind}>
								<Draggable
									axis="both"
									handle=".logInBox"
									defaultPosition={{ x: ind * -209, y: 0 }}
									bounds=".schemaContainer"
									grid={[1, 1]}
									scale={1}
									onStart={handleStart}
									onStop={handleStop}
								>
									<div className="dragBox">
										<ArcherElement
											id={`${table.frontId}`}
											relations={ state.showArrows
												? table.belongsTo.map((belongsTo: number) => ({ targetId: `${belongsTo}`, targetAnchor: 'top', sourceAnchor: 'bottom' }))
												: []
											}
										>
											<div className="logInBox">
												<form>
													<div className="flexButtonContainer"><input className="titleForm" name="name" placeholder="Table Name..." onChange={(e) => handleChange(e, table)} value={table.name} /></div>
													<TableBody
														table={table}
														handleFieldChange={handleFieldChange}
													/>
													<button type="button" onClick={(evt: MouseEvent<HTMLButtonElement>) => addField(evt, table)}>Add Row</button>
													<TableAssociations
														table={table}
														arr={arr}
														handleBelongsTo={handleBelongsTo}
													/>
												</form>
											</div>
										</ArcherElement>
									</div>
								</Draggable>
							</div>
						)
					})
					}
				</div>
			</ArcherContainer>
		</div>
	)
}

export default SchemaContainer
