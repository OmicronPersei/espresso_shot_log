import React from 'react';

import MenuItem from '@material-ui/core/MenuItem';
import AddIcon from '@material-ui/icons/Add';
import { IconButton } from '@material-ui/core';

import DropDown from '../DropDown/DropDown';

import './style.css';

export default function NonEditableDropDown(props) {
    let items = props.items;

    let menuItems = [];
    
    let nullMenuItem = (
        <MenuItem value="" key="">
            (none)
        </MenuItem>
    );

    menuItems.push(nullMenuItem);

    let defaultMenuItems = items && items.map(item =>
        (
            <MenuItem value={item} key={item}>
                {item}
            </MenuItem>
        )
    );

    menuItems = menuItems.concat(defaultMenuItems);
    
    return (
        <table className="drop-down-table">
            <tbody>
                <tr>
                    <td className="drop-down-select">
                        <DropDown
                            name={props.name}
                            value={props.value}
                            items={props.items}
                            onChange={x => props.onChange(x)} 
                            fullWidth={true}
                        />
                    </td>
                    <td className="drop-down-button">
                        <IconButton onClick={() => props.onAddClick()} size="small" className="action-button"><AddIcon /></IconButton>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}