import React from 'react';

import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import { IconButton, FormHelperText } from '@material-ui/core';

import './style.css';

export default function TextInputConfirmCancel(props) {
    let hasError = !!props.error;

    return (
        <table className="drop-down-table">
            <tbody>
                <tr>
                    <td className="drop-down-select">
                        <TextField 
                            value={props.value} 
                            onChange={(event) => props.onTextChange(event.target.value)}
                            label={"New " + props.name.toLowerCase()}
                            className="selector"
                            fullWidth={true}
                            disabled={props.disabled}
                            error={hasError}></TextField>
                    </td>
                    <td className="drop-down-button">
                        <IconButton 
                            onClick={props.onAddConfirmed} 
                            size="small" 
                            className="action-button" 
                            disabled={props.disabled || hasError}
                        >
                                <DoneIcon />
                        </IconButton>
                    </td>
                    <td className="drop-down-button">
                        <IconButton 
                            onClick={props.onCancelClicked} 
                            size="small" 
                            className="action-button" 
                            disabled={props.disabled}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </td>
                </tr>
                {props.error ? (
                <tr>
                    <td>
                        <FormHelperText error={true}>{props.error.description}</FormHelperText>
                    </td>
                </tr>) : null}
            </tbody>
        </table>
    );
}