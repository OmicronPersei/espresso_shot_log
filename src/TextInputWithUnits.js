import React from 'react';
import { Input, InputAdornment, FormHelperText, FormControl, TextField } from '@material-ui/core';

class TextInputWithUnits extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <FormControl fullWidth={true}>
                <TextField
                    id="adornment-weight"
                    value={this.props.weight}
                    onChange={(event) => this.raiseOnChangeEvent(event.target.value)}
                    InputProps={{
                        endAdornment: <InputAdornment position="end">{this.props.unit}</InputAdornment>,
                        }}
                    aria-describedby="weight-helper-text"
                    label={this.props.name}
                    />
            </FormControl>
        );
    }

    raiseOnChangeEvent(val) {
        if (this.props.onChange) {
            this.props.onChange(val);
        }
    }
}

export default TextInputWithUnits;