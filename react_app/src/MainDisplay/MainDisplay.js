import React from 'react';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';

import ShotRecordsTable from '../ShotRecordsDisplay/ShotRecordsTable/ShotRecordsTable';
import NewShotModal from './NewShotModal/NewShotModal';
import IDProvider from './IDProvider';
import './style.css';

class MainDisplay extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            shots: shots,
            roasters: roasters,
            beans: beans,
            issues: issues,
            newShotLogEntryFormModalOpen: false
        };
    }

    render() {
        return (
            <div className="main-display">
                <Paper>
                    <ShotRecordsTable
                        shots={this.state.shots}
                        roasters={this.state.roasters}
                        beans={this.state.beans} />
                </Paper>
                <div className="add-icon">
                    <Fab color="primary" aria-label="Add" onClick={() => this.handleAddButtonClick()}>
                        <AddIcon />
                    </Fab>
                </div>
                <NewShotModal
                    clasName="new-shot-log-entry-modal"
                    open={this.state.newShotLogEntryFormModalOpen}
                    onClose={() => this.handleModalClose()}
                    className="new-shot-log-entry-modal"
                    roasters={this.state.roasters}
                    beans={this.state.beans}
                    issues={this.state.issues}
                    onNewRoasterAdded={roaster => this.handleNewRoasterAdded(roaster)}
                    onNewBeanAddedForRoaster={(roaster, bean) => this.handleNewBeanAddedForRoaster(roaster, bean)}
                    onNewIssueAdded={issue => this.handleNewIssueAdded(issue)}
                    onAddShotRecord={shot => this.handleAddNewShotRecord(shot)}
                />
            </div>
        );
    }

    handleAddButtonClick() {
        this.setState({
            newShotLogEntryFormModalOpen: true
        });
    }

    handleModalClose() {
        this.setState({
            newShotLogEntryFormModalOpen: false
        });
    }

    handleNewRoasterAdded(roaster) {
        this.setState(prevState => {
            let roasters = prevState.roasters.slice();
            roasters.push(roaster);
            let beans = prevState.beans;
            beans[roaster] = [];

            return {
                roasters: roasters,
                beans: beans
            };
        });
    }

    handleNewBeanAddedForRoaster(roaster, bean) {
        this.setState(prevState => {
            let beans = {...prevState.beans};

            beans[roaster].push(bean);

            return {
                beans: beans
            };
        });
    }

    handleNewIssueAdded(issue) {
        this.setState(prevState => {
            let issues = prevState.issues.slice();
            issues.push(issue);

            return {
                issues: issues
            };
        });
    }

    handleAddNewShotRecord(shot) {
        this.setState(prevState => {
            let shots = prevState.shots.slice();
            this._idProvider.appendID(shot);
            shots.push(shot);

            return {
                shots: shots
            };
        });
    }
}


export default MainDisplay;