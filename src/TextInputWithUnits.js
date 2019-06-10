import React from 'react';
import { Input, InputAdornment, FormHelperText, FormControl } from '@material-ui/core';

class TextInputWithUnits extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        
        return (
            <FormControl fullWidth={true}>
                <Input
                    id="adornment-weight"
                    value={this.props.weight}
                    onChange={(event) => this.raiseOnChangeEvent(event.target.value)}
                    endAdornment={<InputAdornment position="end">{this.props.unit}</InputAdornment>}
                    aria-describedby="weight-helper-text"
                    inputProps={{
                        'aria-label': this.props.name,
                    }}
                    />
                <FormHelperText id="weight-helper-text">{this.props.name}</FormHelperText>
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