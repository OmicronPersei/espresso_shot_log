import React from 'react';

import './style.css';

import NonEditableDropDown from './NonEditableDropDown';
import TextInputConfirmCancel from './TextInputConfirmCancel';

//Using the below style is affected by the known [issue](https://github.com/facebook/react/issues/13991)

// const buttonUseStyles = makeStyles(theme => ({
//     button: {
//       margin: theme.spacing(1),
//     },
//     input: {
//       display: 'none',
//     },
//   }));

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
            <React.Fragment>
                {addingNewItem ? 
                    this.renderAddingNewItem() 
                    : this.renderMenuItemsSelect()}
            </React.Fragment>
        )
    }

    renderMenuItemsSelect() {
        let items = this.props.items;
        if (this.state.itemsHasNewValue) {
            items = (items && items.slice()) || [];
            items.push(this.state.newValue);
        }

        return NonEditableDropDown({
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
        let error = this.props.items.includes(this.state.value) ? { description: this.props.name + " already exists" } : null;

        return TextInputConfirmCancel({
            name: this.props.name,
            onTextChange: (newVal) => this.handleAddNewItemTextChange(newVal),
            onAddConfirmed: () => this.handleAddNewItem(),
            onCancelClicked: () => this.handleCancelAddingNewItem(),
            value: this.state.value,
            disabled: this.props.disabled,
            error: error
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

        this.raiseOnChangeCallback(this.state.value);
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