import React from 'react';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import ShotRecordsTable from '../ShotRecordsDisplay/ShotRecordsTable/ShotRecordsTable';
import NewShotModal from './NewShotModal/NewShotModal';
import './style.css';
import API from './API';

class MainDisplay extends React.Component {

    constructor(props) {
        super(props);

        this._api = new API();

        this.state = {
            shots: [],
            roasters: [],
            beans: {},
            issues: [],
            newShotLogEntryFormModalOpen: false,
            awaitingAPICallback: {
                savingNewShot: false,
                savingNewRoaster: false,
                savingNewBean: false,
                savingNewIssue: false
            }
        };

        this.getAllData();
    }

    getAllData() {
        this._api.getAllData()
            .then(res => {
                res.json()
                    .then(obj => {
                        obj.shots.forEach(shot => shot.timestamp = new Date(shot.timestamp));
                        
                        this.setState({
                            shots: obj.shots,
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
                    onNewIssueAdded={(issue) => this.handleNewIssueAdded(issue)}
                    onAddShotRecord={(shot) => this.handleAddNewShotRecord(shot)}
                    awaitingAPICallback={this.state.awaitingAPICallback}
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
        this.setWaitingOnAPIFlag("savingNewRoaster", true)
            .then(() => {
                return this._api.addNewRoaster(roaster);
            })
            .then(() => {
                console.log("successfully saved new roaster " + roaster);
    
                this.setState(prevState => {
                    let roasters = prevState.roasters.slice();
                    roasters.push(roaster);
                    let beans = {...prevState.beans};
                    beans[roaster] = [];
        
                    return {
                        roasters: roasters,
                        beans: beans
                    };
                });
            })
            .catch(error => this.handleAPIError("save new roaster", error))
            .then(() => this.setWaitingOnAPIFlag("savingNewRoaster", false));
    }

    handleNewBeanAddedForRoaster(roaster, bean) {
        this.setWaitingOnAPIFlag("savingNewBean", true)
            .then(() => {
                return this._api.addNewBeanForRoaster(roaster, bean);
            })
            .then(() => {
                console.log(`successfully added the bean ${bean} for roaster ${roaster}`);
                this.setState(prevState => {
                    let beans = {...prevState.beans};
        
                    beans[roaster].push(bean);
        
                    return {
                        beans: beans
                    };
                });
            })
            .catch(error => this.handleAPIError("saving new bean", error))
            .then(() => this.setWaitingOnAPIFlag("savingNewBean", false));
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
            .then(() => {
                return this._api.addNewShotRecord(shot);
            })
            .then(res => {
                return res.json();
            })
            .then(res => {
                console.log(`successfully saved shot ${res}`);
                let shotId = res;
                let newShotRecord = {
                    ...shot,
                    id: shotId
                };
                this.setState(prevState => {
                    let shots = prevState.shots.slice();
                    shots.push(newShotRecord);
        
                    return {
                        shots: shots
                    };
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
}

export default MainDisplay;