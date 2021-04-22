/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react'
import { schemaTable } from '../../interfaces'

interface TableAssociationProps {
	table: schemaTable,
	arr: schemaTable[],
	handleBelongsTo: (evt: React.ChangeEvent<HTMLInputElement>, selectedTable: schemaTable, otherTable: schemaTable) => schemaTable
}

export const TableAssociations: FunctionComponent<TableAssociationProps> = (props) => {
	const { arr, table, handleBelongsTo } = props
	return (
		<div className="allCheckParent" id="toCenter">
			<button>Belongs To</button>
			<div className="hiddenCheck">
				{
					arr.map((inTable) => {
						if (inTable !== table) {
							return (
								<div className="centerChecks">
									<label htmlFor = "belongsTo">{`${inTable.name}`}</label>
									<input name = "belongsTo" type="checkbox" onChange ={(e) => handleBelongsTo(e, table, inTable)} checked={table.belongsTo.includes(inTable.frontId)} />
								</div>)
						} else {
							return (null)
						}
					})
				}
			</div>
		</div>
	)
}
