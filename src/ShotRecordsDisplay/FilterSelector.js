import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DropDown from '../DropDown/DropDown';

export const Roaster = "Roaster";
export const RoasterBean = "Roaster/Bean";

class FilterSelector extends React.Component {

    constructor(props) {
        super(props);

        this.filterTypes = [
            Roaster,
            RoasterBean
        ];

        this.state = {
            filterType: "",
            roaster: "",
            bean: ""
        };
    }

    render() {

        return (
            <Grid>
                <Grid item xs={12}>
                    <IconButton onClick={() => this.props.onClose()}>
                        <CloseIcon />
                    </IconButton>
                </Grid>
                <Grid item xs={5}>
                    <Typography variant="h7">
                        Filter type
                    </Typography>
                </Grid>
                <Grid item xs={7}></Grid>
                <Grid item xs={5}>
                    <DropDown
                        name="Type"
                        value={this.state.filterType}
                        items={this.filterTypes}
                        onChange={x => this.setState({ filterType: x })} />
                </Grid>
                <Grid item xs={7}>
                    {this.renderFilterValueSelectors()}
                </Grid>
            </Grid>
        );
    }

    renderFilterValueSelectors() {
        return (
            <div>
            {this.shouldRenderRoasterSelector() ? (
                <DropDown
                    name="Roaster"
                    value={this.state.roaster}
                    items={this.props.roasters}
                    onChange={x => this.setState({ roaster: x })} />
            ) : null}
            {this.shouldRenderBeanSelector() ? (
                <DropDown
                    name="Bean"
                    value={this.state.bean}
                    items={this.props.bean[this.state.roaster]}
                    onChange={x => this.setState({ bean: x })} />
            ) : null}
            </div>
        )
    }

    shouldRenderRoasterSelector() {
        return this.filterType = Roaster || this.filterType == RoasterBean;
    }

    shouldRenderBeanSelector() {
        return this.filterType == RoasterBean;
    }

    renderButtons() {
        return (
            <div>
                <Button color="primary" onClick={() => this.handleOnClickApply()}>
                    Apply
                </Button>
                <Button onClick={() => this.handleOnClickClear()}>
                    Clear
                </Button>
            </div>
        );
    }

    handleOnClickApply() {
        this.raiseOnFilterChange();
    }

    handleOnClickClear() {
        this.setState({
            filterType: "",
            roaster: "",
            bean: ""
        });

        this.raiseOnFilterChange();
    }

    raiseOnFilterChange() {
        this.props.onFilterChange({
            ...this.state
        });
    }
}


export default FilterSelector;