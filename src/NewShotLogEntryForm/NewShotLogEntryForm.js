import React from 'react';

import Grid from '@material-ui/core/Grid';

import DropDownWithAddButton from '../DropDownWithAddButton/DropDownWithAddButton';
import DropDown from '../DropDown/DropDown';
import TextInputWithUnits from '../TextInputWithUnits';

import './styles.css';

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

        this.issues = [
            "Spritzers",
            "Extraction too fast"
        ];

        let bitter_sour_vals = [];
        for (let i = 5; i >= -5; --i) {
            if (i > 0) {
                bitter_sour_vals.push("+" + i.toString() + " (bitter)");
            } else if (i < 0) {
                bitter_sour_vals.push(i.toString() + " (sour)");
            } else {
                bitter_sour_vals.push(i.toString());
            }
        }

        this.bitter_sour_vals = bitter_sour_vals;
        
        this.state = {
            form: {
                roaster: "",
                bean: "",
                grinder_setting: "",
                dose_amount_grams: 0,
                brew_amount_grams: 0,
                brew_time_seconds: 0,
                bitter_sour: "",
                issues: ""
            }
        };
    }

    render() {
        return (
            <div>
                <Grid container spacing={2} justify="center" alignContent="center" alignItems="center">
                    <Grid item sm={6} xs={12} md={6}  justify="center">
                        <div className="form-item left">
                            <DropDownWithAddButton 
                                items={this.roasters} 
                                name="Roaster" 
                                onChange={val => this.handleValueChange("roaster", val)}
                                onNewItemAdded={(newItem) => this.handleNewRoasterAdded(newItem)}
                                onStartAddNewItem={() => this.handleOnStartAddingNewRoaster()} />
                        </div>
                    </Grid>
                    <Grid item sm={6} xs={12} md={6}  justify="center">
                        {this.renderBeansDropDownIfRoasterSelected()}
                    </Grid>
                </Grid>
                <Grid container spacing={2} justify="center">
                    <Grid item sm={6} xs={12} md={6} justify="center">
                        <div className="form-item left">
                            <TextInputWithUnits
                                name="Grinder setting"
                                unit=""
                                value={this.state.form.grinder_setting}
                                onChange={val => this.handleValueChange("grinder_setting", val)} />
                        </div>
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} justify="center" >
                        <div className="form-item right">
                            <TextInputWithUnits
                                name="Dose amount"
                                unit="grams"
                                value={this.state.form.dose_amount_grams}
                                onChange={val => this.handleValueChange("dose_amount_grams", val)} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2} justify="center">
                    <Grid item sm={6} xs={12} md={6} justify="center">
                        <div className="form-item left">
                            <TextInputWithUnits
                                name="Brew amount"
                                unit="grams"
                                value={this.state.form.brew_amount_grams}
                                onChange={val => this.handleValueChange("brew_amount_grams", val)} />
                        </div>
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} justify="center">
                        <div className="form-item right">
                            <TextInputWithUnits
                                name="Brew time"
                                unit="seconds"
                                value={this.state.form.brew_time_seconds}
                                onChange={val => this.handleValueChange("brew_time_seconds", val)} />
                        </div>
                    </Grid>
                </Grid>
                <Grid container spacing={2} justify="center">
                    <Grid item sm={6} xs={12} md={6} justify="center">
                        <div className="form-item left">
                            <DropDown
                                name="Bitterness/sourness"
                                items={this.bitter_sour_vals}
                                value={this.state.form.bitter_sour}
                                onChange={val => this.handleValueChange("bitter_sour", val)} />
                        </div>
                    </Grid>
                    <Grid item sm={6} xs={12} md={6} justify="center">
                        <div className="form-item right">
                            <DropDownWithAddButton
                                name="Issues?"
                                items={this.issues}
                                value={this.state.form.issues}
                                onChange={val => this.handleValueChange("issues", val)}
                                onNewItemAdded={val => this.handleNewIssueAdded(val)} />
                        </div>
                    </Grid>
                </Grid>
            </div>
        )
    }

    handleOnStartAddingNewRoaster() {
        this.handleValueChange("bean", "");
        this.handleValueChange("roaster", "");
    }

    handleNewRoasterAdded(newVal) {
        this.roasters.push(newVal);
        this.beans[newVal] = [];

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
                <div className="form-item right">
                    <DropDownWithAddButton
                        items={beansForRoaster}
                        name="Bean"
                        onChange={bean => this.handleValueChange("bean", bean)}
                        onNewItemAdded={bean => this.handleNewBeanTypeAdded(bean)} />
                </div>
            );
        }

        return;
    }

    handleNewBeanSelected(bean) {
        this.handleValueChange("bean", bean);
    }

    handleNewBeanTypeAdded(bean) {
        let beansForRoaster = this.beans[this.state.form.roaster];
        beansForRoaster.push(bean);
    }

    handleNewIssueAdded(issue) {
        this.issues.push(issue);
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