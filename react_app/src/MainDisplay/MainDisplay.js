import React from 'react';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Modal from '@material-ui/core/Modal';

import ShotRecordsTable from '../ShotRecordsDisplay/ShotRecordsTable/ShotRecordsTable';
import NewShotModal from './NewShotModal/NewShotModal';
import IDProvider from './IDProvider';
import './style.css';
import config from '../config';
import { resetWarningCache } from 'prop-types';
import { request } from 'http';

class MainDisplay extends React.Component {

    constructor(props) {
        super(props);

        this._config = config();

        this.state = {
            shots: [],
            roasters: [],
            beans: {},
            issues: [],
            newShotLogEntryFormModalOpen: false
        };

        this.getAllData();
    }

    getAllData() {
        let endpoint = `${this._config.apiurl}/all`;
        let headers = new Headers();
        headers.set("Content-type", "application-json");
        fetch(endpoint, { headers: headers, method: "GET" })
            .then(res => {
                res.json()
                    .then(obj => {
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
        let url = `${this._config.apiurl}/roasters/add`;
        let headers = new Headers();
        let body = roaster
        let requestInit = {
            headers: headers,
            method: "POST",
            body: body
        };

        fetch(url, requestInit).then(res => {
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
        }, error => {
            console.error("could not save roaster: " + error);
        });
    }

    handleNewBeanAddedForRoaster(roaster, bean) {
        let url = `${this._config.apiurl}/beans/add`;
        let headers = new Headers();
        let body = JSON.stringify({ roaster: roaster, bean: bean });
        let requestInit = {
            headers: headers,
            method: "POST",
            body: body
        };

        fetch(url, requestInit).then(res => {
            console.log(`successfully added the bean ${bean} for roaster ${roaster}`);
            this.setState(prevState => {
                let beans = {...prevState.beans};
    
                beans[roaster].push(bean);
    
                return {
                    beans: beans
                };
            });
        });
    }

    handleNewIssueAdded(issue) {
        let url = `${this._config.apiurl}/issues/add`;
        let headers = new Headers();
        let body = issue
        let requestInit = {
            headers: headers,
            method: "POST",
            body: body
        };

        fetch(url, requestInit).then(res => {
            console.log("successfully saved new issue " + issue);

            this.setState(prevState => {
                let issues = prevState.issues.slice();
                issues.push(issue);
    
                return {
                    issues: issues
                };
            });
        }, error => {
            console.error("could not save issue: " + error);
        });
    }

    handleAddNewShotRecord(shot) {
        let url = `${this._config.apiurl}/shots/add`;
        let headers = new Headers();
        let body = JSON.stringify(shot);
        let requestInit = {
            headers: headers,
            method: "POST",
            body: body
        };

        fetch(url, requestInit).then(
            (res) => {
                res.json()
                    .then(body => {
                        console.log(`successfully saved shot ${body}`);
                        let shotId = body;
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
                    });
            },
            error => {
                console.log("could not save the shot: " + error);
            });
    }
}


export default MainDisplay;