/* eslint-disable react/prop-types */
import React from 'react'

export default function TableBody (props) {
	const { table, handleFieldChange } = props
	return (
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
								<div className="halfRow"><input name="name" placeholder="Name..." onChange={(e) => handleFieldChange(e, table, field)} value={field.name} /></div>
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
