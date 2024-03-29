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
            showFilterPopover: false,
        };

        this._api = new API();
    }

    componentDidMount() {
        this.retrieveAndSetShots();
    }

    render() {
        let shotDisplayRecords = this.mapToShotDisplayRecords(this.props.shots);

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

    renderTableToolbar() {
        return (
            <TableToolbar
                currentFilter={this.props.shotPageQuery.filter}
                onFilterChange={filter => this.handleFilterChange(filter)}
                roasters={this.props.roasters}
                beans={this.props.beans}
                shots={this.props.shots}
            />
        )
    }

    handleFilterChange(filter) {
        let shotPageQuery = {...this.props.shotPageQuery};
        shotPageQuery.filter = filter;

        this.retrieveAndSetShotPageUsingQuery(shotPageQuery);
    }
    
    renderTable(shotDisplayRecords) {
        
        let headerProps = {
            cols: this.cols,
            sortedColId: this.props.shotPageQuery.sortedColId,
            order: this.props.shotPageQuery.sortOrder,
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
                            count={this.props.totalItems}
                            rowsPerPage={this.props.shotPageQuery.pageSize}
                            page={this.props.shotPageQuery.page}
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
        let prevSortedColId = this.props.shotPageQuery.sortedColId;
        let newSortOrder = "";

        if (prevSortedColId !== colId) {
            newSortOrder = "desc";
        } else {
            //order: (nosort), descending, ascending
            switch (this.props.shotPageQuery.sortOrder) {
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

        let shotPageQuery = {...this.props.shotPageQuery};
        shotPageQuery.sortOrder = newSortOrder;
        shotPageQuery.sortedColId = colId;

        this.retrieveAndSetShotPageUsingQuery(shotPageQuery);
    }

    roundToThreeDecimalPlaces(num) {
        return Math.round(num * 1000) / 1000;
    }
    
    handlePageChange(page) {
        let shotPageQuery = {...this.props.shotPageQuery};
        shotPageQuery.page = page;

        this.retrieveAndSetShotPageUsingQuery(shotPageQuery);
    }

    handlePageSizeChange(pageSize) {
        let shotPageQuery = {...this.props.shotPageQuery};
        shotPageQuery.pageSize = pageSize;

        this.retrieveAndSetShotPageUsingQuery(shotPageQuery);
    }

    retrieveAndSetShots() {
        this.props.updateTableDisplay(this.props.shotPageQuery);
    }

    retrieveAndSetShotPageUsingQuery(shotPageQuery) {
        this.props.updateTableDisplay(shotPageQuery);
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