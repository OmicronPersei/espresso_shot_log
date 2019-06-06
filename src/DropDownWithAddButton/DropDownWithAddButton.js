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
                {addingNewItem ? this.renderAddingNewItem() : this.renderMenuItemsSelect()}
            </FormControl>
        )
    }

    renderMenuItemsSelect() {
        let curValue = this.state.curValue;

        return (
            <div>
                <InputLabel>{this.props.name}</InputLabel>
                <Select
                    value={curValue}
                    onChange={(event) => this.handleItemSelectChange(event)}
                    className="selector"
                >
                    {this.renderMenuItems()}
                </Select>
                <Button variant="outlined" color="default" onClick={() => this.handleAddButtonClick()}>
                    Add
                </Button>
            </div>
        );
    }

    handleAddButtonClick() {
        this.setState({
            addingNewItem: true,
            curValue: ""
        })
    }

    renderMenuItems() {
        let items = this.state.items;
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
        

        return menuItems;
    }

    handleItemSelectChange(event) {
        let newItem = event.target.value;
        console.log("setting new selection to " + newItem);
        
        this.setState({
            curValue: newItem
        });
    }

    renderAddingNewItem() {
        let isError = !this.state.addingNewItemValid;
        return (
            <div>
                <TextField 
                    value={this.state.curValue} 
                    onChange={(event) => this.handleAddNewItemTextChange(event)}
                    label={"New " + this.props.name.toLowerCase()}
                    className="selector"></TextField>
                <Button variant="contained" color="primary" onClick={() => this.handleAddNewItem()}>Confirm</Button>
            </div>
        );
    }

    handleAddNewItemTextChange(event) {
        let newVal = event.target.value;

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
}

export default DropDownWithAddButton;