import React from 'react';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

export default class ShotRecordsDisplay extends React.Component {

    constructor(props) {
        super(props);

        this.shot_records = [
            {
                roaster: "Counter culture",
                bean: "Apollo",
                grinder_setting: "1.8",
                dose_amount_grams: 18,
                brew_amount_grams: 24,
                brew_time_seconds: 35,
                bitter_sour: "+1 (bitter)",
                issues: ""
            }
        ]
    }

    render() {
        let shotDisplayRecords = this.mapToShotDisplayRecords(this.shot_records);
        
        return (
            <Paper>
                {this.renderTable(shotDisplayRecords)}
            </Paper>
        );
    }


    mapToShotDisplayRecords(shotRecords) {
        return shotRecords.map(x => {
            return {
                roaster: x.roaster,
                bean: x.bean,
                dose_amount: x.dose_amount_grams,
                brew_amount: x.brew_amount_grams,
                brew_ratio: x.brew_amount_grams / x.dose_amount_grams,
                bitter_sour: x.bitter_sour
            };
        });
    }
    
    renderTable(shotDisplayRecords) {
        return (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Roaster</TableCell>
                        <TableCell>Bean</TableCell>
                        <TableCell>Dose</TableCell>
                        <TableCell>Brew Amount</TableCell>
                        <TableCell>Brew Ratio</TableCell>
                        <TableCell>Bitterness/sourness</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {shotDisplayRecords.map(x => (
                        <TableRow>
                            <TableCell>{x.roaster}</TableCell>
                            <TableCell>{x.bean}</TableCell>
                            <TableCell>{x.dose_amount}</TableCell>
                            <TableCell>{x.brew_amount}</TableCell>
                            <TableCell>{this.roundToThreeDecimalPlaces(x.brew_ratio)}</TableCell>
                            <TableCell>{x.bitter_sour}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    }

    roundToThreeDecimalPlaces(num) {
        return Math.round(num * 1000) / 1000;
    }
}