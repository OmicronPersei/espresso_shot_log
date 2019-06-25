import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import TableSortLabel from '@material-ui/core/TableSortLabel';
import TablePagination from './TablePagination';
import TableToolbar from './TableToolbar';

import API from '../../API';

class ShotRecordsTable extends React.Component {

    constructor(props) {
        super(props);

        //The `id` property for each column is the display record object property that it reffers to.
        //(See the method `mapToShotDisplayRecords` for column value mapping).
        this.cols = [
            { label: "Date/time", id: "timestamp", sortAsNumber: true },
            { label: "Roaster", id: "roaster", sortAsNumber: false },
            { label: "Bean", id: "bean", sortAsNumber: false },
            { label: "Dose", id: "dose_amount_grams", sortAsNumber: true },
            { label: "Brew Amount", id: "brew_amount_grams", sortAsNumber: true },
            { label: "Brew Ratio", id: "brew_ratio", sortAsNumber: true },
            { label: "Brew time", id: "brew_time_seconds", sortAsNumber: true },
            { 
                label: "Bitterness/sourness", 
                id: "bitter_sour", 
                sortAsNumber: true
            },
        ];
        
        this.state = {
            sortOrder: null,
            sortedColId: null,
            showFilterPopover: false,
            filter: {
                roaster: "",
                bean: "",
                filterType: ""
            },
            shots: [],
            page: 0,
            pageSize: 5,
            totalItems: 0
        };

        this._api = new API();
    }

    render() {
        let shotDisplayRecords = this.state.shots;

        //Round brew_ratio column to only 3 decimal places.
        shotDisplayRecords.forEach(shot => {
            shot.brew_ratio = this.roundToThreeDecimalPlaces(shot.brew_ratio);
        });

        return (
            <div>
                {this.renderTableToolbar()}
                {this.renderTable(shotDisplayRecords)}
            </div>
        );
    }

    // sortDisplayRecords(shotDisplayRecords) {
    //     if (!this.state.sortedColId) {
    //         return shotDisplayRecords;
    //     }

    //     let getValForSorting = val => val[this.state.sortedColId].value;
    //     let matchingCol = this.cols.find(col => col.id === this.state.sortedColId);

    //     return shotDisplayRecords.sort((a,b) => {
    //         let aVal = getValForSorting(a);
    //         let bVal = getValForSorting(b);

    //         let isAsc = this.state.sortOrder === "asc";
    //         if (matchingCol.sortAsNumber) {
    //             if (isAsc) {
    //                 return aVal - bVal;
    //             } else {
    //                 return bVal - aVal;
    //             }
    //         } else {
    //             if (isAsc) {
    //                 if (aVal.toUpperCase() > bVal.toUpperCase()) {
    //                     return 1;
    //                 } else if (aVal.toUpperCase() < bVal.toUpperCase()) {
    //                     return -1;
    //                 } else {
    //                     return 0;
    //                 }
    //             } else {
    //                 if (aVal.toUpperCase() < bVal.toUpperCase()) {
    //                     return 1;
    //                 } else if (aVal.toUpperCase() > bVal.toUpperCase()) {
    //                     return -1;
    //                 } else {
    //                     return 0;
    //                 }
    //             }
    //         }
    //     });
    // }

    // filterDisplayRecords(filter, shotDisplayRecords) {

    //     if (!filter.filterType) {
    //         return shotDisplayRecords;
    //     }

    //     switch (filter.filterType.toLowerCase()) {
    //         case Roaster.toLowerCase():
    //             return shotDisplayRecords.filter(r => r.roaster.value === filter.roaster);

    //         case RoasterBean.toLowerCase():
    //             return shotDisplayRecords.filter(r => (r.roaster.value === filter.roaster) && (r.bean.value === filter.bean));

    //         default:
    //             throw new Error("Unknown filter type");
    //     }
    // }

    renderTableToolbar() {
        return (
            <TableToolbar
                currentFilter={this.state.filter}
                onFilterChange={filter => this.handleFilterChange(filter)}
                roasters={this.props.roasters}
                beans={this.props.beans}
                shots={this.props.shots}
            />
        )
    }

    handleFilterChange(filter) {
        this.setState({
            filter: filter
        });
        this.retrieveShotPage();
    }
    
    renderTable(shotDisplayRecords) {
        
        let headerProps = {
            cols: this.cols,
            sortedColId: this.state.sortedColId,
            order: this.state.sortOrder,
            onChangeSortedCol: (x) => this.handleChangeSortedColIdChange(x)
        };

        return (
            <Table>
                {RenderSortableTableHeader(headerProps)}
                <TableBody>
                    {RenderCells(shotDisplayRecords, this.cols)}
                </TableBody>
                <TablePagination
                    goToPage={page => this.handlePageChange(page)}
                    page={this.state.page}
                    pageSize={this.state.pageSize}
                    totalItems={this.state.totalItems} />
            </Table>
        );
    }

    handleChangeSortedColIdChange(colId) {
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

        this.retrieveShotPage();
    }

    roundToThreeDecimalPlaces(num) {
        return Math.round(num * 1000) / 1000;
    }
    
    handlePageChange(page) {
        this.setState({ page: page });

        this.retrieveShotPage();
    }

    retrieveShotPage() {
        this.getShotPage()
            .then(res => {
                this.setState({
                    shots: res.shots,
                    totalItems: res.totalItems
                });
            });
    }

    getShotPage() {
        let pageQuery = {
            page: this.state.page,
            pageSize: this.state.pageSize,
            filter: this.state.filter,
            sortedColId: this.state.sortedColId,
            sortOrder: this.state.sortOrder
        };

        return this._api.getShotPage(pageQuery);
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
                <TableCell key={col.id}>{shotRecord[col.id].label}</TableCell>
            ))}
        </TableRow>
    ));
}

export default ShotRecordsTable;