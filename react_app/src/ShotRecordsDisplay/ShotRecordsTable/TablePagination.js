import React from 'react';

import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import LastPageIcon from '@material-ui/icons/LastPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

class TablePagination extends React.Component {

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
        this.props.goToPage(0);
    }

    goToPreviousPage() {
        this.props.goToPage(this.props.page-1);
    }

    goToNextPage() {
        this.props.goToPage(this.props.page+1);
    }

    get totalPages() {
        return Math.ceil(this.props.totalItems / this.props.pageSize);
    }

    get lastPage() {
        return this.totalPages - 1;
    }

    goToLastPage() {
        this.props.goToPage(this.lastPage);
    }
}

export default TablePagination;