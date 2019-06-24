import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import './style.css';
import { IconButton } from '@material-ui/core';

import { makeStyles, useTheme } from '@material-ui/core/styles';

import DropDown from '../DropDown/DropDown';

//Using the below style is affected by the known [issue](https://github.com/facebook/react/issues/13991)

//attempting to use this solution: https://github.com/facebook/react/issues/13991#issuecomment-496383268
const buttonUseStyles = makeStyles(theme => ({
    button: {
      margin: theme.spacing(1),
    },
    input: {
      display: 'none',
    },
    stuff: {
        display: 'none'
    }
  }));

function renderMenuItemsWithAddbutton(props) {
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

function renderNewEntryWithConfirmButton(props) {
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
                            disabled={props.disabled}></TextField>
                    </td>
                    <td className="drop-down-button">
                        <IconButton onClick={props.onAddConfirmed} size="small" className="action-button" disabled={props.disabled}><DoneIcon /></IconButton>
                    </td>
                    <td className="drop-down-button">
                        <IconButton onClick={props.onCancelClicked} size="small" className="action-button" disabled={props.disabled}><DeleteIcon /></IconButton>
                    </td>
                </tr>
            </tbody>
        </table>
    );
}

class DropDownWithAddButton extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            value: "",
            addingNewItem: false,
            addingNewItemValid: true,
            itemsHasNewValue: false,
            newValue: null
        };
    }

    render() {
        let addingNewItem = this.state.addingNewItem;

        let styles = buttonUseStyles();
        
        return (
            <div className={styles.stuff}>
                {addingNewItem ? 
                    this.renderAddingNewItem() 
                    : this.renderMenuItemsSelect()}
            </div>
        )
    }

    renderMenuItemsSelect() {
        let items = this.props.items;
        if (this.state.itemsHasNewValue) {
            items = items.slice();
            items.push(this.state.newValue);
        }

        return renderMenuItemsWithAddbutton({
            items: items,
            value: this.state.value,
            onChange: (item) => this.handleItemSelectChange(item),
            onAddClick: () => this.handleAddButtonClick(),
            name: this.props.name
        });
    }

    handleAddButtonClick() {
        this.setState({
            addingNewItem: true,
            value: ""
        });

        this.raiseStartedAddingNewItemCallback();
    }

    handleItemSelectChange(item) {
        this.setState({
            value: item
        });

        this.raiseOnChangeCallback(item);
    }

    renderAddingNewItem() {
        return renderNewEntryWithConfirmButton({
            name: this.props.name,
            onTextChange: (newVal) => this.handleAddNewItemTextChange(newVal),
            onAddConfirmed: () => this.handleAddNewItem(),
            onCancelClicked: () => this.handleCancelAddingNewItem(),
            value: this.state.value,
            disabled: this.props.disabled
        });
    }

    handleAddNewItemTextChange(newVal) {
        this.setState({
            value: newVal
        });
    }

    handleAddNewItem() {
       this.raiseOnNewItemAddedCallback(this.state.value);
       this.finishedAddingItem();
    }

    finishedAddingItem() {
        this.setState(prevState => {
            return {
                addingNewItem: false,
                itemsHasNewValue: true,
                newValue: prevState.value
            };
        });
    }

    handleCancelAddingNewItem() {
        this.setState({
            addingNewItem: false,
            value: ""
        });
    }

    raiseOnChangeCallback(item) {
        if (this.props.onChange) {
            this.props.onChange(item);
        }
    }

    raiseOnNewItemAddedCallback(newItem) {
        if (this.props.onNewItemAdded) {
            this.props.onNewItemAdded(newItem);
        }
    }

    raiseStartedAddingNewItemCallback() {
        if (this.props.onStartAddNewItem) {
            this.props.onStartAddNewItem();
        }
    }
}

export default DropDownWithAddButton;