import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import TableToolbar from './TableToolbar';

import TableFooter from '@material-ui/core/TableFooter';

import TablePaginationActions from './TablePaginationActions';

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
            { label: "Bitterness/sourness", id: "bitter_sour", sortAsNumber: true },
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

    componentDidMount() {
        this.retrieveShotPage();
    }

    render() {
        let shotDisplayRecords = this.mapToShotDisplayRecords(this.state.shots);

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
                roaster: { value: x.roaster, label: x.roaster },
                bean: { value: x.bean, label: x.bean },
                dose_amount_grams: { value: x.dose_amount_grams, label: x.dose_amount_grams },
                brew_amount_grams: { value: x.brew_amount_grams, label: x.brew_amount_grams },
                brew_ratio: { value: x.brew_ratio, label: this.roundToThreeDecimalPlaces(x.brew_ratio) },
                brew_time_seconds: { value: x.brew_time_seconds, label: x.brew_time_seconds },
                bitter_sour: { value: x.bitter_sour.replace(/\D/g, ""), label: x.bitter_sour },
                id: x.id,
                timestamp: { value: x.timestamp, label: `${x.timestamp.toLocaleDateString()} ${x.timestamp.toLocaleTimeString()}` }
            };
        });
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
                <TableFooter>
                    <TableRow>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25]}
                            count={this.state.totalItems}
                            rowsPerPage={this.state.pageSize}
                            page={this.state.page}
                            onChangePage={page => this.handlePageChange(page)}
                            onChangeRowsPerPage={event => this.handlePageSizeChange(event.target.value)}
                            ActionsComponent={TablePaginationActions}
                            />
                    </TableRow>
                </TableFooter>
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

    handlePageSizeChange(pageSize) {
        this.setState({ pageSize: pageSize });

        this.retrieveShotPage();
    }

    retrieveShotPage() {
        this.getShotPage()
            .then(res => res.json())
            .then(res => {
                res.shots.forEach(shot => shot.timestamp = new Date(shot.timestamp));

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