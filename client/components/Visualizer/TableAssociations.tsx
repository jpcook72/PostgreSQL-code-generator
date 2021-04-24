/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react'
import { SchemaTable } from '../../interfaces'

interface TableAssociationProps {
	table: SchemaTable,
	arr: SchemaTable[],
	handleBelongsTo: (evt: React.ChangeEvent<HTMLInputElement>, selectedTable: SchemaTable, otherTable: SchemaTable) => SchemaTable
}

const TableAssociations: FunctionComponent<TableAssociationProps> = (props) => {
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

export default TableAssociations
