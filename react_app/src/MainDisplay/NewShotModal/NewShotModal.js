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
                            onNewRoasterAdded={(roaster, finishedAddingCallback) => props.onNewRoasterAdded(roaster, finishedAddingCallback)}
                            onNewBeanAddedForRoaster={(roaster, bean, finishedAddingCallback) => props.onNewBeanAddedForRoaster(roaster, bean, finishedAddingCallback)}
                            onNewIssueAdded={(issue, finishedAddingCallback) => props.onNewIssueAdded(issue, finishedAddingCallback)}
                            onAddShotRecord={(shot, finishedAddingCallback) => props.onAddShotRecord(shot, finishedAddingCallback)}
                            awaitingAPICallback={props.awaitingAPICallback}
                        />
                    </div>
                </ClosableComponent>
            </div>
        </Dialog>
        
    )
}