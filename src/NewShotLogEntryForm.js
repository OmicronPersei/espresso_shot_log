import React from 'react';

import DropDownWithAddButton from './DropDownWithAddButton/DropDownWithAddButton';

class NewShotLogEntryForm extends React.Component {
    constructor(props) {
        super(props);

        this.roasters = [
            "Counter culture",
            "Starbucks"
        ];

        this.beans = {
            "Counter culture": ["Apollo", "Hologram"],
            "Starbucks": ["House blend", "Yukon"]
        };
        
        this.initializeFormState();
    }

    initializeFormState() {
        this.state = {
            roaster: "",
            bean: "",
            grinder_setting: "",
            dose_amount_grams: 0,
            brew_amount_grams: 0,
            brew_time_seconds: 0
        }
    }


    render() {
        return (
            <div>
                <DropDownWithAddButton 
                    items={this.roasters} 
                    name="Roaster" 
                    onChange={(val) => this.handleRoasterChanged(val)}
                    onNewItemAdded={(newItem) => this.handleNewRoasterAdded(newItem)}
                    onStartAddNewItem={() => this.handleOnStartAddingNewRoaster()} />
                {this.renderBeansDropDownIfRoasterSelected()}
            </div>
        )
    }

    handleRoasterChanged(newVal) {
        this.setState({
            roaster: newVal
        })
    }

    handleOnStartAddingNewRoaster() {
        this.setState({
            bean: "",
            roaster: ""
        });
    }

    handleNewRoasterAdded(newVal) {
        this.roasters.push(newVal);

        this.setState({
            roaster: newVal
        });
    }

    renderBeansDropDownIfRoasterSelected() {
        let roaster = this.state.roaster;
        
        if (roaster) {
            let beansForRoaster = this.beans[roaster];
            if (!beansForRoaster) {
                beansForRoaster = [];
                this.beans[roaster] = beansForRoaster;
            }
            
            return (
                <DropDownWithAddButton
                    items={beansForRoaster}
                    name="Bean"
                    onChange={(bean) => this.handleNewBeanSelected(bean)}
                    onNewItemAdded={(bean) => this.handleNewBeanTypeAdded(bean)} />
            );
        }

        return;
    }

    handleNewBeanSelected(bean) {
        this.setState({
            bean: bean
        });
    }

    handleNewBeanTypeAdded(bean) {
        let beansForRoaster = this.beans[this.state.roaster];
        beansForRoaster.push(bean);
    }
}

export default NewShotLogEntryForm;