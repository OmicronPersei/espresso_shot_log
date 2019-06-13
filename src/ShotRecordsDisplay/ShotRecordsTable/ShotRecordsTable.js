import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import { Roaster, RoasterBean } from '../FilterSelector/FilterSelector';
import TableToolbar from './TableToolbar';

class ShotRecordsTable extends React.Component {

    constructor(props) {
        super(props);

        this.cols = [
            { label: "Roaster", id: "roaster", sortAsNumber: false },
            { label: "Bean", id: "bean", sortAsNumber: false },
            { label: "Dose", id: "dose_amount", sortAsNumber: true },
            { label: "Brew Amount", id: "brew_amount", sortAsNumber: true },
            { label: "Brew Ratio", id: "brew_ratio", sortAsNumber: true },
            { label: "Brew time", id: "brew_time_seconds", sortAsNumber: true },
            { 
                label: "Bitterness/sourness", 
                id: "bitter_sour", 
                sortAsNumber: false,
                compare: (a,b,asc) => {
                    //Okay to strip negative sign, we want absolute value.
                    let aVal = a.replace(/\D/g, "");
                    let bVal = b.replace(/\D/g, "");
                    if (asc) {
                        return aVal - bVal;
                    } else {
                        return bVal - aVal;
                    }
                }
            },
        ];
        
        this.state = {
            sortOrder: null,
            sortedColId: null,
            showFilterPopover: false
        };
    }

    render() {
        let shotDisplayRecords = this.mapToShotDisplayRecords(this.props.shots);

        if (this.state.filter) {
            shotDisplayRecords = this.filterDisplayRecords(this.state.filter, shotDisplayRecords);
        }

        shotDisplayRecords = this.sortDisplayRecords(shotDisplayRecords);

        return (
            <div>
                {this.renderTableToolbar()}
                {this.renderTable(shotDisplayRecords)}
            </div>
        );
    }

    mapToShotDisplayRecords(shotRecords) {
        return shotRecords.map(x => {
            return {
                roaster: x.roaster,
                bean: x.bean,
                dose_amount: x.dose_amount_grams,
                brew_amount: x.brew_amount_grams,
                brew_ratio: this.roundToThreeDecimalPlaces(x.brew_amount_grams / x.dose_amount_grams),
                brew_time_seconds: x.brew_time_seconds,
                bitter_sour: x.bitter_sour,
                id: x.id
            };
        });
    }

    sortDisplayRecords(shotDisplayRecords) {
        if (!this.state.sortedColId) {
            return shotDisplayRecords;
        }

        let getValForSorting = val => val[this.state.sortedColId];
        let matchingCol = this.cols.find(col => col.id === this.state.sortedColId);

        return shotDisplayRecords.sort((a,b) => {
            let aVal = getValForSorting(a);
            let bVal = getValForSorting(b);

            let isAsc = this.state.sortOrder === "asc";
            if (matchingCol.sortAsNumber) {
                if (isAsc) {
                    return aVal - bVal;
                } else {
                    return bVal - aVal;
                }
            } else if (matchingCol.compare) {
                return matchingCol.compare(aVal, bVal, isAsc);
            } else {
                if (isAsc) {
                    if (aVal.toUpperCase() > bVal.toUpperCase()) {
                        return 1;
                    } else if (aVal.toUpperCase() < bVal.toUpperCase()) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else {
                    if (aVal.toUpperCase() < bVal.toUpperCase()) {
                        return 1;
                    } else if (aVal.toUpperCase() > bVal.toUpperCase()) {
                        return -1;
                    } else {
                        return 0;
                    }
                }
            }
        });
    }

    filterDisplayRecords(filter, shotDisplayRecords) {
        switch (filter.filterType.toLowerCase()) {
            case Roaster.toLowerCase():
                return shotDisplayRecords.filter(r => r.roaster === filter.roaster);

            case RoasterBean.toLowerCase():
                return shotDisplayRecords.filter(r => (r.roaster === filter.roaster) && (r.bean === filter.bean));

            default:
                throw new Error("Unknown filter type");
        }
    }

    renderTableToolbar() {
        return (
            <TableToolbar
                onFilterChange={filter => this.setState({ filter: filter })}
                roasters={this.props.roasters}
                beans={this.props.beans}
            />
        )
    }
    
    renderTable(shotDisplayRecords) {
        
        let headerProps = {
            cols: this.cols,
            sortedColId: this.state.sortedColId,
            order: this.state.sortOrder,
            onChangeSortedCol: (x) => this.handleChangeSortedCol(x)
        };

        return (
            <Table>
                {RenderSortableTableHeader(headerProps)}
                <TableBody>
                    {RenderCells(shotDisplayRecords, this.cols)}
                </TableBody>
            </Table>
        );
    }

    handleChangeSortedCol(colId) {
        let prevSortedColId = this.state.sortedColId;
        let newSortOrder = "";

        if (prevSortedColId !== colId) {
            newSortOrder = "desc";
        } else {
            //order: (nosort), descending, ascending
            switch (this.state.sortOrder) {
                case "desc":
                    newSortOrder = "asc";
                    break;

                case "asc":
                    newSortOrder = null;
                    colId = null;
                    break;

                default:
                    newSortOrder = "desc";
            }
        }

        this.setState({
            sortedColId: colId,
            sortOrder: newSortOrder
        });
    }

    roundToThreeDecimalPlaces(num) {
        return Math.round(num * 1000) / 1000;
    }
}

function RenderSortableTableHeader(props) {
    return (
        <TableHead>
            <TableRow>
            {props.cols.map(c => (
                <TableCell
                    key={c.id}
                    sortDirection={props.sortedColId === c.id ? props.order : false}>
                    <TableSortLabel
                        active={props.order && (props.sortedColId === c.id)}
                        direction={props.order || undefined}
                        onClick={() => props.onChangeSortedCol(c.id)}
                    >
                        {c.label}
                    </TableSortLabel>
                </TableCell>
            ))}
            </TableRow>
        </TableHead>
    );
}

function RenderCells(shotDisplayRecords, cols) {
    return shotDisplayRecords.map(shotRecord => (
        <TableRow key={shotRecord.id}>
            {cols.map(col => (
                <TableCell key={col.id}>{shotRecord[col.id]}</TableCell>
            ))}
        </TableRow>
    ));
}

export default ShotRecordsTable;