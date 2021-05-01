import React, { FunctionComponent } from 'react'
import { SchemaTable, SchemaField } from '../../interfaces'

interface TableBodyProps {
    table: SchemaTable,
    handleFieldChange: (evt: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>, selectedTable: SchemaTable, selectedField: SchemaField) => void
}

const TableBody: FunctionComponent<TableBodyProps> = (props: TableBodyProps) => {
	const { table, handleFieldChange } = props
	return (
		<div className="formBody">
			<div className="formRowMain">
				<div className="formRowMainLeftHeader">Field</div>
				<div className="formRowMainRightHeader">Type</div>
			</div>
			{
				table.fields.map((field, idx) => {
					return (
						<div key={idx} className="formRowParent">
							<div className="formRowMain">
								<div className="halfRow">
									<input name="name"
										placeholder="Name..."
										onChange={(e) => handleFieldChange(e, table, field)}
										value={field.name}
									/>
								</div>
								<div className="halfRow">
									<select name="type" onChange={(e) => handleFieldChange(e, table, field)}>
										<option value="string">String</option>
										<option value="integer">Integer</option>
										<option value="float">Float</option>
										<option value="boolean">Boolean</option>
									</select>
								</div>
							</div>
							<div className="hiddenCheck">
								<label htmlFor = "allowNull">Allow Null</label>
								<input name = "allowNull" type="checkbox" onChange ={(e) => handleFieldChange(e, table, field)} checked={field.allowNull} />
							</div>
						</div>)
				})
			}
		</div>
	)
}

export default TableBody
