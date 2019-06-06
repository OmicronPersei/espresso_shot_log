import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import './style.css';

// const useStyles = makeStyles(theme => ({
//     button: {
//       margin: theme.spacing(1),
//     },
//     input: {
//       display: 'none',
//     },
//   }));

//   const classes = useStyles();

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
            <InputLabel>{props.name}</InputLabel>
            <Select
                value={props.curValue}
                onChange={(event) => props.onChange(event.target.value)}
                className="selector"
            >
                {menuItems}
            </Select>
            <Button variant="outlined" color="default" onClick={() =>props.onAddClick()}>
                Add
            </Button>
        </div>
    );
}

function renderNewEntryWithConfirmButton(props) {
    return (
        <div>
            <TextField 
                value={props.curValue} 
                onChange={(event) => props.onTextChange(event.target.value)}
                label={"New " + props.name.toLowerCase()}
                className="selector"></TextField>
            <Button variant="contained" color="primary" onClick={props.onAddConfirmed}>Confirm</Button>
            <Button variant="contained" color="secondary" onClick={props.onCancelClicked}>Cancel</Button>
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

        this.addNewItemConst = Symbol("add new item");
    }

    render() {
        let addingNewItem = this.state.addingNewItem;
        
        return (
            <FormControl>
                {addingNewItem ? 
                    this.renderAddingNewItem() 
                    : this.renderMenuItemsSelect()}
            </FormControl>
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
    }

    handleCancelAddingNewItem() {
        this.setState({
            addingNewItem: false,
            curValue: ""
        });
    }
}

export default DropDownWithAddButton;