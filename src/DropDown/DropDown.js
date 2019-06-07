import React from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

function DropDown(props) {
    let items = props.items;
    let menuItems = [];
    
    let nullMenuItem = (
        <MenuItem value="" key="">
            (none)
        </MenuItem>
    );

    menuItems.push(nullMenuItem);

    let defaultMenuItems = items.map(item =>
        (
            <MenuItem value={item} key={item}>
                {item}
            </MenuItem>
        )
    );

    menuItems = menuItems.concat(defaultMenuItems);

    return (
        <FormControl>
            <InputLabel>{props.name}</InputLabel>
            <Select
                value={props.value}
                onChange={(event) => props.onChange(event.target.value)}
                className="selector"
                fullWidth={true}
            >
                {menuItems}
            </Select>
        </FormControl>
    );
}

export default DropDown;