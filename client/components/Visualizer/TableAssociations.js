/* eslint-disable react/prop-types */
import React from 'react'

export default function TableAssociations (props) {
    const { arr, table, handleBelongsTo } = props
    return (
        <div className="allCheckParent" id="toCenter">
            <button>Belongs To</button>
            <div className="hiddenCheck">
                {
                    arr.map((inTable, inInd) => {
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
