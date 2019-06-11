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

        //mock data for testing
        this.shot_records = [
            {
                roaster: "Counter culture",
                bean: "Apollo",
                grinder_setting: "1.8",
                dose_amount_grams: 18,
                brew_amount_grams: 24,
                brew_time_seconds: 35,
                bitter_sour: "+1 (bitter)",
                issues: ""
            },
            {
                roaster: "Counter culture",
                bean: "Apollo",
                grinder_setting: "1.8",
                dose_amount_grams: 18,
                brew_amount_grams: 24,
                brew_time_seconds: 36,
                bitter_sour: "+1 (bitter)",
                issues: ""
            },
            {
                roaster: "Counter culture",
                bean: "Apollo",
                grinder_setting: "1.8",
                dose_amount_grams: 18,
                brew_amount_grams: 24,
                brew_time_seconds: 37,
                bitter_sour: "+1 (bitter)",
                issues: ""
            }
        ];

        //todo: refactor to not need the `id` prop here.
        this.cols = [
            { label: "Roaster", sortable: true, id: "roaster" },
            { label: "Bean", sortable: true, id: "bean" },
            { label: "Dose", sortable: true, id: "dose_amount" },
            { label: "Brew Amount", sortable: true, id: "brew_amount" },
            { label: "Brew Ratio", sortable: true, id: "brew_ratio" },
            { label: "Bitterness/sourness", sortable: true, id: "bitter_sour" },
        ];
        
        this.state = {
            sortOrder: null,
            sortedColId: null
        };
    }

    render() {
        let shotDisplayRecords = this.mapToShotDisplayRecords(this.shot_records);

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
                bitter_sour: x.bitter_sour
            };
        });
    }

    sortDisplayRecords(shotDisplayRecords) {
        if (!this.state.sortedColId) {
            return shotDisplayRecords;
        }
        let getValForSorting = val => val[this.state.sortedColId];

        return shotDisplayRecords.sort((a,b) => {
            let aVal = getValForSorting(a);
            let bVal = getValForSorting(b);
            if (this.state.sortOrder === "asc") {
                return aVal > bVal;
            } else {
                return aVal < bVal;
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
                {SortableTableHeader(headerProps)}
                <TableBody>
                {shotDisplayRecords.map(x => (
                    <TableRow>
                        <TableCell>{x.roaster}</TableCell>
                        <TableCell>{x.bean}</TableCell>
                        <TableCell>{x.dose_amount}</TableCell>
                        <TableCell>{x.brew_amount}</TableCell>
                        <TableCell>{this.roundToThreeDecimalPlaces(x.brew_ratio)}</TableCell>
                        <TableCell>{x.bitter_sour}</TableCell>
                    </TableRow>
                ))}
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

function SortableTableHeader(props) {

    return (
        <TableHead>
        {props.cols.map(c => (
            <TableCell
                key={c.id}
                sortDirection={props.sortedColId === c.id ? props.order : false}>
                <TableSortLabel
                    active={props.sortedColId === c.id}
                    direction={props.order}
                    onClick={props.onChangeSortedCol(c.id)}
                >
                    {c.label}
                </TableSortLabel>
            </TableCell>
        ))}
        </TableHead>
    );
}