import React from 'react';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import ShotRecordsTable from '../ShotRecordsDisplay/ShotRecordsTable/ShotRecordsTable';
import NewShotModal from './NewShotModal/NewShotModal';
import './style.css';
import API from '../API';

class MainDisplay extends React.Component {

    constructor(props) {
        super(props);

        this._api = new API();

        this.state = {
            roasters: [],
            beans: {},
            issues: [],
            newShotLogEntryFormModalOpen: false,
            awaitingAPICallback: {
                savingNewShot: false,
                savingNewIssue: false
            },
            shotPageQuery: {
                sortOrder: null,
                sortedColId: null,
                filter: {
                    roaster: "",
                    bean: "",
                    filterType: ""
                },
                page: 0,
                pageSize: 5,
            },
            shots: [],
            totalItems: 0
        };

        this.getAllMetadata();
    }

    getAllMetadata() {
        this._api.getMetadata()
            .then(res => {
                res.json()
                    .then(obj => {
                        this.setState({
                            roasters: obj.roasters,
                            beans: obj.beans,
                            issues: obj.issues
                        });
                    }, error => {
                        console.error("could not deserialize response: " + error);
                    });
            }, error => {
                console.error("could not get all data. error: " + error);
            });
    }

    render() {
        return (
            <div className="main-display">
                <Paper>
                    <ShotRecordsTable
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
                    onNewIssueAdded={(issue) => this.handleNewIssueAdded(issue)}
                    onAddShotRecord={(shot) => this.handleAddNewShotRecord(shot)}
                    awaitingAPICallback={this.state.awaitingAPICallback}
                    shotPageQuery={this.state.shotPageQuery}
                    totalItems={this.state.totalItems}
                    updateTableDisplay={shotPageQuery => this.retrieveAndSetShotPageUsingQuery(shotPageQuery)}
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

    handleNewIssueAdded(issue) {
        this.setWaitingOnAPIFlag("savingNewIssue", true)
            .then(() => {
                return this._api.addNewIssue(issue);
            })
            .then(() => {
                console.log("successfully saved new issue " + issue);
        
                this.setState(prevState => {
                    let issues = prevState.issues.slice();
                    issues.push(issue);
        
                    return {
                        issues: issues
                    };
                });
            })
            .catch(error => this.handleAPIError("saving new issue", error))
            .then(() => this.setWaitingOnAPIFlag("savingNewIssue", false));
    }

    handleAddNewShotRecord(shot) {
        this.setWaitingOnAPIFlag("savingNewShot", true)
            .then(() => this._api.addNewShotRecord(shot))
            .then(res => {
                console.log(`successfully saved shot ${res}`);
                return this._api.getMetadata();
            })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    roasters: res.roasters,
                    beans: res.beans
                });
            })
            .catch(error => this.handleAPIError("saving new shot", error))
            .then(() => this.setWaitingOnAPIFlag("savingNewShot", false));
    }

    setWaitingOnAPIFlag(field, value) {
        return new Promise((resolve) => {
            this.setState(prevState => {
                let awaitingAPICallback = {...prevState.awaitingAPICallback};
                awaitingAPICallback[field] = value;
    
                return {
                    awaitingAPICallback: awaitingAPICallback
                };
            }, () => {
                resolve();
            });
        })
    }

    handleAPIError(action, error) {
        console.error(`failed to ${action}: ${error}`);
    }
    
    retrieveAndSetShotPageUsingQuery(shotPageQuery) {
        this.getShotPage(shotPageQuery)
            .then(res => {
                this.setState({
                    shotPageQuery: shotPageQuery,
                    shots: res.shots,
                    totalItems: res.totalItems
                });
            });
    }

    getShotPage(pageQuery) {
        return this._api.getShotPage(pageQuery)
            .then(res => res.json())
            .then(res => {
                res.shots.forEach(shot => shot.timestamp = new Date(shot.timestamp));

                return res;
            });
    }
}

export default MainDisplay;