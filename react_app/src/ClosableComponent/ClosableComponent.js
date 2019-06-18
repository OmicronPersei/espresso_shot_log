import React from 'react';
import { Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

import './style.css';

export default function ClosableComponent(props) {
    return (
        <div className="modal">
            <table>
                <tbody>
                    <tr className="header">
                        <td className="title">
                            <Typography variant="h5">
                                {props.title}
                            </Typography>
                        </td>
                        <td>
                            <IconButton onClick={() => props.onClose()} className="close-button">
                                <CloseIcon />
                            </IconButton>
                        </td>
                    </tr>
                </tbody>
            </table>
            {props.children}
        </div>
    );
}