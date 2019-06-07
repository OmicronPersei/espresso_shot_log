import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import './style.css';
import { IconButton } from '@material-ui/core';

//Using the below style is affected by the known [issue](https://github.com/facebook/react/issues/13991)

// const buttonUseStyles = makeStyles(theme => ({
//     button: {
//       margin: theme.spacing(1),
//     },
//     input: {
//       display: 'none',
//     },
//   }));

function renderMenuItemsWithAddbutton(props) {
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
        <div>
            <FormControl>
                <InputLabel>{props.name}</InputLabel>
                <Select
                    value={props.curValue}
                    onChange={(event) => props.onChange(event.target.value)}
                    className="selector"
                    fullWidth={true}
                >
                    {menuItems}
                </Select>
            </FormControl>
            <IconButton onClick={() => props.onAddClick()} size="small" className="action-button"><AddIcon /></IconButton>
        </div>
    );
}

function renderNewEntryWithConfirmButton(props) {
    return (
        <div>
            <FormControl>
                <TextField 
                    value={props.curValue} 
                    onChange={(event) => props.onTextChange(event.target.value)}
                    label={"New " + props.name.toLowerCase()}
                    className="selector"
                    fullWidth={true}></TextField>
            </FormControl>
            <IconButton onClick={props.onAddConfirmed} size="small" className="action-button"><DoneIcon /></IconButton>
            <IconButton onClick={props.onCancelClicked} size="small" className="action-button"><DeleteIcon /></IconButton>
        </div>
    );
}

class DropDownWithAddButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            items: [
                "Counter culture",
                "Sage brush",
                "Starbucks"
            ],
            curValue: "",
            addingNewItem: false,
            addingNewItemValid: true
        };
    }

    render() {
        let addingNewItem = this.state.addingNewItem;
        
        return (
            <div style={{margin: 'auto'}}>
                {addingNewItem ? 
                    this.renderAddingNewItem() 
                    : this.renderMenuItemsSelect()}
            </div>
        )
    }

    renderMenuItemsSelect() {
        return renderMenuItemsWithAddbutton({
            items: this.state.items,
            curValue: this.state.curValue,
            onChange: (item) => this.handleItemSelectChange(item),
            onAddClick: () => this.handleAddButtonClick(),
            name: this.props.name
        });
    }

    handleAddButtonClick() {
        this.setState({
            addingNewItem: true,
            curValue: ""
        })
    }

    handleItemSelectChange(item) {
        this.setState({
            curValue: item
        });

        this.raiseOnChangeCallback();
    }

    renderAddingNewItem() {
        return renderNewEntryWithConfirmButton({
            name: this.props.name,
            onTextChange: (newVal) => this.handleAddNewItemTextChange(newVal),
            onAddConfirmed: () => this.handleAddNewItem(),
            onCancelClicked: () => this.handleCancelAddingNewItem(),
            curValue: this.state.curValue
        });
    }

    handleAddNewItemTextChange(newVal) {
        let addingNewItemValid = !this.state.items.includes(newVal);

        this.setState({
            curValue: newVal,
            addingNewItemValid: addingNewItemValid
        });
    }

    handleAddNewItem() {
        let curItems = this.state.items.slice();
        curItems.push(this.state.curValue);

        this.setState({
            items: curItems,
            addingNewItem: false
        });

        this.raiseOnNewItemAddedCallback(this.state.curValue);
    }

    handleCancelAddingNewItem() {
        this.setState({
            addingNewItem: false,
            curValue: ""
        });
    }

    raiseOnChangeCallback() {
        if (this.props.onChange) {
            this.props.onChange(this.state.curValue);
        }
    }

    raiseOnNewItemAddedCallback(newItem) {
        if (this.props.onNewItemAdded) {
            this.props.onNewItemAdded(newItem);
        }
    }
}

export default DropDownWithAddButton;