import React from 'react';
import { Grid, Typography, Button } from '@material-ui/core';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import DropDown from '../../DropDown/DropDown';
import './style.css';

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
            <table>
                <tbody>
                    <tr>
                        <td colSpan={2}>
                            <IconButton onClick={() => this.props.onClose()} className="close-button">
                                <CloseIcon />
                            </IconButton>
                        </td>
                    </tr>
                    <tr>
                        <td>
                        Filter type
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <DropDown
                                name="Type"
                                value={this.state.filterType}
                                items={this.filterTypes}
                                onChange={x => this.handleFilterTypeChange(x)} />
                        </td>
                        <td>
                            {this.renderFilterValueSelectors()}
                            {this.renderButtons()}
                        </td>
                    </tr>
                </tbody>
            </table>
        );
    }

    handleFilterTypeChange(val) {
        this.setState({
            filterType: val,
            roaster: "",
            bean: ""
        })
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
                    items={this.props.beans[this.state.roaster]}
                    onChange={x => this.setState({ bean: x })} />
            ) : null}
            </div>
        )
    }

    shouldRenderRoasterSelector() {
        return this.state.filterType === Roaster || this.state.filterType === RoasterBean;
    }

    shouldRenderBeanSelector() {
        return this.state.filterType == RoasterBean;
    }

    renderButtons() {
        if (!this.state.filterType) {
            return null;
        }

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