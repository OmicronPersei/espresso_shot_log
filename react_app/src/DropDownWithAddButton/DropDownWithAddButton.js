import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';

import AddIcon from '@material-ui/icons/Add';
import './style.css';
import { IconButton } from '@material-ui/core';



import DropDown from '../DropDown/DropDown';

import RenderNewEntryWithConfirmButton from './RenderNewEntryWithConfirmButton';



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
        
        return (
            <div>
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
        return RenderNewEntryWithConfirmButton({
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

//-----below is test code and should be removed before being merged.-----
// Add this in node_modules/react-dom/index.js
window.React1 = require('react');

// Add this in your component file
require('react-dom');
window.React2 = require('react');
console.log(window.React1 === window.React2);