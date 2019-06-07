import React from 'react';

import DropDownWithAddButton from './DropDownWithAddButton/DropDownWithAddButton';
import TextInputWithUnits from './TextInputWithUnits';

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
            form: {
                roaster: "",
                bean: "",
                grinder_setting: "",
                dose_amount_grams: 0,
                brew_amount_grams: 0,
                brew_time_seconds: 0 
            }
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
                <TextInputWithUnits
                    name="Dose amount"
                    unit="grams"
                    value={this.state.form.dose_amount_grams}
                    onChange={(val) => this.handleValueChange("dose_amount_grams", val)} />
            </div>
        )
    }

    handleRoasterChanged(newVal) {
        this.handleValueChange("roaster", newVal);
    }

    handleOnStartAddingNewRoaster() {
        this.handleValueChange("bean", "");
        this.handleValueChange("roaster ", "");
    }

    handleNewRoasterAdded(newVal) {
        this.roasters.push(newVal);

        this.handleValueChange("roaster", newVal);
    }

    renderBeansDropDownIfRoasterSelected() {
        let roaster = this.state.form.roaster;
        
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
        this.handleValueChange("bean", bean);
    }

    handleNewBeanTypeAdded(bean) {
        let beansForRoaster = this.beans[this.state.roaster];
        beansForRoaster.push(bean);
    }

    handleValueChange(val_name, value) {
        let form = {...this.state.form};
        form[val_name] = value;
        this.setState({
            form: form
        });
    }
}

export default NewShotLogEntryForm;