import React from 'react';
import { Dialog } from '@material-ui/core';

import ClosableComponent from '../../ClosableComponent/ClosableComponent';
import NewShotLogEntryForm from '../../NewShotLogEntryForm/NewShotLogEntryForm';

import './style.css';

export default function NewShotModal(props) {
    return (
        
        <Dialog onClose={props.onClose} open={props.open}>
            <div className="new-shot-modal">
                <ClosableComponent
                    onClose={props.onClose}
                    title="Add new shot"
                >
                <div className="new-shot-form">
                    <NewShotLogEntryForm
                        roasters={props.roasters}
                        beans={props.beans}
                        issues={props.issues}
                        onNewRoasterAdded={roaster => props.onNewRoasterAdded(roaster)}
                        onNewBeanAddedForRoaster={(roaster, bean) => props.onNewBeanAddedForRoaster(roaster, bean)}
                        onNewIssueAdded={issue => props.onNewIssueAdded(issue)}
                        onAddShotRecord={shot => props.onAddShotRecord(shot)}
                    />
                </div>
                    
                </ClosableComponent>
            </div>
        </Dialog>
        
    )
}