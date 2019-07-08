import React from 'react';

import { IconButton } from '@material-ui/core';

import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';

import { makeStyles, useTheme } from '@material-ui/core/styles';

//Using the below style is affected by the known [issue](https://github.com/facebook/react/issues/13991)

//attempting to use this solution: https://github.com/facebook/react/issues/13991#issuecomment-496383268
const useStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    }
}));

export default function RenderNewEntryWithConfirmButton(props) {
    let styles = useStyles();

    return (
        <table>
            <tbody>
                <tr>
                    <td className="drop-down-select">
                        <TextField 
                            value={props.value} 
                            onChange={(event) => props.onTextChange(event.target.value)}
                            label={"New " + props.name.toLowerCase()}
                            className="selector"
                            fullWidth={true}
                            disabled={props.disabled}></TextField>
                    </td>
                    <td className="drop-down-button">
                        <IconButton 
                            onClick={props.onAddConfirmed} 
                            size="small" 
                            className={styles.button} 
                            disabled={props.disabled}
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
            </tbody>
        </table>
    );
}