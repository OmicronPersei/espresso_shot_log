import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';

class ShotRecordsTable extends React.Component {

    constructor(props) {
        super(props);

        this.cols = [
            { label: "Roaster", sortable: true, id: "roaster", sortAsNumber: false },
            { label: "Bean", sortable: true, id: "bean", sortAsNumber: false },
            { label: "Dose", sortable: true, id: "dose_amount", sortAsNumber: true },
            { label: "Brew Amount", sortable: true, id: "brew_amount", sortAsNumber: true },
            { label: "Brew Ratio", sortable: true, id: "brew_ratio", sortAsNumber: true },
            { label: "Brew time", sortable: true, id: "brew_time_seconds", sortAsNumber: true },
            { label: "Bitterness/sourness", sortable: true, id: "bitter_sour", sortAsNumber: false },
        ];
        
        this.state = {
            sortOrder: null,
            sortedColId: null
        };
    }

    render() {
        let shotDisplayRecords = this.mapToShotDisplayRecords(this.props.shots);

        shotDisplayRecords = this.sortDisplayRecords(shotDisplayRecords);
        
        return this.renderTable(shotDisplayRecords);
    }

    mapToShotDisplayRecords(shotRecords) {
        return shotRecords.map(x => {
            return {
                roaster: x.roaster,
                bean: x.bean,
                dose_amount: x.dose_amount_grams,
                brew_amount: x.brew_amount_grams,
                brew_ratio: x.brew_amount_grams / x.dose_amount_grams,
                brew_time_seconds: x.brew_time_seconds,
                bitter_sour: x.bitter_sour,
                id: x.id
            };
        });
    }

    sortDisplayRecords(shotDisplayRecords) {
        if (!this.state.sortedColId || !this.state.sortOrder) {
            return shotDisplayRecords;
        }
        let getValForSorting = val => val[this.state.sortedColId];
        let sortAsNumber = this.cols.find(col => col.id === this.state.sortedColId).sortAsNumber;

        return shotDisplayRecords.sort((a,b) => {
            let aVal = getValForSorting(a);
            let bVal = getValForSorting(b);

            if (sortAsNumber) {
                if (this.state.sortOrder === "asc") {
                    return aVal - bVal;
                } else {
                    return bVal - aVal;
                }
            } else {
                if (this.state.sortOrder === "asc") {
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

export default ShotRecordsTable;

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