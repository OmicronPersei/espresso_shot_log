import React from 'react';
import { Button } from '@material-ui/core';
import DropDown from '../../DropDown/DropDown';
import './style.css';
import ClosableComponent from '../../ClosableComponent/ClosableComponent';

class FilterSelector extends React.Component {

    constructor(props) {
        super(props);

        this.filterTypes = [
            Roaster,
            RoasterBean
        ];

        this.state = {
            filterType: props.currentFilter.filterType,
            roaster: props.currentFilter.roaster,
            bean: props.currentFilter.bean
        };
    }

    render() {
        return (
            <ClosableComponent
                onClose={() => this.props.onClose()}
                title="Filter"
            >
                <table className="filter-table">
                    <tbody>
                        <tr>
                            <td className="left">
                                <DropDown
                                    name="Type"
                                    value={this.state.filterType}
                                    items={this.filterTypes}
                                    onChange={x => this.handleFilterTypeChange(x)} />
                            </td>
                            <td className="right">
                                {this.renderFilterValueSelectors()}
                                {this.renderButtons()}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </ClosableComponent>
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

    convertSetToArray(set) {
        return Array.from(set);
    }

    shouldRenderRoasterSelector() {
        return this.state.filterType === Roaster || this.state.filterType === RoasterBean;
    }

    shouldRenderBeanSelector() {
        return (this.state.filterType === RoasterBean) && this.state.roaster;
    }

    renderButtons() {
        if (!this.state.filterType) {
            return null;
        }

        return (
            <div className="buttons">
                <div className="action-button">
                    <Button variant="contained" color="primary" onClick={() => this.handleOnClickApply()} className="action-button">
                        Apply
                    </Button>
                </div>
                <div className="action-button">
                    <Button variant="contained" onClick={() => this.handleOnClickClear()} className="action-button">
                        Clear
                    </Button>
                </div>
            </div>
        );
    }

    handleOnClickApply() {
        this.raiseOnFilterChange();
        this.props.onClose();
    }

    handleOnClickClear() {
        this.props.onClose();
        
        new Promise(() => {
            this.setState({
                filterType: "",
                roaster: "",
                bean: ""
            }, () => {
                this.raiseOnFilterChange();
            });
        })
        
    }

    raiseOnFilterChange() {
        this.props.onFilterChange({
            ...this.state
        });
    }
}




export const Roaster = "Roaster";
export const RoasterBean = "Roaster/Bean";

export default FilterSelector;