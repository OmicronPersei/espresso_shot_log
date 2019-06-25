import React from 'react';

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';


class TablePaginationActions extends React.Component {

    render() {
        return (
            <div>
                <IconButton
                    onClick={() => this.goToFirstPage()}
                    disabled={this.props.page === 0}
                >
                    <FirstPageIcon />
                </IconButton>
                <IconButton
                    onClick={() => this.goToPreviousPage()}
                    disabled={this.props.page === 0}
                >
                    <KeyboardArrowLeft />
                </IconButton>
                <IconButton
                    onClick={() => this.goToNextPage()}
                    disabled={this.props.page >= this.lastPage}
                >
                    <KeyboardArrowRight />
                </IconButton>
                <IconButton
                    onClick={() => this.goToLastPage()}
                    disabled={this.props.page >= this.lastPage}
                >
                    <LastPageIcon />
                </IconButton>
            </div>
        );
    }

    goToFirstPage() {
        this.props.onChangePage(0);
    }

    goToPreviousPage() {
        this.props.onChangePage(this.props.page-1);
    }

    goToNextPage() {
        this.props.onChangePage(this.props.page+1);
    }

    get totalPages() {
        return Math.ceil(this.props.totalItems / this.props.pageSize);
    }

    get lastPage() {
        return this.totalPages - 1;
    }

    goToLastPage() {
        this.props.onChangePage(this.lastPage);
    }
}

export default TablePaginationActions;