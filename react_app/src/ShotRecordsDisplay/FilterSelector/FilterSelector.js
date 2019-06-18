import React from 'react';
import { Button, FormHelperText } from '@material-ui/core';
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

    getUniqueRoastersAndBeans() {
        let uniqueRoasters = this.getUniqueRoasters();
        let uniqueRoasterBeans = {};
        uniqueRoasters.forEach(roaster => {
            uniqueRoasterBeans[roaster] = new Set();
        });

        this.props.shots.forEach(shot => {
            let matchingRoasterSet = uniqueRoasterBeans[shot.roaster];

            if (!matchingRoasterSet.has(shot.bean)) {
                matchingRoasterSet.add(shot.bean);
            }
        });

        return {
            uniqueRoasters: uniqueRoasters,
            uniqueRoasterBeans: uniqueRoasterBeans
        };
    }

    getUniqueRoasters() {
        return this.getUniqueItems(this.props.shots, x => x.roaster);
    }

    getUniqueItems(collection, delegate) {
        let uniqueItems = new Set();
        collection.forEach(record => {
            let item = undefined;
            if (delegate) {
                item = delegate(record);
            } else {
                item = record;
            }

            if (!uniqueItems.has(item)) {
                uniqueItems.add(item);
            }
        });

        return uniqueItems;
    }

    handleFilterTypeChange(val) {
        this.setState({
            filterType: val,
            roaster: "",
            bean: ""
        })
    }

    renderFilterValueSelectors() {
        let uniqueRoastersAndBeans = this.getUniqueRoastersAndBeans();

        return (
            <div>
            {this.shouldRenderRoasterSelector() ? (
                <DropDown
                    name="Roaster"
                    value={this.state.roaster}
                    items={this.convertSetToArray(uniqueRoastersAndBeans.uniqueRoasters)}
                    onChange={x => this.setState({ roaster: x })} />
            ) : null}
            {this.shouldRenderBeanSelector() ? (
                <DropDown
                    name="Bean"
                    value={this.state.bean}
                    items={this.convertSetToArray(uniqueRoastersAndBeans.uniqueRoasterBeans[this.state.roaster])}
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
        return (this.state.filterType == RoasterBean) && this.state.roaster;
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