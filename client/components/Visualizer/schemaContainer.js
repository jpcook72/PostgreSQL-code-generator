/* eslint-disable react/prop-types */
import React from 'react'
import Draggable from 'react-draggable'
import { ArcherContainer, ArcherElement } from 'react-archer'
import TableBody from './TableBody.js'
import TableAssociations from './TableAssociations.js'

export default class SchemaContainer extends React.Component {
    render () {
        const { state, handleStop, handleStart, handleChange, handleFieldChange, addField, handleBelongsTo } = this.props
        return (
            <div className="schemaContainer">
                <ArcherContainer strokeColor='red'>
                    {state.tables.map((table, ind, arr) => {
                        const offset = table.offset
                        return (
                            <Draggable className="dragBox"
                                key={table}
                                axis="both"
                                handle=".logInBox"
                                defaultPosition={{ x: -595, y: 0 - offset }}
                                bounds={{ left: -595, top: 0 - offset, right: 595, bottom: 435 - offset }}
                                position={null} grid={[1, 1]} scale={1} onStart={handleStart}
                                onDrag={this.handleDrag}
                                onStop={handleStop}
                            >
                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <ArcherElement
                                        id={`${table.frontId}`}
                                        relations={ state.showArrows
                                            ? table.belongsTo.map(belongsTo => ({ targetId: `${belongsTo}`, targetAnchor: 'top', sourceAnchor: 'bottom' }))
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
                                                <button type="button" onClick={(evt) => addField(evt, table)}>Add Row</button>
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
                        )
                    })
                    }
                </ArcherContainer>
            </div>
        )
    }
}
