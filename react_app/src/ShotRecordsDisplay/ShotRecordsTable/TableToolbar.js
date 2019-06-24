import React from 'react';
import { Toolbar, IconButton, Typography, Popover } from '@material-ui/core';
import FilterListIcon from '@material-ui/icons/FilterList';
import FilterSelector from '../FilterSelector/FilterSelector';

class TableToolbar extends React.Component {
    
    constructor(props) {
        super(props);

        this.state = {
            anchorEl: null,
            open: false
        };
    }

    render() {

        const id = this.state.anchorEl ? "popover" : null;

        return (
            <Toolbar>
                <Typography variant="h5">
                    Shot history
                </Typography>
                    <IconButton aria-label="Filter list" onClick={event => this.handleFilterIconClick(event)}>
                        <FilterListIcon />
                    </IconButton>
                    <Popover
                        id={id}
                        open={this.state.open}
                        onClose={() => this.handleOnPopoverClose()}
                        anchorEl={this.state.anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                       >
                        <FilterSelector
                            currentFilter={this.props.currentFilter}
                            roasters={this.props.roasters}
                            beans={this.props.beans}
                            shots={this.props.shots}
                            onFilterChange={filter => this.props.onFilterChange(filter)}
                            onClose={() => this.handleFilterSelectorOnClose()}
                            />
                    </Popover>
            </Toolbar>
        );
    }

    handleFilterIconClick(event) {
        event.persist();
        this.setState(state => {
            let toOpen = !state.open;
            return { 
                anchorEl: toOpen ? event.target : null,
                open: !state.open 
            };
        });
    }

    handleFilterSelectorOnClose() {
        this.handleOnPopoverClose();
    }

    handleOnPopoverClose() {
        this.setState({
            open: false
        });
    }
}

export default TableToolbar;